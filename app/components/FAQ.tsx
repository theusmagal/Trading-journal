const faqs = [
  { q: "Do I need to enter trades manually?", a: "No. We import automatically from Binance. Bybit and Tradovate are planned." },
  { q: "Is my data safe?", a: "Yes. API keys are encrypted; data is hosted in the EU. You can revoke access anytime." },
  { q: "Can I cancel?", a: "Anytime. Stripe manages billing, VAT, and invoices." },
];

export default function FAQ() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-center">FAQ</h2>
        <div className="mt-8 space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="glass p-4">
              <summary className="font-medium cursor-pointer">{f.q}</summary>
              <p className="text-zinc-300 mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
