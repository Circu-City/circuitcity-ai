"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bot, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }
      toast.success("Welcome back!");
      // Route admin users to admin dashboard
      if (data.user?.role === "admin") {
        router.push("/admin");
      } else if (!data.onboarded) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex w-1/2 bg-dark-navy text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-lemon-gradient opacity-10 blur-[120px] rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-lemon-gradient rounded-xl flex items-center justify-center shadow-lemon">
              <Bot className="text-dark-navy w-7 h-7" />
            </div>
            <span className="text-2xl font-bold">CircuitCity<span className="text-lemon-green">AI</span></span>
          </div>
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-6 leading-tight">Welcome back to your AI-powered store</h2>
            <p className="text-gray-400 text-lg">Monitor conversations, track analytics, and manage your AI assistant all in one place.</p>
          </div>
        </div>
        <div className="relative z-10 text-sm text-gray-500">
          © 2026 CircuitCity AI. All rights reserved.
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-lemon-gradient rounded-xl flex items-center justify-center">
              <Bot className="text-dark-navy w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-dark-navy">CircuitCity<span className="text-lemon-green">AI</span></span>
          </div>

          <h1 className="text-3xl font-bold text-dark-navy mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-8">Log in to your account to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold bg-lemon-gradient text-dark-navy hover:opacity-90 shadow-lemon transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link href="/signup" className="text-lemon-green font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}