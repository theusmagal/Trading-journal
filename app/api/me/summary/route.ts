// app/api/me/summary/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RangeKey = "7d" | "30d" | "ytd" | "all";

function pointsFor(range: RangeKey) {
  if (range === "7d") return 7;
  if (range === "30d") return 30;
  if (range === "ytd") {
    const now = new Date();
    const jan1 = new Date(now.getFullYear(), 0, 1);
    return Math.max(7, Math.ceil((+now - +jan1) / 86400000));
  }
  return 180; // "all" -> show a longer curve
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const range = (url.searchParams.get("range") as RangeKey) || "30d";
  const n = pointsFor(range);

  const now = new Date();

  // Equity curve
  const equity = Array.from({ length: n }, (_, i) => ({
    x: i + 1,
    y:
      10000 +
      Math.round(
        400 * Math.sin(i / 4) + 50 * (Math.random() - 0.5)
      ),
  }));

  // Calendar: current month preview (unchanged by range)
  const calendarDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const calendar = Array.from({ length: calendarDays }, (_, i) => ({
    day: i + 1,
    pnl: Math.round((Math.random() - 0.45) * 120),
    trades: Math.floor(Math.random() * 6),
  }));

  // Trades: generate more then slice by "range" age
  const total = Math.max(12, Math.round(n * 0.6));
  const trades = Array.from({ length: total }, (_, i) => ({
    id: `T${2000 + i}`,
    symbol: ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"][i % 4],
    side: i % 2 ? "SELL" : "BUY",
    qty: (Math.random() * 0.5 + 0.01).toFixed(3),
    price: (1000 + Math.random() * 50000).toFixed(2),
    pnl: +(Math.random() * 80 - 25).toFixed(2),
    time: new Date(now.getTime() - i * 6.5 * 36e5).toISOString(), // ~6.5h apart
  }));

  // KPIs
  const net = +trades.reduce((a, t) => a + t.pnl, 0).toFixed(2);
  const wins = trades.filter(t => t.pnl > 0);
  const losses = trades.filter(t => t.pnl < 0);
  const profit = wins.reduce((a, t) => a + t.pnl, 0);
  const lossAbs = Math.abs(losses.reduce((a, t) => a + t.pnl, 0)) || 1;

  return NextResponse.json({
    kpis: {
      netPnl: net,
      winRate: Math.round((wins.length / trades.length) * 100),
      profitFactor: +(profit / lossAbs).toFixed(2),
      avgR: +(Math.random() * 0.8 + 0.4).toFixed(2),
      tradeCount: trades.length,
    },
    equity,
    calendar,
    trades,
  });
}
