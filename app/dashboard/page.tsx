import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { headers } from "next/headers";
import DashboardClient from "./DashboardClient";

type RangeKey = "7d" | "30d" | "ytd" | "all";

function baseFrom(h: Headers) {
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host  = h.get("x-forwarded-host") ?? h.get("host");
  return `${proto}://${host}`;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: RangeKey }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="p-8">
        <p>You must be signed in.</p>
        <a className="underline" href="/auth/login">Go to login</a>
      </div>
    );
  }

  const sp = await searchParams;
  const initialRange: RangeKey = (sp?.range as RangeKey) ?? "30d";

  const h = await headers();
  const base = baseFrom(h);
  const res = await fetch(`${base}/api/me/summary?range=${initialRange}`, { cache: "no-store" });
  const data = await res.json();

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <DashboardClient initial={data} initialRange={initialRange} />
    </div>
  );
}
