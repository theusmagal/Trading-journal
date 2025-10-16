"use client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { GREEN, RED } from "@/lib/colors";

export default function AvgWinLossBar({
  avgWin,
  avgLossAbs,
}: {
  avgWin: number;
  avgLossAbs: number;
}) {
  const total = Math.max(0.0001, avgWin + avgLossAbs);
  const ratio = (avgWin / total) * 100;
  const data = [{ name: "Avg", total }];

  return (
    <div
      className="glass h-full p-6 flex flex-col items-center justify-center focus:outline-none focus:ring-0"
      tabIndex={-1}
    >
      <div className="text-sm text-zinc-400 text-center w-full">Avg Win / Avg Loss</div>

      <div className="mt-3 h-[36px] w-[78%] mx-auto">
        <ResponsiveContainer width="100%" height="100%" className="pointer-events-none">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            barSize={18}
            barGap={0}
            barCategoryGap={0}
            style={{ pointerEvents: "none" }}
          >
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" hide />
            <defs>
              <linearGradient id="avg-split" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={GREEN} />
                <stop offset={`${ratio}%`} stopColor={GREEN} />
                <stop offset={`${ratio}%`} stopColor={RED} />
                <stop offset="100%" stopColor={RED} />
              </linearGradient>
            </defs>
            <Bar dataKey="total" fill="url(#avg-split)" radius={999} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-center gap-6 text-xs">
        <span className="text-emerald-300">${avgWin.toFixed(2)} avg win</span>
        <span className="text-rose-300">-${avgLossAbs.toFixed(2)} avg loss</span>
      </div>
    </div>
  );
}
