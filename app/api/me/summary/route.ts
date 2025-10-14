import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const now = new Date();
  const equity = Array.from({ length: 30 }, (_, i) => ({
    x: i + 1,
    y: 10000 + Math.round(400 * Math.sin(i / 4) + 50 * (Math.random() - 0.5)),
  }));

  const today = new Date(now.getFullYear(), now.getMonth(), 1);
  const calendar = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    pnl: Math.round((Math.random() - 0.45) * 120),
    trades: Math.floor(Math.random() * 6),
  })).filter(d => d.day <= new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());

  const trades = Array.from({ length: 12 }, (_, i) => ({
    id: `T${1700 + i}`,
    symbol: ["BTCUSDT", "ETHUSDT", "BNBUSDT"][i % 3],
    side: i % 2 ? "SELL" : "BUY",
    qty: (Math.random() * 0.5 + 0.01).toFixed(3),
    price: (1000 + Math.random() * 50000).toFixed(2),
    pnl: +(Math.random() * 60 - 20).toFixed(2),
    time: new Date(now.getTime() - i * 36e5).toISOString(),
  }));

  return NextResponse.json({
    kpis: {
      netPnl: +trades.reduce((a, t) => a + t.pnl, 0).toFixed(2),
      winRate: Math.round((trades.filter(t => t.pnl > 0).length / trades.length) * 100),
      profitFactor: +(trades.filter(t => t.pnl > 0).reduce((a, t) => a + t.pnl, 0) /
                      Math.abs(trades.filter(t => t.pnl < 0).reduce((a, t) => a + t.pnl, 0) || 1)).toFixed(2),
      avgR: +(Math.random() * 0.8 + 0.4).toFixed(2),
    },
    equity,
    calendar,
    trades,
  });
}