import { Heart, Moon, MapPin, Droplet } from "lucide-react";
import WatchPhoto from "@/components/ui/WatchPhoto";

const PILLS = [
  { icon: Heart, label: "Heart Rate" },
  { icon: Moon, label: "Sleep Tracking" },
  { icon: MapPin, label: "GPS" },
  { icon: Droplet, label: "5ATM Water Resistant" },
];

const ProductIntroSection = () => {
  return (
    <section
      id="product"
      className="py-32 px-6 bg-[#0B1340] text-center overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-6">
          Introducing
        </p>

        {/* Product photo — shared component (Jakob's Law: consistent with hero/login/register) */}
        <div className="mb-12 flex justify-center">
          <WatchPhoto size="md" />
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
          Meet the watch that works
          <br />
          <span className="text-blue-400">as hard as you do.</span>
        </h2>

        <p className="text-gray-400 text-xl leading-relaxed max-w-2xl mx-auto mb-12">
          One device. Every metric that matters. Designed to disappear on your
          wrist and show up in your life.
        </p>

        {/* Feature pills — Miller's Law: exactly 4 */}
        <div className="flex flex-wrap justify-center gap-3">
          {PILLS.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="bg-white/10 border border-blue-500/30 text-white text-sm px-5 py-2.5 rounded-full flex items-center gap-2"
            >
              <Icon size={16} className="text-blue-400" />
              <span>{label}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductIntroSection;
