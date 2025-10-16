"use client";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { GREEN, RED_BG } from "@/lib/colors";

export default function GaugeWinRate({ wins, losses }: { wins: number; losses: number }) {
  const total = Math.max(1, wins + losses);
  const winRatePct = Math.round((wins / total) * 100);
  const data = [{ name: "win", value: winRatePct }];

  return (
    <div
      className="glass h-[220px] p-4 flex flex-col focus:outline-none focus:ring-0"
      tabIndex={-1}
    >
      <div className="text-sm text-zinc-400 text-center">Trade Win %</div>

      <div className="mt-4 grid grid-cols-[140px_1fr] items-center gap-6">
        <div className="relative h-[120px] w-[120px] mx-auto">
          <ResponsiveContainer width="100%" height="100%" className="pointer-events-none">
            <RadialBarChart
              data={data}
              startAngle={200}
              endAngle={-20}
              innerRadius="68%"
              outerRadius="100%"
              style={{ pointerEvents: "none" }}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                dataKey="value"
                cornerRadius={14}
                fill={GREEN}
                background={{ fill: RED_BG }}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-semibold text-zinc-100">{winRatePct}%</span>
          </div>
        </div>

        <div className="text-xs text-zinc-400 grid grid-cols-2 gap-x-6">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-sm bg-emerald-400" />
            <span>Wins: <span className="text-zinc-200">{wins}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-sm bg-rose-400" />
            <span>Losses: <span className="text-zinc-200">{losses}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
