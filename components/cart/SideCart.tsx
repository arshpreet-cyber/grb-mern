"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useMounted } from "@/hooks/useMounted";
import { X, Trash2, ShoppingCart, RefreshCcw, Info } from "lucide-react";

export default function SideCart() {
  const { items, removeItem, updateQty, clearCart, total, count, isOpen, closeCart, toggleCart } = useCart();
  const router = useRouter();
  const isMounted = useMounted();
  const visibleCount = isMounted ? count : 0;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[1200] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300" 
          onClick={closeCart} 
        />
      )}

      {/* Floating Cart Button */}
      <button
        onClick={toggleCart}
        aria-label={`Open cart with ${visibleCount} ${visibleCount === 1 ? "item" : "items"}`}
        className="fixed right-6 top-1/2 z-[1210] flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-[#111111] text-white shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all hover:scale-110 active:scale-95 group"
      >
        <ShoppingCart size={24} className="transition-transform group-hover:-rotate-12" />
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#ff5a7a] text-[12px] font-bold text-white shadow-sm ring-2 ring-white">
          {visibleCount}
        </span>
      </button>

      {/* Side Drawer */}
      <div
        className={`fixed top-1 right-1 bottom-1 z-[1220] flex w-full max-w-[420px] rounded-3xl flex-col bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.15)] overflow-hidden transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-[calc(100%+32px)]"
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between bg-[#FFE57F] px-6 py-5">
          <h3 className="text-[16px] font-bold tracking-tight text-black uppercase">Your Cart</h3>
          <button
            onClick={closeCart}
            className="flex h-8 w-8 items-center justify-center rounded-full text-black transition hover:bg-black/10 active:scale-90"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 scrollbar-thin scrollbar-thumb-gray-200">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center opacity-60">
              <div className="mb-4 rounded-full bg-gray-50 p-6">
                <ShoppingCart size={48} className="text-gray-300" />
              </div>
              <p className="text-[17px] font-bold text-gray-800">Your cart is empty</p>
              <p className="mt-2 text-[14px] text-gray-500">Looks like you haven't added anything yet.</p>
              <button
                onClick={() => {
                  closeCart();
                  router.push("/buy-reviews");
                }}
                className="mt-6 rounded-lg bg-black px-6 py-3 text-[14px] font-bold text-white transition hover:bg-gray-800"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {items.map((item) => (
                <div key={item.id} className="group relative animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex gap-4">
                    {/* Item Image */}
                    <div className="h-[70px] w-[70px] shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-[#f9f9f9] flex items-center justify-center">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.platform} 
                          className="h-[40px] w-[40px] object-contain transition-transform group-hover:scale-110" 
                        />
                      ) : (
                        <ShoppingCart size={24} className="text-gray-300" />
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-[15px] font-semibold leading-tight text-[#000] truncate pr-4">
                            {item.platform}
                          </h3>
                          <div className="mt-2 flex items-center gap-2">
                            {item.type === "subscribe" ? (
                              <div className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#fff9db] px-2 py-1 text-[10px] font-bold text-[#8d6e00]">
                                <RefreshCcw size={10} className="animate-spin-slow" />
                                Monthly
                                {/* <Info size={10} className="text-black cursor-help" /> */}
                              </div>
                            ) : (
                              <span className="rounded-[6px] border border-[#e9ecef] bg-[#f8f9fa] px-2 py-1 text-[10px] font-bold text-gray-600">
                                One-time
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="shrink-0 text-[12px] font-normal text-[#999999] underline underline-offset-2 transition hover:text-red-500 mt-6"
                        >
                          Remove
                        </button>
                      </div>

                      <div className=" items-center justify-between">
                        <div className="text-[13px] font-normal text-gray-600 my-2">
                          {item.qty} X <span className="text-gray-400 font-normal">${item.pricePerUnit.toFixed(2)}</span>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center rounded-[8px] border border-gray-200 bg-white overflow-hidden shadow-sm w-[100px]">
                          <button 
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="flex h-8 w-8 items-center justify-center text-lg text-gray-400 transition hover:bg-gray-50 hover:text-black border-r border-gray-100"
                          >
                            -
                          </button>
                          <input 
                            type="number" 
                            min="5"
                            value={item.qty}
                            onChange={(e) => updateQty(item.id, Number(e.target.value))}
                            className="w-10 text-center text-[13px] font-normal text-black appearance-none scrollbar-hide"
                          />
                          <button 
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="flex h-8 w-8 items-center justify-center text-lg text-gray-400 transition hover:bg-gray-50 hover:text-black border-l border-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="mt-3 border-b border-[#f0f0f0]" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="shrink-0 space-y-4 border-t border-gray-100 bg-white px-6 py-8">
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-semibold text-[#333]">Subtotal</span>
              <span className="text-[20px] font-extrabold text-[#28a745]">
                ${total.toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  closeCart();
                  router.push("/cart");
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-1 border-black bg-white py-4 text-[15px] font-bold text-black transition hover:bg-gray-50 active:scale-[0.98] cursor-pointer"
              >
                <ShoppingCart size={18} />
                View Cart
              </button>
              
              <button
                onClick={clearCart}
                className="w-full rounded-lg border-1 border-[#d9534f] bg-white py-4 text-[15px] font-bold text-[#d9534f] transition hover:bg-red-50 active:scale-[0.98] cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
