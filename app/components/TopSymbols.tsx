"use client";

import { fmtUsd } from "@/lib/format";

type Trade = { symbol: string; pnl: number };

export default function TopSymbols({ trades }: { trades: Trade[] }) {
  const bySym = new Map<string, { pnl: number; count: number }>();
  trades.forEach((t) => {
    const cur = bySym.get(t.symbol) ?? { pnl: 0, count: 0 };
    cur.pnl += t.pnl;
    cur.count += 1;
    bySym.set(t.symbol, cur);
  });

  const rows = Array.from(bySym, ([symbol, { pnl, count }]) => ({
    symbol,
    pnl: +pnl.toFixed(2),
    count,
  }))
    .sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl))
    .slice(0, 3);

  return (
    <div className="glass p-4">
      <div className="mb-2 text-sm text-zinc-400">Top symbols</div>
      <div className="grid sm:grid-cols-3 gap-3">
        {rows.map((r) => {
          const pos = r.pnl >= 0;
          return (
            <div key={r.symbol} className="rounded-xl border border-white/10 p-3">
              <div className="text-sm text-zinc-400">{r.symbol}</div>
              <div className={`text-lg font-semibold ${pos ? "text-emerald-300" : "text-red-300"}`}>
                {fmtUsd(r.pnl, { signed: true })}
              </div>
              <div className="text-xs text-zinc-500">{r.count} trades</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
