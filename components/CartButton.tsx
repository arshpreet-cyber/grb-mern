"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useMounted } from "@/components/useMounted";

export default function CartButton() {
  const { count } = useCart();
  const isMounted = useMounted();
  const visibleCount = isMounted ? count : 0;
  return (
    <Link href="/cart"
      className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-violet-300 hover:text-violet-700 transition shadow-sm">
      <span className="text-base">🛒</span>
      <span className="hidden sm:inline">Cart</span>
      {visibleCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-extrabold text-white">
          {visibleCount}
        </span>
      )}
    </Link>
  );
}
