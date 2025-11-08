import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function isActiveStatus(s?: string | null): boolean {
  return s === "active" || s === "trialing";
}

/**
 * Ensures the current user is a paid or trialing member.
 * Redirects to /auth/login if not authenticated,
 * or /settings/billing if subscription/trial is inactive.
 */
export async function requireMember(): Promise<{ userId: string }> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionStatus: true, trialEndsAt: true },
  });

  const now = new Date();
  const onTrial = user?.trialEndsAt ? user.trialEndsAt > now : false;
  const ok = isActiveStatus(user?.subscriptionStatus) || onTrial;

  if (!ok) redirect("/settings/billing?reason=subscribe");

  return { userId };
}

/** Membership plan types */
export type Plan = "free" | "monthly" | "yearly";

/** Membership object model */
export type Membership = {
  userId: string;
  plan: Plan;
  active: boolean;
  currentPeriodEnd?: Date | null;
};

/** Returns true if membership is currently valid */
export function isActive(m: Membership): boolean {
  if (!m.active) return false;
  if (m.currentPeriodEnd && m.currentPeriodEnd < new Date()) return false;
  return true;
}
