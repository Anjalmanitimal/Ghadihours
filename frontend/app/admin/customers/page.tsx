"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus, MoreVertical, X } from "lucide-react";
import { fetchAllCustomers, registerUser } from "@/lib/api";
import { ICustomer } from "@/types";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import StatusPill from "@/components/admin/StatusPill";

const PAGE_SIZE = 8;

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function AdminCustomersPage() {
  const ready = useAdminGuard();
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showNewCustomer, setShowNewCustomer] = useState(false);

  const loadCustomers = () => {
    fetchAllCustomers().then(setCustomers).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!ready) return;
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const registeredCount = customers.filter((c) => !c.isGuest).length;
  const guestCount = customers.filter((c) => c.isGuest).length;

  if (!ready) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 px-10 py-10">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-500 mt-1">{customers.length} total customers</p>
          </div>
          <button
            onClick={() => setShowNewCustomer(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
          >
            <Plus size={16} />
            New Customer
          </button>
        </div>

        {/* Search */}
        <div className="relative mt-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full h-11 pl-11 pr-4 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mt-1">
              Total Customers
            </p>
          </div>
          <div className="bg-white rounded-2xl border-l-4 border-green-500 shadow-sm p-6">
            <p className="text-3xl font-bold text-gray-900">{registeredCount}</p>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mt-1">
              Registered
            </p>
          </div>
          <div className="bg-white rounded-2xl border-l-4 border-gray-400 shadow-sm p-6">
            <p className="text-3xl font-bold text-gray-900">{guestCount}</p>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mt-1">
              Guest Orders
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase tracking-wide bg-gray-50">
                    <th className="py-3 px-6 font-semibold">Customer</th>
                    <th className="py-3 px-4 font-semibold">Recent Order</th>
                    <th className="py-3 px-4 font-semibold">Phone</th>
                    <th className="py-3 px-4 font-semibold">Joined</th>
                    <th className="py-3 px-4 font-semibold w-10" />
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((c) => (
                    <tr key={c._id} className="border-t border-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{c.name}</p>
                            <p className="text-gray-400 text-xs">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {c.lastOrderStatus ? (
                          <div>
                            <StatusPill status={c.lastOrderStatus} />
                            <p className="text-gray-400 text-xs mt-1">
                              #{c.lastOrderNumber}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No orders yet</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-600 whitespace-nowrap">
                        {c.phone || "—"}
                      </td>
                      <td className="py-4 px-4 text-gray-400 whitespace-nowrap">
                        {formatDate(c.createdAt)}
                      </td>
                      <td className="py-4 px-4 relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === c._id ? null : c._id)}
                          className="text-gray-400 hover:text-gray-700"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {openMenuId === c._id && (
                          <div className="absolute right-4 top-10 z-10 bg-white border border-gray-100 rounded-xl shadow-lg py-1 w-40">
                            <Link
                              href={`/admin/orders?q=${encodeURIComponent(c.email)}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              View Orders
                            </Link>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {pageItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400">
                        No customers match.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-sm font-medium text-gray-500 disabled:opacity-40 hover:text-gray-700 px-2"
            >
              ‹ Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
                  page === n ? "bg-blue-500 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-sm font-medium text-gray-500 disabled:opacity-40 hover:text-gray-700 px-2"
            >
              Next ›
            </button>
          </div>
        )}
      </main>

      {showNewCustomer && (
        <NewCustomerModal
          onClose={() => setShowNewCustomer(false)}
          onCreated={() => {
            setShowNewCustomer(false);
            loadCustomers();
          }}
        />
      )}
    </div>
  );
}

const NewCustomerModal = ({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await registerUser(form.name, form.email, form.password);
      onCreated();
    } catch {
      setError("Couldn't create customer — email may already be in use.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">New Customer</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="h-11 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500"
          />
          <input
            required
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="h-11 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="h-11 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={saving}
            className="h-11 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition-colors mt-2"
          >
            {saving ? "Creating..." : "Create Customer"}
          </button>
        </form>
      </div>
    </div>
  );
};
