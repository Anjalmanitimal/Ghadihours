"use client";

import { useEffect, useState } from "react";
import { fetchAllOrders, updateOrderStatus } from "@/lib/api";
import { IOrder } from "@/types";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import StatusPill from "@/components/admin/StatusPill";

const STATUSES = ["Order Placed", "Processing", "Shipped", "Delivered"] as const;

export default function AdminOrdersPage() {
  const ready = useAdminGuard();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    fetchAllOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ready]);

  const handleStatusChange = async (order: IOrder, newStatus: string) => {
    setSavingId(order._id);
    try {
      await updateOrderStatus(order.orderNumber, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id ? { ...o, orderStatus: newStatus as IOrder["orderStatus"] } : o
        )
      );
    } catch (err) {
      console.error(err);
      alert("Couldn't update order status.");
    } finally {
      setSavingId(null);
    }
  };

  if (!ready) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 px-10 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">{orders.length} total orders</p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase tracking-wide">
                    <th className="py-3 pr-4 font-semibold">Order #</th>
                    <th className="py-3 pr-4 font-semibold">Customer</th>
                    <th className="py-3 pr-4 font-semibold">Items</th>
                    <th className="py-3 pr-4 font-semibold">NPR Total</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                    <th className="py-3 pr-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-t border-gray-50 align-top">
                      <td className="py-4 pr-4 font-bold text-gray-900 whitespace-nowrap">
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
                        {order.items.map((item, i) => (
                          <p key={i} className="whitespace-nowrap">
                            {item.caseColor} · {item.strapColor} · {item.size} · Qty{" "}
                            {item.quantity}
                          </p>
                        ))}
                      </td>
                      <td className="py-4 pr-4 font-bold text-gray-900 whitespace-nowrap">
                        {order.pricing.total.toLocaleString()}
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.orderStatus}
                            disabled={savingId === order._id}
                            onChange={(e) => handleStatusChange(order, e.target.value)}
                            className="text-xs font-semibold border border-gray-200 rounded-lg px-2 py-1.5 bg-white disabled:opacity-50"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <StatusPill status={order.orderStatus} />
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-gray-400 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
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
          )}
        </div>
      </main>
    </div>
  );
}
