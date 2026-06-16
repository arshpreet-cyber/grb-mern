"use client";

import { useRouter } from "next/navigation";
import { X, ClipboardList, ArrowRight } from "lucide-react";

interface OrderInfo {
  id: string;
  orderNumber: string;
  date?: string;
}

interface InputDetailsModalProps {
  orders: OrderInfo[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function InputDetailsModal({ orders, isOpen, onClose }: InputDetailsModalProps) {
  const router = useRouter();

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-[450px] bg-white rounded-2xl shadow-2xl p-8 text-center" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-14 h-14 bg-[#e6f4ff] text-[#1677ff] rounded-full flex items-center justify-center mx-auto mb-6">
          <ClipboardList size={26} strokeWidth={2} />
        </div>

        <h2 className="text-[18px] font-bold text-gray-900 mb-4">Action Required</h2>

        {orders.length === 1 ? (
          <>
            <p className="text-[13px] text-gray-600 mb-4 leading-relaxed">
              We noticed that Order <span className="bg-[#fff2e8] text-[#fa541c] px-2 py-0.5 rounded font-semibold mx-1">#{orders[0].orderNumber || orders[0].id}</span> has been paid successfully.
            </p>

            <p className="text-[13px] text-gray-600 mb-8 px-2 leading-relaxed">
              However, some required information is missing. Please complete the form to process your order immediately.
            </p>

            <button
              onClick={() => {
                onClose();
                router.push(`/order/${orders[0].id}/details`);
              }}
              className="w-full bg-[#fcd535] hover:bg-[#f3cc2b] text-gray-900 font-bold text-[14px] py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              Complete Order Details <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </>
        ) : (
          <>
            <p className="text-[14px] text-gray-600 mb-6 leading-relaxed">
              You have <span className="bg-[#fff2e8] text-[#fa541c] px-2 py-0.5 rounded font-semibold mx-1">{orders.length} orders</span> that require input details to be processed.
            </p>

            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto px-1 mb-2">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between text-left hover:border-[#fc0] transition-colors bg-white">
                  <div>
                    <p className="font-bold text-gray-900 text-[14px]">Order #{order.orderNumber || order.id}</p>
                    {order.date && <p className="text-[12px] text-gray-400 mt-1">{order.date}</p>}
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      router.push(`/order/${order.id}/details`);
                    }}
                    className="bg-[#fc0] hover:bg-[#e6bb00] text-slate-900 font-bold text-[11px] px-4 py-2 rounded-lg transition-colors whitespace-nowrap shadow-sm"
                  >
                    Input Details
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
