import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function isActiveStatus(s?: string | null) {
  return s === "active" || s === "trialing";
}

export async function requireMember(): Promise<{ userId: string }> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: userId! },
    select: { subscriptionStatus: true, trialEndsAt: true },
  });

  const now = new Date();
  const onTrial = user?.trialEndsAt ? user.trialEndsAt > now : false;
  const ok = isActiveStatus(user?.subscriptionStatus) || onTrial;

  if (!ok) {
    redirect("/settings/billing?reason=subscribe");
  }

  return { userId: userId! };
}
