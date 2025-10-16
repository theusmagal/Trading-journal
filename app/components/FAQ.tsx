// app/components/FAQ.tsx
"use client";

import { useState } from "react";

type QA = { q: string; a: string };

const faqs: QA[] = [
  {
    q: "Do I need to enter trades manually?",
    a: "No. We auto-import executions and funding from your connected exchange (Binance first, Bybit next). You can still edit notes/tags whenever you want.",
  },
  {
    q: "Is my data safe?",
    a: "API keys are stored encrypted at rest. We request read-only permissions and never withdraw funds. You can revoke access any time from your exchange.",
  },
  {
    q: "Can I cancel?",
    a: "Absolutely. It’s month-to-month (or yearly with discount). Cancel anytime from your account page—no hoops.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-14">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center text-2xl md:text-3xl font-semibold text-zinc-100">
          FAQ
        </h2>

        <div className="mt-6 space-y-3">
          {faqs.map((item, i) => {
            const active = open === i;
            return (
              <div
                key={item.q}
                className={[
                  "glass overflow-hidden",
                  active ? "ring-1 ring-emerald-400/25" : "",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => setOpen(active ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                >
                  <span className="font-medium text-zinc-100">{item.q}</span>
                  <svg
                    className={[
                      "h-4 w-4 shrink-0 text-zinc-400 transition-transform",
                      active ? "rotate-90 text-emerald-300" : "",
                    ].join(" ")}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* answer */}
                {active && (
                  <div className="border-t border-zinc-700/60 px-4 py-3 text-sm text-zinc-300">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
