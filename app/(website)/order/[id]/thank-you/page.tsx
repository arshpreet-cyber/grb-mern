"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Wrapper from "@/components/ui/Wrapper";

export default function ThankYouPage() {
  const { id } = useParams<{ id: string }>();

  const steps = [
    { number: 1, label: "Configure & Order", active: false },
    { number: 2, label: "Order Details", active: false },
    { number: 3, label: "Order Placed", active: true },
  ];

  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      <div className="bg-[#f7f7f7] py-[50px] md:pb-[60px]">
        <Wrapper>
          {/* Progress Steps */}
          <div className="flex justify-center mb-[60px] pt-[10px]">
            <div className="relative flex justify-between w-[600px] max-w-full">
              <div className="absolute top-[25px] left-[40px] w-[87%] h-[2px] z-0 flex">
                <div className="bg-[#fcd535] flex-1"></div>
                <div className="bg-[#fcd535] flex-1"></div>
              </div>
              {steps.map((step) => (
                <div key={step.number} className="relative z-[2] text-center w-[120px]">
                  <div className={`w-[50px] h-[50px] rounded-full flex items-center justify-center border-2 mx-auto mb-[10px] font-semibold text-[18px] transition-all duration-300 ${
                    step.active
                      ? "bg-[#fcd535] border-[#fcd535] text-[#212529] outline outline-[2px] outline-[#212529]"
                      : "bg-[#fcd535] border-[#fcd535] text-[#212529]"
                  }`}>
                    {step.number}
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.5px] whitespace-nowrap text-[#212529]">
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thank You Card */}
          <div className="bg-white rounded-[11px] p-[50px] max-w-2xl mx-auto text-center shadow-sm">
            {/* Checkmark */}
            <div className="w-20 h-20 bg-[#28a745] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h1 className="text-[28px] font-bold text-[#212529] mb-3">Thank You for Your Order!</h1>
            <p className="text-[15px] text-[#6c757d] mb-2">
              Your order has been placed successfully and our team has been notified.
            </p>
            <p className="text-[13px] text-[#adb5bd] mb-8">Order ID: {id}</p>

            <div className="bg-[#fff3cd] border border-[#ffeeba] rounded-xl p-5 mb-8 text-left">
              <p className="text-[13px] font-semibold text-[#856404] mb-1">What happens next?</p>
              <ul className="text-[13px] text-[#856404] space-y-1 list-disc list-inside">
                <li>Our team will review your order details</li>
                <li>Work will begin within 24 hours</li>
                <li>You will receive email updates on progress</li>
                <li>Track your order anytime from your dashboard</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard/orders"
                className="bg-[#fcd535] text-[#212529] font-bold text-[14px] px-8 py-[12px] rounded-[50px] hover:bg-[#f0c000] transition-all"
              >
                View My Orders
              </Link>
              <Link
                href="/"
                className="bg-white text-[#555] border border-[#ccc] font-medium text-[14px] px-8 py-[12px] rounded-[50px] hover:bg-[#f8f9fa] transition-all"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </Wrapper>
      </div>
    </div>
  );
}
