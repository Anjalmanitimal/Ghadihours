import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import ProductIntroSection from "@/components/sections/ProductIntroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import CustomiserTeaser from "@/components/sections/CustomiserTeaser";
import ReviewsSection from "@/components/sections/ReviewsSection";
import BeforeAfterSection from "@/components/sections/BeforeAfterSection";
import PricingSection from "@/components/sections/PricingSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <ProductIntroSection />
      <FeaturesSection />
      <CustomiserTeaser />
      <ReviewsSection />
      <BeforeAfterSection />
      <PricingSection />
    </>
  );
}
