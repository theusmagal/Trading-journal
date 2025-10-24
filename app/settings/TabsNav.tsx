"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/billing", label: "Billing" },
  { href: "/settings/integrations", label: "Integrations" },
];

export default function TabsNav() {
  const pathname = usePathname() || "";
  return (
    <nav className="flex gap-2">
      {tabs.map((t) => {
        const active = pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={[
              "px-3 py-1.5 rounded-md border border-zinc-800 text-sm",
              "hover:bg-zinc-900/60",
              active ? "bg-emerald-500/15 text-emerald-300" : "text-zinc-300",
            ].join(" ")}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
