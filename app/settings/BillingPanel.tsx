// app/settings/BillingPanel.tsx
"use client";

type Plan = "PRO_MONTHLY" | "PRO_ANNUAL" | null;

export default function BillingPanel({
  plan,
  portalUrl,
  trialEndsAt,
}: {
  plan?: Plan;
  portalUrl?: string | null;
  trialEndsAt?: string | null;
}) {
  const subscribed = plan === "PRO_MONTHLY" || plan === "PRO_ANNUAL";
  const trialActive =
    trialEndsAt ? new Date(trialEndsAt) > new Date() : false;

  return (
    <div className="glass p-4 space-y-3">
      <div className="text-sm text-zinc-400">Current plan</div>
      <div className="text-lg font-medium">
        {subscribed
          ? plan === "PRO_ANNUAL"
            ? "Pro – Annual"
            : "Pro – Monthly"
          : "Not subscribed"}
      </div>

      {trialActive && (
        <div className="text-sm text-emerald-500">
          Trial active — ends {new Date(trialEndsAt!).toLocaleDateString()}
        </div>
      )}

      <div className="pt-2">
        {portalUrl ? (
          <a className="btn-secondary" href={portalUrl}>
            Manage billing (change / cancel)
          </a>
        ) : (
          <div className="text-sm text-zinc-500">
            Billing portal unavailable. You can start a plan from the{" "}
            <a className="underline" href="/pricing">
              Pricing
            </a>{" "}
            page.
          </div>
        )}
      </div>

      <p className="text-xs text-zinc-500">
        This page is for managing your subscription only. To start a new trial,
        go to the Pricing page.
      </p>
    </div>
  );
}
