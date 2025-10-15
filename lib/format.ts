// lib/format.ts

// USD with fixed locale to avoid hydration mismatches.
// signed: true -> adds "+" for positives and "-" for negatives.
export const fmtUsd = (
  n: number,
  { signed = false }: { signed?: boolean } = {}
) => {
  const abs = Math.abs(n);
  const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(abs);

  if (!signed) return usd;
  if (n > 0) return `+${usd}`;
  if (n < 0) return `-${usd}`;
  return usd;
};

// Percent as whole number (e.g., 62%)
export const fmtPct = (n: number) => `${Math.round(n)}%`;

// Class helper for coloring PnL numbers
export const pnlClass = (n: number) =>
  n > 0 ? "text-emerald-300" : n < 0 ? "text-red-300" : "text-zinc-300";

// Qty helper
export const fmtQty = (s: string | number) =>
  typeof s === "string" ? s : s.toFixed(3);

// Deterministic date/time to prevent hydration mismatch.
export const fmtDateTime = (
  iso: string,
  { locale = "en-GB", timeZone = "UTC" }: { locale?: string; timeZone?: string } = {}
) => {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone,
  })
    .format(d)
    .replace(",", "");
};
