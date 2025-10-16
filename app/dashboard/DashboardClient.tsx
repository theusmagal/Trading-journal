"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import KPI from "@/components/KPI";
import CalendarPreview from "@/components/CalendarPreview";
import SparklineInteractive from "@/components/SparklineInteractive";
import TradesTable from "@/components/TradesTable";
import PnLHistogram from "@/components/PnLHistogram";
import TopSymbols from "@/components/TopSymbols";
import { fmtPct, fmtUsd } from "@/lib/format";

import GaugeWinRate from "@/components/widgets/GaugeWinRate";
import DonutProfitSplit from "@/components/widgets/DonutProfitSplit";
import AvgWinLossBar from "@/components/widgets/AvgWinLossBar";

type Summary = {
  kpis: { netPnl: number; winRate: number; profitFactor: number; avgR: number; tradeCount: number };
  equity: { x: number; y: number }[];
  calendar: { day: number; pnl: number; trades: number }[];
  trades: {
    id: string;
    symbol: string;
    side: "BUY" | "SELL";
    qty: string;
    price: string;
    pnl: number;
    time: string;
  }[];
};
type RangeKey = "7d" | "30d" | "ytd" | "all";

export default function DashboardClient({
  initial,
  initialRange,
}: {
  initial: Summary;
  initialRange: RangeKey;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlRange = (searchParams.get("range") as RangeKey) || initialRange;

  const [range, setRange] = useState<RangeKey>(urlRange);
  const [data, setData] = useState<Summary>(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlRange !== range) setRange(urlRange);
  }, [urlRange]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/me/summary?range=${range}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (active) setData(json);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [range]);

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date());
  }, []);

  const pos = useMemo(
    () => data.trades.filter((t) => t.pnl > 0).reduce((a, t) => a + t.pnl, 0),
    [data]
  );
  const neg = useMemo(
    () => Math.abs(data.trades.filter((t) => t.pnl < 0).reduce((a, t) => a + t.pnl, 0)),
    [data]
  );
  const deltaPnl = +(pos - neg).toFixed(2);

  const stats = useMemo(() => {
    const wins = data.trades.filter((t) => t.pnl > 0);
    const losses = data.trades.filter((t) => t.pnl < 0);

    const grossWins = wins.reduce((a, t) => a + t.pnl, 0);
    const grossLossesAbs = Math.abs(losses.reduce((a, t) => a + t.pnl, 0));

    const avgWin = wins.length ? grossWins / wins.length : 0;
    const avgLossAbs = losses.length ? grossLossesAbs / losses.length : 0;

    const profitFactor = grossLossesAbs > 0 ? grossWins / grossLossesAbs : wins.length ? Infinity : 0;

    return {
      wins: wins.length,
      losses: losses.length,
      grossWins,
      grossLossesAbs,
      avgWin,
      avgLossAbs,
      profitFactor,
    };
  }, [data]);

  const setRangeAndUrl = (r: RangeKey) => {
    setRange(r);
    const q = new URLSearchParams(searchParams);
    q.set("range", r);
    router.replace(`?${q.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {/* Range selector */}
      <div className="flex items-center gap-2">
        {(["7d", "30d", "ytd", "all"] as RangeKey[]).map((r) => {
          const active = range === r;
          return (
            <button
              key={r}
              onClick={() => setRangeAndUrl(r)}
              disabled={loading}
              aria-pressed={active}
              className={[
                "h-8 rounded-md px-3 text-sm transition",
                "border border-zinc-800",
                active
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-zinc-900/40 text-zinc-300 hover:bg-zinc-900/60",
              ].join(" ")}
            >
              {r.toUpperCase()}
            </button>
          );
        })}
        {loading && <span className="text-xs text-zinc-400">Loading…</span>}
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI
          label="Total P&L"
          value={fmtUsd(data.kpis.netPnl)}
          forceGreen           
        />
        <KPI label="Win rate" value={fmtPct(data.kpis.winRate)} />
        <KPI label="Profit factor" value={`${data.kpis.profitFactor}`} />
        <KPI label="Avg R" value={`${data.kpis.avgR}`} sub={`${data.kpis.tradeCount} trades`} />
      </div>


      {/*equity */}
      <section className="glass p-4">
        <div className="mb-2 text-sm text-zinc-400">Equity curve ({range.toUpperCase()})</div>
        <SparklineInteractive data={data.equity} />
      </section>

      {/* visuall summary widgets */}
      <div className="grid gap-4 md:grid-cols-3">
        <GaugeWinRate wins={stats.wins} losses={stats.losses} />
        <DonutProfitSplit
          grossWins={stats.grossWins}
          grossLossesAbs={stats.grossLossesAbs}
          profitFactor={stats.profitFactor}
        />
        <AvgWinLossBar avgWin={stats.avgWin} avgLossAbs={stats.avgLossAbs} />
      </div>

      {/* Extras */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopSymbols trades={data.trades} />
        <PnLHistogram trades={data.trades} />
      </div>

      {/* calendar + trades */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CalendarPreview days={data.calendar} title={monthLabel} />
        <TradesTable rows={data.trades} />
      </div>
    </div>
  );
}
