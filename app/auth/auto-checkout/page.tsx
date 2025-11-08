import { Suspense } from "react";
import AutoCheckoutClient from "./AutoCheckoutClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md py-16 text-center text-zinc-500">
          Preparing checkout…
        </div>
      }
    >
      <AutoCheckoutClient />
    </Suspense>
  );
}
