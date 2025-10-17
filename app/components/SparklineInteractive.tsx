"use client";
import { useMemo, useState } from "react";

type Pt = { x: number; y: number };

export default function SparklineInteractive({
  data,
  className = "",
}: {
  data: Pt[];
  className?: string;
}) {
  if (!data?.length) return null;

  // Ensure sorted & deduped
  const series = useMemo(() => {
    const s = [...data]
      .filter((d) => Number.isFinite(d.x) && Number.isFinite(d.y))
      .sort((a, b) => a.x - b.x);
    return s.filter((d, i) => (i === 0 ? true : d.x !== s[i - 1].x));
  }, [data]);

  const xs = series.map((d) => d.x),
    ys = series.map((d) => d.y);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs);
  const minY = Math.min(...ys),
    maxY = Math.max(...ys);

  const W = 900,
    H = 320,
    P = 12;

  const sx = (x: number) =>
    P + ((x - minX) / (maxX - minX || 1)) * (W - 2 * P);
  const sy = (y: number) =>
    H - P - ((y - minY) / (maxY - minY || 1)) * (H - 2 * P);

  const path = series
    .map((p, i) => `${i ? "L" : "M"}${sx(p.x)},${sy(p.y)}`)
    .join(" ");
  const xsScaled = series.map((p) => sx(p.x));

  const [hi, setHi] = useState<number | null>(null);

  const fmtDate = (ts: number) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
    }).format(new Date(ts));
  const fmtUsd = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(n);

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        onMouseMove={(e) => {
          const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const x = (e.clientX - rect.left) * (W / rect.width);
          let idx = 0,
            best = Infinity;
          xsScaled.forEach((xx, i) => {
            const diff = Math.abs(xx - x);
            if (diff < best) {
              best = diff;
              idx = i;
            }
          });
          setHi(idx);
        }}
        onMouseLeave={() => setHi(null)}
      >
        <defs>
          <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        {/* base line */}
        <line
          x1={P}
          y1={H - P}
          x2={W - P}
          y2={H - P}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />

        {/* path & area */}
        <path
          d={path}
          fill="none"
          stroke="#34d399"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d={`${path} L ${sx(maxX)},${H - P} L ${sx(minX)},${H - P} Z`}
          fill="url(#equityFill)"
        />

        {/* hover marker */}
        {hi !== null && (
          <>
            <line
              x1={sx(series[hi].x)}
              x2={sx(series[hi].x)}
              y1={P}
              y2={H - P}
              stroke="rgba(255,255,255,0.25)"
              strokeDasharray="3 3"
            />
            <circle cx={sx(series[hi].x)} cy={sy(series[hi].y)} r="4" fill="#34d399" />
          </>
        )}
      </svg>

      {/* tooltip */}
      {hi !== null && (
        <div
          className="pointer-events-none absolute rounded-md border border-white/10 bg-black/70 px-2 py-1 text-xs text-zinc-100"
          style={{ left: `calc(${(xsScaled[hi] / W) * 100}% + 6px)`, top: 6 }}
        >
          <div>{fmtDate(series[hi].x)}</div>
          <div className="font-medium">{fmtUsd(series[hi].y)}</div>
        </div>
      )}
    </div>
  );
}
