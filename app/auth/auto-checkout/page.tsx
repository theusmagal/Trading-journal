"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Plan = "monthly" | "annual";
type SessionResponse = { user?: { id: string; email?: string } } | null;

export default function AutoCheckoutPage() {
  const search = useSearchParams();
  const router = useRouter();
  const plan: Plan = (search.get("plan") === "annual" ? "annual" : "monthly") as Plan;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // 1) Check session first
        const sessRes = await fetch("/api/auth/session", { credentials: "same-origin" });
        const sess: SessionResponse = await sessRes.json().catch(() => null);

        if (!sess?.user) {
          // Not logged in -> go create account with plan carried over
          if (!cancelled) router.replace(`/auth/register?plan=${plan}`);
          return;
        }

        // 2) Now we’re authenticated; create checkout
        const res = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ plan }),
        });

        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(j.error || `Failed to create checkout (${res.status})`);
        }

        const { url } = (await res.json()) as { url?: string };
        if (!cancelled && url) window.location.href = url;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unexpected error";
        if (!cancelled) setError(message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [plan, router]);

  if (error) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="mb-4 text-red-500">{error}</p>
        <button className="btn-primary" onClick={() => router.push(`/pricing?retry=1`)}>
          Back to pricing
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p>Creating your secure checkout…</p>
    </div>
  );
}
