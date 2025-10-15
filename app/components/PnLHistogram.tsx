"use client";

type Trade = { pnl: number };

export default function PnLHistogram({ trades }: { trades: Trade[] }) {
  if (!trades?.length) return null;
  const bins = 11; // -25 … +80 in API, but we’ll compute dynamically
  const min = Math.min(...trades.map(t=>t.pnl));
  const max = Math.max(...trades.map(t=>t.pnl));
  const pad = (max-min) * 0.05;
  const lo = min - pad, hi = max + pad;
  const step = (hi - lo) / bins;

  const counts = new Array(bins).fill(0);
  trades.forEach(t => {
    let idx = Math.floor((t.pnl - lo) / step);
    if (idx < 0) idx = 0;
    if (idx >= bins) idx = bins - 1;
    counts[idx]++;
  });

  const W = 600, H = 160, P = 20;
  const maxC = Math.max(...counts, 1);
  const barW = (W - 2*P) / bins;

  return (
    <div className="glass p-4">
      <div className="mb-2 text-sm text-zinc-400">PnL distribution</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <line x1={P} y1={H-P} x2={W-P} y2={H-P} stroke="rgba(255,255,255,0.12)" />
        {counts.map((c, i) => {
          const x = P + i * barW + 2;
          const h = ((c / maxC) * (H - 2*P)) || 0;
          const y = H - P - h;
          const midVal = lo + (i + 0.5) * step;
          const isPos = midVal >= 0;
          const fill = isPos ? "rgba(16,185,129,0.6)" : "rgba(244,63,94,0.6)";
          return <rect key={i} x={x} y={y} width={barW - 4} height={h} fill={fill} rx="3" />;
        })}
      </svg>
    </div>
  );
}
