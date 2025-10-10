export default function Hero() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <span className="inline-block text-[11px] font-medium tracking-wider uppercase text-emerald-300/90 bg-emerald-400/10 ring-1 ring-emerald-400/30 px-3 py-1 rounded-full">
          New • Trading Journal for Pros
        </span>
        <h1 className="mt-5 text-4xl md:text-5xl font-semibold leading-tight">
          Trade smarter. <span className="text-emerald-400">Not harder.</span>
        </h1>
        <p className="mt-4 text-zinc-300/90 max-w-2xl mx-auto">
          Connect your exchange, get instant analytics, and track your edge with a visual calendar, KPIs, and PnL insights. No spreadsheets. No manual entry.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a href="/auth/register" className="px-5 py-3 rounded-lg bg-emerald-500 text-zinc-900 font-medium hover:bg-emerald-400 transition">
            Start free trial
          </a>
          <a href="/pricing" className="px-5 py-3 rounded-lg border border-white/15 hover:border-white/25">
            See pricing
          </a>
        </div>
        <p className="mt-3 text-xs text-zinc-400">14-day free trial • Cancel anytime</p>
      </div>
    </section>
  );
}
