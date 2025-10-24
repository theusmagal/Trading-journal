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
  return 180; // "all" -> longer curve
}

/** --- TIMEZONE HELPERS (no extra libs) --- */

/** Parse "GMT+02:00", "GMT+8", "UTC", etc into offset ms. */
function parseGmtOffsetToMs(label: string): number {
  // Normalize, examples: "GMT+02:00", "GMT-5", "UTC", "GMT"
  const s = label.trim().toUpperCase();
  const m = s.match(/GMT|UTC/);
  if (!m) return 0;

  const signMatch = s.match(/([+-])(\d{1,2})(?::?(\d{2}))?/);
  if (!signMatch) return 0;

  const [, sign, hh, mm] = signMatch;
  const hours = Number(hh || "0");
  const mins = Number(mm || "0");
  const total = hours * 60 + mins;
  return (sign === "-" ? -total : total) * 60_000;
}

/** Get the zone offset for a specific Date in a target IANA TZ (ms from UTC). */
function getZoneOffsetMs(tz: string, at: Date): number {
  // timeZoneName: 'shortOffset' yields e.g. "GMT+02:00" in modern Node/Chrome
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    timeZoneName: "shortOffset",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(at);

  const tzName = parts.find((p) => p.type === "timeZoneName")?.value ?? "UTC";
  return parseGmtOffsetToMs(tzName);
}

/** Get Y/M/D for a given instant in the target TZ. */
function ymdInZone(ts: number, tz: string) {
  const d = new Date(ts);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const y = Number(parts.find((p) => p.type === "year")?.value);
  const m = Number(parts.find((p) => p.type === "month")?.value);
  const dnum = Number(parts.find((p) => p.type === "day")?.value);
  return { y, m, d: dnum };
}

/** Return the UTC timestamp of the *end of the local day* (23:59:59.999 in tz). */
function endOfZonedDay(ts: number, tz: string): number {
  const { y, m, d } = ymdInZone(ts, tz);
  // Construct the UTC instant that corresponds to local (tz) 23:59:59.999
  const probeUtc = Date.UTC(y, m - 1, d, 23, 59, 59, 999);
  const offsetMs = getZoneOffsetMs(tz, new Date(probeUtc));
  // UTC = local - offset
  return probeUtc - offsetMs;
}

/** Generate an array of end-of-day *UTC timestamps* for the last N days in the given TZ. */
function dayEndsFor(n: number, tz: string, now = Date.now()): number[] {
  const ends: number[] = [];
  // Step backwards by one local day at a time
  // We hop using "ts - 24h" which is safe since we recompute end-of-day via ymdInZone each loop.
  let cursor = now;
  for (let i = n - 1; i >= 0; i--) {
    const end = endOfZonedDay(cursor, tz);
    ends.unshift(end);
    cursor -= 24 * 60 * 60 * 1000; // move ~one day earlier; exact end is recalculated in tz next loop
  }
  return ends;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const range = (url.searchParams.get("range") as RangeKey) || "30d";
  const tz = url.searchParams.get("tz") || "UTC"; // ← NEW
  const n = pointsFor(range);
  const now = Date.now();

  // ---- Trades (mock) ----
  const total = Math.max(12, Math.round(n * 0.6));
  const trades = Array.from({ length: total }, (_, i) => ({
    id: `T${2000 + i}`,
    symbol: ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"][i % 4],
    side: (i % 2 ? "SELL" : "BUY") as "BUY" | "SELL",
    qty: (Math.random() * 0.5 + 0.01).toFixed(3),
    price: (1000 + Math.random() * 50000).toFixed(2),
    pnl: +(Math.random() * 80 - 25).toFixed(2),
    time: new Date(now - i * 6.5 * 36e5).toISOString(), // ~6.5h apart
  })).sort((a, b) => +new Date(a.time) - +new Date(b.time));

  // ---- KPIs ----
  const net = +trades.reduce((a, t) => a + t.pnl, 0).toFixed(2);
  const wins = trades.filter((t) => t.pnl > 0);
  const losses = trades.filter((t) => t.pnl < 0);
  const profit = wins.reduce((a, t) => a + t.pnl, 0);
  const lossAbs = Math.abs(losses.reduce((a, t) => a + t.pnl, 0)) || 1;

  // ---- Equity curve: cumulative PnL on end-of-day *in tz* ----
  const START_BALANCE = 10_000;
  const dayEnds = dayEndsFor(n, tz, now);

  let running = 0;
  let idx = 0;
  const equity = dayEnds.map((endTs) => {
    while (idx < trades.length && +new Date(trades[idx].time) <= endTs) {
      running += trades[idx].pnl;
      idx++;
    }
    return { x: endTs, y: +(START_BALANCE + running).toFixed(2) };
  });

  // ---- Calendar: current month preview (mock; still UTC buckets for now) ----
  const nowD = new Date(now);
  const calendarDays = new Date(nowD.getFullYear(), nowD.getMonth() + 1, 0).getDate();
  const calendar = Array.from({ length: calendarDays }, (_, i) => ({
    day: i + 1,
    pnl: Math.round((Math.random() - 0.45) * 120),
    trades: Math.floor(Math.random() * 6),
  }));

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
