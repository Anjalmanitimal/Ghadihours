"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Gem,
  BatteryCharging,
  UserRound,
} from "lucide-react";
import { AxiosError } from "axios";
import { loginUser, guestLogin } from "@/lib/api";
import WatchPhoto from "@/components/ui/WatchPhoto";

const FEATURES = [
  { icon: ShieldCheck, label: "Precision biometric tracking" },
  { icon: Gem, label: "Unmatched titanium durability" },
  { icon: BatteryCharging, label: "Up to 14 days of battery life" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    setRegistered(new URLSearchParams(window.location.search).has("registered"));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(email, password);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      router.push(res.data.isAdmin ? "/admin" : "/home");
    } catch (err) {
      const message =
        err instanceof AxiosError ? err.response?.data?.message : undefined;
      setError(message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
      const res = await guestLogin(email || "guest@ghadihours.com", "Guest");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      router.push("/checkout");
    } catch (err) {
      const message =
        err instanceof AxiosError ? err.response?.data?.message : undefined;
      setError(message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0B1340] flex-col px-16 py-12 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />

        {/* Logo */}
        <span className="relative z-10 font-bold text-lg text-white">
          GhadiHours
        </span>

        <div className="relative z-10 flex-1 flex flex-col justify-center text-left max-w-sm mx-auto">
          {/* Watch visual */}
          <div className="mb-10 flex justify-center">
            <WatchPhoto size="md" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">
            Built for the life you live.
          </h2>

          <div className="flex flex-col gap-3 mt-4 text-left">
            {FEATURES.map(({ icon: Icon, label }) => (
              <p
                key={label}
                className="flex items-center gap-2 text-gray-400 text-sm"
              >
                <Icon size={16} className="text-blue-400 shrink-0" />
                {label}
              </p>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-gray-500 text-xs">
          © 2024 Ghadi PRECISION INSTRUMENTS.
        </p>
      </div>

      {/* Right — form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <span className="font-bold text-lg text-gray-900">
              GhadiHours
            </span>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-200 mb-8">
            <button
              type="button"
              className="text-sm font-semibold text-blue-500 pb-3 border-b-2 border-blue-500"
            >
              Login
            </button>
            <Link
              href="/register"
              className="text-sm font-medium text-gray-400 hover:text-gray-600 pb-3"
            >
              Create account
            </Link>
          </div>

          {/* Registered successfully */}
          {registered && !error && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-6">
              Account created — please sign in.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-2">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full h-13 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold tracking-wide text-gray-500">
                  PASSWORD
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full h-13 border border-gray-200 rounded-xl px-4 pr-12 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Guest checkout — Hick's Law: always visible */}
          <button
            onClick={handleGuest}
            disabled={loading}
            className="w-full h-13 flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-blue-500 text-gray-700 hover:text-blue-500 rounded-xl font-semibold text-sm transition-colors"
          >
            <UserRound size={16} />
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}