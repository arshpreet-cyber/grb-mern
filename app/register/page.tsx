/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [countryCode, setCountryCode] = useState("+1");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
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
          email: form.email,
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

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-yellow-400", "bg-emerald-500"][strength];

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* ── Blurred Homepage Background ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-violet-950 to-indigo-950" />
        <div className="absolute -top-32 -left-32 h-125 w-125 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-125 w-125 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 h-100 w-100 rounded-full bg-cyan-600/10 blur-3xl" />

        {/* Floating decorative elements */}
        <div className="absolute top-12 right-12 hidden lg:block opacity-20 blur-sm">
          <div className="rounded-2xl bg-white/10 border border-white/10 p-5 w-52">
            <div className="text-2xl font-bold text-white mb-1">12,000+</div>
            <p className="text-violet-300 text-xs">Happy Clients</p>
          </div>
        </div>
        <div className="absolute bottom-20 left-10 hidden lg:block opacity-20 blur-sm">
          <div className="rounded-2xl bg-white/10 border border-white/10 p-5 w-52">
            <div className="flex gap-1 mb-2">{[1,2,3,4,5].map(i=><span key={i} className="text-amber-400 text-sm">★</span>)}</div>
            <p className="text-xs text-white">&quot;Best investment for my business!&quot;</p>
            <p className="text-violet-300 text-[10px] mt-2">— Sarah M.</p>
          </div>
        </div>

        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {/* ── Register Card ── */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center">
              <img
                src="https://getreviews.buzz/storage/app/blog/kSoP1QwwRTAIZ7Z8G8KOwstnQCGKrnP0e2ludxw7.png"
                alt="GetReviews.Buzz"
                style={{ width: "200px", height: "auto" }}
              />
            </Link>
            <p className="mt-3 text-sm text-slate-400">Create your free account today</p>
          </div>

          {/* Glass Card */}
          <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl p-8">

            {error && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-red-500/20 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                <span className="text-base">⚠</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">👤</span>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={set("name")}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-white/10 bg-white/10 py-3.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition"
                  />
                </div>
              </div>

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
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/10 py-3.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-300 mb-2">
                  Mobile Number <span className="text-slate-500 normal-case tracking-normal font-normal">(optional)</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="rounded-xl border border-white/10 bg-white/10 py-3.5 px-3 text-sm text-white outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition appearance-none cursor-pointer"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">📱</span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="123 456 7890"
                      className="w-full rounded-xl border border-white/10 bg-white/10 py-3.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={set("password")}
                    placeholder="Min. 8 characters"
                    className="w-full rounded-xl border border-white/10 bg-white/10 py-3.5 pl-10 pr-14 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition text-xs"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {/* Strength bar */}
                {form.password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex flex-1 gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-white/10"}`}
                        />
                      ))}
                    </div>
                    <span className={`text-[10px] font-semibold ${["", "text-red-400", "text-amber-400", "text-yellow-400", "text-emerald-400"][strength]}`}>
                      {strengthLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.confirm}
                    onChange={set("confirm")}
                    placeholder="Re-enter password"
                    className={`w-full rounded-xl border py-3.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 transition bg-white/10 ${
                      form.confirm && form.confirm !== form.password
                        ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                        : "border-white/10 focus:border-violet-400 focus:ring-violet-400/20"
                    }`}
                  />
                  {form.confirm && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">
                      {form.confirm === form.password ? "✅" : "❌"}
                    </span>
                  )}
                </div>
              </div>

              {/* Terms */}
              <p className="text-xs text-slate-500 leading-relaxed">
                By creating an account, you agree to our{" "}
                <Link href="#" className="text-violet-400 hover:text-violet-300">Terms of Service</Link>{" "}
                and{" "}
                <Link href="#" className="text-violet-400 hover:text-violet-300">Privacy Policy</Link>.
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account...
                  </span>
                ) : (
                  "Create Free Account →"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-500">already have an account?</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <p className="text-center text-sm text-slate-400">
              <Link href="/login" className="font-semibold text-violet-400 hover:text-violet-300 transition">
                Sign in instead →
              </Link>
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex items-center justify-center gap-5 text-xs text-slate-500">
            <span>🔒 SSL Secured</span>
            <span>✅ Free to Join</span>
            <span>⭐ No Credit Card</span>
          </div>
        </div>
      </div>
    </div>
  );
}
