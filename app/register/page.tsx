/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HomePage from "@/app/page";

const countryCodes = [
  { code: "+1", flag: "🇺🇸", name: "US" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+91", flag: "🇮🇳", name: "IN" },
  { code: "+61", flag: "🇦🇺", name: "AU" },
  { code: "+49", flag: "🇩🇪", name: "DE" },
  { code: "+33", flag: "🇫🇷", name: "FR" },
  { code: "+971", flag: "🇦🇪", name: "AE" },
  { code: "+92", flag: "🇵🇰", name: "PK" },
  { code: "+86", flag: "🇨🇳", name: "CN" },
  { code: "+81", flag: "🇯🇵", name: "JP" },
];

function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",
  });
  const [countryCode, setCountryCode] = useState("+1");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setField = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.username,
          password: form.password,
          phone: form.phone ? `${countryCode}${form.phone}` : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setIsLoading(false);
      } else {
        router.push("/login");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2.5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          <span>⚠</span> {error}
        </div>
      )}

      <div className="space-y-3">
        <input
          type="text"
          required
          value={form.name}
          onChange={setField("name")}
          placeholder="Full Name"
          className="w-full rounded-md border border-gray-200 bg-[#F4F7FF] py-3 px-4 text-sm text-gray-800 placeholder-gray-500 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
        />
        <input
          type="email"
          required
          value={form.username}
          onChange={setField("username")}
          placeholder="Email Address"
          className="w-full rounded-md border border-gray-200 bg-[#F4F7FF] py-3 px-4 text-sm text-gray-800 placeholder-gray-500 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
        />

        <div className="flex gap-2">
          <div className="relative flex w-[110px] items-center rounded-md border border-gray-200 bg-white px-3 py-3">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full appearance-none bg-transparent text-sm text-gray-900 outline-none cursor-pointer pr-4"
            >
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 text-[10px] text-gray-500">▼</span>
          </div>
          <input
            type="tel"
            value={form.phone}
            onChange={setField("phone")}
            placeholder="Phone Number"
            className="flex-1 rounded-md border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={form.password}
            onChange={setField("password")}
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

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-[#FFCE2E] hover:bg-[#EBB81E] py-3 text-[15px] font-bold text-black transition mt-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Signing up..." : "Sign Up"}
      </button>

       <div className="flex items-center gap-4 my-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">Or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

     {/* Google Button */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 rounded-md border border-gray-200 bg-white py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Sign in with Google
      </button>


      <p className="text-center text-[13px] text-gray-500 mt-4 pt-2">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-black underline">
          Log In.
        </Link>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const handleBackdropClick = () => {
    router.push("/");
  };

  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden">
        <HomePage />
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

            <h1 className="text-[17px] font-bold text-black mb-5">Create Account</h1>

            <Suspense fallback={<div className="h-10 animate-pulse rounded-md bg-gray-100" />}>
              <RegisterForm />
            </Suspense>
          </div>
        </div>

        <div
          className="relative z-10 text-center pb-8 px-4 cursor-default -mt-[40px]"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-xs text-white">
            By signing up, you agree to the{" "}
            <Link href="/terms" className="underline hover:text-gray-300">
              Terms of Service.
            </Link>
            <br />
            ©2026 - Get Reviews Buzz. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}