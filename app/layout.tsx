import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./Header";
import Providers from "./providers"; // make sure app/providers.tsx exists (SessionProvider)

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trading Journal",
  description: "MVP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full text-zinc-100
        bg-[radial-gradient(1200px_800px_at_80%_-10%,rgba(16,185,129,0.15),transparent),
             radial-gradient(1000px_600px_at_-20%_-20%,rgba(59,130,246,0.12),transparent)]
        bg-zinc-950`}
      >
        {/* faint grid overlay */}
        <div
          className="pointer-events-none fixed inset-0 opacity-20 -z-10"
          style={{ backgroundImage: "url('/grid.svg')" }}
        />
        <Providers>
          <Header />
          <main className="relative mx-auto max-w-6xl px-6 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
