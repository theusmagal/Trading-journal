// app/settings/BillingPanel.tsx
"use client";
import { useState } from "react";

export default function BillingPanel({
  plan,
  portalUrl,
}: {
  plan?: string | null;
  portalUrl?: string | null;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="glass p-4 space-y-4">
      <div className="text-sm text-zinc-400">Current plan</div>
      <div className="text-lg capitalize">{plan ?? "free"}</div>
      <div>
        {portalUrl ? (
          <a
            href={portalUrl}
            onClick={() => setLoading(true)}
            className="btn-primary inline-block"
          >
            {loading ? "Opening…" : "Manage billing"}
          </a>
        ) : (
          <div className="text-sm text-zinc-400">
            Billing portal unavailable (no Stripe customer yet).
          </div>
        )}
      </div>
    </div>
  );
}
