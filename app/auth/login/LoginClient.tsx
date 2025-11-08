"use client";

import { useState, useMemo } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

type Plan = "monthly" | "annual";

export default function LoginClient() {
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (res?.ok) {
      if (plan) router.push(`/auth/auto-checkout?plan=${plan}`);
      else router.push("/dashboard");
    } else {
      setErr("Invalid email or password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Sign in</h1>

        {plan && (
          <p className="text-sm text-zinc-500">
            You selected the <b>{plan === "annual" ? "annual" : "monthly"}</b> plan.
            After sign-in we’ll open checkout for your 14-day free trial.
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
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {err && <p className="text-red-600 text-sm">{err}</p>}

        <button disabled={loading} className="w-full bg-emerald-600 text-white p-2 rounded">
          {loading ? "Signing in…" : plan ? "Sign in & continue" : "Sign in"}
        </button>

        <a
          href={`/auth/register${plan ? `?plan=${plan}` : ""}`}
          className="block text-sm underline"
        >
          Create account
        </a>

        {!plan && (
          <a href="/pricing" className="block text-xs text-zinc-500 underline">
            Back to pricing
          </a>
        )}
      </form>
    </div>
  );
}
