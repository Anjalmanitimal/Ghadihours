"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchMyOrders } from "@/lib/api";
import { IOrder } from "@/types";
import {
  Package,
  Heart,
  User,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { caseColors, strapColors } from "@/lib/productOptions";
import WatchVisual from "@/components/ui/WatchVisual";

const orderSteps = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Delivered",
] as const;

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(savedUser));

    fetchMyOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-NP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStepIndex = (status: string) => {
    return orderSteps.indexOf(status as (typeof orderSteps)[number]);
  };

  const navItems = [
    { id: "orders", label: "My Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "profile", label: "My Details", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              {/* User info */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {user?.name}
                  </p>
                  <p className="text-gray-400 text-xs">{user?.email}</p>
                </div>
              </div>

              {/* Nav items */}
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full text-left ${
                      activeTab === item.id
                        ? "bg-blue-50 text-blue-500 border-l-4 border-blue-500"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                    {activeTab === item.id && (
                      <ChevronRight size={14} className="ml-auto" />
                    )}
                  </button>
                ))}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 transition-colors w-full text-left mt-4"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">

            {/* My Orders tab */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  My Orders
                </h2>

                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                    <Package size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium mb-2">
                      No orders yet
                    </p>
                    <p className="text-gray-400 text-sm mb-6">
                      When you place an order it will appear here
                    </p>
                    <Link href="/customise">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors">
                        Shop now
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
                      >
                        {/* Order header */}
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                              Order number
                            </p>
                            <p className="font-bold text-gray-900">
                              #{order.orderNumber}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                              order.orderStatus === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : order.orderStatus === "Shipped"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>

                        {/* Products */}
                        <div className="flex flex-col gap-3 mb-6">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                                <div style={{ transform: "scale(0.29)" }}>
                                  <WatchVisual
                                    size="sm"
                                    caseColor={caseColors.find((c) => c.label === item.caseColor)?.hex}
                                    strapColor={strapColors.find((s) => s.label === item.strapColor)?.hex}
                                  />
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-sm">
                                  GhadiHours
                                </p>
                                <p className="text-gray-400 text-xs mt-0.5">
                                  {item.caseColor} · {item.strapColor} strap ·{" "}
                                  {item.size} · Qty {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                          <p className="font-bold text-gray-900 text-sm text-right">
                            Total: NPR {order.pricing.total.toLocaleString()}
                          </p>
                        </div>

                        {/* Progress tracker */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between relative">
                            {/* Line */}
                            <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200 z-0" />
                            <div
                              className="absolute left-0 top-4 h-0.5 bg-blue-500 z-0 transition-all duration-500"
                              style={{
                                width: `${
                                  (getStepIndex(order.orderStatus) /
                                    (orderSteps.length - 1)) *
                                  100
                                }%`,
                              }}
                            />

                            {orderSteps.map((step, i) => {
                              const stepIdx = getStepIndex(order.orderStatus);
                              const isDone = i < stepIdx;
                              const isActive = i === stepIdx;

                              return (
                                <div
                                  key={step}
                                  className="flex flex-col items-center z-10"
                                >
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                                      isDone
                                        ? "bg-green-500 border-green-500 text-white"
                                        : isActive
                                        ? "bg-blue-500 border-blue-500 text-white"
                                        : "bg-white border-gray-200 text-gray-400"
                                    }`}
                                  >
                                    {isDone ? "✓" : i + 1}
                                  </div>
                                  <span
                                    className={`text-xs mt-2 font-medium text-center max-w-[60px] leading-tight ${
                                      isActive
                                        ? "text-blue-500"
                                        : isDone
                                        ? "text-green-500"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Delivery date */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm">
                          <span className="text-gray-400">
                            Est. delivery:{" "}
                            {formatDate(order.estimatedDeliveryDate)}
                          </span>
                          <span className="text-gray-400">
                            Placed: {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist tab */}
            {activeTab === "wishlist" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Wishlist
                </h2>
                <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                  <Heart size={48} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium mb-2">
                    Your wishlist is empty
                  </p>
                  <p className="text-gray-400 text-sm mb-6">
                    Save your watch configuration to find it here
                  </p>
                  <Link href="/customise">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors">
                      Go back to the store
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* Profile tab */}
            {activeTab === "profile" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  My Details
                </h2>
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Full name
                      </label>
                      <div className="h-12 border border-gray-200 rounded-xl px-4 flex items-center text-gray-900 text-sm bg-gray-50">
                        {user?.name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Email address
                      </label>
                      <div className="h-12 border border-gray-200 rounded-xl px-4 flex items-center text-gray-900 text-sm bg-gray-50">
                        {user?.email}
                      </div>
                    </div>
                    <button className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-sm transition-colors">
                      Update details
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Settings tab */}
            {activeTab === "settings" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Settings
                </h2>
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col gap-4">
                  {[
                    "Email notifications",
                    "Order updates via SMS",
                    "Marketing emails",
                  ].map((setting) => (
                    <div
                      key={setting}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-gray-700 text-sm font-medium">
                        {setting}
                      </span>
                      <div className="w-11 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}