"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function SideCart() {
  const { items, removeItem, updateQty, clearCart, total, count } = useCart();
  const router = useRouter();

  return (
    <div className="fixed top-20 right-4 z-40 w-72 max-h-[calc(100vh-6rem)] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-700 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">🛒</span>
          <h2 className="text-sm font-bold text-white">Your Cart</h2>
        </div>
        {count > 0 && (
          <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white text-violet-700 text-[10px] font-extrabold px-1">
            {count}
          </span>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-4xl mb-2">🛒</div>
            <p className="text-xs font-semibold text-slate-600">Cart is empty</p>
            <p className="text-[11px] text-slate-400 mt-1">Add review packages to get started</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">{item.platform}</p>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${item.type === "subscribe" ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700"}`}>
                      {item.type === "subscribe" ? "Subscribe" : "One-Time"}
                    </span>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-400 transition text-xs shrink-0">✕</button>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center rounded-lg border border-slate-200 bg-white overflow-hidden">
                  <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2 py-1 text-slate-500 hover:bg-slate-50 transition font-bold text-xs">−</button>
                  <span className="px-2 text-xs font-bold text-slate-800 min-w-[1.5rem] text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2 py-1 text-slate-500 hover:bg-slate-50 transition font-bold text-xs">+</button>
                </div>
                <p className="text-xs font-extrabold text-violet-700">${(item.pricePerUnit * item.qty).toFixed(2)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="border-t border-slate-100 px-3 py-3 space-y-2 bg-white shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Subtotal</span>
            <span className="text-sm font-extrabold text-slate-900">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => router.push("/cart")}
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
  );
}
