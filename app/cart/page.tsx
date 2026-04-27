"use client";

import { useCart } from "@/context/CartContext";
import HomeNavbar from "@/components/HomeNavbar";
import Link from "next/link";

import Wrapper from "@/components/Wrapper";

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, total, count } = useCart();

  return (
    <Wrapper>
      <div className="min-h-screen bg-slate-50">
        <HomeNavbar />

        <div className="mx-auto w-full px-5 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Shopping Cart</h1>
              <p className="text-sm text-slate-500 mt-1">{count} {count === 1 ? "item" : "items"} in your cart</p>
            </div>
            <Link href="/buy-reviews" className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition">
              ← Continue Shopping
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm py-24 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
              <p className="text-slate-500 mt-2 mb-6">Browse our review packages and add items to your cart.</p>
              <Link href="/buy-reviews"
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow transition hover:opacity-90">
                Browse Packages →
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              {/* Cart Items */}
              <div className="space-y-4">
                {/* Clear Cart */}
                <div className="flex justify-end">
                  <button onClick={clearCart}
                    className="text-xs font-semibold text-red-400 hover:text-red-600 transition flex items-center gap-1">
                    🗑 Clear All Items
                  </button>
                </div>

                {items.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-violet-100 to-indigo-100 text-3xl">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-slate-900">{item.platform}</h3>
                            <span className={`inline-flex mt-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${item.type === "subscribe" ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700"}`}>
                              {item.type === "subscribe" ? "♻️ Subscribe" : "🛒 One-Time"}
                            </span>
                          </div>
                          <button onClick={() => removeItem(item.id)}
                            className="text-slate-300 hover:text-red-400 transition shrink-0">✕</button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          {/* Qty */}
                          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                            <button onClick={() => updateQty(item.id, item.qty - 1)}
                              className="px-3 py-2 text-slate-500 hover:bg-slate-100 transition font-bold">−</button>
                            <span className="px-3 py-2 text-sm font-bold text-slate-800 min-w-3rem text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, item.qty + 1)}
                              className="px-3 py-2 text-slate-500 hover:bg-slate-100 transition font-bold">+</button>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-slate-400">${item.pricePerUnit.toFixed(2)} × {item.qty}</p>
                            <p className="text-lg font-extrabold text-violet-700">${(item.pricePerUnit * item.qty).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-4">
                <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 sticky top-24">
                  <h2 className="text-base font-bold text-slate-800 mb-5">Order Summary</h2>

                  <div className="space-y-3 mb-5">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 truncate mr-2">{item.icon} {item.platform} ×{item.qty}</span>
                        <span className="font-semibold text-slate-800 shrink-0">${(item.pricePerUnit * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="font-semibold">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Processing Fee</span>
                      <span className="font-semibold text-emerald-600">Free</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                      <span>Total</span>
                      <span className="text-violet-700">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button className="mt-5 w-full rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow transition hover:opacity-90">
                    Proceed to Checkout →
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
                    <span>🔒 Secure</span>
                    <span>💳 All Cards</span>
                    <span>⚡ Instant</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Have a promo code?</p>
                  <div className="flex gap-2">
                    <input placeholder="Enter code..." className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition" />
                    <button className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 transition">Apply</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
