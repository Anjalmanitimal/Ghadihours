"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProduct, addToCart, guestLogin } from "@/lib/api";
import { IProduct } from "@/types";
import { ShoppingBag, Save, Shield, Truck, RotateCcw, Check, Minus, Plus } from "lucide-react";
import WatchVisual from "@/components/ui/WatchVisual";
import { caseColors, strapColors, sizes } from "@/lib/productOptions";

export default function CustomisePage() {
  const router = useRouter();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedCase, setSelectedCase] = useState("Midnight Black");
  const [selectedStrap, setSelectedStrap] = useState("Black");
  const [selectedSize, setSelectedSize] = useState("44mm");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    // restore saved config if exists
    const savedConfig = localStorage.getItem("watchConfig");
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setSelectedCase(config.caseColor || "Midnight Black");
      setSelectedStrap(config.strapColor || "Black");
      setSelectedSize(config.size || "44mm");
      setQuantity(config.quantity || 1);
    }

    fetchProduct()
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const saveConfig = () => {
    localStorage.setItem(
      "watchConfig",
      JSON.stringify({
        caseColor: selectedCase,
        strapColor: selectedStrap,
        size: selectedSize,
        quantity,
      })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      if (!localStorage.getItem("token")) {
        const res = await guestLogin("guest@ghadihours.com", "Guest");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
      await addToCart(selectedCase, selectedStrap, selectedSize, quantity);
      window.dispatchEvent(new Event("cart:updated"));
      router.push("/cart");
    } catch (err) {
      console.error(err);
      alert("Couldn't add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const currentCase = caseColors.find((c) => c.label === selectedCase);
  const currentStrap = strapColors.find((s) => s.label === selectedStrap);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading your customiser...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-blue-500 text-sm font-semibold uppercase tracking-widest mb-2">
            Customise
          </p>
          <h1 className="text-4xl font-bold text-gray-900">Make it yours.</h1>
          <p className="text-gray-500 mt-2">Every detail. Your choice.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — live-recoloring preview */}
          <div className="sticky top-28">
            <div className="relative flex flex-col items-center justify-center py-8 gap-4">
              <WatchVisual size="lg" caseColor={currentCase?.hex} strapColor={currentStrap?.hex} />
              <p className="text-gray-400 text-xs">
                Illustration — actual finish may vary
              </p>
            </div>

            {/* Current config summary */}
            <div className="mt-10 bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Your configuration
              </p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Case</span>
                  <span className="font-medium text-gray-900">{selectedCase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Strap</span>
                  <span className="font-medium text-gray-900">{selectedStrap}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Size</span>
                  <span className="font-medium text-gray-900">{selectedSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Quantity</span>
                  <span className="font-medium text-gray-900">{quantity}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200 mt-2">
                  <span className="text-gray-500">Price</span>
                  <span className="font-bold text-gray-900 text-lg">
                    NPR {((product?.price || 0) * quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — controls */}
          <div className="flex flex-col gap-10">

            {/* Case colour — Hick's Law: exactly 3 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Choose your case
              </h3>
              <div className="flex flex-col gap-3">
                {caseColors.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => setSelectedCase(c.label)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      selectedCase === c.label
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full border-2 border-white shadow-md flex-shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span
                      className={`font-medium text-sm ${
                        selectedCase === c.label
                          ? "text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      {c.label}
                    </span>
                    {selectedCase === c.label && (
                      <Check size={18} className="ml-auto text-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Strap colour — Hick's Law: exactly 4 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Choose your strap
              </h3>
              <div className="flex gap-4 flex-wrap">
                {strapColors.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSelectedStrap(s.label)}
                    className="flex flex-col items-center gap-2"
                  >
                    {/* Fitts's Law: min 44px touch target */}
                    <div
                      className={`w-12 h-12 rounded-full border-4 transition-all ${
                        selectedStrap === s.label
                          ? "border-blue-500 scale-110"
                          : "border-transparent hover:border-gray-300"
                      }`}
                      style={{ backgroundColor: s.hex }}
                    />
                    <span
                      className={`text-xs font-medium ${
                        selectedStrap === s.label
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size — Hick's Law: only 2 options */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Choose your size
              </h3>
              <div className="flex gap-4">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 py-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                      selectedSize === size
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-gray-400 text-xs mt-3">
                40mm is ideal for smaller wrists. 44mm for larger wrists or
                those who prefer a bolder look.
              </p>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quantity
              </h3>
              <div className="flex items-center gap-4">
                {/* Fitts's Law: min 44px touch target */}
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-11 h-11 rounded-2xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 disabled:opacity-40 disabled:hover:border-gray-200 flex items-center justify-center transition-all"
                >
                  <Minus size={18} />
                </button>
                <span className="w-10 text-center font-bold text-lg text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  disabled={quantity >= 10}
                  className="w-11 h-11 rounded-2xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 disabled:opacity-40 disabled:hover:border-gray-200 flex items-center justify-center transition-all"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Trust indicators — Law of Proximity */}
            <div className="flex gap-6 text-sm text-green-600 flex-wrap">
              <span className="flex items-center gap-1">
                <Truck size={14} /> Free shipping
              </span>
              <span className="flex items-center gap-1">
                <Shield size={14} /> 1 year warranty
              </span>
              <span className="flex items-center gap-1">
                <RotateCcw size={14} /> 30-day returns
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full h-14 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20"
              >
                <ShoppingBag size={20} />
                {addingToCart
                  ? "Adding..."
                  : `Add to Cart — NPR ${((product?.price || 0) * quantity).toLocaleString()}`}
              </button>
              <button
                onClick={saveConfig}
                className="w-full h-14 border-2 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-500 rounded-2xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                {saved ? <Check size={16} /> : <Save size={16} />}
                {saved ? "Configuration saved!" : "Save configuration"}
              </button>
            </div>

            {/* Specs */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Specifications
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: "Water resistance", value: product?.waterResistance },
                  { label: "Battery life", value: product?.batteryLife },
                  { label: "Warranty", value: `${product?.warrantyMonths} months` },
                  { label: "Returns", value: `${product?.returnWindowDays} days` },
                ].map((spec) => (
                  <div key={spec.label}>
                    <p className="text-gray-400 text-xs mb-1">{spec.label}</p>
                    <p className="font-semibold text-gray-900">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}