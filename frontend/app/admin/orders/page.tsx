"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, ChevronDown, X, Printer } from "lucide-react";
import { fetchAllOrders, updateOrderStatus } from "@/lib/api";
import { IOrder } from "@/types";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import StatusPill from "@/components/admin/StatusPill";

const STATUSES = ["Order Placed", "Processing", "Shipped", "Delivered"] as const;

const FILTER_TABS = [
  { label: "All", status: null },
  { label: "Placed", status: "Order Placed" },
  { label: "Processing", status: "Processing" },
  { label: "Shipped", status: "Shipped" },
  { label: "Delivered", status: "Delivered" },
] as const;

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const printInvoice = (order: IOrder) => {
  const win = window.open("", "_blank");
  if (!win) return;
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td>${item.caseColor} · ${item.strapColor} · ${item.size}</td>
        <td style="text-align:center">${item.quantity}</td>
        <td style="text-align:right">NPR ${item.price.toLocaleString()}</td>
        <td style="text-align:right">NPR ${(item.price * item.quantity).toLocaleString()}</td>
      </tr>`
    )
    .join("");

  win.document.write(`
    <html>
      <head>
        <title>Invoice ${order.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; padding: 40px; }
          h1 { font-size: 22px; margin-bottom: 4px; }
          .muted { color: #6b7280; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-top: 24px; }
          th, td { padding: 8px 4px; border-bottom: 1px solid #e5e7eb; font-size: 13px; text-align: left; }
          .totals { margin-top: 16px; width: 260px; margin-left: auto; }
          .totals div { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
          .totals .grand { font-weight: bold; font-size: 16px; border-top: 1px solid #e5e7eb; padding-top: 8px; margin-top: 8px; }
        </style>
      </head>
      <body>
        <h1>GhadiHours</h1>
        <p class="muted">Invoice #${order.orderNumber} · ${formatDate(order.createdAt)}</p>
        <p class="muted">${order.deliveryDetails.fullName} · ${order.deliveryDetails.email}</p>
        <p class="muted">${order.deliveryDetails.street}, ${order.deliveryDetails.city}, ${order.deliveryDetails.country}</p>
        <table>
          <thead><tr><th>Configuration</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr></thead>
          <tbody>${itemRows}</tbody>
        </table>
        <div class="totals">
          <div><span>Subtotal</span><span>NPR ${order.pricing.subtotal.toLocaleString()}</span></div>
          <div><span>Shipping</span><span>${order.pricing.shipping ? `NPR ${order.pricing.shipping.toLocaleString()}` : "Free"}</span></div>
          <div><span>VAT (13%)</span><span>NPR ${order.pricing.tax.toLocaleString()}</span></div>
          <div class="grand"><span>Total</span><span>NPR ${order.pricing.total.toLocaleString()}</span></div>
        </div>
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
};

export default function AdminOrdersPage() {
  const ready = useAdminGuard();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setSearch(q);

    fetchAllOrders()
      .then((data) => {
        setOrders(data);
        if (data.length > 0) setSelectedId(data[0]._id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ready]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesStatus = !statusFilter || o.orderStatus === statusFilter;
      const matchesSearch =
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.deliveryDetails.fullName.toLowerCase().includes(q) ||
        o.deliveryDetails.email.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const selectedOrder = orders.find((o) => o._id === selectedId) || null;

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

        {/* Search + filter tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mt-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="w-full h-11 pl-11 pr-4 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full p-1 overflow-x-auto">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setStatusFilter(tab.status)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === tab.status
                    ? "bg-blue-500 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6 items-start">
            {/* Orders table */}
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 text-xs uppercase tracking-wide bg-gray-50">
                      <th className="py-3 px-4 font-semibold">Order #</th>
                      <th className="py-3 px-4 font-semibold">Customer</th>
                      <th className="py-3 px-4 font-semibold">Configuration</th>
                      <th className="py-3 px-4 font-semibold">Total (NPR)</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const item = order.items[0];
                      const active = order._id === selectedId;
                      return (
                        <tr
                          key={order._id}
                          onClick={() => setSelectedId(order._id)}
                          className={`cursor-pointer border-t border-gray-50 border-l-4 transition-colors ${
                            active
                              ? "bg-blue-50/60 border-l-blue-500"
                              : "border-l-transparent hover:bg-gray-50"
                          }`}
                        >
                          <td className="py-4 px-4 font-bold text-blue-600 whitespace-nowrap">
                            #{order.orderNumber}
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-semibold text-gray-900">
                              {order.deliveryDetails.fullName}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {order.deliveryDetails.email}
                            </p>
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {item &&
                              `${item.caseColor} · ${item.strapColor} · ${item.size}`}
                            {order.items.length > 1 && (
                              <span className="text-gray-400"> +{order.items.length - 1} more</span>
                            )}
                          </td>
                          <td className="py-4 px-4 font-bold text-gray-900 whitespace-nowrap">
                            {order.pricing.total.toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            <StatusPill status={order.orderStatus} />
                          </td>
                        </tr>
                      );
                    })}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-400">
                          No orders match.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail panel */}
            <div className="xl:sticky xl:top-10">
              {selectedOrder ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">
                      #{selectedOrder.orderNumber}
                    </h2>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Update status */}
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Update status
                  </p>
                  <div className="relative mb-6">
                    <select
                      value={selectedOrder.orderStatus}
                      disabled={savingId === selectedOrder._id}
                      onChange={(e) => handleStatusChange(selectedOrder, e.target.value)}
                      className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium disabled:opacity-50"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>

                  {/* Customer info */}
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Customer info
                  </p>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {selectedOrder.deliveryDetails.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {selectedOrder.deliveryDetails.fullName}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {selectedOrder.isGuestOrder ? "Guest checkout" : "Verified buyer"}
                      </p>
                    </div>
                  </div>

                  {/* Delivery address */}
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Delivery address
                  </p>
                  <p className="text-gray-700 text-sm mb-6 leading-relaxed">
                    {selectedOrder.deliveryDetails.street}
                    <br />
                    {selectedOrder.deliveryDetails.city}
                    <br />
                    {selectedOrder.deliveryDetails.country}
                  </p>

                  {/* Configuration */}
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Configuration
                  </p>
                  <div className="border border-gray-200 rounded-xl p-4 mb-6 flex flex-col gap-2">
                    {selectedOrder.items.map((item, i) => (
                      <div
                        key={i}
                        className={i > 0 ? "pt-2 border-t border-gray-100" : ""}
                      >
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Case</span>
                          <span className="font-medium text-gray-900">{item.caseColor}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Strap</span>
                          <span className="font-medium text-gray-900">{item.strapColor}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Size</span>
                          <span className="font-medium text-gray-900">
                            {item.size} · Qty {item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="flex flex-col gap-2 text-sm mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>NPR {selectedOrder.pricing.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Shipping</span>
                      <span>
                        {selectedOrder.pricing.shipping
                          ? `NPR ${selectedOrder.pricing.shipping.toLocaleString()}`
                          : "Free"}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>VAT (13%)</span>
                      <span>NPR {selectedOrder.pricing.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span className="text-blue-600">
                        NPR {selectedOrder.pricing.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => printInvoice(selectedOrder)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Printer size={16} />
                    Print Invoice
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center text-gray-400">
                  Select an order to view details.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
