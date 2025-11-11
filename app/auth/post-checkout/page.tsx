// app/auth/post-checkout/page.tsx
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { authUserId } from "@/lib/auth";
import { Plan as PrismaPlan } from "@prisma/client"; // <-- Prisma enum

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UiPlan = "monthly" | "annual";

function toPrismaPlan(p?: UiPlan): PrismaPlan | undefined {
  return p
    ? p === "monthly"
      ? PrismaPlan.PRO_MONTHLY
      : PrismaPlan.PRO_ANNUAL
    : undefined;
}

export default async function PostCheckout({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  if (!sessionId) redirect("/dashboard");

  const userId = await authUserId();

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  const planUi = (session.metadata?.plan as UiPlan | undefined) ?? undefined;
  const planDb = toPrismaPlan(planUi);

  const cust =
    typeof session.customer === "string" ? session.customer : session.customer?.id;

  const sub =
    typeof session.subscription === "object" && session.subscription
      ? session.subscription
      : undefined;

  const trialEndsAt =
    sub && typeof (sub as any).trial_end === "number"
      ? new Date((sub as any).trial_end * 1000)
      : undefined;

  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: cust ?? undefined,
      ...(planDb ? { plan: planDb } : {}),       
      ...(trialEndsAt ? { trialEndsAt } : {}),
    },
  });

  redirect("/dashboard?welcome=1");
}
