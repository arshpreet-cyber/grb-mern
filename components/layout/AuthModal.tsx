"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { countryCodes } from "@/lib/constants/countryCodes";

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
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
    const res = await signIn("credentials", { email: email.trim().toLowerCase(), password, redirect: false });
    if (res?.error) { setError("Invalid email or password. Please try again."); setIsLoading(false); }
    else { router.replace(callbackUrl); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2.5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          <span>⚠</span> {error}
        </div>
      )}
      <div className="space-y-3">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address"
          className="w-full rounded-md border border-gray-200 bg-[#F4F7FF] py-3 px-4 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" />
        <div className="relative">
          <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            className="w-full rounded-md border border-gray-200 bg-[#F4F7FF] py-3 pl-4 pr-12 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-gray-700 transition">
            {showPassword
              ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            }
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between text-[13px] py-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-300" />
          <span className="text-gray-700">Remember password</span>
        </label>
        <Link href="#" className="text-black underline hover:text-gray-600 transition">Forgot password?</Link>
      </div>
      <button type="submit" disabled={isLoading}
        className="w-full rounded-md bg-[#FFCE2E] hover:bg-[#EBB81E] py-3 text-[15px] font-bold text-black transition disabled:opacity-50">
        {isLoading ? "Signing in..." : "Log In"}
      </button>
      <div className="flex items-center gap-4 my-4"><div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-gray-400">Or</span><div className="flex-1 h-px bg-gray-200" /></div>
      <button type="button" className="w-full flex items-center justify-center gap-3 rounded-md border border-gray-200 bg-white py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition">
        <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
        Sign in with Google
      </button>
      <p className="text-center text-[13px] text-gray-500 mt-4">
        Don&apos;t have an account?{" "}
        <button type="button" onClick={onSwitch} className="font-bold text-black underline">Register Now.</button>
      </p>
    </form>
  );
}

