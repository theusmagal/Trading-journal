// app/settings/Integrations.tsx
"use client";

import { useTransition } from "react";
import { addBinanceKey, revokeApiKey } from "./actions";

export function AddBinanceForm() {
  const [pending, start] = useTransition();
  return (
    <form className="space-y-3" action={(fd) => start(() => addBinanceKey(fd))}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input name="label" placeholder="Label (optional)" className="input" />
        <input name="apiKey" placeholder="Binance API Key" className="input" required />
        <input name="secret" placeholder="Binance Secret" className="input" required />
      </div>
      <button disabled={pending} className="btn-primary">
        {pending ? "Verifying…" : "Add & verify"}
      </button>
      <p className="text-xs text-zinc-400 mt-1">
        We encrypt your key & secret at rest. Only the last 4 characters are displayed.
      </p>
    </form>
  );
}

export function KeysList({
  keys,
}: {
  keys: { id: string; label: string | null; keyLast4: string; status: string }[];
}) {
  const [pending, start] = useTransition();
  return (
    <div className="space-y-2">
      {keys.length === 0 && (
        <div className="text-sm text-zinc-400">No Binance keys yet.</div>
      )}
      {keys.map((k) => (
        <div
          key={k.id}
          className="flex items-center justify-between rounded-md border border-white/10 px-3 py-2"
        >
          <div className="text-sm">
            <span className="font-medium">{k.label ?? "Binance"}</span>{" "}
            <span className="text-zinc-400">…{k.keyLast4}</span>{" "}
            <span className={k.status === "active" ? "text-emerald-400" : "text-zinc-400"}>
              {k.status}
            </span>
          </div>
          <button
            className="text-xs text-red-300 hover:text-red-200"
            onClick={() => start(() => revokeApiKey(k.id))}
            disabled={pending}
          >
            Revoke
          </button>
        </div>
      ))}
    </div>
  );
}
