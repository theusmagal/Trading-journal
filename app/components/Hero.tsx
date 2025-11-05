export default function Hero() {
  return (
    <section className="py-16 md:py-24 bg-transparent text-inherit">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <span
          className="
            inline-block rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider
            text-emerald-700 bg-emerald-500/10 ring-1 ring-emerald-500/30
            dark:text-emerald-300/90 dark:bg-emerald-400/10 dark:ring-emerald-400/30
          "
        >
          New • Trading Journal for Pros
        </span>

        <h1
          className="
            mt-5 text-4xl font-semibold leading-tight md:text-5xl
            text-zinc-900 dark:text-zinc-100
          "
        >
          Trade smarter. <span className="text-emerald-600 dark:text-emerald-400">Not harder.</span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-zinc-700 dark:text-zinc-300">
          Connect your exchange, get instant analytics, and track your edge with a visual calendar,
          KPIs, and PnL insights. No spreadsheets. No manual entry.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="/pricing"
            className="
              rounded-lg px-5 py-3 font-medium transition
              bg-emerald-600 text-white hover:bg-emerald-500
              dark:bg-emerald-500 dark:text-zinc-900 dark:hover:bg-emerald-400
            "
          >
            Start free trial
          </a>

          <a
            href="/pricing"
            className="
              rounded-lg px-5 py-3 transition
              border border-black/10 text-zinc-900 hover:bg-black/5
              dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/5
            "
          >
            See pricing
          </a>
        </div>

        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          14-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}
