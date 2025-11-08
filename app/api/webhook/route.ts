// app/api/webhook/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Minimal shapes we actually use (avoid importing Stripe types on edge) */
type CheckoutSessionLike = {
  customer?: string | null;
  subscription?: string | null;
};

type SubscriptionLike = {
  id: string;
  customer: string | null;
  status: string;
  metadata?: Record<string, unknown> | null;
  current_period_end?: number | null;
  trial_end?: number | null;
};

function isCheckoutSession(x: unknown): x is CheckoutSessionLike {
  return !!x && typeof x === "object";
}

function isSubscription(x: unknown): x is SubscriptionLike {
  return !!x && typeof x === "object" && "id" in x && "status" in x;
}

function subTimes(s: SubscriptionLike | null | undefined) {
  const currentPeriodEnd =
    s?.current_period_end != null ? new Date(s.current_period_end * 1000) : null;
  const trialEnd = s?.trial_end != null ? new Date(s.trial_end * 1000) : null;
  return { currentPeriodEnd, trialEnd };
}

function mapPlan(meta: unknown): "PRO_MONTHLY" | "PRO_ANNUAL" | null {
  const m = typeof meta === "string" ? meta : undefined;
  if (m === "monthly") return "PRO_MONTHLY";
  if (m === "annual") return "PRO_ANNUAL";
  return null;
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const rawBody = await req.text();

  let event: unknown;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[webhook] signature verify failed:", msg);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // At runtime this is a Stripe.Event; we only use the parts we need
  const ev = event as { type: string; data: { object: unknown } };

  try {
    switch (ev.type) {
      case "checkout.session.completed": {
        const session = ev.data.object;
        if (!isCheckoutSession(session)) break;

        const customerId = session.customer ?? "";
        const subscriptionId = session.subscription ?? "";
        if (!subscriptionId) {
          console.warn("[webhook] checkout.session.completed: missing subscriptionId");
          break;
        }

        const subFetched = await stripe.subscriptions.retrieve(subscriptionId);
        const sub = subFetched as unknown as SubscriptionLike;

        const byCustomer = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
          select: { id: true },
        });
        const userId =
          byCustomer?.id ??
          (typeof sub.metadata?.userId === "string" ? sub.metadata.userId : undefined);

        if (!userId) {
          console.warn("[webhook] checkout.session.completed: no userId");
          break;
        }

        const plan = mapPlan(sub.metadata?.plan);
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
        const subObj = ev.data.object;
        if (!isSubscription(subObj)) break;

        const subscriptionId = subObj.id;
        const customerId = subObj.customer ?? "";

        const byCustomer = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
          select: { id: true },
        });
        const userId =
          byCustomer?.id ??
          (typeof subObj.metadata?.userId === "string" ? subObj.metadata.userId : undefined);

        if (!userId) {
          console.warn(`[webhook] ${ev.type}: no userId`);
          break;
        }

        const { currentPeriodEnd, trialEnd } = subTimes(subObj);

        await prisma.billingSubscription.upsert({
          where: { stripeSubscriptionId: subscriptionId },
          create: {
            userId,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            status: subObj.status,
            currentPeriodEnd,
            trialEnd,
          },
          update: {
            status: subObj.status,
            currentPeriodEnd,
            trialEnd,
          },
        });

        const isInactive = ["canceled", "unpaid", "incomplete_expired"].includes(
          subObj.status
        );

        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubId: subObj.id,
            subscriptionStatus: subObj.status,
            ...(isInactive ? { plan: null } : {}),
          },
        });

        break;
      }

      default:
        console.log("[webhook] Unhandled event:", ev.type);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[webhook] handler error:", msg);
  }

  return NextResponse.json({ ok: true });
}
