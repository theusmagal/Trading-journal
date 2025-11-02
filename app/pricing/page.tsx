// app/pricing/page.tsx
import PricingTable from "../components/PricingTable";
import Footer from "../components/Footer";
import StartTrialButtons from "@/components/StartTrialButtons";

export const metadata = { title: "Pricing • Trading Journal" };

export default function PricingPage() {
  return (
    <div className="bg-transparent text-inherit">
      {/* Hero */}
      <section className="py-16 bg-transparent">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-4">
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
            Choose your plan
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Fair pricing. Cancel anytime. <span className="font-medium">14-day free trial</span>.
          </p>

          {/* Start trial buttons (handles auth redirect or opens Stripe Checkout) */}
          <div className="mt-6 flex justify-center">
            <StartTrialButtons />
          </div>
        </div>
      </section>

      {/* Detailed plan cards/feature comparison */}
      <PricingTable highlightAnnual />

      <Footer />
    </div>
  );
}
