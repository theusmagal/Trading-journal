import HeroPro from "./components/HeroPro";
import TrustRow from "./components/TrustRow";
import Features from "./components/Features";
import FeatureRow from "./components/FeatureRow";
import PricingTable from "./components/PricingTable";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import CTABand from "./components/CTABand";

export default function Home() {
  return (
    <div className="bg-transparent text-inherit">
      <HeroPro />
      <TrustRow />
      <div id="features" />
      <Features />
      <FeatureRow
        title="PnL Calendar"
        desc="See daily wins/losses and trade counts at a glance. Spot overtrading instantly."
        bullet={["Color-coded days", "Trade counts per day", "Click-through drilldown (soon)"]}
      />
      <FeatureRow
        reverse
        title="Performance KPIs"
        desc="Win rate, profit factor, average R, and equity curve—calculated automatically."
        bullet={["Custom date ranges", "Instrument grouping", "Export to CSV (soon)"]}
      />
      <PricingTable />
      <Testimonials />
      <FAQ />
      <CTABand />
      <Footer />
    </div>
  );
}
