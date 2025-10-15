"use client";

import { fmtDateTime, fmtQty, pnlClass } from "@/lib/format";

type Trade = {
  id: string; symbol: string; side: "BUY"|"SELL"; qty: string; price: string; pnl: number; time: string;
};

type ColKey = "time" | "symbol" | "side" | "qty" | "price" | "pnl";

export default function TradesTable({ rows }: { rows: Trade[] }) {
  const [sortBy, setSortBy] = useState<ColKey>("time");
  const [asc, setAsc] = useState(false);

  const sorted = [...rows].sort((a,b) => {
    const va = keyVal(a, sortBy), vb = keyVal(b, sortBy);
    if (va < vb) return asc ? -1 : 1;
    if (va > vb) return asc ? 1 : -1;
    return 0;
  });

  const changeSort = (k: ColKey) => {
    if (sortBy === k) setAsc(!asc);
    else { setSortBy(k); setAsc(k === "symbol" || k === "side"); }
  };

  return (
    <div className="glass p-4 overflow-x-auto">
      <div className="mb-2 text-sm text-zinc-400">Recent trades (mock)</div>
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-zinc-900/60 backdrop-blur text-left text-zinc-400">
          <tr>
            {header("Time","time",sortBy,asc,changeSort)}
            {header("Symbol","symbol",sortBy,asc,changeSort)}
            {header("Side","side",sortBy,asc,changeSort)}
            {header("Qty","qty",sortBy,asc,changeSort)}
            {header("Price","price",sortBy,asc,changeSort)}
            {header("PnL ($)","pnl",sortBy,asc,changeSort)}
          </tr>
        </thead>
        <tbody>
          {sorted.map(t => (
            <tr key={t.id} className="border-t border-white/10">
              <td className="py-2 pr-3">{fmtDateTime(t.time)}</td>
              <td className="py-2 pr-3">{t.symbol}</td>
              <td className={`py-2 pr-3 ${t.side === "BUY" ? "text-emerald-300" : "text-red-300"}`}>{t.side}</td>
              <td className="py-2 pr-3">{fmtQty(t.qty)}</td>
              <td className="py-2 pr-3">{Number(t.price).toFixed(2)}</td>
              <td className={`py-2 pr-3 ${pnlClass(t.pnl)}`}>{t.pnl>=0?"+":""}{t.pnl.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function header(label: string, key: ColKey, sortBy: ColKey, asc: boolean, on: (k: ColKey)=>void) {
  const active = key === sortBy;
  return (
    <th className="py-2 pr-3 cursor-pointer select-none" onClick={()=>on(key)}>
      <span className={active ? "text-zinc-100" : ""}>{label}</span>
      {active && <span className="ml-1">{asc?"▲":"▼"}</span>}
    </th>
  );
}

function keyVal(t: any, k: ColKey) {
  if (k === "time") return +new Date(t.time);
  if (k === "qty") return +t.qty;
  if (k === "price") return +t.price;
  return (t[k] ?? "").toString();
}

import { useState } from "react";
