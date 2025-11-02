// app/api/billing/portal/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // ← no apiVersion

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "No Stripe customer" }, { status: 400 });
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.APP_URL}/settings/billing`,
  });

  return NextResponse.json({ url: portal.url });
}
