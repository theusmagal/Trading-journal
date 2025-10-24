// app/settings/billing/page.tsx
import { prisma } from "@/lib/prisma";
import { authUserId } from "@/lib/auth";
import { createPortalSession } from "@/lib/stripe";
import BillingPanel from "../BillingPanel";

export default async function BillingPage() {
  const userId = await authUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, stripeCustomerId: true },
  });

  let portalUrl: string | null = null;

  if (user?.stripeCustomerId && process.env.APP_URL) {
    const sess = await createPortalSession(
      user.stripeCustomerId,
      `${process.env.APP_URL}/settings/billing`
    );
    portalUrl = sess.url ?? null;
  }

  return <BillingPanel plan={user?.plan ?? "free"} portalUrl={portalUrl ?? undefined} />;
}
