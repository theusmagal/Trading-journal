"use client";

type Day = { day: number; pnl: number; trades: number };

const GREEN_BG = "rgba(34,197,94,0.32)"; 
const RED_BG   = "rgba(249, 3, 3, 0.28)"; 

export default function CalendarPreview({ days, title }: { days: Day[]; title?: string }) {
  const weekdays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  return (
    <div className="glass p-4 space-y-3 self-start">
      <div className="flex items-center justify-between text-sm text-zinc-400">
        <div>{title ?? "This month"}</div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <i className="h-3 w-3 rounded-sm inline-block" style={{ backgroundColor: GREEN_BG }} />
            Win
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="h-3 w-3 rounded-sm inline-block" style={{ backgroundColor: RED_BG }} />
            Loss
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-xs">
        {weekdays.map((w) => (
          <div key={w} className="text-zinc-500 text-center">{w}</div>
        ))}

        {days.map((d) => {
          const isPos = d.pnl >= 0;
          const bg = isPos ? GREEN_BG : RED_BG;

          return (
            <div
              key={d.day}
              className="rounded-md border border-white/8 p-2"
              style={{ backgroundColor: bg }}
            >
              <div className="text-zinc-200">{d.day}</div>
              <div className="font-semibold text-white">
                {d.pnl >= 0 ? "+" : ""}{d.pnl}
              </div>
              <div className="text-[10px] text-zinc-300">{d.trades} trades</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
