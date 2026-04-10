/* eslint-disable @next/next/no-img-element */
"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
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
      router.replace(callbackUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/20 px-4 py-3 text-sm text-red-300">
          <span>⚠</span> {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-300">
          Email Address
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">✉</span>
          <input
            type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/10 bg-white/10 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-widest text-slate-300">Password</label>
          <Link href="#" className="text-xs text-violet-400 hover:text-violet-300 transition">Forgot password?</Link>
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
          <input
            type={showPassword ? "text" : "password"} required value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-white/10 bg-white/10 py-3 pl-10 pr-14 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 transition">
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Remember Me */}
      <label className="flex cursor-pointer items-center gap-3 group">
        <div
          onClick={() => setRemember(!remember)}
          className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition ${remember ? "border-violet-600 bg-violet-600" : "border-white/20 bg-white/5"}`}
        >
          {remember && <span className="text-[10px] font-bold text-white">✓</span>}
        </div>
        <span className="text-sm text-slate-400 group-hover:text-slate-300 transition">Remember me for 30 days</span>
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        style={{ background: "linear-gradient(to right, #7c3aed, #4f46e5)" }}
        className="w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Signing in...
          </span>
        ) : "Sign In →"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(135deg, #020617, #2e1065, #1e1b4b)" }}>
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute inset-0 backdrop-blur-sm" />

        {/* Floating cards */}
        <div className="absolute left-10 top-16 hidden opacity-20 blur-sm lg:block">
          <div className="w-52 rounded-2xl border border-white/10 bg-white/10 p-5">
            <div className="mb-2 flex gap-1">{[1,2,3,4,5].map(i=><span key={i} className="text-sm text-amber-400">★</span>)}</div>
            <p className="text-xs text-white">&quot;Amazing service! My Google rating jumped overnight.&quot;</p>
            <p className="mt-2 text-[10px] text-violet-300">— James R.</p>
          </div>
        </div>
        <div className="absolute bottom-24 right-10 hidden opacity-20 blur-sm lg:block">
          <div className="w-52 rounded-2xl border border-white/10 bg-white/10 p-5">
            <div className="mb-1 text-2xl font-bold text-white">50,000+</div>
            <p className="text-xs text-violet-300">Reviews Delivered</p>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center justify-center">
              <img
                src="https://getreviews.buzz/storage/app/blog/kSoP1QwwRTAIZ7Z8G8KOwstnQCGKrnP0e2ludxw7.png"
                alt="GetReviews.Buzz"
                style={{ width: "200px", height: "auto" }}
              />
            </Link>
            <p className="mt-3 text-sm text-slate-400">Sign in to your account</p>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <Suspense fallback={<div className="h-10 animate-pulse rounded-xl bg-white/5" />}>
              <LoginForm />
            </Suspense>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-slate-500">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <p className="text-center text-sm text-slate-400">
              Don&apos;t have an account?{" "}
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
