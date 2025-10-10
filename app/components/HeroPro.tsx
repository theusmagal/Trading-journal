import Container from "./Container";
import Image from "next/image";

export default function HeroPro() {
  return (
    <section className="pt-16 md:pt-24">
      <Container className="grid md:grid-cols-2 gap-10 items-center">
        {/* Copy block */}
        <div>
          <span className="inline-block text-[11px] font-medium tracking-wider uppercase text-emerald-300/90 bg-emerald-400/10 ring-1 ring-emerald-400/30 px-3 py-1 rounded-full">
            New • Trading journal for pros
          </span>

          <h1 className="mt-5 text-4xl md:text-5xl font-semibold leading-tight">
            Trade smarter. <span className="text-emerald-400">
              Not harder.</span>
          </h1>

          <p className="mt-4 text-zinc-300/90">
            Connect your exchange and get instant analytics — KPIs, equity curve, and a PnL calendar.
            No spreadsheets. No manual entry.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <a href="/auth/register" className="px-5 py-3 rounded-lg bg-emerald-500 text-zinc-900 font-medium hover:bg-emerald-400 transition">
              Start free trial
            </a>
            <a href="/pricing" className="px-5 py-3 rounded-lg border border-white/15 hover:border-white/25">
              See pricing
            </a>
          </div>

          {/* 3 quick bullets */}
          <ul className="mt-5 grid gap-2 text-sm text-zinc-300/90">
            <li className="flex items-center gap-2"><span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">✓</span>Auto-import trades (Binance first; Bybit next)</li>
            <li className="flex items-center gap-2"><span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">✓</span>KPI dashboard & equity curve</li>
            <li className="flex items-center gap-2"><span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">✓</span>PnL calendar with daily trade counts</li>
          </ul>

          <p className="mt-3 text-xs text-zinc-400">14-day free trial • Cancel anytime</p>
        </div>

        {/* Illustration block with your 950×614 screenshot */}
        <div className="relative">
          {/* soft glow */}
          <div className="absolute -top-10 -right-8 h-64 w-64 md:h-80 md:w-80 rounded-full bg-emerald-500/20 blur-3xl -z-10" />

          <div className="glass p-3 rounded-2xl">
            <Image
              src="/marketing/hero-dashboard.png"
              alt="TradePulse dashboard preview"
              width={950}          // intrinsic width
              height={614}         // intrinsic height
              priority
              className="rounded-xl border border-white/10 w-full h-auto"
              sizes="(min-width: 768px) 540px, 100vw"
            />
          </div>

          {/* KPI chips */}
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <div className="glass p-3 text-center">
              <div className="text-lg font-semibold text-emerald-300">+12%</div>
              <div className="text-zinc-400">MoM PnL</div>
            </div>
            <div className="glass p-3 text-center">
              <div className="text-lg font-semibold text-emerald-300">58%</div>
              <div className="text-zinc-400">Win rate</div>
            </div>
            <div className="glass p-3 text-center">
              <div className="text-lg font-semibold text-emerald-300">1.8</div>
              <div className="text-zinc-400">Profit factor</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
