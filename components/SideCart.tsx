"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SideCart() {
  const { items, removeItem, updateQty, clearCart, total, count } = useCart();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      {/* Floating Cart Icon — always visible on right center */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center justify-center gap-1 bg-gradient-to-b from-violet-600 to-indigo-700 text-white px-2 py-4 rounded-l-2xl shadow-xl hover:from-violet-700 hover:to-indigo-800 transition-all"
        style={{ writingMode: "horizontal-tb" }}
      >
        <span className="text-xl">🛒</span>
        <span className="text-[11px] font-extrabold leading-none">{count}</span>
      </button>

      {/* Full Cart Panel */}
      <div className={`fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <h2 className="text-sm font-bold text-white">Your Cart</h2>
            {count > 0 && (
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white text-violet-700 text-[10px] font-extrabold px-1">
                {count}
              </span>
            )}
          </div>
          <button onClick={() => setOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition text-sm">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-5xl mb-3">🛒</div>
              <p className="text-sm font-semibold text-slate-700">Cart is empty</p>
              <p className="text-xs text-slate-400 mt-1">Add review packages to get started</p>
              <button onClick={() => { setOpen(false); router.push("/buy-reviews"); }}
                className="mt-4 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-violet-700 transition">
                Browse Packages
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">{item.platform}</p>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${item.type === "subscribe" ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700"}`}>
                        {item.type === "subscribe" ? "♻️ Subscribe" : "🛒 One-Time"}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-400 transition text-xs shrink-0">✕</button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-slate-200 bg-white overflow-hidden">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2.5 py-1.5 text-slate-500 hover:bg-slate-100 transition font-bold text-xs">−</button>
                    <span className="px-2 text-xs font-bold text-slate-800 min-w-[2rem] text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2.5 py-1.5 text-slate-500 hover:bg-slate-100 transition font-bold text-xs">+</button>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400">${item.pricePerUnit.toFixed(2)} each</p>
                    <p className="text-xs font-extrabold text-violet-700">${(item.pricePerUnit * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 px-4 py-4 space-y-2 bg-white shrink-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">Subtotal ({count} {count === 1 ? "item" : "items"})</span>
              <span className="text-base font-extrabold text-slate-900">${total.toFixed(2)}</span>
            </div>
            <button onClick={() => { setOpen(false); router.push("/cart"); }}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-xs font-bold text-white shadow hover:opacity-90 transition">
              View Cart →
            </button>
            <button onClick={clearCart}
              className="w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-red-500 transition">
              🗑 Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
