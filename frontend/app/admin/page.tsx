"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Clock, Truck, CheckCircle2, TrendingUp } from "lucide-react";
import { fetchAdminStats, fetchAllOrders } from "@/lib/api";
import { IAdminStats, IOrder } from "@/types";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import StatusPill from "@/components/admin/StatusPill";

export default function AdminDashboard() {
  const ready = useAdminGuard();
  const [stats, setStats] = useState<IAdminStats | null>(null);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!ready) return;
    const saved = localStorage.getItem("user");
    if (saved) setUserName(JSON.parse(saved).name || "");

    fetchAdminStats().then(setStats).catch(console.error);
    fetchAllOrders().then(setOrders).catch(console.error);
  }, [ready]);

  if (!ready) return null;

  const statCards = [
    { label: "Total Orders", value: stats?.totalOrders, icon: ShoppingBag, color: "blue" },
    { label: "Pending", value: stats?.pending, icon: Clock, color: "orange" },
    { label: "Shipped", value: stats?.shipped, icon: Truck, color: "blue" },
    { label: "Delivered", value: stats?.delivered, icon: CheckCircle2, color: "green" },
  ] as const;

  const colorClasses: Record<string, { border: string; bg: string; text: string }> = {
    blue: { border: "border-blue-500", bg: "bg-blue-50", text: "text-blue-500" },
    orange: { border: "border-orange-400", bg: "bg-orange-50", text: "text-orange-500" },
    green: { border: "border-green-500", bg: "bg-green-50", text: "text-green-500" },
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 px-10 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {userName || "Admin"}.</p>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {statCards.map(({ label, value, icon: Icon, color }) => {
            const c = colorClasses[color];
            return (
              <div
                key={label}
                className={`bg-white rounded-2xl border-l-4 ${c.border} shadow-sm p-6`}
              >
                <div className={`w-11 h-11 rounded-full ${c.bg} ${c.text} flex items-center justify-center mb-4`}>
                  <Icon size={20} />
                </div>
                <p className="text-3xl font-bold text-gray-900">{value ?? "—"}</p>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mt-1">
                  {label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Revenue banner */}
        <div className="bg-[#0B1340] rounded-2xl p-8 mt-6 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm mb-2">Total revenue</p>
            <p className="text-4xl font-bold text-white">
              NPR {(stats?.revenue ?? 0).toLocaleString()}
            </p>
            <p className="text-white/40 text-sm mt-2">
              From {stats?.totalOrders ?? 0} orders in the last 30 days
            </p>
          </div>
          <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
            <TrendingUp size={22} className="text-blue-400" />
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent orders</h2>
            <Link href="/admin/orders" className="text-blue-500 text-sm font-semibold hover:text-blue-600">
              View all →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wide">
                  <th className="py-3 pr-4 font-semibold">Order #</th>
                  <th className="py-3 pr-4 font-semibold">Customer</th>
                  <th className="py-3 pr-4 font-semibold">Config</th>
                  <th className="py-3 pr-4 font-semibold">NPR Total</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 pr-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => {
                  const item = order.items[0];
                  return (
                    <tr key={order._id} className="border-t border-gray-50">
                      <td className="py-4 pr-4 font-bold text-gray-900">
                        #{order.orderNumber}
                      </td>
                      <td className="py-4 pr-4">
                        <p className="font-semibold text-gray-900">
                          {order.deliveryDetails.fullName}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {order.deliveryDetails.email}
                        </p>
                      </td>
                      <td className="py-4 pr-4 text-gray-600">
                        {item ? `${item.caseColor} · ${item.strapColor} · ${item.size}` : "—"}
                      </td>
                      <td className="py-4 pr-4 font-bold text-gray-900">
                        {order.pricing.total.toLocaleString()}
                      </td>
                      <td className="py-4 pr-4">
                        <StatusPill status={order.orderStatus} />
                      </td>
                      <td className="py-4 pr-4 text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
