"use client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { GREEN, RED } from "@/lib/colors";

export default function DonutProfitSplit({
  grossWins,
  grossLossesAbs,
  profitFactor,
}: { grossWins: number; grossLossesAbs: number; profitFactor: number }) {
  const data = [
    { name: "Wins", value: Math.max(0, grossWins), color: GREEN },
    { name: "Losses", value: Math.max(0, grossLossesAbs), color: RED },
  ];

  return (
    <div
      className="glass h-[220px] p-4 flex flex-col focus:outline-none focus:ring-0"
      tabIndex={-1}
    >
      <div className="text-sm text-zinc-400 text-center">Profit Factor</div>

      <div className="mt-4 grid grid-cols-[140px_1fr] items-center gap-6">
        <div className="relative h-[110px] w-[110px] mx-auto">
          <ResponsiveContainer width="100%" height="100%" className="pointer-events-none">
            <PieChart style={{ pointerEvents: "none" }}>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={40}
                outerRadius={52}
                stroke="transparent"
              >
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[10px] text-zinc-400 leading-none">PF</div>
            <div className="text-base font-semibold text-zinc-100">
              {profitFactor.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="text-xs text-zinc-400 space-y-1">
          <div>
            Gross wins: <span className="text-emerald-300">${grossWins.toFixed(2)}</span>
          </div>
          <div>
            Gross losses: <span className="text-rose-300">-${grossLossesAbs.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
