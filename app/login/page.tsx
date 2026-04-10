/* eslint-disable @next/next/no-img-element */
"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import HomePage from "@/app/page"; 


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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2.5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          <span>⚠</span> {error}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Username or Email Address"
            className="w-full rounded-md border border-gray-200 bg-[#F4F7FF] py-3 px-4 text-sm text-gray-800 placeholder-gray-500 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-md border border-gray-200 bg-[#F4F7FF] py-3 pl-4 pr-12 text-sm text-gray-800 placeholder-gray-500 font-medium outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
          />
         <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-gray-700 transition"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Remember Me */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="sr-only" />
          <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition ${remember ? "bg-violet-600 border-violet-600" : "border-white/20 bg-white/5"}`}>
            {remember && <span className="text-white text-[10px] font-bold">✓</span>}
          </div>
        </div>
        <span className="text-sm text-slate-400 group-hover:text-slate-300 transition">Remember me for 30 days</span>
      </label>

      <button type="submit" disabled={isLoading}
        className="w-full rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Signing in...
          </span>
        ) : "Sign In →"}
      </button>

      <p className="text-center text-[13px] text-gray-500 mt-6 pt-2">
        Don&apos;t have a Getreviews.buzz account?{" "}
        <Link href="/register" className="font-bold text-black underline">
          Register Now.
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const handleBackdropClick = () => {
    router.push("/");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-violet-950 to-indigo-950" />
        <div className="absolute -top-32 -left-32 h-125 w-125 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-125 w-125 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-800/20 blur-3xl" />
        <div className="absolute inset-0 backdrop-blur-sm" />
        <div className="absolute top-16 left-10 hidden lg:block opacity-20 blur-sm">
          <div className="rounded-2xl bg-white/10 border border-white/10 p-5 w-52">
            <div className="flex gap-1 mb-2">{[1,2,3,4,5].map(i=><span key={i} className="text-amber-400 text-sm">★</span>)}</div>
            <p className="text-xs text-white">&quot;Amazing service! My Google rating jumped overnight.&quot;</p>
            <p className="text-violet-300 text-[10px] mt-2">— James R.</p>
          </div>
        </div>
        <div className="absolute bottom-24 right-10 hidden lg:block opacity-20 blur-sm">
          <div className="rounded-2xl bg-white/10 border border-white/10 p-5 w-52">
            <div className="text-2xl font-bold text-white mb-1">50,000+</div>
            <p className="text-violet-300 text-xs">Reviews Delivered</p>
          </div>
        </div>
      </div>

      <div 
        className="fixed inset-0 z-50 font-sans flex flex-col bg-black/60 backdrop-blur-[2px] cursor-pointer overflow-y-auto"
        onClick={handleBackdropClick}
      >
        <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-12 min-h-full">
          
          <div 
            className="w-full max-w-[440px] rounded-xl bg-white shadow-2xl px-8 py-10 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-6">
              <Link href="/" className="inline-block">
                <img
                  src="https://getreviews.buzz/storage/app/blog/kSoP1QwwRTAIZ7Z8G8KOwstnQCGKrnP0e2ludxw7.png"
                  alt="GetReviews.Buzz"
                  className="h-16 w-auto object-contain"
                />
              </Link>
            </div>

            <h1 className="text-[17px] font-bold text-black mb-5">Log in</h1>

            <Suspense fallback={<div className="h-10 animate-pulse rounded-md bg-gray-100" />}>
              <LoginForm />
            </Suspense>
          </div>
        </div>

        <div className="relative z-10 text-center pb-8 px-4 cursor-default -mt-[80px]"  onClick={(e) => e.stopPropagation()}>
          <p className="text-xs text-white">
            By signing up, you agree to the <Link href="/terms" className="underline hover:text-gray-300">Terms of Service.</Link>
            <br />
            ©2026 - Get Reviews Buzz. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}