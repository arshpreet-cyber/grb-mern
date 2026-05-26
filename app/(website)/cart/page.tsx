"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Wrapper from "@/components/ui/Wrapper";
import { X, Info, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import products from "@/lib/constants/products";
import SimilarProducts from "@/components/sections/SimilarProducts";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

function AuthGate() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const res = await signIn("credentials", { email: loginForm.email.trim().toLowerCase(), password: loginForm.password, redirect: false });
    if (res?.error) { setError("Invalid email or password."); setIsLoading(false); }
    else { window.location.reload(); }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="w-full max-w-[440px] mx-4 rounded-xl bg-white shadow-lg border border-gray-100 px-8 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/">
            <img src="https://grb-mern-gilt.vercel.app/icons/logo.png" alt="Get Reviews Buzz" className="h-12 w-auto object-contain" />
          </Link>
        </div>

        {tab === "login" ? (
          <>
            <h2 className="text-[18px] font-bold text-center text-gray-900 mb-1">Sign in to continue</h2>
            <p className="text-[13px] text-gray-500 text-center mb-6">You need to be logged in to checkout.</p>
          </>
        ) : (
          <>
            <h2 className="text-[18px] font-bold text-center text-gray-900 mb-1">Create an account</h2>
            <p className="text-[13px] text-gray-500 text-center mb-6">Register to place your order.</p>
          </>
        )}

        {/* Tab Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button onClick={() => { setTab("login"); setError(""); }}
            className={`flex-1 py-2 text-[14px] font-semibold rounded-md transition-all ${tab === "login" ? "bg-white text-black shadow-sm" : "text-gray-500"}`}>
            Log In
          </button>
          <button onClick={() => { setTab("register"); setError(""); }}
            className={`flex-1 py-2 text-[14px] font-semibold rounded-md transition-all ${tab === "register" ? "bg-white text-black shadow-sm" : "text-gray-500"}`}>
            Register
          </button>
        </div>

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"><span>⚠</span> {error}</div>}
            <input type="email" required value={loginForm.email} onChange={(e) => setLoginForm(p => ({ ...p, email: e.target.value }))} placeholder="Email Address"
              className="w-full rounded-md border border-gray-200 bg-[#F4F7FF] py-3 px-4 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" />
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required value={loginForm.password} onChange={(e) => setLoginForm(p => ({ ...p, password: e.target.value }))} placeholder="Password"
                className="w-full rounded-md border border-gray-200 bg-[#F4F7FF] py-3 pl-4 pr-12 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                {showPassword
                  ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              </button>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full rounded-md bg-[#FFCE2E] hover:bg-[#EBB81E] py-3 text-[15px] font-bold text-black transition disabled:opacity-50">
              {isLoading ? "Signing in..." : "Log In"}
            </button>
            <p className="text-center text-[13px] text-gray-500">
              Don&apos;t have an account?{" "}
              <button type="button" onClick={() => { setTab("register"); setError(""); }} className="font-bold text-black underline">Register Now.</button>
            </p>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-[14px] text-gray-600">Complete your registration to place an order.</p>
            <Link href="/register"
              className="block w-full rounded-md bg-[#FFCE2E] hover:bg-[#EBB81E] py-3 text-[15px] font-bold text-black transition text-center">
              Create Account
            </Link>
            <p className="text-[13px] text-gray-500">
              Already have an account?{" "}
              <button type="button" onClick={() => { setTab("login"); setError(""); }} className="font-bold text-black underline">Log In.</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const { items, removeItem, updateQty, clearCart, total } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState<"card" | "paypal" | "razorpay" | "zoho" | null>(null);

  async function handlePayment(method: "card" | "paypal" | "razorpay" | "zoho") {
    setLoading(method);
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, paymentMethod: method }),
      });
      let data: any;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server error — please try again.");
      }
      if (!res.ok) throw new Error(data?.error ?? "Failed to create order");
      window.location.href = data.payUrl;
    } catch (err: any) {
      alert(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  if (status === "loading") return null;
  if (!session) {
    return (
      <div className="min-h-screen bg-white font-['Poppins']">
        <div className="bg-[#f7f7f7] py-[50px]">
          <Wrapper><AuthGate /></Wrapper>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-white font-['Poppins']">
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
                    <div className="coupon-row flex max-w-[420px]">
                      <input 
                        type="text" 
                        placeholder="Enter your Coupon Code" 
                        className="coupon-field flex-1 border border-[#ced4da] border-r-0 rounded-l-md px-[15px] h-[46px] text-[14px] outline-none focus:border-[#333] transition-colors"
                      />
                      <button className="coupon-submit bg-[#333] text-white border-none rounded-r-md px-[30px] h-[46px] text-[14px] font-medium hover:bg-black transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column (Summary) */}
                <div className="cart-right-col w-full lg:w-[380px] shrink-0">
                  <div className="summary-panel bg-[#fffcf8] rounded-xl p-[30px] w-full">
                    <h3 className="summary-head text-[18px] font-semibold mb-[25px] text-[#333] uppercase tracking-wide">Net Total</h3>
                    
                    <div className="space-y-[15px] mb-5">
                      {items.map((item) => (
                        <div key={item.id} className="sum-row flex justify-between text-[14px] leading-relaxed">
                          <span className="text-[#6c757d]">{item.platform} Reviews</span>
                          <span className="text-[#333] font-medium">${(item.pricePerUnit * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="sum-divider h-[1px] bg-[#e9ecef] my-5"></div>

                    <div className="sum-total flex justify-between items-center mb-[30px]">
                      <span className="text-[16px] font-medium text-[#6c757d]">Subtotal</span>
                      <span className="text-[24px] font-bold text-black">${total.toFixed(2)}</span>
                    </div>

                    <div className="space-y-[10px]">

                      {/* Pay with Debit/Credit Card */}
                      <button
                        onClick={() => handlePayment("zoho")}
                        disabled={!!loading}
                        className="w-full flex items-center justify-center gap-2.5 bg-black text-white text-[14px] font-semibold py-[13px] px-4 rounded-[50px] hover:bg-[#222] transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {loading === "zoho" ? (
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
                            <span>Pay with Debit / Credit Card</span>
                            <span className="flex items-center gap-1 ml-auto">
                              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/visa.svg" alt="Visa" className="h-[13px] object-contain brightness-0 invert opacity-80" />
                              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mastercard.svg" alt="Mastercard" className="h-[15px] object-contain brightness-0 invert opacity-80" />
                            </span>
                          </>
                        )}
                      </button>


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
