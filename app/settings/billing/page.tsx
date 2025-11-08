import { prisma } from "@/lib/prisma";
import BillingPanel from "../BillingPanel";
import { authUserId } from "@/lib/auth";

type Plan = "PRO_MONTHLY" | "PRO_ANNUAL";

export const runtime = "nodejs";

export default async function BillingPage() {
  const userId = await authUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, trialEndsAt: true },
  });

  // strictly type: Plan | undefined
  const plan = (user?.plan ?? undefined) as Plan | undefined;
  const trialEndsAt = user?.trialEndsAt ? user.trialEndsAt.toISOString() : null;

  // No billing portal model yet -> show nothing / disabled button
  const portalUrl = null;

  return (
    <BillingPanel
      plan={plan}
      portalUrl={portalUrl}
      trialEndsAt={trialEndsAt}
    />
  );
}
