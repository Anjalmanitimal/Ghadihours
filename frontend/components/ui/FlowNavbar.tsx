"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { fetchCart } from "@/lib/api";

const links = [
  { label: "Home", href: "/home" },
  { label: "Customiser", href: "/customise" },
  { label: "Pricing", href: "/home#pricing" },
  { label: "Checkout", href: "/checkout" },
];

const FlowNavbar = () => {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = () => {
    if (!localStorage.getItem("token")) return;
    fetchCart()
      .then((cart) => {
        setCartCount(cart.items.reduce((sum, item) => sum + item.quantity, 0));
      })
      .catch(() => {});
  };

  useEffect(() => {
    refreshCartCount();
    window.addEventListener("cart:updated", refreshCartCount);
    return () => window.removeEventListener("cart:updated", refreshCartCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1340] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/home" className="flex items-center gap-2">
          <span className="font-bold text-lg text-white">GhadiHours</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const active = pathname === link.href.split("#")[0];
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative text-sm font-medium pb-1 transition-colors hover:text-white ${
                  active ? "text-white" : "text-white/60"
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-0.5 bg-blue-400 rounded-full transition-all duration-300 ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <Link href="/cart">
          <button className="relative bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-colors flex items-center gap-2">
            <ShoppingCart size={16} />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white text-blue-600 text-xs font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default FlowNavbar;
