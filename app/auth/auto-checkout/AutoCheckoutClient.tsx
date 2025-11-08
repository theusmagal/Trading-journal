"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Plan = "monthly" | "annual";
type SessionResponse = { user?: { id: string; email?: string } } | null;

export default function AutoCheckoutClient() {
  const search = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const plan = useMemo<Plan>(() => {
    const p = (search.get("plan") || "").toLowerCase();
    return p === "annual" ? "annual" : "monthly";
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sessRes = await fetch("/api/auth/session", { credentials: "same-origin" });
        const sess: SessionResponse = await sessRes.json().catch(() => null);

        if (!sess?.user) {
          if (!cancelled) router.replace(`/auth/register?plan=${plan}`);
          return;
        }

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
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unexpected error";
        if (!cancelled) setError(msg);
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
        <button className="btn-primary" onClick={() => router.push("/pricing?retry=1")}>
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
