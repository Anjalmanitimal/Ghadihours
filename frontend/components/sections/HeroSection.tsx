import Link from "next/link";
import WatchPhoto from "@/components/ui/WatchPhoto";
import SectionDots from "@/components/ui/SectionDots";

const sections = [
  "hero",
  "story",
  "product",
  "features",
  "customise",
  "reviews",
  "compare",
  "pricing",
];

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen bg-[#0B1340] flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-400/10 rounded-full blur-2xl" />
      </div>

      {/* Dot progress indicator — Zeigarnik effect: shows position in an unfinished sequence */}
      <SectionDots sections={sections} />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Eyebrow */}
        <p className="text-teal text-xs font-semibold uppercase tracking-[0.35em] mb-10">
          The only watch you need
        </p>

        {/* Watch visual */}
        <div className="mx-auto mb-10 flex justify-center">
          <WatchPhoto size="lg" />
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          Built for the life you live.
        </h1>

        {/* Subheading */}
        <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-12">
          Track health. Express style. Own every moment.
        </p>

        {/* CTAs — Fitts's Law: large, easy to hit */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/customise">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3.5 rounded-full font-semibold text-base transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5">
              Buy Now
            </button>
          </Link>
          <a href="#story">
            <button className="border border-white/25 hover:border-white/50 text-white px-8 py-3.5 rounded-full font-semibold text-base transition-all duration-200 hover:bg-white/5">
              See the story
            </button>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/40">
        <span className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
        <span className="text-[10px] font-medium uppercase tracking-[0.3em]">
          Scroll
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
