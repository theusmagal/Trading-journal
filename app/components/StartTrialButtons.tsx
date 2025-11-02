"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function StartTrialButtons() {
  const router = useRouter();
  const { status } = useSession();

  async function start(plan: "monthly" | "annual") {
    if (status === "authenticated") {
      // Already logged in → go create checkout session
      router.push(`/auth/auto-checkout?plan=${plan}`);
    } else {
      // Not logged in → go create/login carrying the plan
      router.push(`/auth/register?plan=${plan}`);
    }
  }

  return (
    <div className="flex gap-3">
      <button className="btn-primary" onClick={() => start("monthly")}>
        Start 14-day trial — Monthly
      </button>
      <button className="btn-ghost" onClick={() => start("annual")}>
        Start 14-day trial — Annual
      </button>
    </div>
  );
}
