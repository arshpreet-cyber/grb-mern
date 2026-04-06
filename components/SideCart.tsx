"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function SideCart() {
  const { items, isOpen, closeCart, removeItem, updateQty, clearCart, total, count } = useCart();
  const router = useRouter();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Side Cart Panel */}
      <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-600 to-indigo-700">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <h2 className="text-base font-bold text-white">Your Cart</h2>
            {count > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-violet-700 text-[10px] font-extrabold">
                {count}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition text-sm">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-5xl mb-4">🛒</div>
              <p className="font-semibold text-slate-700">Your cart is empty</p>
              <p className="text-sm text-slate-400 mt-1">Add some review packages to get started</p>
              <button onClick={closeCart} className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-700 transition">
                Browse Packages
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{item.platform}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.type === "subscribe" ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700"}`}>
                        {item.type === "subscribe" ? "Subscribe" : "One-Time"}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-400 transition text-sm shrink-0">✕</button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  {/* Qty Controls */}
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <button onClick={() => updateQty(item.id, item.qty - 1)}
                      className="px-3 py-1.5 text-slate-500 hover:bg-slate-50 transition font-bold text-sm">−</button>
                    <span className="px-2 text-sm font-bold text-slate-800 min-w-[2rem] text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}
                      className="px-3 py-1.5 text-slate-500 hover:bg-slate-50 transition font-bold text-sm">+</button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">${item.pricePerUnit.toFixed(2)} each</p>
                    <p className="text-sm font-extrabold text-violet-700">${(item.pricePerUnit * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 px-5 py-4 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Subtotal ({count} {count === 1 ? "item" : "items"})</span>
              <span className="text-lg font-extrabold text-slate-900">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => { closeCart(); router.push("/cart"); }}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-bold text-white shadow hover:opacity-90 transition">
              View Cart →
            </button>

            <button onClick={clearCart}
              className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-red-500 transition">
              🗑 Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
