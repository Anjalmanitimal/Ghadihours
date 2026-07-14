import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Lock } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Truck, label: "Free shipping" },
  { icon: Lock, label: "Secure payment" },
  { icon: ShieldCheck, label: "1 year warranty" },
  { icon: RotateCcw, label: "30-day returns" },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-blue-500 text-sm font-semibold uppercase tracking-widest mb-4">
          Simple, transparent pricing
        </p>

        {/* Price */}
        <div className="text-6xl font-bold text-gray-900 mb-2">NPR 32,000</div>

        {/* CTAs — Hick's Law: only 2 choices */}
        <div className="flex flex-col gap-4 mb-10 mt-8">
          <Link href="/customise">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-blue-500/20">
              Customise & Add to Cart
            </button>
          </Link>
          <Link href="/checkout">
            <button className="w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-4 rounded-xl font-bold text-lg transition-colors">
              Buy Now — Skip to Checkout
            </button>
          </Link>
        </div>

        {/* Trust badges — single set, no repetition (Occam's Razor) */}
        <div className="flex justify-center gap-8 text-gray-400 flex-wrap">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon size={20} />
              <span className="text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;