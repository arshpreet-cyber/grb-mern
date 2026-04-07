"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function SideCart() {
  const { items, removeItem, updateQty, clearCart, total, count, isOpen, closeCart, toggleCart } = useCart();
  const router = useRouter();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[1200] bg-black/30 backdrop-blur-sm" onClick={closeCart} />
      )}

      <button
        onClick={toggleCart}
        aria-label={`Open cart with ${count} ${count === 1 ? "item" : "items"}`}
        className="fixed right-4 top-1/2 z-[1210] flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-[22px] bg-[#111111] text-white shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition-transform hover:scale-105"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 4h2l2.1 9.2a1 1 0 0 0 1 .8h7.7a1 1 0 0 0 1-.8L19 7H7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="10" cy="19" r="1.6" fill="currentColor" />
          <circle cx="17" cy="19" r="1.6" fill="currentColor" />
        </svg>
        <span className="absolute right-1.5 top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-[#ff5a7a] px-1 text-[11px] font-extrabold leading-none text-white">
          {count}
        </span>
      </button>

      <div className={`fixed top-0 right-0 z-[1210] flex h-full w-80 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex shrink-0 items-center justify-between bg-linear-to-r from-violet-600 to-indigo-700 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">Cart</span>
            <h2 className="text-sm font-bold text-white">Your Cart</h2>
            {count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-extrabold text-violet-700">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm text-white transition hover:bg-white/30"
          >
            x
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 text-5xl">Cart</div>
              <p className="text-sm font-semibold text-slate-700">Cart is empty</p>
              <p className="mt-1 text-xs text-slate-400">Add review packages to get started</p>
              <button
                onClick={() => {
                  closeCart();
                  router.push("/buy-reviews");
                }}
                className="mt-4 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-violet-700"
              >
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
                      <p className="text-xs font-bold leading-tight text-slate-800">{item.platform}</p>
                      <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${item.type === "subscribe" ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700"}`}>
                        {item.type === "subscribe" ? "Subscribe" : "One-Time"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 text-xs text-slate-300 transition hover:text-red-400"
                  >
                    x
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2.5 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100">-</button>
                    <span className="min-w-[2rem] px-2 text-center text-xs font-bold text-slate-800">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2.5 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100">+</button>
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

        {items.length > 0 && (
          <div className="shrink-0 space-y-2 border-t border-slate-100 bg-white px-4 py-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-slate-500">Subtotal ({count} {count === 1 ? "item" : "items"})</span>
              <span className="text-base font-extrabold text-slate-900">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => {
                closeCart();
                router.push("/cart");
              }}
              className="w-full rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 py-2.5 text-xs font-bold text-white shadow transition hover:opacity-90"
            >
              View Cart
            </button>
            <button
              onClick={clearCart}
              className="w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-red-500"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
