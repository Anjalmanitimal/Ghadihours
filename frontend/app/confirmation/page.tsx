"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchOrderByNumber } from "@/lib/api";
import { IOrder } from "@/types";
import { CheckCircle, Package, Truck, Calendar, Mail } from "lucide-react";
import { Suspense } from "react";
import { caseColors, strapColors } from "@/lib/productOptions";
import WatchVisual from "@/components/ui/WatchVisual";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      fetchOrderByNumber(orderNumber)
        .then(setOrder)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [orderNumber]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-NP", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Success icon — Peak-End Rule: memorable ending */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Your order is confirmed!
          </h1>
          <p className="text-gray-500 text-lg">
            Thank you for your purchase. A confirmation has been sent to your
            email.
          </p>
        </div>

        {/* Order summary card */}
        {order && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6">
            {/* Order number + status */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                  Order number
                </p>
                <p className="font-bold text-gray-900 text-lg">
                  #{order.orderNumber}
                </p>
              </div>
              <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full">
                {order.orderStatus}
              </span>
            </div>

            {/* Products */}
            <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-gray-100">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                    <div style={{ transform: "scale(0.33)" }}>
                      <WatchVisual
                        size="sm"
                        caseColor={caseColors.find((c) => c.label === item.caseColor)?.hex}
                        strapColor={strapColors.find((s) => s.label === item.strapColor)?.hex}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">GhadiHours</p>
                    <p className="text-gray-400 text-sm mt-0.5">
                      {item.caseColor} · {item.strapColor} strap · {item.size} ·
                      Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-gray-700 font-semibold text-sm">
                    NPR {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
              <p className="text-blue-500 font-bold text-sm text-right pt-2">
                Total: NPR {order.pricing.total.toLocaleString()}
              </p>
            </div>

            {/* Delivery info */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Estimated delivery
                  </p>
                  <p className="text-gray-500 text-sm">
                    {formatDate(order.estimatedDeliveryDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Delivery address
                  </p>
                  <p className="text-gray-500 text-sm">
                    {order.deliveryDetails.street},{" "}
                    {order.deliveryDetails.city},{" "}
                    {order.deliveryDetails.country}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Confirmation sent to
                  </p>
                  <p className="text-gray-500 text-sm">
                    {order.deliveryDetails.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3 mb-8">
          <Link href="/orders">
            <button className="w-full h-13 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
              <Package size={18} />
              Track your order
            </button>
          </Link>
          <Link href="/home">
            <button className="w-full h-13 border-2 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-500 rounded-2xl font-semibold text-sm transition-colors">
              Continue browsing
            </button>
          </Link>
        </div>

        {/* Optional account creation */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center mb-8">
          <p className="text-gray-700 text-sm mb-3">
            Save your details for next time. Create a free account in one click.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/register">
              <button className="text-blue-500 font-semibold text-sm hover:text-blue-600">
                Create account
              </button>
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/home">
              <button className="text-gray-400 text-sm hover:text-gray-600">
                No thanks
              </button>
            </Link>
          </div>
        </div>

        {/* Support links */}
        <div className="flex justify-center gap-8 text-sm text-gray-400">
          <button className="hover:text-gray-600">Need help?</button>
          <button className="hover:text-gray-600">Return policy</button>
          <button className="hover:text-gray-600">Contact us</button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}