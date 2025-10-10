export default function TrustRow() {
  const items = [
    { k: "2 min", v: "Setup • no spreadsheets" },
    { k: "Encrypted", v: "API keys at rest" },
    { k: "Global", v: "Secure & compliant" },
  ];

  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-3 gap-4">
        {items.map((i) => (
          <div key={i.k} className="glass p-4 text-center">
            <div className="text-emerald-300 font-semibold">{i.k}</div>
            <div className="text-sm text-zinc-300/90 mt-1">{i.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
