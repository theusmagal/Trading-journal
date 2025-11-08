"use client";

type Plan = "PRO_MONTHLY" | "PRO_ANNUAL";

type Props = {
  /** Current paid plan; omit or undefined means not subscribed */
  plan?: Plan;
  /** Stripe customer portal URL (null/undefined when unavailable) */
  portalUrl?: string | null;
  /** ISO string; when in the future, shows active trial */
  trialEndsAt?: string | null;
};

export default function BillingPanel({ plan, portalUrl, trialEndsAt }: Props) {
  const hasPlan = plan === "PRO_MONTHLY" || plan === "PRO_ANNUAL";

  const planLabel =
    plan === "PRO_ANNUAL" ? "Annual" : plan === "PRO_MONTHLY" ? "Monthly" : "Not subscribed";

  const trialDate = trialEndsAt ? new Date(trialEndsAt) : null;
  const trialActive = !!trialDate && trialDate.getTime() > Date.now();
  const trialLabel =
    trialDate &&
    trialDate.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });

  return (
    <div className="glass p-6 space-y-4 max-w-xl">
      <h1 className="text-2xl font-semibold">Billing</h1>

      <div className="text-sm text-zinc-400">Current plan</div>
      <div className="text-lg">{planLabel}</div>

      {trialActive && (
        <div className="text-sm text-emerald-500">
          Trial active — ends {trialLabel}
        </div>
      )}

      <div className="pt-2">
        {hasPlan && portalUrl ? (
          <a href={portalUrl} className="px-3 py-2 rounded bg-emerald-600 text-white">
            Manage Subscription
          </a>
        ) : (
          <span className="text-sm text-zinc-500">
            {hasPlan
              ? "Billing portal is unavailable right now."
              : "You don’t have an active subscription."}
          </span>
        )}
      </div>

      <p className="text-xs text-zinc-500">
        Subscriptions support a 14-day trial. If you start a plan, the trial end date will appear here.
      </p>
    </div>
  );
}
