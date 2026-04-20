"use client";

import { useSession } from "next-auth/react";
import { ShoppingBag, BadgeCheck, History, BadgeX } from "lucide-react";

export default function DemoDashboard() {
  const { data: session } = useSession();

  // Data array for the stat cards to keep the JSX clean
  const stats = [
    {
      title: "TOTAL ORDERS",
      value: "50",
      icon: ShoppingBag,
      bgColor: "bg-[#FAEDE2]",   // Light peach
      iconColor: "text-[#D98A2C]", // Orange stroke
    },
    {
      title: "COMPLETED ORDERS",
      value: "38",
      icon: BadgeCheck,
      bgColor: "bg-[#EBF7E5]",   // Light green
      iconColor: "text-[#5AC328]", // Green stroke
    },
    {
      title: "PENDING ORDERS",
      value: "8",
      icon: History,
      bgColor: "bg-[#FDF9E7]",   // Light yellow/cream
      iconColor: "text-[#DBA32A]", // Gold/Yellow stroke
    },
    {
      title: "CANCELLED ORDERS",
      value: "4",
      icon: BadgeX,
      bgColor: "bg-[#FBEBEB]",   // Light red
      iconColor: "text-[#D32F2F]", // Red stroke
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Header Section */}
        <div>
          <h1 className="text-[40px] font-[500] text-gray-900 mb-2 tracking-tight">
            All Orders
          </h1>
          <p className="text-gray-600 text-sm font-[400]">
            Lorem Ipsum is simply dummy text of the printing
          </p>
        </div>

        {/* Outer White Container (as seen in the image) */}
        <div className="bg-white rounded-[24px] p-4 md:p-6 shadow-sm border border-gray-100">
          
          {/* 4-Column Grid for Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`${stat.bgColor} rounded-xl p-6 flex items-center justify-between transition-transform hover:-translate-y-1`}
                >
                  {/* Left Side: Number and Label */}
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-[500] text-gray-900">
                      {stat.value}
                    </span>
                    <span className="text-[10px] font-[600] tracking-widest text-gray-500 uppercase">
                      {stat.title}
                    </span>
                  </div>

                  {/* Right Side: Icon */}
                  <div className={`${stat.iconColor}`}>
                    <Icon size={38} strokeWidth={1.5} />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}