"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

// --- Mock Data ---
const ACTIVE_PLANS = Array(1).fill({
  id: "1771509416",
  product: "Google Review",
  details: "$100/Monthly",
  duration: "30 Days",
  renewalDate: "27-04-2026",
  method: "Credit Card",
});

export default function DemoDashboard() {
  const { data: session } = useSession();

  return (
    <div className="w-full mx-auto flex flex-col gap-6 ">
      {/* Header */}
      <div>
        <h1 className="text-[32px] md:text-[36px] font-semibold text-gray-900 mb-1 mt-[30px] tracking-tight">
          Subscription Details
        </h1>
        <p className="text-[14px] md:text-[15px] text-gray-600 font-normal">
          Boost your online reputation by generating more authentic Google reviews.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 items-start">
        
        {/* LEFT COLUMN: Active Plan Details */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden flex flex-col ">
          <div className="p-6 pb-5">
            <h2 className="text-[18px] font-semibold text-gray-900">Active Plan Details</h2>
            <p className="text-[14px] text-gray-500 mt-1">Details of your currently active plan.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#F4F5F7]">
                  <th className="px-5 py-4 text-[13px] font-medium text-gray-700 whitespace-nowrap"># Order No</th>
                  <th className="px-5 py-4 text-[13px] font-medium text-gray-700 whitespace-nowrap">Product</th>
                  <th className="px-5 py-4 text-[13px] font-medium text-gray-700 whitespace-nowrap">Subscription Details</th>
                  <th className="px-5 py-4 text-[13px] font-medium text-gray-700 whitespace-nowrap">Duration</th>
                  <th className="px-5 py-4 text-[13px] font-medium text-gray-700 whitespace-nowrap">Renewal Date</th>
                  <th className="px-5 py-4 text-[13px] font-medium text-gray-700 whitespace-nowrap">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ACTIVE_PLANS.map((plan, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-5 text-[14px] text-gray-600">#{plan.id}</td>
                    <td className="px-5 py-5 text-[14px] text-gray-600">{plan.product}</td>
                    <td className="px-5 py-5 text-[14px] text-gray-600">{plan.details}</td>
                    <td className="px-5 py-5 text-[14px] text-gray-600">{plan.duration}</td>
                    <td className="px-5 py-5 text-[14px] text-gray-600">{plan.renewalDate}</td>
                    <td className="px-5 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-[#FDECB1] bg-[#FFFBF0] text-[#E5B300] text-[12px] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E5B300]"></span>
                        {plan.method}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: Info Cards */}
        <div className="flex flex-col gap-6">
          
          {/* Billing Details Card */}
          <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 lg:p-8">
            <h2 className="text-[18px] font-semibold text-gray-900">Billing Details</h2>
            <p className="text-[14px] text-gray-500 mt-1 mb-8">Lorem Ipsum is simply dummy text</p>

            <h3 className="text-[16px] font-semibold text-gray-900 mb-3">Billing Address</h3>
            <div className="text-[14px] text-gray-600 leading-relaxed flex flex-col gap-4">
              <p>Get Reviwes Buzz</p>
              <div>
                <p><span className="font-semibold text-gray-800">Phone:</span> +91 98765 43210</p>
                <p><span className="font-semibold text-gray-800">Email:</span> support@getreviews.buzz</p>
              </div>
            </div>
          </div>

          {/* Upcoming Payment Card */}
          <div className="bg-[#FFF6EB] rounded-[20px] p-6 lg:p-8 relative overflow-hidden h-full min-h-[260px] flex flex-col justify-center">
            {/* Background decorative circles */}
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#FFE8CC] rounded-full opacity-50 blur-2xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-[28px] md:text-[32px] font-medium text-black mb-4 tracking-tight">Upcoming Payment</h2>
              <p className="text-[15px] text-gray-800 leading-relaxed max-w-[280px] mb-8">
                Your next subscription payment will be processed on <span className="font-semibold text-black">27 May 2026.</span> Please confirm your billing details.
              </p>
              <button className="bg-black text-white text-[14px] font-medium px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors w-max">
                Pay Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}