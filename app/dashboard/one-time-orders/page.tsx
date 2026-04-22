"use client";

import { useState, useEffect } from "react";
import { 
  ShoppingBag, BadgeCheck, History, BadgeX, 
  ChevronDown, Filter, MoreVertical, ChevronLeft, ChevronRight,
  CheckCircle2, FileText, Eye
} from "lucide-react";

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
  { id: "1", orderNumber: "100452", paymentId: "PAY-88214A", amount: 150.00, createdAt: new Date().toISOString(), paymentMethod: "Credit Card", status: "Complete", paymentStatus: "Complete" },
  { id: "2", orderNumber: "100453", paymentId: "PAY-11992B", amount: 89.99, createdAt: new Date(Date.now() - 86400000).toISOString(), paymentMethod: "PayPal", status: "Pending", paymentStatus: "Pending" },
  { id: "3", orderNumber: "100454", paymentId: "PAY-44556C", amount: 210.50, createdAt: new Date(Date.now() - 172800000).toISOString(), paymentMethod: "Stripe", status: "Cancelled", paymentStatus: "Pending" },
  { id: "4", orderNumber: "100455", paymentId: "PAY-77332D", amount: 45.00, createdAt: new Date(Date.now() - 259200000).toISOString(), paymentMethod: "Credit Card", status: "Processing", paymentStatus: "Complete" },
];

