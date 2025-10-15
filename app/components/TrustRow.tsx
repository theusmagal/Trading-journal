export default function TrustRow() {
  const items = [
    { k: "2 min", v: "Setup • no spreadsheets" },
    { k: "Encrypted", v: "API keys at rest" },
    { k: "Global", v: "Secure & compliant" },
  ];

  return (
    <section className="py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-6 md:grid-cols-3">
        {items.map((i) => (
          <div
            key={i.k}
            className="panel p-5 text-center transition
                       hover:ring-1 hover:ring-emerald-400/25 hover:shadow-[0_0_22px_rgba(16,185,129,.14)]"
          >
            <div className="text-emerald-300 font-semibold text-lg">{i.k}</div>
            <div className="mt-1 text-sm text-zinc-300">{i.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
