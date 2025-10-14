import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sparkline from "@/app/components/Sparkline";
import KPI from "@/app/components/KPI";
import CalendarPreview from "@/app/components/CalendarPreview";

async function getSummary() {
  const res = await fetch(`${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/me/summary`, { cache: "no-store" });
  return res.json();
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="p-8">
        <p>You must be signed in.</p>
        <a className="underline" href="/auth/login">Go to login</a>
      </div>
    );
  }

  const data = await getSummary();

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Net PnL" value={`${data.kpis.netPnl >= 0 ? "+" : ""}${data.kpis.netPnl} $`} />
        <KPI label="Win rate" value={`${data.kpis.winRate}%`} />
        <KPI label="Profit factor" value={`${data.kpis.profitFactor}`} />
        <KPI label="Avg R" value={`${data.kpis.avgR}`} />
      </div>

      {/* Equity curve */}
      <div className="glass p-4">
        <div className="mb-2 text-sm text-zinc-400">Equity curve (mock)</div>
        <Sparkline data={data.equity} />
      </div>

      {/* Calendar + Recent trades */}
      <div className="grid lg:grid-cols-2 gap-6">
        <CalendarPreview days={data.calendar} />

        <div className="glass p-4 overflow-x-auto">
          <div className="mb-2 text-sm text-zinc-400">Recent trades (mock)</div>
          <table className="w-full text-sm">
            <thead className="text-left text-zinc-400">
              <tr>
                <th className="py-2 pr-3">Time</th>
                <th className="py-2 pr-3">Symbol</th>
                <th className="py-2 pr-3">Side</th>
                <th className="py-2 pr-3">Qty</th>
                <th className="py-2 pr-3">Price</th>
                <th className="py-2 pr-3">PnL ($)</th>
              </tr>
            </thead>
            <tbody>
              {data.trades.map((t: any) => (
                <tr key={t.id} className="border-t border-white/10">
                  <td className="py-2 pr-3">{new Date(t.time).toLocaleString()}</td>
                  <td className="py-2 pr-3">{t.symbol}</td>
                  <td className={`py-2 pr-3 ${t.side === "BUY" ? "text-emerald-300" : "text-red-300"}`}>{t.side}</td>
                  <td className="py-2 pr-3">{t.qty}</td>
                  <td className="py-2 pr-3">{t.price}</td>
                  <td className={`py-2 pr-3 ${t.pnl >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                    {t.pnl >= 0 ? "+" : ""}{t.pnl}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
