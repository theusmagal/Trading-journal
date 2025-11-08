// app/auth/register/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { signIn } from "next-auth/react";

type Plan = "monthly" | "annual";

export default function RegisterPage() {
  const router = useRouter();
  const search = useSearchParams();

  const plan = useMemo<Plan | undefined>(() => {
    const p = (search.get("plan") || "").toLowerCase();
    return p === "monthly" || p === "annual" ? (p as Plan) : undefined;
  }, [search]);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setErr(null);
    setLoading(true);
    try {
      // Match your API route path
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      if (!r.ok) {
        let msg = `Failed to register (${r.status})`;
        try {
          const data: unknown = await r.json();
          if (data && typeof data === "object" && "error" in data) {
            const d = data as { error?: string };
            if (d.error) msg = d.error;
          }
        } catch {
          /* ignore JSON parse errors */
        }
        throw new Error(msg);
      }

      // Auto sign-in with credentials
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res || res.error) {
        throw new Error(res?.error || "Auto sign-in failed");
      }

      // Route based on selected plan
      if (plan) router.replace(`/auth/auto-checkout?plan=${plan}`);
      else router.replace("/dashboard");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setErr(msg);
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
          className="w-full border p-2 rounded bg-zinc-900 border-white/10 outline-none"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          className="w-full border p-2 rounded bg-zinc-900 border-white/10 outline-none"
          type="password"
          placeholder="Password (min 8 chars)"
          required
          minLength={8} // keep in sync with server zod schema
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        {err && <p className="text-red-500 text-sm">{err}</p>}

        <button
          disabled={loading}
          className="w-full bg-emerald-600 text-white p-2 rounded disabled:opacity-60"
        >
          {loading ? "Creating…" : plan ? "Create & continue" : "Create account"}
        </button>

        <a
          href={`/auth/login${plan ? `?plan=${plan}` : ""}`}
          className="block text-sm underline text-zinc-300"
        >
          Back to login
        </a>
      </form>
    </div>
  );
}
