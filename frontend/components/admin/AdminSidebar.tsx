"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, ShoppingCart, Users, Star, LogOut } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutGrid },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
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
    <aside className="w-64 shrink-0 bg-[#0B1340] min-h-screen flex flex-col">
      <div className="px-8 py-8">
        <span className="text-xl font-bold text-white">GhadiHours</span>
        <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mt-1">
          Admin
        </p>
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
                  ? "bg-white/10 text-white border-blue-400"
                  : "text-white/50 border-transparent hover:bg-white/5 hover:text-white/80"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-6 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white text-sm truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-white/40 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
