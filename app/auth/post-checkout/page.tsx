// app/auth/post-checkout/page.tsx
import { redirect } from "next/navigation";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { authUserId } from "@/lib/auth";
import { Plan as PlanEnum } from "@prisma/client"; // <- Prisma enum

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function PostCheckout({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  if (!sessionId) {
    redirect("/dashboard");
  }

  const userId = await authUserId();

  // Retrieve the Checkout session (expand to get subscription object)
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  // subscription can be string | Stripe.Subscription | null
  const subscription = session.subscription as string | Stripe.Subscription | null;
  const subscriptionId =
    typeof subscription === "string" ? subscription : subscription?.id ?? undefined;

  // customer can be string | Stripe.Customer | null
  const customer = session.customer as string | Stripe.Customer | null;
  const customerId =
    typeof customer === "string" ? customer : customer?.id ?? undefined;

  // Validate plan from metadata against Prisma enum
  const planMeta = session.metadata?.plan;
  const plan: PlanEnum | undefined =
    planMeta === "monthly" || planMeta === "annual"
      ? (planMeta as PlanEnum)
      : undefined;

  // trial_end only present when subscription is an object
  const trialEndsAt =
    typeof subscription === "object" && subscription?.trial_end
      ? new Date(subscription.trial_end * 1000)
      : undefined;

  // Update user safely
  await prisma.user.update({
    where: { id: userId },
    data: {
      // Save Stripe customer id if we have it
      ...(customerId ? { stripeCustomerId: customerId } : {}),
      // If your schema has stripeSubscriptionId, keep this line; otherwise leave it out
      ...(subscriptionId ? { stripeSubscriptionId: subscriptionId } : {}),
      // Enum needs `{ set: ... }`
      ...(plan ? { plan: { set: plan } } : {}),
      // DateTime accepts a Date or `{ set: Date }`
      ...(trialEndsAt ? { trialEndsAt } : {}),
    },
  });

  // Done → Dashboard with welcome flag
  redirect("/dashboard?welcome=1");
}
