type Day = { day: number; pnl: number; trades: number };

export default function CalendarPreview({ days, title }: { days: Day[]; title?: string }) {
  const maxAbs = Math.max(1, ...days.map(d => Math.abs(d.pnl)));
  const weekdays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return (
    <div className="glass p-4 space-y-3">
      <div className="flex items-center justify-between text-sm text-zinc-400">
        <div>{title ?? "This month"}</div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><i className="h-3 w-3 rounded-sm bg-emerald-500/25 inline-block" /> Win</span>
          <span className="inline-flex items-center gap-1"><i className="h-3 w-3 rounded-sm bg-rose-500/25 inline-block" /> Loss</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-xs">
        {weekdays.map(w => (
          <div key={w} className="text-zinc-500 text-center">{w}</div>
        ))}
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
          );
        })}
      </div>
    </div>
  );
}
