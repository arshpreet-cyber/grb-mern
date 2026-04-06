"use client";

import { useCart } from "@/context/CartContext";

export default function CartButton() {
  const { openCart, count } = useCart();
  return (
    <button onClick={openCart}
      className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-violet-300 hover:text-violet-700 transition shadow-sm">
      <span className="text-base">🛒</span>
      <span className="hidden sm:inline">Cart</span>
      {count > 0 && (
        <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-extrabold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
