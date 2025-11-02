// app/api/billing/checkout/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function priceIdFor(plan: "monthly" | "annual") {
  return plan === "annual"
    ? process.env.STRIPE_PRICE_ID_ANNUAL!
    : process.env.STRIPE_PRICE_ID_MONTHLY!;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const email = session.user.email;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const plan: "monthly" | "annual" =
    body?.plan === "annual" ? "annual" : "monthly";

  // Ensure single Customer; keep metadata.userId set
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  let stripeCustomerId = dbUser?.stripeCustomerId ?? null;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email,
      metadata: { userId },
    });
    stripeCustomerId = customer.id;
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId },
    });
  } else {
    try {
      await stripe.customers.update(stripeCustomerId, {
        metadata: { userId },
      });
    } catch {}
  }

  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    client_reference_id: userId, // webhook fallback
    payment_method_types: ["card"],
    line_items: [{ price: priceIdFor(plan), quantity: 1 }],
    subscription_data: {
      trial_period_days: 14,
      metadata: { plan, userId },
    },
    allow_promotion_codes: true,
    success_url: `${appUrl}/settings/billing?from=checkout`,
    cancel_url: `${appUrl}/pricing?canceled=1`,
  });

  return NextResponse.json({ url: checkout.url });
}
