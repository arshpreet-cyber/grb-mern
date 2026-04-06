"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", { email, password, redirect: false });

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      setIsLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* ── Blurred Homepage Background ── */}
      <div className="absolute inset-0 z-0">
        {/* Mimics the homepage hero gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-950" />
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-violet-800/20 blur-3xl" />

        {/* Fake blurred page content for depth */}
        <div className="absolute inset-0 backdrop-blur-sm" />

        {/* Floating decorative cards */}
        <div className="absolute top-16 left-10 hidden lg:block opacity-20 blur-sm">
          <div className="rounded-2xl bg-white/10 border border-white/10 p-5 w-52">
            <div className="flex gap-1 mb-2">{[1,2,3,4,5].map(i=><span key={i} className="text-amber-400 text-sm">★</span>)}</div>
            <p className="text-white text-xs">"Amazing service! My Google rating jumped overnight."</p>
            <p className="text-violet-300 text-[10px] mt-2">— James R.</p>
          </div>
        </div>
        <div className="absolute bottom-24 right-10 hidden lg:block opacity-20 blur-sm">
          <div className="rounded-2xl bg-white/10 border border-white/10 p-5 w-52">
            <div className="text-2xl font-bold text-white mb-1">50,000+</div>
            <p className="text-violet-300 text-xs">Reviews Delivered</p>
          </div>
        </div>
        <div className="absolute top-1/3 right-16 hidden xl:block opacity-20 blur-sm">
          <div className="rounded-2xl bg-white/10 border border-white/10 p-4 w-44">
            <div className="text-2xl font-bold text-white mb-1">98%</div>
            <p className="text-violet-300 text-xs">Satisfaction Rate</p>
          </div>
        </div>
      </div>

      {/* ── Login Card ── */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 justify-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-bold text-lg shadow-xl">
                G
              </div>
              <span className="text-2xl font-extrabold text-white">
                GetReviews<span className="text-violet-400">.buzz</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-400">Sign in to your account</p>
          </div>

          {/* Glass Card */}
          <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl p-8">

            {error && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-red-500/20 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                <span className="text-base">⚠</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">✉</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/10 py-3.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-300">
                    Password
                  </label>
                  <Link href="#" className="text-xs text-violet-400 hover:text-violet-300 transition">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/10 py-3.5 pl-10 pr-12 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition text-xs"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In →"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-500">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <p className="text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link href="/register" className="font-semibold text-violet-400 hover:text-violet-300 transition">
                Create one free →
              </Link>
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex items-center justify-center gap-5 text-xs text-slate-500">
            <span>🔒 SSL Secured</span>
            <span>✅ Trusted by 12k+</span>
            <span>⭐ 98% Satisfaction</span>
          </div>
        </div>
      </div>
    </div>
  );
}
