"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Wrapper from "@/components/ui/Wrapper";
import { X, Info, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import products from "@/lib/constants/products";
import SimilarProducts from "@/components/sections/SimilarProducts";
import { useState } from "react";

export default function CartPage() {
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
      clearCart();
      window.location.href = data.payUrl;
    } catch (err: any) {
      alert(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-['Poppins'] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#fcd535] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[16px] font-semibold text-[#333]">Redirecting to payment...</p>
          <p className="text-[13px] text-[#888] mt-1">Please do not close this window.</p>
        </div>
      </div>
    );
  }

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

                      {/* Pay by Credit/Debit Card */}
                      <button
                        onClick={() => handlePayment("card")}
                        disabled={!!loading}
                        className="w-full flex items-center justify-center gap-2.5 bg-black text-white text-[14px] font-semibold py-[12px] px-4 rounded-[50px] hover:bg-[#222] transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {loading === "card" ? "Redirecting..." : (
                          <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                              <line x1="1" y1="10" x2="23" y2="10"/>
                            </svg>
                            <span>Pay by Credit / Debit</span>
                            <span className="flex items-center gap-1 ml-auto">
                              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/visa.svg" alt="Visa" className="h-[13px] object-contain brightness-0 invert opacity-80" />
                              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mastercard.svg" alt="Mastercard" className="h-[15px] object-contain brightness-0 invert opacity-80" />
                            </span>
                          </>
                        )}
                      </button>

                      {/* PayPal */}
                      <button
                        onClick={() => handlePayment("paypal")}
                        disabled={!!loading}
                        className="w-full flex items-center justify-center gap-2.5 bg-[#FFC439] text-[#003087] text-[14px] font-bold py-[12px] px-4 rounded-[50px] hover:bg-[#f0b429] transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {loading === "paypal" ? "Redirecting..." : (
                          <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#003087">
                              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
                            </svg>
                            <span>Pay with PayPal</span>
                            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/paypal.svg" alt="PayPal" className="h-[14px] object-contain brightness-0 invert ml-auto" />
                          </>
                        )}
                      </button>

                      {/* Razorpay */}
                      <button
                        onClick={() => handlePayment("razorpay")}
                        disabled={!!loading}
                        className="w-full flex items-center justify-center gap-2.5 bg-[#2D81F7] text-white text-[14px] font-semibold py-[12px] px-4 rounded-[50px] hover:bg-[#1a6fe0] transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {loading === "razorpay" ? "Redirecting..." : (
                          <>
                            <svg width="16" height="18" viewBox="0 0 24 28" fill="white">
                              <path d="M13.5 0L0 16h9L7.5 28 24 12h-9z"/>
                            </svg>
                            <span>Pay with Razorpay</span>
                            <svg viewBox="0 0 120 28" height="14" fill="white" className="ml-auto opacity-90">
                              <text x="0" y="22" fontSize="22" fontWeight="bold" fontFamily="Arial">razorpay</text>
                            </svg>
                          </>
                        )}
                      </button>

                      {/* Zoho */}
                      <button
                        onClick={() => handlePayment("zoho")}
                        disabled={!!loading}
                        className="w-full flex items-center justify-center gap-2.5 bg-[#E42527] text-white text-[14px] font-semibold py-3 px-4 rounded-[50px] hover:bg-[#c41f21] transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {loading === "zoho" ? "Redirecting..." : (
                          <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                            </svg>
                            <span>Pay with Zoho</span>
                            <svg viewBox="0 0 60 20" height="14" fill="white" className="ml-auto opacity-90">
                              <text x="0" y="16" fontSize="16" fontWeight="bold" fontFamily="Arial">zoho</text>
                            </svg>
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
