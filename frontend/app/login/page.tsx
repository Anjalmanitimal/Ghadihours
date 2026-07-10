"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Watch } from "lucide-react";
import { loginUser, guestLogin } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(email, password);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      router.push("/");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
      const res = await guestLogin(email || "guest@kada.com", "Guest");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      router.push("/checkout");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0B1340] flex-col items-center justify-center px-16 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Watch size={32} className="text-white" />
          </div>

          {/* Watch visual */}
          <div className="w-48 h-48 mx-auto mb-10 relative">
            <div className="w-full h-full rounded-[40px] bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center shadow-2xl">
              <div className="w-32 h-32 rounded-[28px] bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white text-xl font-light">10:09</div>
                  <div className="text-gray-400 text-xs mt-1">KADA</div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 -z-10 bg-blue-500/20 rounded-full blur-3xl scale-150" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">
            Built for the life you live
           
          </h2>

          <div className="flex flex-col gap-3 mt-8 text-left">
            {[
              "  Precision biometric tracking",
              "  Unmatched titanium durability",
              "  Up to 14 days of battery life",
              
            ].map((item) => (
              <p key={item} className="text-gray-400 text-sm">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="font-bold text-lg text-gray-900">Kada</span>
          </div>

          {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1> */}
          <p className="text-gray-500 mb-8">
            Login
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
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
                <label className="text-sm font-medium text-gray-700">
                  Password
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
            className="w-full h-13 border-2 border-gray-200 hover:border-blue-500 text-gray-700 hover:text-blue-500 rounded-xl font-semibold text-sm transition-colors"
          >
            Continue as Guest
          </button>

          {/* Register link */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-blue-500 font-semibold hover:text-blue-600"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}