import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CustomiserTeaser = () => {
  return (
    <section id="customise" className="py-24 px-6 bg-[#0B1340]">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-4">
          Customise
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Make it yours.
        </h2>
        <p className="text-gray-400 text-xl mb-12">
          Every detail. Your choice. Pick your case, strap and size.
        </p>

        {/* Strap colour preview */}
        <div className="flex justify-center gap-4 mb-12">
          {[
            { color: "#1f2937", label: "Black" },
            { color: "#f5f0e8", label: "Beige" },
            { color: "#1e3a5f", label: "Navy" },
            { color: "#dc2626", label: "Red" },
          ].map((swatch) => (
            <div key={swatch.label} className="flex flex-col items-center gap-2">
              <div
                className="w-12 h-12 rounded-full border-4 border-white/20 cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: swatch.color }}
              />
              <span className="text-gray-400 text-xs">{swatch.label}</span>
            </div>
          ))}
        </div>

        <Link href="/customise">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg shadow-blue-500/30 inline-flex items-center gap-2">
            Build your watch
            <ArrowRight size={20} />
          </button>
        </Link>
      </div>
    </section>
  );
};

export default CustomiserTeaser;