export default function DemoDashboard() {
  // --- State ---
  const [allOrders, setAllOrders] = useState<Order[]>([]); // Source of truth from DB
  const [orders, setOrders] = useState<Order[]>([]); // Filtered state for UI
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
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
            status: o.status as Order["status"],
            paymentStatus: o.paymentStatus as Order["paymentStatus"],
          }));
          setAllOrders(mappedOrders);
          setOrders(mappedOrders);
        } else {
          // Fallback to static data if API returns empty/invalid
          setAllOrders(STATIC_ORDERS);
          setOrders(STATIC_ORDERS);
        }
      })
      .catch(() => {
        // Fallback on error
        setAllOrders(STATIC_ORDERS);
        setOrders(STATIC_ORDERS);
      })
      .finally(() => setLoading(false));
  }, []);

  // --- Filtering Logic ---
  useEffect(() => {
    // If initially loading, skip the filter delay
    if (allOrders.length === 0) return;

    setCurrentPage(1); // Reset page on filter/search
    
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
        <h1 className="text-[36px] font-[500] text-gray-900 mb-1 mt-[30px] tracking-tight">All Orders</h1>
        <p className="text-[15px] text-gray-600 font-normal">Manage your recent transactions and view order statuses.</p>
      </div>

      {/* Stat Cards */}
      <div className="bg-[#FFFFFF] rounded-[20px] p-2 md:p-6 border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`${stat.bgColor} rounded-xl p-6 flex items-center justify-between transition-transform hover:-translate-y-1`}>
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-[500] text-gray-900">{stat.value}</span>
                  <span className="text-[10px] font-[600] tracking-widest text-gray-500 uppercase">{stat.title}</span>
                </div>
                <div className={`${stat.iconColor}`}><Icon size={50} strokeWidth={1.5} /></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[20px] border border-gray-100 mt-1 overflow-hidden shadow-sm">
        <div className="px-6 py-5 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
          
          <div className="flex items-center gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-1.5 text-[14px] font-medium transition-all rounded-[10px] ${
                  activeTab === tab.value ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-gray-400"
            /> */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-600 font-medium hover:bg-gray-50 whitespace-nowrap">
              Sort By <ChevronDown size={16} className="text-gray-400" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-600 font-medium hover:bg-gray-50">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {[
                  "# Order No", "Payment ID", "Amount", "Date", 
                  "Payment Method", "Status", "Payment Status", 
                  "Order Details", "Payment option", "Action"
                ].map((h) => (
                  <th key={h} className="px-5 py-4 text-[10px] font-[500] uppercase tracking-widest text-slate-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={10} className="text-center py-12 text-gray-500">Loading orders...</td></tr>
              ) : paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-5 text-[13px] text-gray-800">{order.orderNumber}</td>
                    <td className="px-5 py-5 text-[13px] text-gray-600">{order.paymentId || "N/A"}</td>
                    <td className="px-5 py-5 text-[13px] text-gray-800">${order.amount.toFixed(2)}</td>
                    <td className="px-5 py-5 text-[13px] text-gray-600">{new Date(order.createdAt).toLocaleDateString('en-GB')}</td>
                    <td className="px-5 py-5">
                      <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-[400] text-amber-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {order.paymentMethod || "N/A"}
                      </span>
                    </td>

                  <td className="px-5 py-5">
                    <span className={`inline-flex items-center gap-1.5 rounded-[5px] border px-2.5 py-1 text-[10px] font-[400] ${order.status === "Pending" ? "border-rose-200 bg-rose-50 text-rose-600" : "border-emerald-200 bg-emerald-50 text-emerald-600"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${order.status === "Pending" ? "bg-rose-500" : "bg-emerald-500"}`} />
                      {order.status}
                    </span>
                  </td>

                  <td className="px-5 py-5">
                    <span className={`inline-flex items-center gap-1.5 rounded-[5px] border px-2.5 py-1 text-[10px] font-[400] ${order.paymentStatus === "Pending" ? "border-rose-200 bg-rose-50 text-rose-600" : "border-emerald-200 bg-emerald-50 text-emerald-600"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${order.paymentStatus === "Pending" ? "bg-rose-500" : "bg-emerald-500"}`} />
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <button className="rounded-[5px] bg-blue-600 px-3 py-1 text-[10px] font-[400] text-white shadow-sm hover:bg-blue-700 transition">
                      Input Details
                    </button>
                  </td>
                    <td className="px-5 py-5">
                      {order.status !== "Complete" && (
                        <div className="flex flex-col gap-2 min-w-[120px]">
                          <select className="w-full border border-gray-200 rounded-md px-2 py-1 text-[12px] bg-white cursor-pointer outline-none">
                            <option>Choose Method</option>
                            <option>Credit Card</option>
                            <option>PayPal</option>
                          </select>
                          <button className="w-full bg-[#0092FF] text-white text-[12px] font-medium py-1.5 rounded-md transition-colors">Pay Now</button>
                        </div>
                      )}
                    </td>
                    {/* Action Column with Dropdown */}
                    <td className="relative px-5 py-5 text-center">
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === order.id ? null : order.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === order.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-4 top-14 z-[100] w-32 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden">
                            <div className="group flex items-center gap-2 px-3 py-2.5 text-slate-700 hover:bg-[#54CE12] cursor-pointer transition-colors">
                              <CheckCircle2 size={16} className="text-slate-400 group-hover:text-white" />
                              <span className="text-[12px] font-[400] group-hover:text-white">Live Status</span>
                            </div>
                            <div className="group flex items-center gap-2 px-3 py-2.5 text-slate-700 hover:bg-[#54CE12] cursor-pointer transition-colors">
                              <FileText size={16} className="text-slate-400 group-hover:text-white" />
                              <span className="text-[12px] font-[400] group-hover:text-white">Invoices</span>
                            </div>
                            <div className="group flex items-center gap-2 px-3 py-2.5 text-slate-700 hover:bg-[#54CE12] cursor-pointer transition-colors">
                              <Eye size={16} className="text-slate-400 group-hover:text-white" />
                              <span className="text-[12px] font-[400] group-hover:text-white">See More</span>
                            </div>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={10} className="text-center py-12 text-gray-500">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {orders.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/30">
            <p className="text-[14px] text-gray-600">
              Showing {showingFrom} to {showingTo} of {orders.length} Entries
            </p>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-7 h-7 rounded-full text-[13px] font-medium transition-colors ${
                    currentPage === idx + 1 ? "bg-black text-white" : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-50 transition-colors"
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
    ? "border-[#4CAF50] text-[#4CAF50] bg-[#EBF7E5]" 
    : status === "Cancelled" 
      ? "border-[#F44336] text-[#F44336] bg-[#FBEBEB]" 
      : "border-[#D98A2C] text-[#D98A2C] bg-[#FDF9E7]"; 
  
  const dotColor = isComplete 
    ? "bg-[#4CAF50]" 
    : status === "Cancelled" 
      ? "bg-[#F44336]" 
      : "bg-[#D98A2C]";

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-[12px] font-medium w-max ${colorClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      {status}
    </span>
  );
}