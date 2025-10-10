export default function PricingTable({ highlightAnnual = true }: { highlightAnnual?: boolean }) {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-center">Simple pricing</h2>
        <p className="text-zinc-300/90 text-center mt-2">Fair and transparent. No hidden fees.</p>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className={`glass p-6 ${highlightAnnual ? "ring-1 ring-emerald-400/40" : ""}`}>
            <h3 className="font-semibold">Yearly</h3>
            <p className="mt-1 text-3xl font-bold">€200 <span className="text-sm text-zinc-400">/ year</span></p>
            <p className="text-xs text-emerald-300 mt-1">Best value — 2 months free</p>
            <ul className="mt-4 text-sm text-zinc-200/90 space-y-2 list-disc list-inside">
              <li>All analytics & calendar</li>
              <li>1 connected exchange (Binance)</li>
              <li>Priority support</li>
            </ul>
            <a href="/auth/register" className="mt-6 inline-block w-full text-center px-5 py-3 rounded-lg bg-emerald-500 text-zinc-900 font-medium hover:bg-emerald-400 transition">
              Start free trial
            </a>
          </div>

          <div className="glass p-6">
            <h3 className="font-semibold">Monthly</h3>
            <p className="mt-1 text-3xl font-bold">€20 <span className="text-sm text-zinc-400">/ month</span></p>
            <ul className="mt-4 text-sm text-zinc-200/90 space-y-2 list-disc list-inside">
              <li>All analytics & calendar</li>
              <li>1 connected exchange (Binance)</li>
              <li>Cancel anytime</li>
            </ul>
            <a href="/auth/register" className="mt-6 inline-block w-full text-center px-5 py-3 rounded-lg border border-white/15 hover:border-white/25">
              Start monthly
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-4">
          VAT handled by Stripe • 14-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}
