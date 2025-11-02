// app/api/webhook/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe"; // ← use your shared client

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Narrow safely; avoid referencing Stripe.Subscription at the type level here
function subTimes(s: unknown) {
  if (
    s &&
    typeof s === "object" &&
    "current_period_end" in s &&
    "trial_end" in s
  ) {
    const sub = s as { current_period_end?: number | null; trial_end?: number | null };
    const currentPeriodEnd =
      typeof sub.current_period_end === "number"
        ? new Date(sub.current_period_end * 1000)
        : null;
    const trialEnd =
      typeof sub.trial_end === "number"
        ? new Date(sub.trial_end * 1000)
        : null;
    return { currentPeriodEnd, trialEnd };
  }
  return { currentPeriodEnd: null, trialEnd: null };
}

function mapPlan(meta: string | undefined | null): "PRO_MONTHLY" | "PRO_ANNUAL" | null {
  if (meta === "monthly") return "PRO_MONTHLY";
  if (meta === "annual") return "PRO_ANNUAL";
  return null;
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("[webhook] signature verify failed:", err?.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any; // Checkout.Session
        const customerId = (session.customer as string) || "";
        const subscriptionId = (session.subscription as string) || "";
        if (!subscriptionId) {
          console.warn("[webhook] checkout.session.completed: missing subscriptionId");
          break;
        }

        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const byCustomer = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
          select: { id: true },
        });
        const userId = byCustomer?.id ?? (sub.metadata?.userId as string | undefined);
        if (!userId) {
          console.warn("[webhook] checkout.session.completed: no userId");
          break;
        }

        const plan = mapPlan(sub.metadata?.plan as string | undefined);
        const { currentPeriodEnd, trialEnd } = subTimes(sub);

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: plan ?? undefined,
            trialEndsAt: trialEnd ?? undefined,
            stripeCustomerId: customerId,
            stripeSubId: sub.id,
            subscriptionStatus: sub.status,
          },
        });

        await prisma.billingSubscription.upsert({
          where: { stripeSubscriptionId: subscriptionId },
          create: {
            userId,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            status: sub.status,
            currentPeriodEnd,
            trialEnd,
          },
          update: {
            status: sub.status,
            currentPeriodEnd,
            trialEnd,
          },
        });

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as any; // Stripe.Subscription at runtime
        const subscriptionId = sub.id as string;
        const customerId = (sub.customer as string) || "";

        const byCustomer = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
          select: { id: true },
        });
        const userId = byCustomer?.id ?? (sub.metadata?.userId as string | undefined);
        if (!userId) {
          console.warn(`[webhook] ${event.type}: no userId`);
          break;
        }

        const { currentPeriodEnd, trialEnd } = subTimes(sub);

        await prisma.billingSubscription.upsert({
          where: { stripeSubscriptionId: subscriptionId },
          create: {
            userId,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            status: sub.status,
            currentPeriodEnd,
            trialEnd,
          },
          update: {
            status: sub.status,
            currentPeriodEnd,
            trialEnd,
          },
        });

        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubId: sub.id,
            subscriptionStatus: sub.status,
            ...( ["canceled", "unpaid", "incomplete_expired"].includes(sub.status as string)
              ? { plan: null }
              : {} ),
          },
        });

        break;
      }

      default:
        console.log("[webhook] Unhandled event:", event.type);
    }
  } catch (err) {
    console.error("[webhook] handler error:", err);
  }

  return NextResponse.json({ ok: true });
}
