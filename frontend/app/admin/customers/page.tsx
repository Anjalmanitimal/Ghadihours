"use client";

import { useEffect, useState } from "react";
import { fetchAllCustomers } from "@/lib/api";
import { ICustomer } from "@/types";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminGuard } from "@/hooks/useAdminGuard";

export default function AdminCustomersPage() {
  const ready = useAdminGuard();
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    fetchAllCustomers()
      .then(setCustomers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ready]);

  if (!ready) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 px-10 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 mt-1">{customers.length} registered customers</p>

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
                    <th className="py-3 pr-4 font-semibold">Customer</th>
                    <th className="py-3 pr-4 font-semibold">Orders</th>
                    <th className="py-3 pr-4 font-semibold">Total spent</th>
                    <th className="py-3 pr-4 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c._id} className="border-t border-gray-50">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{c.name}</p>
                            <p className="text-gray-400 text-xs">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-gray-600">{c.orderCount}</td>
                      <td className="py-4 pr-4 font-bold text-gray-900">
                        NPR {c.totalSpent.toLocaleString()}
                      </td>
                      <td className="py-4 pr-4 text-gray-400">
                        {new Date(c.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">
                        No customers yet.
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
