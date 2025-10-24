
import crypto from "crypto";
const BASE = "https://api.binance.com";

export async function verifyBinanceKey(apiKey: string, secret: string) {
  
  if (process.env.BINANCE_VERIFY_DISABLED === "true") return { ok: true as const };

  const qs = new URLSearchParams({
    timestamp: Date.now().toString(),
    recvWindow: "5000",
  });
  const sig = crypto.createHmac("sha256", secret).update(qs.toString()).digest("hex");
  qs.append("signature", sig);

  const res = await fetch(`${BASE}/api/v3/account?${qs.toString()}`, {
    headers: { "X-MBX-APIKEY": apiKey },
    cache: "no-store",
  });
  if (res.status === 200) return { ok: true as const };
  const text = await res.text();
  return { ok: false as const, status: res.status, msg: text };
}
