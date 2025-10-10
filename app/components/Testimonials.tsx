// app/components/Testimonials.tsx
import { Star } from "lucide-react";

const quotes = [
  {
    name: "Mikko K.",
    role: "Futures Trader",
    text:
      "The calendar view finally made my bad days obvious. Huge win for discipline.",
    rating: 5,
  },
  {
    name: "Sara L.",
    role: "Crypto Swing",
    text:
      "Automatic import means I actually keep a journal. The equity curve tells the truth.",
    rating: 5,
  },
  {
    name: "João M.",
    role: "Scalper",
    text:
      "Fast, clean, and no spreadsheet drama. Exactly what I needed.",
    rating: 5,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < rating;
        return (
          <Star
            key={i}
            className={`h-4 w-4 ${
              filled ? "text-yellow-400 fill-yellow-400" : "text-yellow-500/30"
            }`}
            strokeWidth={1.5}
          />
        );
      })}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-center">
          What traders say
        </h2>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {quotes.map((q) => (
            <div key={q.name} className="glass p-5 rounded-2xl">
              <Stars rating={q.rating} />
              <p className="mt-3 text-zinc-200">&ldquo;{q.text}&rdquo;</p>
              <div className="mt-4 text-sm text-zinc-400">
                {q.name} • {q.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
