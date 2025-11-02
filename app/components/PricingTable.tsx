// app/components/PricingTable.tsx
export default function PricingTable({ highlightAnnual = true }: { highlightAnnual?: boolean }) {
  return (
    <section className="py-12 md:py-16 bg-transparent">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-2xl md:text-3xl font-semibold text-zinc-100">
          Simple pricing
        </h2>
        <p className="mt-2 text-center text-zinc-400">
          Fair and transparent. No hidden fees.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Yearly (highlight) */}
          <div
            className={[
              "glass p-6",
              highlightAnnual
                ? "ring-1 ring-emerald-400/30 shadow-[0_0_30px_rgba(16,185,129,.18)]"
                : "",
            ].join(" ")}
          >
            <h3 className="font-semibold text-zinc-100">Yearly</h3>
            <p className="mt-1 text-3xl font-bold text-zinc-100">
              €200 <span className="text-sm text-zinc-400">/ year</span>
            </p>
            <p className="mt-1 text-xs text-emerald-300">Best value — 2 months free</p>

            <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-zinc-200">
              <li>All analytics & calendar</li>
              <li>1 connected exchange (Binance)</li>
              <li>Priority support</li>
            </ul>

            {/* ✅ Pass plan=annual so it auto-redirects to Stripe after sign-up */}
            <a
              href="/auth/register?plan=annual"
              className="mt-6 inline-block w-full rounded-md px-5 py-3 text-center font-medium
                         bg-emerald-500 text-zinc-900 hover:bg-emerald-400
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70
                         shadow-[0_0_20px_rgba(16,185,129,.18)] hover:shadow-[0_0_26px_rgba(16,185,129,.24)] transition"
            >
              Start free trial
            </a>
          </div>

          {/* Monthly */}
          <div className="glass p-6 opacity-85 transition hover:opacity-100">
            <h3 className="font-semibold text-zinc-100">Monthly</h3>
            <p className="mt-1 text-3xl font-bold text-zinc-100">
              €20 <span className="text-sm text-zinc-400">/ month</span>
            </p>

            <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-zinc-200">
              <li>All analytics & calendar</li>
              <li>1 connected exchange (Binance)</li>
              <li>Cancel anytime</li>
            </ul>

            {/* ✅ Pass plan=monthly as well */}
            <a
              href="/auth/register?plan=monthly"
              className="mt-6 inline-block w-full rounded-md px-5 py-3 text-center font-medium
                         border border-zinc-700/70 text-zinc-200 hover:bg-zinc-900/60
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 transition"
            >
              Start monthly
            </a>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-400">
          VAT handled by Stripe • 14-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}
