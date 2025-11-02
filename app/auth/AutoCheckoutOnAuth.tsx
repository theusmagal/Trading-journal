"use client";
import { useEffect, useState } from "react";

export default function AutoCheckoutOnAuth({
  planFromUrl,
}: {
  planFromUrl?: "monthly" | "annual";
}) {
  const [ran, setRan] = useState(false);

  useEffect(() => {
    if (ran || !planFromUrl) return;

    (async () => {
      try {
        const res = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: planFromUrl }),
        });
        const data = await res.json();
        if (data?.url) window.location.href = data.url; // → Stripe Checkout
      } finally {
        setRan(true);
      }
    })();
  }, [planFromUrl, ran]);

  return null;
}
