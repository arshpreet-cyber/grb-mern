"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag, BadgeCheck, History, BadgeX,
  ChevronDown, ChevronLeft, ChevronRight,
  Eye, SlidersHorizontal
} from "lucide-react";
import { orderStatusLabel, paymentStatusLabel } from "@/lib/status-labels";
import { useRouter } from "next/navigation"; 

// --- Types ---
interface Order {
  id: string;
  orderNumber: string;
  paymentId?: string;
  amount: number;
  createdAt: string;
  paymentMethod?: string;
  status: "Pending" | "Complete" | "Processing" | "Cancelled";
  paymentStatus: "Pending" | "Complete";
  user?: { name: string; email: string };
}

type ApiOrder = {
  id: string;
  orderNumber: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: string;
  paymentStatus: string;
};

// --- Constants ---
const TABS = [
  { label: "All Orders", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Cancelled", value: "deleted" }, 
];

// Fallback data if API fails
const STATIC_ORDERS: Order[] = [
  { id: "1", orderNumber: "#1771509416", paymentId: "123456", amount: 100.00, createdAt: "2028-02-19T00:00:00.000Z", paymentMethod: "", status: "Pending", paymentStatus: "Pending" },
  { id: "2", orderNumber: "#1771509416", paymentId: "123456", amount: 100.00, createdAt: "2025-02-19T00:00:00.000Z", paymentMethod: "Credit Card", status: "Complete", paymentStatus: "Complete" },
];

export default function DemoDashboard() {
  const router = useRouter();

  // --- State ---
  const [allOrders, setAllOrders] = useState<Order[]>([]); // Source of truth from DB
  const [orders, setOrders] = useState<Order[]>([]); // Filtered state for UI
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10; 

  // --- Data Fetching ---
  useEffect(() => {
    setLoading(true);
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mappedOrders: Order[] = data.map((o: ApiOrder) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            paymentId: o.id.substring(0, 8).toUpperCase(),
            amount: o.amount,
            createdAt: o.date,
            paymentMethod: o.paymentMethod,
            status: orderStatusLabel(o.status) as Order["status"],
            paymentStatus: paymentStatusLabel(o.paymentStatus) as Order["paymentStatus"],
          }));
          setAllOrders(mappedOrders);
          setOrders(mappedOrders);
        } else {
          setAllOrders(STATIC_ORDERS);
          setOrders(STATIC_ORDERS);
        }
      })
      .catch(() => {
        setAllOrders(STATIC_ORDERS);
        setOrders(STATIC_ORDERS);
      })
      .finally(() => setLoading(false));
  }, []);

  // --- Filtering Logic ---
  useEffect(() => {
    if (allOrders.length === 0) return;

    setCurrentPage(1); 
    
    const delay = setTimeout(() => {
      let filtered = [...allOrders];

      if (activeTab === "completed") {
        filtered = filtered.filter(o => o.status === "Complete");
      } else if (activeTab === "pending") {
        filtered = filtered.filter(o => o.status === "Pending" || o.status === "Processing");
      } else if (activeTab === "deleted") {
        filtered = filtered.filter(o => o.status === "Cancelled");
      }

      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(o => 
          o.orderNumber.toLowerCase().includes(query) || 
          (o.paymentId && o.paymentId.toLowerCase().includes(query))
        );
      }

      setOrders(filtered);
    }, 300);

    return () => clearTimeout(delay);
  }, [activeTab, searchQuery, allOrders]);

  // --- Calculations for Pagination ---
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const showingFrom = orders.length === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(startIndex + ITEMS_PER_PAGE, orders.length);

  const stats = [
    { title: "TOTAL ORDERS", value: allOrders.length.toString(), icon: ShoppingBag, bgColor: "bg-[#FAEDE2]", iconColor: "text-[#D98A2C]" },
    { title: "COMPLETED ORDERS", value: allOrders.filter(o => o.status === "Complete").length.toString(), icon: BadgeCheck, bgColor: "bg-[#EBF7E5]", iconColor: "text-[#5AC328]" },
    { title: "PENDING ORDERS", value: allOrders.filter(o => o.status === "Pending" || o.status === "Processing").length.toString(), icon: History, bgColor: "bg-[#FDF9E7]", iconColor: "text-[#DBA32A]" },
    { title: "CANCELLED ORDERS", value: allOrders.filter(o => o.status === "Cancelled").length.toString(), icon: BadgeX, bgColor: "bg-[#FBEBEB]", iconColor: "text-[#D32F2F]" },
  ];

  return (
    <div className="w-full mx-auto flex flex-col gap-6 ">
      <div>
        <h1 className="text-[36px] font-[500] text-gray-900 dark:text-white mb-1 mt-[30px] tracking-tight">All Orders</h1>
        <p className="text-[15px] text-gray-600 dark:text-slate-400 font-normal">Manage and track your entire order history.</p>
      </div>

      {/* Stat Cards */}
      <div className="bg-[#FFFFFF] dark:bg-[#1a1f2c] rounded-[20px] p-2 md:p-6 border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`${stat.bgColor} dark:bg-slate-800/50 rounded-xl p-6 flex items-center justify-between transition-all hover:-translate-y-1`}>
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-[500] text-gray-900 dark:text-white">{stat.value}</span>
                  <span className="text-[10px] font-[600] tracking-widest text-gray-500 dark:text-slate-400 uppercase">{stat.title}</span>
                </div>
                <div className={`${stat.iconColor} dark:text-white/80`}><Icon size={50} strokeWidth={1.5} /></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-[#1a1f2c] rounded-[20px] border border-gray-100 dark:border-slate-800 mt-1 overflow-hidden shadow-sm transition-colors">
        <div className="px-6 py-5 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800">
          
          <div className="flex items-center gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-1.5 text-[14px] font-medium transition-all rounded-[10px] ${
                  activeTab === tab.value ? "bg-black dark:bg-white text-white dark:text-black" : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-[13px] text-gray-600 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 whitespace-nowrap transition-colors">
              Sort By <ChevronDown size={16} className="text-gray-400" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-[13px] text-gray-600 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              Filter <SlidersHorizontal size={14} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                {[
                  "# Order No", "Payment ID", "Amount", "Date", 
                  "Payment Method", "Status", "Payment Status", 
                  "Order Details", "Payment option", "Action"
                ].map((h) => (
                  <th key={h} className="px-5 py-4 text-[10px] font-[500] uppercase tracking-widest text-slate-400 dark:text-slate-500 whitespace-nowrap text-center last:text-center">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={10} className="text-center py-12 text-gray-500 dark:text-slate-400">Loading orders...</td></tr>
              ) : paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-5 text-[13px] text-gray-800 dark:text-slate-300 font-medium text-center">{order.orderNumber}</td>
                    <td className="px-5 py-5 text-[13px] text-gray-600 dark:text-slate-400 text-center">{order.paymentId || "N/A"}</td>
                    <td className="px-5 py-5 text-[13px] text-gray-800 dark:text-slate-200 font-bold text-center">${order.amount.toFixed(2)}</td>
                    <td className="px-5 py-5 text-[13px] text-gray-600 dark:text-slate-400 font-mono text-center">{new Date(order.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}</td>
                    <td className="px-5 py-5 text-center">
                      {order.paymentMethod ? (
                        <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 text-[10px] font-[400] text-amber-600 dark:text-amber-400 whitespace-nowrap">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          {order.paymentMethod}
                        </span>
                      ) : null}
                    </td>

                    <td className="px-5 py-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 rounded-[5px] border px-2.5 py-1 text-[10px] font-[400] whitespace-nowrap ${order.status === "Pending" ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400" : "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${order.status === "Pending" ? "bg-rose-500" : "bg-emerald-500"}`} />
                        {order.status}
                      </span>
                    </td>

                    <td className="px-5 py-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 rounded-[5px] border px-2.5 py-1 text-[10px] font-[400] whitespace-nowrap ${order.paymentStatus === "Pending" ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400" : "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${order.paymentStatus === "Pending" ? "bg-rose-500" : "bg-emerald-500"}`} />
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-5 text-center">
                      {order.status === "Complete" && (
                        <button className="rounded-[5px] bg-[#1E3A8A] dark:bg-blue-600 px-3 py-1.5 text-[10px] font-[500] text-white shadow-sm hover:bg-blue-900 dark:hover:bg-blue-500 transition-colors whitespace-nowrap">
                          Input Details
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-5 text-center">
                      {order.status !== "Complete" && (
                        <div className="flex flex-col gap-2 items-center">
                          <select className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 text-[10px] text-slate-600 dark:text-slate-300 outline-none w-32 transition-colors">
                            <option>Choose Methods</option>
                            <option>Credit Card</option>
                            <option>PayPal</option>
                          </select>
                          <button className="rounded-[5px] bg-[#0084FF] px-3 py-1.5 text-[11px] font-[500] text-white transition-colors w-32">Pay Now</button>
                        </div>
                      )}
                    </td>
                    
                    {/* Updated Action Column with Single Click Eye Button */}
                    <td className="px-5 py-5 text-center">
                      <button 
                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                        className="p-2 rounded-lg text-gray-400 dark:text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all duration-200 inline-flex items-center justify-center"
                        title="See More Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={10} className="text-center py-12 text-gray-500 dark:text-slate-400">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {orders.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30 transition-colors">
            <p className="text-[14px] text-gray-600 dark:text-slate-400">
              Showing {showingFrom} to {showingTo} of {orders.length} Entries
            </p>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors text-gray-600 dark:text-slate-400"
              >
                <ChevronLeft size={18} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-7 h-7 rounded-full text-[13px] font-medium transition-colors ${
                    currentPage === idx + 1 ? "bg-black dark:bg-white text-white dark:text-black shadow-sm" : "text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors text-gray-600 dark:text-slate-400"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const isComplete = status === "Complete" || status === "Paid";
  const colorClasses = isComplete 
    ? "border-[#4CAF50] text-[#4CAF50] bg-[#EBF7E5] dark:border-emerald-900/50 dark:text-emerald-400 dark:bg-emerald-900/20" 
    : status === "Cancelled" 
      ? "border-[#F44336] text-[#F44336] bg-[#FBEBEB] dark:border-rose-900/50 dark:text-rose-400 dark:bg-rose-900/20" 
      : "border-[#D98A2C] text-[#D98A2C] bg-[#FDF9E7] dark:border-amber-900/50 dark:text-amber-400 dark:bg-amber-900/20"; 
  
  const dotColor = isComplete 
    ? "bg-[#4CAF50]" 
    : status === "Cancelled" 
      ? "bg-[#F44336]" 
      : "bg-[#D98A2C]";

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-[12px] font-medium w-max transition-colors ${colorClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      {status}
    </span>
  );
}