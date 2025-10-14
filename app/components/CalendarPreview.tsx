type Day = { day: number; pnl: number; trades: number };
export default function CalendarPreview({ days }: { days: Day[] }) {
  const maxAbs = Math.max(1, ...days.map(d => Math.abs(d.pnl)));
  return (
    <div className="glass p-4">
      <div className="grid grid-cols-7 gap-2 text-xs">
        {days.map(d => {
          const isPos = d.pnl >= 0;
          const tone = Math.min(0.9, Math.abs(d.pnl) / maxAbs);
          const bg = isPos ? `rgba(16,185,129,${0.10 + 0.25 * tone})`
                           : `rgba(244,63,94,${0.10 + 0.25 * tone})`;
        return (
          <div key={d.day} className="rounded-md border border-white/10 p-2" style={{background:bg}}>
            <div className="text-zinc-400">{d.day}</div>
            <div className="font-medium">{d.pnl>=0?"+":""}{d.pnl}</div>
            <div className="text-[10px] text-zinc-400">{d.trades} trades</div>
          </div>
        );})}
      </div>
    </div>
  );
}
