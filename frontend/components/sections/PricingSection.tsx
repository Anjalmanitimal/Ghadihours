import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Lock } from "lucide-react";

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-blue-500 text-sm font-semibold uppercase tracking-widest mb-4">
          Simple, transparent pricing
        </p>

        {/* Price */}
        <div className="text-6xl font-bold text-gray-900 mb-2">NPR 32,000</div>

        {/* Trust indicators — Law of Proximity: grouped tight */}
        <div className="flex items-center justify-center gap-6 text-sm text-green-600 font-medium mb-10 flex-wrap">
          <span className="flex items-center gap-1">
            <Truck size={14} />
            Free shipping
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={14} />
            1 year warranty
          </span>
          <span className="flex items-center gap-1">
            <RotateCcw size={14} />
            30-day returns
          </span>
        </div>

        {/* CTAs — Hick's Law: only 2 choices */}
        <div className="flex flex-col gap-4 mb-10">
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

        {/* Trust badges */}
        <div className="flex justify-center gap-8 text-gray-400">
          <div className="flex flex-col items-center gap-2">
            <Lock size={20} />
            <span className="text-xs">Secure payment</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <RotateCcw size={20} />
            <span className="text-xs">30-day returns</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck size={20} />
            <span className="text-xs">1 year warranty</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;