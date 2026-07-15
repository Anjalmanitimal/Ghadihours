"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, ShoppingCart, Users, LogOut } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutGrid },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-100 min-h-screen flex flex-col">
      <div className="px-8 py-8">
        <span className="text-xl font-bold text-gray-900">Admin</span>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors border-l-4 ${
                active
                  ? "bg-blue-50 text-blue-600 border-blue-500"
                  : "text-gray-500 border-transparent hover:bg-gray-50"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-6 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-gray-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