type Step = "form" | "phone-otp" | "email-otp";

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputs = Array.from({ length: 6 });
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  const handleChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const digits = value.split("");
    digits[i] = v.slice(-1);
    const next = digits.join("").padEnd(6, "").slice(0, 6);
    onChange(next.trimEnd());
    if (v && i < 5) refs[i + 1].current?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[i] && i > 0) refs[i - 1].current?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) { onChange(pasted); refs[Math.min(pasted.length, 5)].current?.focus(); }
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center">
      {inputs.map((_, i) => (
        <input key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-11 h-12 text-center text-lg font-bold rounded-md border border-gray-200 bg-[#F4F7FF] outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" />
      ))}
    </div>
  );
}

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({ name: "", username: "", phone: "", password: "" });
  const [countryCode, setCountryCode] = useState("+91");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fullPhone = `${countryCode}${form.phone}`;
  const selectedCountry = countryCodes.find((c) => c.code === countryCode) || countryCodes[0];
  const filtered = countryCodes.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) { setDropdownOpen(false); setSearch(""); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const setField = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // Step 1: submit form → send phone OTP
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!form.phone) { setError("Phone number is required."); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/twilio/send-phone-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to send OTP."); setIsLoading(false); return; }
      setStep("phone-otp");
      setResendTimer(60);
    } catch { setError("Something went wrong."); }
    setIsLoading(false);
  };

  // Step 2: verify phone OTP → send email OTP
  const handlePhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneOtp.length !== 6) { setError("Enter the 6-digit code."); return; }
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/twilio/verify-phone-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone, code: phoneOtp }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Invalid OTP."); setIsLoading(false); return; }

      // Send email OTP
      const eRes = await fetch("/api/twilio/send-email-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.username }),
      });
      const eData = await eRes.json();
      if (!eRes.ok) { setError(eData.error || "Failed to send email OTP."); setIsLoading(false); return; }
      setStep("email-otp");
      setResendTimer(60);
    } catch { setError("Something went wrong."); }
    setIsLoading(false);
  };

  // Step 3: verify email OTP → create account → sign in
  const handleEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailOtp.length !== 6) { setError("Enter the 6-digit code."); return; }
    setError("");
    setIsLoading(true);
    try {
      // Verify email OTP
      const vRes = await fetch("/api/twilio/verify-email-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.username, code: emailOtp }),
      });
      const vData = await vRes.json();
      if (!vRes.ok) { setError(vData.error || "Invalid code."); setIsLoading(false); return; }

      // Create account
      const rRes = await fetch("/api/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.username, password: form.password, phone: fullPhone }),
      });
      const rData = await rRes.json();
      if (!rRes.ok) { setError(rData.error || "Registration failed."); setIsLoading(false); return; }

      // Auto sign in
      const { signIn } = await import("next-auth/react");
      const res = await signIn("credentials", { email: form.username, password: form.password, redirect: false });
      if (res?.error) { setError("Account created. Please log in."); setIsLoading(false); onSwitch(); return; }
      router.replace("/");
    } catch { setError("Something went wrong."); }
    setIsLoading(false);
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError("");
    setIsLoading(true);
    try {
      const endpoint = step === "phone-otp" ? "/api/twilio/send-phone-otp" : "/api/twilio/send-email-otp";
      const body = step === "phone-otp" ? { phone: fullPhone } : { email: form.username };
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) setResendTimer(60);
      else { const d = await res.json(); setError(d.error || "Failed to resend."); }
    } catch { setError("Failed to resend."); }
    setIsLoading(false);
  };

  // ── Phone OTP step ──
  if (step === "phone-otp") {
    return (
      <form onSubmit={handlePhoneOtp} className="space-y-5">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-yellow-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-3 3h3" /></svg>
          </div>
          <h3 className="text-[16px] font-bold text-gray-900">Verify your phone</h3>
          <p className="text-[13px] text-gray-500 mt-1">Enter the 6-digit code sent to <span className="font-semibold text-gray-700">{fullPhone}</span></p>
        </div>
        {error && <div className="flex items-center gap-2.5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"><span>⚠</span> {error}</div>}
        <OtpInput value={phoneOtp} onChange={setPhoneOtp} />
        <button type="submit" disabled={isLoading || phoneOtp.length !== 6}
          className="w-full rounded-md bg-[#FFCE2E] hover:bg-[#EBB81E] py-3 text-[15px] font-bold text-black transition disabled:opacity-50">
          {isLoading ? "Verifying..." : "Verify Phone"}
        </button>
        <p className="text-center text-[13px] text-gray-500">
          Didn&apos;t receive it?{" "}
          {resendTimer > 0
            ? <span className="text-gray-400">Resend in {resendTimer}s</span>
            : <button type="button" onClick={handleResend} className="font-bold text-black underline">Resend</button>}
        </p>
        <p className="text-center text-[13px] text-gray-500">
          <button type="button" onClick={() => { setStep("form"); setPhoneOtp(""); setError(""); }} className="underline text-gray-500">← Back</button>
        </p>
      </form>
    );
  }

  // ── Email OTP step ──
  if (step === "email-otp") {
    return (
      <form onSubmit={handleEmailOtp} className="space-y-5">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-yellow-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
          </div>
          <h3 className="text-[16px] font-bold text-gray-900">Verify your email</h3>
          <p className="text-[13px] text-gray-500 mt-1">Enter the 6-digit code sent to <span className="font-semibold text-gray-700">{form.username}</span></p>
        </div>
        {error && <div className="flex items-center gap-2.5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"><span>⚠</span> {error}</div>}
        <OtpInput value={emailOtp} onChange={setEmailOtp} />
        <button type="submit" disabled={isLoading || emailOtp.length !== 6}
          className="w-full rounded-md bg-[#FFCE2E] hover:bg-[#EBB81E] py-3 text-[15px] font-bold text-black transition disabled:opacity-50">
          {isLoading ? "Verifying..." : "Verify Email & Create Account"}
        </button>
        <p className="text-center text-[13px] text-gray-500">
          Didn&apos;t receive it?{" "}
          {resendTimer > 0
            ? <span className="text-gray-400">Resend in {resendTimer}s</span>
            : <button type="button" onClick={handleResend} className="font-bold text-black underline">Resend</button>}
        </p>
      </form>
    );
  }

  // ── Registration form (step 1) ──
  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {error && <div className="flex items-center gap-2.5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"><span>⚠</span> {error}</div>}
      <div className="space-y-3">
        <input type="text" required value={form.name} onChange={setField("name")} placeholder="Full Name"
          className="w-full rounded-md border border-gray-200 bg-[#F4F7FF] py-3 px-4 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" />
        <input type="email" required value={form.username} onChange={setField("username")} placeholder="Email Address"
          className="w-full rounded-md border border-gray-200 bg-[#F4F7FF] py-3 px-4 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" />
        <div className="flex gap-2">
          <div className="relative" ref={dropdownRef}>
            <button type="button" onClick={() => { setDropdownOpen(!dropdownOpen); setSearch(""); }}
              className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-3 text-sm hover:border-yellow-400 transition whitespace-nowrap">
              <img src={`https://flagcdn.com/w20/${selectedCountry.iso}.png`} alt={selectedCountry.name} width={20} height={15} className="rounded-sm" />
              <span className="font-medium text-gray-700">{selectedCountry.code}</span>
              <svg className={`w-3 h-3 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 z-[9999] mt-1 w-72 rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
                <div className="p-2.5 border-b border-gray-100 bg-gray-50">
                  <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Search country or code..."
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-yellow-400 transition" />
                </div>
                <ul className="max-h-52 overflow-y-auto">
                  {filtered.length === 0 ? <li className="px-4 py-6 text-center text-xs text-gray-400">No countries found</li>
                    : filtered.map((c, i) => (
                      <li key={`${c.code}-${i}`}>
                        <button type="button" onClick={() => { setCountryCode(c.code); setDropdownOpen(false); setSearch(""); }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-yellow-50 transition text-left ${countryCode === c.code ? "bg-yellow-50" : ""}`}>
                          <img src={`https://flagcdn.com/w20/${c.iso}.png`} alt={c.name} width={20} height={15} className="rounded-sm shrink-0" />
                          <span className="flex-1 text-gray-800 text-xs">{c.name}</span>
                          <span className="text-gray-400 text-xs font-medium">{c.code}</span>
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
          <input type="tel" required value={form.phone} onChange={setField("phone")} placeholder="Phone Number"
            className="flex-1 rounded-md border border-gray-200 bg-[#F4F7FF] px-4 py-3 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" />
        </div>
        <div className="relative">
          <input type={showPassword ? "text" : "password"} required value={form.password} onChange={setField("password")} placeholder="Password (min. 8 characters)"
            className="w-full rounded-md border border-gray-200 bg-[#F4F7FF] py-3 pl-4 pr-12 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-gray-700 transition">
            {showPassword
              ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            }
          </button>
        </div>
      </div>
      <button type="submit" disabled={isLoading}
        className="w-full rounded-md bg-[#FFCE2E] hover:bg-[#EBB81E] py-3 text-[15px] font-bold text-black transition disabled:opacity-50">
        {isLoading ? "Sending OTP..." : "Continue"}
      </button>
      <div className="flex items-center gap-4 my-4"><div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-gray-400">Or</span><div className="flex-1 h-px bg-gray-200" /></div>
      <button type="button" className="w-full flex items-center justify-center gap-3 rounded-md border border-gray-200 bg-white py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition">
        <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
        Sign up with Google
      </button>
      <p className="text-center text-[13px] text-gray-500 mt-4">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="font-bold text-black underline">Log In.</button>
      </p>
    </form>
  );
}

function AuthModalInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isLogin = pathname === "/login";
  const isRegister = pathname === "/register";
  const isOpen = isLogin || isRegister;
  const [tab, setTab] = useState<"login" | "register">(
    isRegister || searchParams.get("tab") === "register" ? "register" : "login"
  );

  useEffect(() => {
    if (isRegister) setTab("register");
    else if (isLogin) setTab("login");
  }, [pathname, isLogin, isRegister]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-[3px] overflow-y-auto font-sans cursor-pointer"
      onClick={() => router.push("/")}
    >
      <div
        className="relative w-full max-w-[440px] mx-4 my-8 rounded-xl bg-white shadow-2xl px-8 py-8 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={() => router.push("/")} className="absolute top-4 right-4 text-gray-400 hover:text-black transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="inline-block">
            <img src="https://getreviews.buzz/storage/app/blog/kSoP1QwwRTAIZ7Z8G8KOwstnQCGKrnP0e2ludxw7.png"
              alt="GetReviews.Buzz" className="h-14 w-auto object-contain" />
          </Link>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button onClick={() => { setTab("login"); router.replace("/login"); }}
            className={`flex-1 py-2 text-[14px] font-semibold rounded-md transition-all ${tab === "login" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            Log In
          </button>
          <button onClick={() => { setTab("register"); router.replace("/register"); }}
            className={`flex-1 py-2 text-[14px] font-semibold rounded-md transition-all ${tab === "register" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            Register
          </button>
        </div>

        {tab === "login"
          ? <LoginForm onSwitch={() => { setTab("register"); router.replace("/register"); }} />
          : <RegisterForm onSwitch={() => { setTab("login"); router.replace("/login"); }} />
        }
      </div>
    </div>
  );
}

export default function AuthModal() {
  return (
    <Suspense fallback={null}>
      <AuthModalInner />
    </Suspense>
  );
}
