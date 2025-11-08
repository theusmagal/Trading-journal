import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-sm py-16 text-center text-zinc-500">
          Loading…
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
