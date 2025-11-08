"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { signIn } from "next-auth/react";

type Plan = "monthly" | "annual";

function getApiError(u: unknown): string | undefined {
  if (u && typeof u === "object") {
    const rec = u as Record<string, unknown>;
    if (typeof rec.error === "string") return rec.error;
  }
  return undefined;
}

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return "Something went wrong";
}

function hasOk(x: unknown): x is { ok: boolean } {
  return !!(x && typeof x === "object" && "ok" in (x as Record<string, unknown>));
}

function hasError(x: unknown): x is { error: string } {
  return !!(
    x &&
    typeof x === "object" &&
    typeof (x as Record<string, unknown>).error === "string"
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const search = useSearchParams();

  const plan = useMemo<Plan | undefined>(() => {
    const p = (search.get("plan") || "").toLowerCase();
    return p === "monthly" || p === "annual" ? (p as Plan) : undefined;
  }, [search]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const r = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!r.ok) {
        const data: unknown = await r.json().catch(() => ({}));
        const apiError = getApiError(data);
        throw new Error(apiError ?? `Failed to register (${r.status})`);
      }

      // Auto sign-in without redirect
      const res = await signIn("credentials", { email, password, redirect: false });

      if (!res) throw new Error("Auto sign-in failed");
      if (hasError(res)) throw new Error(res.error);
      if (hasOk(res) && !res.ok) throw new Error("Auto sign-in failed");

      router.push(plan ? `/auth/auto-checkout?plan=${plan}` : "/dashboard");
    } catch (e) {
      setErr(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Create account</h1>

        {plan && (
          <p className="text-sm text-zinc-500">
            You selected the <b>{plan === "annual" ? "annual" : "monthly"}</b> plan.
            We’ll open checkout for your 14-day free trial right after this.
          </p>
        )}

        <input
          className="w-full border p-2 rounded"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          className="w-full border p-2 rounded"
          type="password"
          placeholder="Password (min 6 chars)"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        {err && <p className="text-red-600 text-sm">{err}</p>}

        <button
          disabled={loading}
          className="w-full bg-emerald-600 text-white p-2 rounded disabled:opacity-60"
        >
          {loading ? "Creating…" : plan ? "Create & continue" : "Create account"}
        </button>

        <a
          href={`/auth/login${plan ? `?plan=${plan}` : ""}`}
          className="block text-sm underline text-center"
        >
          Back to login
        </a>
      </form>
    </div>
  );
}
