"use client";

import { useRouter } from "next/navigation";
import { X, ClipboardList, ArrowRight } from "lucide-react";

interface InputDetailsModalProps {
  orderId: string;
  orderNumber?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function InputDetailsModal({ orderId, orderNumber, isOpen, onClose }: InputDetailsModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const displayOrderNumber = orderNumber || orderId;

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

        <p className="text-[13px] text-gray-600 mb-4 leading-relaxed">
          We noticed that Order <span className="bg-[#fff2e8] text-[#fa541c] px-2 py-0.5 rounded font-semibold mx-1">#{displayOrderNumber}</span> has been paid successfully.
        </p>

        <p className="text-[13px] text-gray-600 mb-8 px-2 leading-relaxed">
          However, some required information is missing. Please complete the form to process your order immediately.
        </p>

        <button
          onClick={() => {
            onClose();
            router.push(`/order/${orderId}/details`);
          }}
          className="w-full bg-[#fcd535] hover:bg-[#f3cc2b] text-gray-900 font-bold text-[14px] py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          Complete Order Details <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
