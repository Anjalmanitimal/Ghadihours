"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Gem,
  BatteryCharging,
} from "lucide-react";
import { AxiosError } from "axios";
import { registerUser } from "@/lib/api";
import WatchPhoto from "@/components/ui/WatchPhoto";

const FEATURES = [
  { icon: ShieldCheck, label: "Precision biometric tracking" },
  { icon: Gem, label: "Unmatched titanium durability" },
  { icon: BatteryCharging, label: "Up to 14 days of battery life" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { strength: 0, label: "", color: "" };
    if (pass.length < 6) return { strength: 1, label: "Weak", color: "bg-red-400" };
    if (pass.length < 10) return { strength: 2, label: "Fair", color: "bg-yellow-400" };
    return { strength: 3, label: "Strong", color: "bg-green-500" };
  };

  const passStrength = getPasswordStrength(form.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerUser(form.name, form.email, form.password, form.phone);
      router.push("/login?registered=1");
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message
          : undefined;
      setError(message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0B1340] flex-col px-16 py-12 relative overflow-hidden">
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

      {/* Right — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <span className="font-bold text-lg text-gray-900">
              GhadiHours
            </span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            {/* Full name */}
            <div>
              <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-2">
                FULL NAME
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Anjal Mani Timalsina"
                required
                className="w-full h-13 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-2">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full h-13 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Phone
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="98XXXXXXXX"
                className="w-full h-13 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div> */}

            {/* Password + Confirm */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-2">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    required
                    className="w-full h-13 border border-gray-200 rounded-xl px-4 pr-10 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-2">
                  CONFIRM
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  required
                  className="w-full h-13 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Password strength bar */}
            {form.password.length > 0 && (
              <div className="-mt-3">
                <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${passStrength.color}`}
                    style={{ width: `${(passStrength.strength / 3) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    Password strength
                  </span>
                  <span className="text-xs font-medium text-gray-700">
                    {passStrength.label}
                  </span>
                </div>
              </div>
            )}

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                className="mt-1 accent-blue-500"
              />
              <p className="text-sm text-gray-500">
                I agree to the{" "}
                <span className="text-blue-500 cursor-pointer">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-blue-500 cursor-pointer">
                  Privacy Policy
                </span>
                .
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-500 font-semibold hover:text-blue-600"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}