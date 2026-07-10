import Link from "next/link";
import { ChevronDown } from "lucide-react";

const sections = ["hero", "story", "product", "features", "reviews", "pricing"];

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

      {/* Dot progress indicator */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
        {sections.map((sec, i) => (
            <a
            key={sec}
            href={`#${sec}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === 0
                ? "bg-blue-500 scale-125"
                : "bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Small label */}
        <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-6">
          The only watch you need
        </p>

        {/* Watch image placeholder */}
        <div className="w-56 h-56 mx-auto mb-10 relative">
          <div className="w-full h-full rounded-[40px] bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center shadow-2xl">
            <div className="w-40 h-40 rounded-[30px] bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
              <div className="text-center">
                <div className="text-white text-2xl font-light">10:09</div>
                <div className="text-gray-400 text-xs mt-1">MON 10 JUL</div>
                <div className="flex justify-center gap-3 mt-3">
                  <div className="text-red-400 text-xs font-bold">❤ 72</div>
                  <div className="text-blue-400 text-xs font-bold">⚡ 94%</div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow behind watch */}
          <div className="absolute inset-0 -z-10 bg-blue-500/20 rounded-full blur-3xl scale-150" />
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
          Built for the life
          <br />
          <span className="text-blue-400">you live.</span>
        </h1>

        {/* Subheading */}
        <p className="text-gray-300 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mb-12">
          Track health. Express style. Own every moment.
        </p>

        {/* CTAs — Fitts's Law: large, easy to hit */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
          <Link href="/customise" className="flex-1">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5">
              Buy Now
            </button>
          </Link>
          <a href="#story" className="flex-1">
            <button className="w-full border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:bg-white/5">
              See the story
            </button>
          </a>
        </div>

        {/* Feature pills — Miller's Law: max 4 */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {["Heart Rate", "Sleep Tracking", "GPS", "5ATM Water Resistant"].map(
            (feat) => (
              <span
                key={feat}
                className="bg-white/10 border border-white/20 text-white/80 text-sm px-4 py-2 rounded-full"
              >
                {feat}
              </span>
            )
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
        <ChevronDown size={28} />
      </div>
    </section>
  );
};

export default HeroSection;