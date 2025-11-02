"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const search = useSearchParams();

  const plan = useMemo<"monthly" | "annual" | undefined>(() => {
    const p = (search.get("plan") || "").toLowerCase();
    return p === "monthly" || p === "annual" ? (p as "monthly" | "annual") : undefined;
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
        const data = await r.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to register");
      }

      // Auto sign-in (no extra login step)
      const res = await signIn("credentials", { email, password, redirect: false });
      if (!res?.ok) throw new Error("Auto sign-in failed");

      if (plan) router.push(`/auth/auto-checkout?plan=${plan}`);
      else router.push("/dashboard");
    } catch (e: any) {
      setErr(e.message || "Something went wrong");
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

        <button disabled={loading} className="w-full bg-emerald-600 text-white p-2 rounded">
          {loading ? "Creating…" : plan ? "Create & continue" : "Create account"}
        </button>

        <a href={`/auth/login${plan ? `?plan=${plan}` : ""}`} className="block text-sm underline">
          Back to login
        </a>
      </form>
    </div>
  );
}
