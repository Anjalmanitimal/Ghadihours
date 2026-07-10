"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Watch } from "lucide-react";
import { registerUser } from "@/lib/api";

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
      const res = await registerUser(
        form.name,
        form.email,
        form.password,
        form.phone
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      router.push("/");
    } catch {
      setError("This email is already registered. Try signing in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0B1340] flex-col items-center justify-center px-16 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Watch size={32} className="text-white" />
          </div>

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
            Join thousands of
            <br />
            <span className="text-blue-400">healthier people.</span>
          </h2>

          <div className="flex flex-col gap-3 mt-8 text-left">
            {[
              "✓  Free shipping on every order",
              "✓  1 year warranty included",
              "✓  30-day hassle-free returns",
              "✓  Secure checkout guaranteed",
            ].map((item) => (
              <p key={item} className="text-gray-400 text-sm">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="font-bold text-lg text-gray-900">Kada</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h1>
          

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full name
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
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

              {/* Password strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passStrength.strength
                            ? passStrength.color
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Password strength:{" "}
                    <span className="font-medium">{passStrength.label}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                required
                className="w-full h-13 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

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
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}