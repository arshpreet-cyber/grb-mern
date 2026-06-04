"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Wrapper from "@/components/ui/Wrapper";
import { X, Info, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import products from "@/lib/constants/products";
import SimilarProducts from "@/components/sections/SimilarProducts";
import { useState, useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import { countryCodes } from "@/lib/constants/countryCodes";

const EYE_OPEN = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const EYE_OFF = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>;

function OtpBoxes({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const handleChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const digits = value.padEnd(6, " ").split("");
    digits[i] = v.slice(-1);
    const next = digits.join("").trimEnd();
    onChange(next);
    if (v && i < 5) refs[i + 1].current?.focus();
  };
  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[i] && i > 0) refs[i - 1].current?.focus();
  };
  const handlePaste = (e: React.ClipboardEvent) => {
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (p) { onChange(p); refs[Math.min(p.length, 5)].current?.focus(); }
    e.preventDefault();
  };
  return (
    <div className="flex gap-2 justify-center">
      {refs.map((ref, i) => (
        <input key={i} ref={ref} type="text" inputMode="numeric" maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-10 h-11 text-center text-lg font-bold rounded-md border border-gray-200 bg-[#F4F7FF] outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" />
      ))}
    </div>
  );
}

type RegStep = "form" | "phone-otp" | "email-otp";

function AuthGate() {
  const [tab, setTab] = useState<"login" | "register">("login");

  // Login state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regStep, setRegStep] = useState<RegStep>("form");
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [countryCode, setCountryCode] = useState("+91");
  const [ccOpen, setCcOpen] = useState(false);
  const [ccSearch, setCcSearch] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const ccRef = useRef<HTMLDivElement>(null);

  const fullPhone = `${countryCode}${regForm.phone}`;
  const selectedCC = countryCodes.find(c => c.code === countryCode) || countryCodes[0];
  const filteredCC = countryCodes.filter(c => c.name.toLowerCase().includes(ccSearch.toLowerCase()) || c.code.includes(ccSearch));

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ccRef.current && !ccRef.current.contains(e.target as Node)) { setCcOpen(false); setCcSearch(""); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const switchTab = (t: "login" | "register") => { setTab(t); setLoginError(""); setRegError(""); setRegStep("form"); };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(""); setLoginLoading(true);
    const res = await signIn("credentials", { email: loginForm.email.trim().toLowerCase(), password: loginForm.password, redirect: false });
    if (res?.error) { setLoginError("Invalid email or password."); setLoginLoading(false); }
    else { window.location.reload(); }
  };

  const handleRegForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    if (regForm.password.length < 8) { setRegError("Password must be at least 8 characters."); return; }
    if (!regForm.phone) { setRegError("Phone number is required."); return; }
    setRegLoading(true);
    const res = await fetch("/api/twilio/send-phone-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: fullPhone }) });
    const data = await res.json();
    if (!res.ok) { setRegError(data.error || "Failed to send OTP."); setRegLoading(false); return; }
    setRegStep("phone-otp"); setResendTimer(60); setRegLoading(false);
  };

  const handlePhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneOtp.length !== 6) { setRegError("Enter the 6-digit code."); return; }
    setRegError(""); setRegLoading(true);
    const r1 = await fetch("/api/twilio/verify-phone-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: fullPhone, code: phoneOtp }) });
    if (!r1.ok) { const d = await r1.json(); setRegError(d.error || "Invalid OTP."); setRegLoading(false); return; }
    const r2 = await fetch("/api/twilio/send-email-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: regForm.email }) });
    if (!r2.ok) { const d = await r2.json(); setRegError(d.error || "Failed to send email OTP."); setRegLoading(false); return; }
    setRegStep("email-otp"); setResendTimer(60); setRegLoading(false);
  };

  const handleEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailOtp.length !== 6) { setRegError("Enter the 6-digit code."); return; }
    setRegError(""); setRegLoading(true);
    const v = await fetch("/api/twilio/verify-email-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: regForm.email, code: emailOtp }) });
    if (!v.ok) { const d = await v.json(); setRegError(d.error || "Invalid code."); setRegLoading(false); return; }
    const r = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: regForm.name, email: regForm.email, password: regForm.password, phone: fullPhone }) });
    if (!r.ok) { const d = await r.json(); setRegError(d.error || "Registration failed."); setRegLoading(false); return; }
    const s = await signIn("credentials", { email: regForm.email, password: regForm.password, redirect: false });
    if (s?.error) { setRegError("Account created. Please log in."); setRegLoading(false); switchTab("login"); return; }
    window.location.reload();
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setRegLoading(true);
    const ep = regStep === "phone-otp" ? "/api/twilio/send-phone-otp" : "/api/twilio/send-email-otp";
    const body = regStep === "phone-otp" ? { phone: fullPhone } : { email: regForm.email };
    const res = await fetch(ep, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) setResendTimer(60);
    else { const d = await res.json(); setRegError(d.error || "Failed to resend."); }
    setRegLoading(false);
  };

  const logo = <div className="flex justify-center mb-5"><Link href="/"><img src="https://grb-mern-gilt.vercel.app/icons/logo.png" alt="Get Reviews Buzz" className="h-14 w-auto object-contain" /></Link></div>;
  const tabs = (
    <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
      {(["login", "register"] as const).map(t => (
        <button key={t} onClick={() => switchTab(t)} className={`flex-1 py-2 text-[14px] font-semibold rounded-md transition-all ${tab === t ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          {t === "login" ? "Log In" : "Register"}
        </button>
      ))}
    </div>
  );
  const errBox = (msg: string) => msg ? <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"><span>⚠</span> {msg}</div> : null;

  return (
    <div className="w-full max-w-[420px] rounded-2xl bg-white shadow-2xl px-8 py-8 overflow-y-auto" style={{ minHeight: '520px', maxHeight: '90vh' }}>
      {logo}

      {/* OTP steps don't show main tabs */}
      {(tab === "login" || regStep === "form") && tabs}

      {/* ── LOGIN ── */}
      {tab === "login" && (
        <form onSubmit={handleLogin} className="space-y-3">
          <p className="text-[13px] text-gray-500 text-center -mt-2 mb-2">Sign in to complete your order.</p>
          {errBox(loginError)}
          <input type="email" required value={loginForm.email} onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} placeholder="Email Address"
            className="w-full rounded-md border border-gray-200 bg-[#F4F7FF] py-3 px-4 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" />
          <div className="relative">
            <input type={showLoginPw ? "text" : "password"} required value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} placeholder="Password"
              className="w-full rounded-md border border-gray-200 bg-[#F4F7FF] py-3 pl-4 pr-12 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" />
            <button type="button" onClick={() => setShowLoginPw(!showLoginPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">{showLoginPw ? EYE_OFF : EYE_OPEN}</button>
          </div>
          <button type="submit" disabled={loginLoading} className="w-full rounded-md bg-[#FFCE2E] hover:bg-[#EBB81E] py-3 text-[15px] font-bold text-black transition disabled:opacity-50">
            {loginLoading ? "Signing in..." : "Log In"}
          </button>
          <p className="text-center text-[13px] text-gray-500">Don&apos;t have an account?{" "}<button type="button" onClick={() => switchTab("register")} className="font-bold text-black underline">Register Now.</button></p>
        </form>
      )}

      {/* ── REGISTER: FORM ── */}
      {tab === "register" && regStep === "form" && (
        <form onSubmit={handleRegForm} className="space-y-3">
          <p className="text-[13px] text-gray-500 text-center -mt-2 mb-2">Create an account to place your order.</p>
          {errBox(regError)}
          <input type="text" required value={regForm.name} onChange={e => setRegForm(p => ({ ...p, name: e.target.value }))} placeholder="Full Name"
            className="w-full rounded-md border border-gray-200 bg-[#F4F7FF] py-3 px-4 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" />
          <input type="email" required value={regForm.email} onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))} placeholder="Email Address"
            className="w-full rounded-md border border-gray-200 bg-[#F4F7FF] py-3 px-4 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" />
          <div className="flex gap-2">
            <div className="relative" ref={ccRef}>
              <button type="button" onClick={() => { setCcOpen(!ccOpen); setCcSearch(""); }}
                className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-3 text-sm hover:border-yellow-400 transition whitespace-nowrap">
                <img src={`https://flagcdn.com/w20/${selectedCC.iso}.png`} alt={selectedCC.name} width={20} height={15} className="rounded-sm" />
                <span className="font-medium text-gray-700">{selectedCC.code}</span>
                <svg className={`w-3 h-3 text-gray-400 transition-transform ${ccOpen ? "rotate-180" : ""}`} viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
              {ccOpen && (
                <div className="absolute top-full left-0 z-[9999] mt-1 w-64 rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
                  <div className="p-2 border-b border-gray-100 bg-gray-50">
                    <input autoFocus value={ccSearch} onChange={e => setCcSearch(e.target.value)} placeholder="Search..."
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-yellow-400 transition" />
                  </div>
                  <ul className="max-h-44 overflow-y-auto">
                    {filteredCC.map((c, i) => (
                      <li key={i}>
                        <button type="button" onClick={() => { setCountryCode(c.code); setCcOpen(false); setCcSearch(""); }}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-xs hover:bg-yellow-50 transition text-left ${countryCode === c.code ? "bg-yellow-50" : ""}`}>
                          <img src={`https://flagcdn.com/w20/${c.iso}.png`} alt={c.name} width={20} height={15} className="rounded-sm shrink-0" />
                          <span className="flex-1 text-gray-800">{c.name}</span>
                          <span className="text-gray-400">{c.code}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <input type="tel" required value={regForm.phone} onChange={e => setRegForm(p => ({ ...p, phone: e.target.value }))} placeholder="Phone Number"
              className="flex-1 rounded-md border border-gray-200 bg-[#F4F7FF] px-4 py-3 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" />
          </div>
          <div className="relative">
            <input type={showRegPw ? "text" : "password"} required value={regForm.password} onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))} placeholder="Password (min. 8 characters)"
              className="w-full rounded-md border border-gray-200 bg-[#F4F7FF] py-3 pl-4 pr-12 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" />
            <button type="button" onClick={() => setShowRegPw(!showRegPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">{showRegPw ? EYE_OFF : EYE_OPEN}</button>
          </div>
          <button type="submit" disabled={regLoading} className="w-full rounded-md bg-[#FFCE2E] hover:bg-[#EBB81E] py-3 text-[15px] font-bold text-black transition disabled:opacity-50">
            {regLoading ? "Sending OTP..." : "Continue"}
          </button>
          <p className="text-center text-[13px] text-gray-500">Already have an account?{" "}<button type="button" onClick={() => switchTab("login")} className="font-bold text-black underline">Log In.</button></p>
        </form>
      )}

      {/* ── REGISTER: PHONE OTP ── */}
      {tab === "register" && regStep === "phone-otp" && (
        <form onSubmit={handlePhoneOtp} className="space-y-5">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-yellow-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" /></svg>
            </div>
            <h3 className="text-[15px] font-bold text-gray-900">Verify your phone</h3>
            <p className="text-[12px] text-gray-500 mt-1">Code sent to <span className="font-semibold text-gray-700">{fullPhone}</span></p>
          </div>
          {errBox(regError)}
          <OtpBoxes value={phoneOtp} onChange={setPhoneOtp} />
          <button type="submit" disabled={regLoading || phoneOtp.length !== 6} className="w-full rounded-md bg-[#FFCE2E] hover:bg-[#EBB81E] py-3 text-[15px] font-bold text-black transition disabled:opacity-50">
            {regLoading ? "Verifying..." : "Verify Phone"}
          </button>
          <p className="text-center text-[13px] text-gray-500">Didn&apos;t receive it?{" "}{resendTimer > 0 ? <span className="text-gray-400">Resend in {resendTimer}s</span> : <button type="button" onClick={handleResend} className="font-bold text-black underline">Resend</button>}</p>
          <p className="text-center"><button type="button" onClick={() => { setRegStep("form"); setPhoneOtp(""); setRegError(""); }} className="text-[13px] text-gray-400 underline">← Back</button></p>
        </form>
      )}

      {/* ── REGISTER: EMAIL OTP ── */}
      {tab === "register" && regStep === "email-otp" && (
        <form onSubmit={handleEmailOtp} className="space-y-5">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-yellow-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            </div>
            <h3 className="text-[15px] font-bold text-gray-900">Verify your email</h3>
            <p className="text-[12px] text-gray-500 mt-1">Code sent to <span className="font-semibold text-gray-700">{regForm.email}</span></p>
          </div>
          {errBox(regError)}
          <OtpBoxes value={emailOtp} onChange={setEmailOtp} />
          <button type="submit" disabled={regLoading || emailOtp.length !== 6} className="w-full rounded-md bg-[#FFCE2E] hover:bg-[#EBB81E] py-3 text-[15px] font-bold text-black transition disabled:opacity-50">
            {regLoading ? "Creating account..." : "Verify & Create Account"}
          </button>
          <p className="text-center text-[13px] text-gray-500">Didn&apos;t receive it?{" "}{resendTimer > 0 ? <span className="text-gray-400">Resend in {resendTimer}s</span> : <button type="button" onClick={handleResend} className="font-bold text-black underline">Resend</button>}</p>
        </form>
      )}
    </div>
  );
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const { items, removeItem, updateQty, clearCart, total } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState<"paypal" | "card" | "razorpay" | null>(null);
  const [couponCode, setCouponCode]     = useState("");
  const [couponApplied, setCouponApplied] = useState<{ code: string; discountAmount: number; discountType: string; discountValue: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError]   = useState("");

  const discountedTotal = couponApplied ? Math.max(total - couponApplied.discountAmount, 0) : total;

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res  = await fetch("/api/coupons/validate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ code: couponCode.trim(), total }),
      });
      const data = await res.json();
      if (!res.ok) { setCouponError(data.error ?? "Invalid coupon"); return; }
      setCouponApplied({ code: data.code, discountAmount: data.discountAmount, discountType: data.discountType, discountValue: data.discountValue });
    } catch {
      setCouponError("Failed to apply coupon. Please try again.");
    } finally {
      setCouponLoading(false);
    }
  }

  function removeCoupon() {
    setCouponApplied(null);
    setCouponCode("");
    setCouponError("");
  }

  async function handlePayment(method: "paypal" | "card" | "razorpay") {
    setLoading(method);
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          paymentMethod: method,
          couponCode:    couponApplied?.code ?? null,
          discountAmount: couponApplied?.discountAmount ?? 0,
        }),
      });
      let data: any;
      try { data = await res.json(); } catch { throw new Error("Server error — please try again."); }
      if (!res.ok) throw new Error(data?.error ?? "Failed to create order");
      clearCart();
      window.location.href = data.payUrl;
    } catch (err: any) {
      const { toast } = await import("sonner");
      toast.error(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  useEffect(() => {
    if (!session && status !== "loading") {
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") router.push("/"); };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [session, status, router]);

  if (status === "loading") return null;
  const isGuest = !session;

  const componentProps = {
    id: "cart-cross-sell",
    settings: {},
    data: {
      excludeIds: items.map((item) => String(item.id))
    }
  };

  // Pick 3 random similar products
  const randomProducts = products
    .filter(p => !items.find(item => item.id === p.id))
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const steps = [
    { number: 1, label: "Configure & Order", active: true },
    { number: 2, label: "order details", active: false },
    { number: 3, label: "order placed", active: false },
  ];

  return (
    <div className="relative min-h-screen bg-white font-['Poppins']">
      {isGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm" onClick={() => router.push("/")}>
          <div onClick={e => e.stopPropagation()}>
            <AuthGate />
          </div>
        </div>
      )}
      <div className="bg-[#f7f7f7] py-[50px] md:pb-[60px]">
        <Wrapper>
          {items.length > 0 && (
            <div className="flex justify-center mb-[60px] pt-[10px]">
              <div className="relative flex justify-between w-[600px] max-w-full">
                {/* Progress Lines */}
                <div className="absolute top-[25px] left-[40px] w-[87%] h-[2px] z-0 flex">
                  <div className="bg-[#fcd535] flex-1"></div>
                  <div className="bg-[#e9ecef] flex-1"></div>
                </div>

                {steps.map((step) => (
                  <div key={step.number} className="relative z-[2] text-center w-[120px]">
                    <div className={`w-[50px] h-[50px] rounded-full flex items-center justify-center border-2 mx-auto mb-[10px] font-semibold text-[18px] transition-all duration-300 ${
                      step.active 
                      ? "bg-[#fcd535] border-[#fcd535] text-[#212529] outline outline-[2px] outline-[#212529]" 
                      : "bg-white border-[#e9ecef] text-[#adb5bd]"
                    }`}>
                      {step.number}
                    </div>
                    <div className={`text-[11px] font-bold uppercase tracking-[0.5px] whitespace-nowrap ${
                      step.active ? "text-[#212529]" : "text-[#adb5bd]"
                    }`}>
                      {step.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center p-[50px] bg-white rounded shadow-sm border mt-4 max-w-4xl mx-auto">
              <h3 className="text-[24px] font-bold text-[#333] mb-4">Your cart is empty</h3>
              <br />
              <Link href="/buy-reviews" className="bg-[#333] text-white px-[30px] py-[12px] rounded-md font-medium text-[15px] hover:bg-black transition-all inline-block">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="bg-white p-[30px] rounded-[11px]">
              {/* Cart Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 mb-5 border-b border-[#f1f1f1]">
                <h2 className="text-[18px] font-semibold uppercase tracking-[1px] text-[#333] m-0">Configure & Order</h2>
                <div className="flex flex-wrap gap-2.5 mt-4 md:mt-0">
                  <Link href="/buy-reviews" className="bg-[#448aff] text-white px-5 py-2.5 rounded-lg text-[14px] font-medium hover:opacity-90 transition-all flex items-center justify-center min-w-[140px]">
                    Continue Shopping
                  </Link>
                  <button 
                    onClick={() => { if(confirm("Are you sure you want to clear your entire cart?")) clearCart(); }}
                    className="bg-transparent text-[#888] border border-[#ccc] px-5 py-2.5 rounded-lg text-[14px] font-medium hover:bg-[#dc3545] hover:text-white hover:border-[#dc3545] transition-all flex items-center gap-2 justify-center min-w-[120px] group"
                  >
                    <X size={16} /> Clear Cart
                  </button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-10 items-start">
                {/* Left Column */}
                <div className="flex-1 w-full">
                  <div className="space-y-5">
                    {items.map((item) => (
                      <div key={item.id} className="bg-white border border-[#f0f0f0] rounded-xl p-[25px] flex justify-between shadow-[0_4px_12px_rgba(0,0,0,0.02)] relative group">
                        <div className="flex flex-1 items-start">
                          {/* Image Box */}
                          <div className="w-[65px] h-[65px] bg-[#f8f9fa] rounded-lg flex items-center justify-center mr-[25px] p-2 shrink-0">
                            <img src={item.image} alt={item.platform} className="max-w-full max-h-full object-contain" />
                          </div>

                          {/* Info Box */}
                          <div className="flex flex-col">
                            <div className="text-[16px] font-bold text-[#333] mb-3 flex flex-wrap items-center gap-2 leading-[1.3]">
                              {item.platform}
                              {item.type === "subscribe" ? (
                                <div className="relative group/tooltip inline-flex items-center gap-2">
                                  <span className="bg-[#fff3cd] text-[#856404] border border-[#ffeeba] text-[10px] px-2 py-[3px] rounded font-bold uppercase tracking-[0.5px] flex items-center gap-1">
                                    <RefreshCcw size={10} className="animate-spin-slow" /> Monthly
                                  </span>
                                  <div className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px] cursor-help relative">
                                    <Info size={10} />
                                    <div className="absolute left-[110%] top-0 w-[180px] bg-[#6c6c6c] text-white p-3 rounded-xl shadow-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all text-[12px] font-normal z-20 text-left">
                                      Subscription renews monthly with automatic billing.
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <span className="bg-[#f3f4f6] text-[#6b7280] border border-[#e5e7eb] text-[10px] px-2 py-[3px] rounded font-bold uppercase tracking-[0.5px]">
                                  One-time
                                </span>
                              )}
                            </div>

                            {/* Qty Selector */}
                            <div className="flex items-center bg-white border border-[#e0e0e0] rounded-md h-[36px] w-fit overflow-hidden">
                              <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-[30px] h-full flex items-center justify-center text-[#bbb] hover:text-[#333] transition-colors text-[18px] pb-0.5">
                                −
                              </button>
                              <input 
                                type="number" 
                                value={item.qty} 
                                onChange={(e) => updateQty(item.id, Number(e.target.value))}
                                className="w-[35px] text-center font-semibold text-[14px] border-none text-[#333] bg-transparent focus:outline-none appearance-none" 
                              />
                              <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-[30px] h-full flex items-center justify-center text-[#bbb] hover:text-[#333] transition-colors text-[18px] pb-0.5">
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between items-end min-h-[80px]">
                          <button onClick={() => removeItem(item.id)} className="btn-remove bg-transparent border-none text-[#999] hover:text-[#dc3545] transition-colors text-[18px] p-0 leading-none cursor-pointer">
                            <X size={18} />
                          </button>
                          <div className="price-box text-right">
                            <div className="price-main text-[#28a745] font-bold text-[18px]">${(item.pricePerUnit * item.qty).toFixed(2)}</div>
                            <div className="price-sub text-[11px] text-[#333] font-medium uppercase mt-0.5">/ Per unit</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Block */}
                  <div className="coupon-block mt-10">
                    <label className="coupon-label text-[15px] font-bold mb-3 block text-[#333]">Have a coupon?</label>
                    {couponApplied ? (
                      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-md px-4 py-3 max-w-[420px]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        <span className="text-[14px] text-green-700 font-semibold flex-1">
                          {couponApplied.code} — {couponApplied.discountType === "percentage" ? `${couponApplied.discountValue}% off` : `$${couponApplied.discountAmount.toFixed(2)} off`}
                        </span>
                        <button onClick={removeCoupon} className="text-[12px] text-red-500 hover:text-red-700 underline">Remove</button>
                      </div>
                    ) : (
                      <>
                        <div className="coupon-row flex max-w-[420px]">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={e => { setCouponCode(e.target.value); setCouponError(""); }}
                            onKeyDown={e => e.key === "Enter" && applyCoupon()}
                            placeholder="Enter your Coupon Code"
                            className="coupon-field flex-1 border border-[#ced4da] border-r-0 rounded-l-md px-[15px] h-[46px] text-[14px] outline-none focus:border-[#333] transition-colors"
                          />
                          <button
                            onClick={applyCoupon}
                            disabled={couponLoading || !couponCode.trim()}
                            className="coupon-submit bg-[#333] text-white border-none rounded-r-md px-[30px] h-[46px] text-[14px] font-medium hover:bg-black transition-colors disabled:opacity-50"
                          >
                            {couponLoading ? "..." : "Apply"}
                          </button>
                        </div>
                        {couponError && <p className="text-red-500 text-[13px] mt-2">{couponError}</p>}
                      </>
                    )}
                  </div>
                </div>

                {/* Right Column (Summary) */}
                <div className="cart-right-col w-full lg:w-[380px] shrink-0">
                  <div className="summary-panel bg-[#fffcf8] rounded-xl p-[30px] w-full">
                    <h3 className="summary-head text-[18px] font-semibold mb-[25px] text-[#333] uppercase tracking-wide">Net Total</h3>
                    
                    <div className="space-y-[15px] mb-5">
                      {items.map((item) => (
                        <div key={item.id} className="sum-row flex justify-between text-[14px] leading-relaxed">
                          <span className="text-[#6c757d]">{item.platform}</span>
                          <span className="text-[#333] font-medium">${(item.pricePerUnit * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="sum-divider h-[1px] bg-[#e9ecef] my-5"></div>

                    {couponApplied && (
                      <div className="flex justify-between text-[14px] mb-2">
                        <span className="text-green-600 font-medium">Discount ({couponApplied.code})</span>
                        <span className="text-green-600 font-semibold">−${couponApplied.discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="sum-total flex justify-between items-center mb-[30px]">
                      <span className="text-[16px] font-medium text-[#6c757d]">Subtotal</span>
                      <span className="text-[24px] font-bold text-black">${discountedTotal.toFixed(2)}</span>
                    </div>

                    <div className="space-y-[10px]">

                      {/* PayPal Button */}
                      <button
                        onClick={() => handlePayment("paypal")}
                        disabled={!!loading}
                        className="w-full h-[52px] flex items-center justify-center bg-[#FFC439] hover:bg-[#f0b429] px-4 rounded-[6px] transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {loading === "paypal" ? (
                          <div className="flex items-center gap-2">
                            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#003087" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/>
                              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                            </svg>
                            <span className="text-[#003087] font-bold text-[14px]">Processing...</span>
                          </div>
                        ) : (
                          <img
                            src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-150px.png"
                            alt="PayPal"
                            className="h-[22px] object-contain"
                          />
                        )}
                      </button>

                      {/* Debit or Credit Card (PayPal card flow) */}
                      <button
                        onClick={() => handlePayment("card")}
                        disabled={!!loading}
                        className="w-full h-[52px] flex items-center justify-center gap-2.5 bg-[#1a1a1a] hover:bg-[#333] text-white text-[14px] font-semibold px-4 rounded-[6px] transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {loading === "card" ? (
                          <>
                            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/>
                              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                            </svg>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                              <line x1="1" y1="10" x2="23" y2="10"/>
                            </svg>
                            <span>Debit or Credit Card</span>
                          </>
                        )}
                      </button>

                      {/* Powered by PayPal */}
                      <p className="text-center text-[12px] text-[#888] pb-1">Powered by <span className="font-semibold text-[#003087]">PayPal</span></p>

                      {/* Razorpay Button */}
                      <button
                        onClick={() => handlePayment("razorpay")}
                        disabled={!!loading}
                        className="w-full h-[52px] flex items-center justify-center gap-3 bg-[#072654] hover:bg-[#0a3570] text-white px-4 rounded-[6px] transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {loading === "razorpay" ? (
                          <div className="flex items-center gap-2">
                            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/>
                              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                            </svg>
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <>
                            <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10.5 0L4 13h5L2 22l14-12H9.5L10.5 0z" fill="#2EB8E6"/>
                            </svg>
                            <div className="flex flex-col items-start leading-tight">
                              <span className="text-[15px] font-bold">Pay Now</span>
                              <span className="text-[11px] text-white/70">Secured by <span className="text-white font-semibold">Razorpay</span></span>
                            </div>
                          </>
                        )}
                      </button>

                      {/* Card brand icons */}
                      <div className="flex items-center justify-center gap-2 pt-1">
                        <img src="https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons@main/flat/visa.svg" alt="Visa" className="h-[24px] rounded object-contain" />
                        <img src="https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons@main/flat/mastercard.svg" alt="Mastercard" className="h-[24px] rounded object-contain" />
                        <img src="https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons@main/flat/paypal.svg" alt="PayPal" className="h-[24px] rounded object-contain" />
                        <img src="https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons@main/flat/amex.svg" alt="Amex" className="h-[24px] rounded object-contain" />
                        <img src="https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons@main/flat/discover.svg" alt="Discover" className="h-[24px] rounded object-contain" />
                      </div>
                    </div>

                    <p className="text-center text-[14px] text-[#515151] mt-[10px]">*You will input your order details on the next page</p>
                  </div>
                </div>
              </div>
              <SimilarProducts {...componentProps} />
            </div>
          )}
        </Wrapper>
      </div>
    </div>
  );
}
