"use client";

type Pt = { x: number; y: number };

export default function SparklineInteractive({ data, className="" }: { data: Pt[]; className?: string }) {
  if (!data?.length) return null;
  const xs = data.map(d => d.x), ys = data.map(d => d.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const W = 600, H = 160, P = 8;

  const sx = (x:number) => P + ((x - minX) / (maxX - minX || 1)) * (W - 2*P);
  const sy = (y:number) => H - P - ((y - minY) / (maxY - minY || 1)) * (H - 2*P);
  const d = data.map((p,i) => `${i ? "L":"M"}${sx(p.x)},${sy(p.y)}`).join(" ");

  const xsScaled = data.map(p => sx(p.x));
  const [hi, setHi] = useState<number | null>(null);

  return (
    <div className={`relative ${className}`}>
      <svg viewBox={`0 0 ${W} ${H}`}
           className="w-full h-auto"
           onMouseMove={(e) => {
             const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
             const x = (e.clientX - rect.left) * (W / rect.width);
             let idx = 0, best = Infinity;
             xsScaled.forEach((xx,i) => { const diff = Math.abs(xx - x); if (diff < best) { best = diff; idx = i; }});
             setHi(idx);
           }}
           onMouseLeave={() => setHi(null)}>
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#34d399" stopOpacity="0"/>
          </linearGradient>
        </defs>

        <line x1={P} y1={H-P} x2={W-P} y2={H-P} stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>

        <path d={d} fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
        <path d={`${d} L ${sx(maxX)},${H-P} L ${sx(minX)},${H-P} Z`} fill="url(#sg)"/>

        {hi !== null && (
          <>
            <line x1={sx(data[hi].x)} x2={sx(data[hi].x)} y1={P} y2={H-P}
                  stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3"/>
            <circle cx={sx(data[hi].x)} cy={sy(data[hi].y)} r="3.5" fill="#34d399" />
          </>
        )}
      </svg>

      {hi !== null && (
        <div className="pointer-events-none absolute rounded-md border border-white/10 bg-black/70 px-2 py-1 text-xs"
             style={{ left: `calc(${(xsScaled[hi]/W)*100}% + 6px)`, top: 4 }}>
          x: {data[hi].x} • y: {data[hi].y}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
