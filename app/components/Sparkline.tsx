type Pt = { x: number; y: number };
export default function Sparkline({ data, className="" }: { data: Pt[]; className?: string }) {
  if (!data?.length) return null;
  const xs = data.map(d => d.x), ys = data.map(d => d.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const W = 600, H = 140, P = 8;

  const scaleX = (x:number) => P + ((x - minX) / (maxX - minX || 1)) * (W - 2*P);
  const scaleY = (y:number) => H - P - ((y - minY) / (maxY - minY || 1)) * (H - 2*P);
  const d = data.map((p,i) => `${i ? "L":"M"}${scaleX(p.x)},${scaleY(p.y)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`w-full h-auto ${className}`}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#34d399" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={d}
        fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <path d={`${d} L ${scaleX(maxX)},${H-P} L ${scaleX(minX)},${H-P} Z`} fill="url(#sg)"/>
    </svg>
  );
}
