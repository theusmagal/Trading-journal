import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-6 text-zinc-500">
          Loading…
        </div>
      }
    >
      <RegisterClient />
    </Suspense>
  );
}
