"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Added Next.js routing engine

// --- Types ---
interface Subscription {
  id: string; // Used for routing and React keys
  orderNo: string;
  paymentId: string;
  amount: string;
  orderDate: string;
  renewalDate: string;
  duration: string;
}

export default function DemoDashboard() {
  const { data: session } = useSession();
  const router = useRouter(); // Core router instance initialization
  
  // --- State ---
  const [activeSubscriptions, setActiveSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Data Fetching ---
  useEffect(() => {
    fetch("/api/subscriptions?userId=" + session?.user?.id)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch subscriptions");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setActiveSubscriptions(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching plans:", error);
        // Fallback mock data matching the schema
        setActiveSubscriptions([
          { id: "1", orderNo: "#ORD-1771509", paymentId: "PAY-987654321", amount: "$100.00", orderDate: "27-03-2026", renewalDate: "30-03-2026", duration: "30 Days" },
          { id: "2", orderNo: "#ORD-1771510", paymentId: "PAY-987654322", amount: "$100.00", orderDate: "27-03-2026", renewalDate: "30-03-2026", duration: "30 Days" },
          { id: "3", orderNo: "#ORD-1771511", paymentId: "PAY-987654323", amount: "$100.00", orderDate: "27-03-2026", renewalDate: "30-03-2026", duration: "30 Days" },
          { id: "4", orderNo: "#ORD-1771512", paymentId: "PAY-987654324", amount: "$100.00", orderDate: "27-03-2026", renewalDate: "30-03-2026", duration: "30 Days" }
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [session?.user?.id]);

  return (
    <div className="w-full mx-auto flex flex-col gap-6 relative">
      {/* Header */}
      <div>
        <h1 className="text-[32px] md:text-[36px] font-semibold text-gray-900 mb-1 mt-[30px] tracking-tight">
          Subscription Details
        </h1>
        <p className="text-[14px] md:text-[15px] text-gray-600 font-normal">
          Boost your online reputation by generating more authentic Google reviews.
        </p>
      </div>

      {/* LEFT COLUMN: Active Plan Details */}
      <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 pb-5">
          <h2 className="text-[18px] font-semibold text-gray-900">Active Plan Details</h2>
          <p className="text-[14px] text-gray-500 mt-1">Details of your currently active plan.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#F4F5F7]">
                <th className="px-5 py-4 text-[13px] font-medium text-gray-700 whitespace-nowrap"># Order No.</th>
                <th className="px-5 py-4 text-[13px] font-medium text-gray-700 whitespace-nowrap">Payment ID</th>
                <th className="px-5 py-4 text-[13px] font-medium text-gray-700 whitespace-nowrap">Amount</th>
                <th className="px-5 py-4 text-[13px] font-medium text-gray-700 whitespace-nowrap">Order Date</th>
                <th className="px-5 py-4 text-[13px] font-medium text-gray-700 whitespace-nowrap">Renewal Date</th>
                <th className="px-5 py-4 text-[13px] font-medium text-gray-700 whitespace-nowrap">Duration</th>
                <th className="px-5 py-4 text-[13px] font-medium text-gray-700 whitespace-nowrap text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    Loading your subscription details...
                  </td>
                </tr>
              ) : activeSubscriptions.length > 0 ? (
                activeSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-5 text-[14px] font-medium text-gray-800">{sub.orderNo}</td>
                    <td className="px-5 py-5 text-[14px] text-gray-600">{sub.paymentId}</td>
                    <td className="px-5 py-5 text-[14px] text-gray-600">{sub.amount}</td>
                    <td className="px-5 py-5 text-[14px] text-gray-600">{sub.orderDate}</td>
                    <td className="px-5 py-5 text-[14px] text-gray-600">{sub.renewalDate}</td>
                    <td className="px-5 py-5 text-[14px] text-gray-600">{sub.duration}</td>
                    <td className="px-5 py-5 text-[14px] text-center">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => router.push(`/admin/orders/${sub.id}`)}
                          className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                          title="View Details Fullscreen"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.8} 
                            stroke="currentColor" 
                            className="w-5 h-5"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    No active plans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}