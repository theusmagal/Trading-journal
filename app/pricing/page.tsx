import PricingTable from "../components/PricingTable";
import Footer from "../components/Footer";

export const metadata = { title: "Pricing • Trading Journal" };

export default function PricingPage() {
  return (
    <>
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-semibold">Choose your plan</h1>
          <p className="text-gray-600 mt-2">Fair pricing. Cancel anytime. 14-day free trial.</p>
        </div>
      </section>
      <PricingTable highlightAnnual />
      <Footer />
    </>
  );
}
