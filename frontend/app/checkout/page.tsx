"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Truck, RotateCcw, ChevronRight, User, Package } from "lucide-react";
import { fetchProduct, createOrder, guestLogin } from "@/lib/api";
import { IProduct, IDeliveryDetails } from "@/types";

const steps = ["Details", "Payment", "Confirm"];

export default function CheckoutPage() {
  const router = useRouter();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [config, setConfig] = useState({
    caseColor: "Midnight Black",
    strapColor: "Black",
    size: "44mm",
  });

  const [form, setForm] = useState<IDeliveryDetails>({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    country: "Nepal",
  });

  const [paymentMethod, setPaymentMethod] = useState<"card" | "esewa" | "khalti">("card");

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem("watchConfig");
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }

    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setForm((prev) => ({
        ...prev,
        fullName: parsed.name || "",
        email: parsed.email || "",
      }));
    }

    fetchProduct()
      .then(setProduct)
      .catch(console.error)
      .finally(() => setPageLoading(false));
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuestContinue = async () => {
    if (!form.email) return;
    setLoading(true);
    try {
      const res = await guestLogin(form.email, form.fullName || "Guest");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      setIsGuest(true);
      setCurrentStep(1);
    } catch {
      console.error("Guest login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsNext = () => {
    if (
      !form.fullName ||
      !form.email ||
      !form.phone ||
      !form.street ||
      !form.city
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    setCurrentStep(1);
  };

  const handlePlaceOrder = async () => {
    if (!product) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const parsedUser = user ? JSON.parse(user) : null;

      const order = await createOrder({
        configuration: config,
        quantity: 1,
        deliveryDetails: form,
        paymentMethod,
        isGuestOrder: parsedUser?.isGuest || !token,
        guestEmail: form.email,
      });

      // clear config after order
      localStorage.removeItem("watchConfig");
      router.push(`/confirmation?order=${order.orderNumber}`);
    } catch (error) {
      console.error("Order failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = product?.price || 32000;
  const shipping = 0;
  const tax = Math.round(subtotal * 0.13);
  const total = subtotal + shipping + tax;

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Step indicator — Jakob's Law: familiar pattern */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    i < currentStep
                      ? "bg-green-500 text-white"
                      : i === currentStep
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {i < currentStep ? "✓" : i + 1}
                </div>
                <span
                  className={`text-xs mt-1 font-medium ${
                    i === currentStep ? "text-blue-500" : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-24 h-0.5 mx-2 mb-4 transition-colors ${
                    i < currentStep ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left — form area */}
          <div className="lg:col-span-2">

            {/* ── STEP 0: DETAILS ── */}
            {currentStep === 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Delivery details
                </h2>

                {/* Guest checkout — Hick's Law: first and most prominent */}
                {!localStorage.getItem("token") && (
                  <div className="mb-8">
                    <button
                      onClick={handleGuestContinue}
                      disabled={loading}
                      className="w-full h-13 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2 mb-4"
                    >
                      <User size={18} />
                      Continue as Guest
                    </button>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-gray-400 text-sm">
                        or fill in your details below
                      </span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-5">
                  {/* Full name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleFormChange}
                      placeholder="Anjal Mani Timalsina"
                      className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Email + Phone row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleFormChange}
                        placeholder="you@example.com"
                        className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleFormChange}
                        placeholder="98XXXXXXXX"
                        className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Street */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street address *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={form.street}
                      onChange={handleFormChange}
                      placeholder="House no., Street name, Tole"
                      className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* City + Country row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleFormChange}
                        placeholder="Kathmandu"
                        className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        name="country"
                        value={form.country}
                        onChange={handleFormChange}
                        className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors bg-white"
                      >
                        <option>Nepal</option>
                        <option>India</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Estimated delivery — fixes CHK-04 */}
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                    <Truck size={18} className="text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-green-700 font-semibold text-sm">
                        Estimated delivery: 3–5 business days
                      </p>
                      <p className="text-green-600 text-xs mt-0.5">
                        Free shipping on this order
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDetailsNext}
                    className="w-full h-13 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    Continue to Payment
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 1: PAYMENT ── */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Payment method
                </h2>

                {/* Payment options — Hick's Law: exactly 3 */}
                <div className="flex flex-col gap-3 mb-8">
                  {(
                    [
                      { id: "card", label: "Credit / Debit Card", icon: "💳" },
                      { id: "esewa", label: "eSewa", icon: "🟢" },
                      { id: "khalti", label: "Khalti", icon: "🟣" },
                    ] as const
                  ).map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                        paymentMethod === method.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <span
                        className={`font-medium text-sm ${
                          paymentMethod === method.id
                            ? "text-blue-600"
                            : "text-gray-700"
                        }`}
                      >
                        {method.label}
                      </span>
                      {paymentMethod === method.id && (
                        <span className="ml-auto text-blue-500">✓</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Card form */}
                {paymentMethod === "card" && (
                  <div className="flex flex-col gap-5 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card number
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cardNumber}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cardNumber: e.target.value,
                          })
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry date
                        </label>
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              expiry: e.target.value,
                            })
                          }
                          placeholder="MM / YY"
                          maxLength={7}
                          className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cardDetails.cvv}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              cvv: e.target.value,
                            })
                          }
                          placeholder="•••"
                          maxLength={4}
                          className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder name
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cardName}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cardName: e.target.value,
                          })
                        }
                        placeholder="Name as on card"
                        className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* eSewa / Khalti message */}
                {(paymentMethod === "esewa" ||
                  paymentMethod === "khalti") && (
                  <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-center">
                    <p className="text-2xl mb-2">
                      {paymentMethod === "esewa" ? "🟢" : "🟣"}
                    </p>
                    <p className="text-gray-700 font-medium text-sm">
                      You will be redirected to{" "}
                      {paymentMethod === "esewa" ? "eSewa" : "Khalti"} to
                      complete your payment securely.
                    </p>
                  </div>
                )}

                {/* SSL badge */}
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-8">
                  <Shield size={14} className="text-green-500" />
                  <span>Your payment is 256-bit SSL encrypted and secure.</span>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full h-13 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white rounded-2xl font-bold text-sm transition-colors"
                  >
                    {loading
                      ? "Placing order..."
                      : `Place Order — NPR ${total.toLocaleString()}`}
                  </button>
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="w-full h-13 text-gray-500 hover:text-gray-700 text-sm font-medium"
                  >
                    ← Back to details
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right — order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-28">
              <div className="flex items-center gap-2 mb-6">
                <Package size={18} className="text-gray-500" />
                <h3 className="font-bold text-gray-900">Order summary</h3>
              </div>

              {/* Watch preview mini */}
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-light">10:09</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    GhadiHours
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {config.caseColor}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {config.strapColor} strap · {config.size}
                  </p>
                </div>
              </div>

              {/* Pricing — Law of Proximity: all costs grouped */}
              <div className="flex flex-col gap-3 text-sm mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>NPR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>VAT (13%)</span>
                  <span>NPR {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base pt-3 border-t border-gray-200 mt-1">
                  <span>Total</span>
                  <span>NPR {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex flex-col gap-2 text-xs text-gray-400">
                <span className="flex items-center gap-2">
                  <Shield size={12} className="text-green-500" />
                  Secure payment
                </span>
                <span className="flex items-center gap-2">
                  <RotateCcw size={12} className="text-green-500" />
                  30-day returns
                </span>
                <span className="flex items-center gap-2">
                  <Truck size={12} className="text-green-500" />
                  Free shipping
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}