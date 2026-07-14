"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Lock,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { fetchCart, removeCartItem } from "@/lib/api";
import { ICartItem } from "@/types";
import WatchPhoto from "@/components/ui/WatchPhoto";

const TRUST_ITEMS = [
  "Free shipping",
  "1 year warranty",
  "30-day returns",
];

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<ICartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = () => {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      return;
    }
    fetchCart()
      .then((cart) => setItems(cart.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemove = async (itemId: string) => {
    try {
      const cart = await removeCartItem(itemId);
      setItems(cart.items);
      window.dispatchEvent(new Event("cart:updated"));
    } catch (err) {
      console.error(err);
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (items.length === 0) return;
    // bridge to the existing single-item checkout flow
    const first = items[0];
    localStorage.setItem(
      "watchConfig",
      JSON.stringify({
        caseColor: first.caseColor,
        strapColor: first.strapColor,
        size: first.size,
      })
    );
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white pt-20 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6">
          <ShoppingBag size={28} className="text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h1>
        <p className="text-gray-500 mb-8">
          Build your watch to add it to your cart.
        </p>
        <Link href="/customise">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3.5 rounded-full font-semibold text-base transition-colors">
            Start customising
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <p className="text-blue-500 text-sm font-semibold uppercase tracking-widest mb-4">
          Simple, transparent pricing.
        </p>

        <div className="text-6xl font-bold text-gray-900 mb-6">
          NPR {total.toLocaleString()}
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-green-600 font-medium mb-10 flex-wrap">
          {TRUST_ITEMS.map((label) => (
            <span key={label} className="flex items-center gap-1.5">
              <CheckCircle2 size={16} />
              {label}
            </span>
          ))}
        </div>

        {/* Cart items */}
        <div className="flex flex-col gap-4 mb-10 text-left">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-gray-50 rounded-2xl border border-gray-100 p-4 flex items-center gap-4"
            >
              <div className="w-24 h-24 shrink-0 bg-white rounded-xl flex items-center justify-center">
                <WatchPhoto size="xs" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-gray-900">GhadiHours</p>
                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href="/customise"
                      className="text-blue-500 text-sm font-semibold hover:text-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-gray-400 text-sm font-medium hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Case: {item.caseColor} / Strap: {item.strapColor} / Size:{" "}
                  {item.size} / Qty: {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-4 mb-10">
          <button
            onClick={handleCheckout}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-blue-500/20"
          >
            Proceed to Checkout
          </button>
          <Link href="/home">
            <button className="w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-4 rounded-xl font-bold text-lg transition-colors">
              Continue Shopping
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
    </div>
  );
}
