
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Minimal shapes used here */
type CheckoutSessionLike = {
  id?: string;
  customer?: string | null;
  subscription?: string | null;
  metadata?: Record<string, unknown> | null;
};

type SubscriptionLike = {
  id: string;
  customer: string | null;
  status: string;
  metadata?: Record<string, unknown> | null;
  current_period_end?: number | null;
  trial_end?: number | null;
  items?: { data?: Array<{ price?: { id?: string | null } | null }> } | null;
};

function isCheckoutSession(x: unknown): x is CheckoutSessionLike {
  return !!x && typeof x === "object";
}
function isSubscription(x: unknown): x is SubscriptionLike {
  return !!x && typeof x === "object" && "id" in x && "status" in x;
}

function toDateOrNull(sec?: number | null) {
  return sec != null ? new Date(sec * 1000) : null;
}

type PlanEnum = "PRO_MONTHLY" | "PRO_ANNUAL";

function mapPlan(meta: unknown): PlanEnum | null {
  const s = typeof meta === "string" ? meta : undefined;
  if (s === "monthly") return "PRO_MONTHLY";
  if (s === "annual")  return "PRO_ANNUAL";
  return null;
}

function mapPlanFromPriceId(priceId?: string | null): PlanEnum | null {
  const m = process.env.STRIPE_PRICE_ID_MONTHLY ?? process.env.STRIPE_PRICE_MONTHLY;
  const a = process.env.STRIPE_PRICE_ID_ANNUAL  ?? process.env.STRIPE_PRICE_ANNUAL;
  if (!priceId) return null;
  if (m && priceId === m) return "PRO_MONTHLY";
  if (a && priceId === a) return "PRO_ANNUAL";
  return null;
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const rawBody = await req.text();

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: unknown) {
    console.error("[webhook] signature verify failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const ev = event as { type: string; data: { object: unknown } };

  try {
    switch (ev.type) {
      case "checkout.session.completed": {
        const session = ev.data.object;
        if (!isCheckoutSession(session)) break;

        const sessionId = session.id;
        const customerId = session.customer ?? undefined;
        const subscriptionId = session.subscription ?? undefined;
        if (!subscriptionId) break;

        
        const subFetched = (await stripe.subscriptions.retrieve(subscriptionId)) as any as SubscriptionLike;

        
        let plan =
          mapPlan(subFetched?.metadata?.plan) ??
          mapPlan(session?.metadata?.plan);

        if (!plan && sessionId) {
          const items = await stripe.checkout.sessions.listLineItems(sessionId, { expand: ["data.price"] });
          const priceId = (items.data?.[0]?.price as any)?.id as string | undefined;
          plan = mapPlanFromPriceId(priceId) ?? plan;
        }

        
        const byCustomer = customerId
          ? await prisma.user.findFirst({
              where: { stripeCustomerId: customerId },
              select: { id: true },
            })
          : null;

        const userId =
          byCustomer?.id ??
          (typeof subFetched?.metadata?.userId === "string" ? subFetched.metadata.userId : undefined) ??
          (typeof (session as any)?.metadata?.userId === "string" ? (session as any).metadata.userId : undefined);

        if (!userId) break;

        const trialEndsAt = toDateOrNull(subFetched?.trial_end);
        const currentPeriodEnd = toDateOrNull(subFetched?.current_period_end);
        const status = subFetched?.status;

        
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: plan ?? undefined,
            trialEndsAt: trialEndsAt ?? undefined,
            stripeCustomerId: customerId ?? undefined,
            stripeSubId: subFetched.id,
            subscriptionStatus: status,
          },
        });

        
        await prisma.billingSubscription.upsert({
          where: { stripeSubscriptionId: subscriptionId },
          create: {
            userId,
            stripeCustomerId: customerId ?? "",
            stripeSubscriptionId: subscriptionId,
            status: status ?? "active",
            currentPeriodEnd,
            trialEnd: trialEndsAt,
          },
          update: {
            status: status ?? "active",
            currentPeriodEnd,
            trialEnd: trialEndsAt,
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
        const customerId = subObj.customer ?? undefined;

        
        let plan = mapPlan(subObj?.metadata?.plan);
        if (!plan) {
          const priceId = (subObj?.items?.data?.[0]?.price as any)?.id as string | undefined;
          plan = mapPlanFromPriceId(priceId) ?? plan;
        }

        const byCustomer = customerId
          ? await prisma.user.findFirst({
              where: { stripeCustomerId: customerId },
              select: { id: true },
            })
          : null;

        const userId =
          byCustomer?.id ??
          (typeof subObj?.metadata?.userId === "string" ? subObj.metadata.userId : undefined);

        if (!userId) break;

        const trialEndsAt = toDateOrNull(subObj?.trial_end);
        const currentPeriodEnd = toDateOrNull(subObj?.current_period_end);
        const status = subObj?.status;

        
        await prisma.billingSubscription.upsert({
          where: { stripeSubscriptionId: subscriptionId },
          create: {
            userId,
            stripeCustomerId: customerId ?? "",
            stripeSubscriptionId: subscriptionId,
            status: status ?? "active",
            currentPeriodEnd,
            trialEnd: trialEndsAt,
          },
          update: {
            status: status ?? "active",
            currentPeriodEnd,
            trialEnd: trialEndsAt,
          },
        });

        
        const isInactive = ["canceled", "unpaid", "incomplete_expired"].includes(status || "");
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubId: subscriptionId,
            subscriptionStatus: status,
            ...(isInactive ? { plan: null } : plan ? { plan } : {}),
            ...(trialEndsAt ? { trialEndsAt } : {}),
          },
        });

        break;
      }

      default:
        console.log("[webhook] Unhandled event:", ev.type);
    }
  } catch (err) {
    console.error("[webhook] handler error:", err);
  }

  return NextResponse.json({ ok: true });
}
