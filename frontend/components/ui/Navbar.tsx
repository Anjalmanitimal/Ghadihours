"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Story", href: "#story" },
    { label: "Features", href: "#features" },
    { label: "Reviews", href: "#reviews" },
    { label: "Price", href: "#pricing" },
  ];

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
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                scrolled ? "text-gray-600" : "text-white/80"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA — always visible (Fitts's Law) */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <span
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                scrolled ? "text-gray-600" : "text-white/80"
              }`}
            >
              Sign in
            </span>
          </Link>
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
              key={link.label}
              href={link.href}
              className="text-gray-700 font-medium text-sm"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link href="/customise">
            <button className="btn-primary mt-2">Buy Now</button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;