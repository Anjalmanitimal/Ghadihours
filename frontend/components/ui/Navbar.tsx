"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Menu, X, User, LogOut } from "lucide-react";
import { useActiveSection } from "@/hooks/useActiveSection";

// Full section order on the home page — must match HeroSection's dot-nav list
// so the active link can be detected even for sections with no nav link.
const ALL_SECTIONS = [
  "hero",
  "story",
  "product",
  "features",
  "customise",
  "reviews",
  "compare",
  "pricing",
];

const navLinks = [
  { label: "Story", id: "story" },
  { label: "Features", id: "features" },
  { label: "Reviews", id: "reviews" },
  { label: "Price", id: "pricing" },
];

const Navbar = () => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const activeSection = useActiveSection(ALL_SECTIONS);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUserName(JSON.parse(saved).name || "Account");
      } catch {
        setUserName("Account");
      }
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserName(null);
    router.push("/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2">
          <span
            className={`font-bold text-lg transition-colors ${
              scrolled ? "text-gray-900" : "text-white"
            }`}
          >
            GhadiHours
          </span>
        </Link>

        {/* Desktop nav links — capped at 4 (Miller's Law) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`relative text-sm font-medium pb-1 transition-colors hover:text-blue-500 ${
                activeSection === link.id
                  ? "text-blue-500"
                  : scrolled
                  ? "text-gray-600"
                  : "text-white/80"
              }`}
            >
              {link.label}
              <span
                className={`absolute left-0 -bottom-0.5 h-0.5 bg-blue-500 rounded-full transition-all duration-300 ${
                  activeSection === link.id ? "w-full" : "w-0"
                }`}
              />
            </a>
          ))}
        </div>

        {/* CTA — always visible (Fitts's Law) */}
        <div className="hidden md:flex items-center gap-4">
          {userName ? (
            <div className="flex items-center gap-4">
              <Link
                href="/orders"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-blue-500 ${
                  scrolled ? "text-gray-600" : "text-white/80"
                }`}
              >
                <User size={16} />
                {userName}
              </Link>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-blue-500 ${
                  scrolled ? "text-gray-600" : "text-white/80"
                }`}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login">
              <span
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                  scrolled ? "text-gray-600" : "text-white/80"
                }`}
              >
                Sign in
              </span>
            </Link>
          )}
          <Link href="/customise">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2">
              <ShoppingBag size={16} />
              Buy Now
            </button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X size={24} className={scrolled ? "text-gray-900" : "text-white"} />
          ) : (
            <Menu size={24} className={scrolled ? "text-gray-900" : "text-white"} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`font-medium text-sm ${
                activeSection === link.id ? "text-blue-500" : "text-gray-700"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {userName ? (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <Link
                href="/orders"
                className="flex items-center gap-1.5 text-gray-700 font-medium text-sm"
                onClick={() => setMenuOpen(false)}
              >
                <User size={16} />
                {userName}
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-1.5 text-gray-500 font-medium text-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-gray-700 font-medium text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Sign in
            </Link>
          )}
          <Link href="/customise">
            <button className="btn-primary mt-2">Buy Now</button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;