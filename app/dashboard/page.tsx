import { headers } from "next/headers";
import { requireMember } from "@/lib/membership";
import DashboardClient from "./DashboardClient";
import type { Metadata } from "next";

type RangeKey = "7d" | "30d" | "ytd" | "all";

// Accept anything with a .get() method (covers ReadonlyHeaders)
type HeaderLike = { get(name: string): string | null };

function baseFrom(h: HeaderLike) {
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  return `${proto}://${host}`;
}

export const metadata: Metadata = {
  title: "Dashboard • Trading Journal",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: RangeKey }>;
}) {
  // Block access unless user is an active member (or trial, depending on your requireMember logic)
  await requireMember();

  const sp = await searchParams;
  const initialRange: RangeKey = (sp?.range as RangeKey) ?? "30d";

  const h = await headers();
  const base = baseFrom(h);

  const res = await fetch(`${base}/api/me/summary?range=${initialRange}`, {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>
      <DashboardClient initial={data} initialRange={initialRange} />
    </div>
  );
}
