"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AutoCheckoutPage() {
  const search = useSearchParams();
  const router = useRouter();
  const plan = (search.get("plan") === "annual" ? "annual" : "monthly") as "monthly" | "annual";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // 1) Check session first
        const sessRes = await fetch("/api/auth/session", { credentials: "same-origin" });
        const sess = await sessRes.json().catch(() => ({}));

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
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `Failed to create checkout (${res.status})`);
        }

        const { url } = await res.json();
        if (!cancelled && url) window.location.href = url;
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Unexpected error");
      }
    })();

    return () => { cancelled = true; };
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
