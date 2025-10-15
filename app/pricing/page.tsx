import PricingTable from "../components/PricingTable";
import Footer from "../components/Footer";

export const metadata = { title: "Pricing • Trading Journal" };

export default function PricingPage() {
  return (
    <div className="bg-transparent text-inherit">
      <section className="py-16 bg-transparent">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">Choose your plan</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Fair pricing. Cancel anytime. 14-day free trial.</p>
        </div>
      </section>
      <PricingTable highlightAnnual />
      <Footer />
    </div>
  );
}
