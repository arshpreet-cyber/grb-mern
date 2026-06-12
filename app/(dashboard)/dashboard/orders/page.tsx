"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShoppingBag, BadgeCheck, History, BadgeX,
  ChevronDown, ChevronLeft, ChevronRight,
  Eye, ChevronsLeft, ChevronsRight
} from "lucide-react";
import { orderStatusLabel, paymentStatusLabel } from "@/lib/status-labels";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PayNowDropdown from "@/components/dashboard/PayNowDropdown";

// --- Types ---
const PM_LABELS: Record<string, string> = {
  "1": "Card", "2": "Stripe", "3": "Razorpay", "4": "PayPal", "5": "Pay by Card",
};

interface Order {
  id: string;
  displayId?: number | null;
  orderNumber: string;
  paymentId?: string;
  amount: number;
  createdAt: string;
  paymentMethod?: string;
  payUrl?: string | null;
  detailsFilled?: boolean;
  isRecurring?: number | null;
  status: string;
  paymentStatus: string;
  user?: { name: string; email: string };
}

type ApiOrder = {
  id: string;
  displayId?: number | null;
  orderNumber: string;
  amount: number;
  date: string;
  createdAt?: string;
  paymentId?: string | null;
  paymentMethod: string;
  payUrl?: string | null;
  detailsFilled?: boolean;
  isRecurring?: number | null;
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

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function DemoDashboard() {
  const router = useRouter();

  // --- State ---
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Counts State
  const [counts, setCounts] = useState<Record<string, number>>({});

  // --- Data Fetching ---
  const fetchCounts = async () => {
    try {
      const res = await fetch(`/api/orders?countsOnly=1&mine=1`);
      const data = await res.json();
      if (data.counts) setCounts(data.counts);
    } catch {
      // ignore
    }
  };

  const fetchOrders = useCallback(async (filter: string, q = "", pg = 1, ps = 10) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?filter=${filter}&search=${encodeURIComponent(q)}&page=${pg}&pageSize=${ps}&mine=1`);
      const data = await res.json();

      if (data.orders) {
        const isNullStr = (v: any) => !v || v === "NULL" || v === "null";

        const mappedOrders: Order[] = data.orders.map((o: ApiOrder) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          paymentId: isNullStr(o.paymentId) ? "—" : o.paymentId,
          amount: o.amount ?? 0,
          createdAt: o.date ?? o.createdAt,
          paymentMethod: isNullStr(o.paymentMethod) ? "—" : (PM_LABELS[o.paymentMethod] ?? o.paymentMethod),
          payUrl: o.payUrl,
          detailsFilled: o.detailsFilled,
          isRecurring: o.isRecurring,
          status: orderStatusLabel(o.status),
          paymentStatus: paymentStatusLabel(o.paymentStatus),
        }));
        setOrders(mappedOrders);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
        setCurrentPage(data.page ?? 1);
      } else {
        setOrders([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchOrders(activeTab, "", 1, pageSize);
  }, [activeTab, pageSize, fetchOrders]);

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    fetchOrders(activeTab, "", newPage, pageSize);
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const showingFrom = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, total);

  const stats = [
    { title: "TOTAL ORDERS", value: (counts["all"] ?? 0).toString(), icon: ShoppingBag, bgColor: "bg-[#FAEDE2]", iconColor: "text-[#D98A2C]" },
    { title: "COMPLETED ORDERS", value: (counts["completed"] ?? 0).toString(), icon: BadgeCheck, bgColor: "bg-[#EBF7E5]", iconColor: "text-[#5AC328]" },
    { title: "PENDING ORDERS", value: (counts["pending"] ?? 0).toString(), icon: History, bgColor: "bg-[#FDF9E7]", iconColor: "text-[#DBA32A]" },
    { title: "CANCELLED ORDERS", value: (counts["deleted"] ?? 0).toString(), icon: BadgeX, bgColor: "bg-[#FBEBEB]", iconColor: "text-[#D32F2F]" },
  ];

  return (
    <div className="w-full mx-auto flex flex-col gap-6 px-4 sm:px-6 lg:px-8">
      <div className="mt-6 md:mt-10">
        <h1 className="text-2xl sm:text-3xl md:text-[36px] font-medium text-gray-900 dark:text-white mb-1 tracking-tight">All Orders</h1>
        <p className="text-xs sm:text-[15px] text-gray-600 dark:text-slate-400 font-normal">Manage and track your entire order history.</p>
      </div>

      {/* Stat Cards */}
      <div className="bg-[#FFFFFF] dark:bg-[#1a1f2c] rounded-[20px] p-4 md:p-6 border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`${stat.bgColor} dark:bg-slate-800/50 rounded-xl p-5 md:p-6 flex items-center justify-between transition-all hover:-translate-y-1`}>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl md:text-3xl font-medium text-gray-900 dark:text-white">{stat.value}</span>
                  <span className="text-[10px] font-semibold tracking-widest text-gray-500 dark:text-slate-400 uppercase">{stat.title}</span>
                </div>
                <div className={`${stat.iconColor} dark:text-white/80 shrink-0`}>
                  <Icon className="w-10 h-10 md:w-[50px] md:h-[50px]" strokeWidth={1.5} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-[#1a1f2c] rounded-[20px] border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">

        {/* Controls Bar */}
        <div className="px-4 py-5 md:px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800">

          {/* Active Navigation Tabs */}
          <div className="flex flex-row items-center gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none -mx-4 px-4 lg:mx-0 lg:px-0">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-3 sm:px-4 py-1.5 text-xs sm:text-[14px] font-medium transition-all rounded-[10px] whitespace-nowrap ${activeTab === tab.value ? "bg-black dark:bg-white text-white dark:text-black" : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filtering Tools Layout */}
          <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
              <span>Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                className="border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-white px-2 py-1.5 text-xs outline-none cursor-pointer"
              >
                {PAGE_SIZE_OPTIONS.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <button
                onClick={() => setPaymentDropdownOpen(v => v === "header" ? null : "header")}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-[13px] text-gray-600 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 whitespace-nowrap transition-colors"
              >
                Payment Option <ChevronDown size={16} className="text-gray-400" />
              </button>
              {paymentDropdownOpen === "header" && (
                <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-44 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
                  <a href="https://www.paypal.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-3 text-[13px] text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors">
                    <span className="font-bold text-[#003087]">Pay</span><span className="font-bold text-[#009cde]">Pal</span>
                  </a>
                  <a href="https://razorpay.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-3 text-[13px] text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors border-t border-gray-100 dark:border-slate-800">
                    <span className="font-bold text-[#2D8CFF]">Razorpay</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop View: Traditional Table Layout */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                {[
                  "# Order No", "Payment ID", "Amount", "Date",
                  "Payment Method", "Status", "Payment Status",
                  "Order Details", "Payment option", "Action"
                ].map((h) => (
                  <th key={h} className="px-4 py-4 text-[10px] font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500 whitespace-nowrap text-center">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={10} className="text-center py-12 text-gray-500 dark:text-slate-400">Loading orders...</td></tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-5 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        <span className="text-[13px] text-gray-800 dark:text-slate-300 font-medium whitespace-nowrap">{order.orderNumber || order.id}</span>
                        {order.isRecurring === 1 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide whitespace-nowrap">
                            ● Subscription
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-5 text-[13px] text-gray-600 dark:text-slate-400 text-center class-id-truncation max-w-[120px] truncate" title={order.paymentId}>{order.paymentId || "—"}</td>
                    <td className="px-4 py-5 text-[13px] text-gray-800 dark:text-slate-200 font-bold text-center">${order.amount.toFixed(2)}</td>
                    <td className="px-4 py-5 text-[13px] text-gray-600 dark:text-slate-400 font-mono text-center whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}</td>
                    <td className="px-4 py-5 text-center">
                      {order.paymentMethod && order.paymentMethod !== "—" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 text-[10px] font-normal text-amber-600 dark:text-amber-400 whitespace-nowrap">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          {order.paymentMethod}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 rounded-[5px] border px-2.5 py-1 text-[10px] font-normal whitespace-nowrap ${order.status === "Pending" ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400" : "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${order.status === "Pending" ? "bg-rose-500" : "bg-emerald-500"}`} />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 rounded-[5px] border px-2.5 py-1 text-[10px] font-normal whitespace-nowrap ${order.paymentStatus === "Unpaid" || order.paymentStatus === "Pending" ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400" : "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${order.paymentStatus === "Unpaid" || order.paymentStatus === "Pending" ? "bg-rose-500" : "bg-emerald-500"}`} />
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-center">
                      {order.paymentStatus === "Paid" && !order.detailsFilled && (
                        <Link
                          href={`/order/${order.id}/details`}
                          className="rounded-[5px] bg-[#1E3A8A] dark:bg-blue-600 px-3 py-1.5 text-[10px] font-medium text-white shadow-sm hover:bg-blue-900 dark:hover:bg-blue-500 transition-colors whitespace-nowrap inline-block"
                        >
                          Input Details
                        </Link>
                      )}
                    </td>
                    <td className="px-4 py-5 text-center">
                      {order.paymentStatus !== "Paid" && (
                        <PayNowDropdown orderId={order.id} fallbackUrl={order.payUrl} />
                      )}
                    </td>
                    <td className="px-4 py-5 text-center">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="p-2 rounded-lg text-gray-400 dark:text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all duration-200 inline-flex items-center justify-center"
                        title="View Order Details"
                      >
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={10} className="text-center py-12 text-gray-500 dark:text-slate-400">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Dynamic Card-Based Layout Alternative */}
        <div className="block md:hidden divide-y divide-gray-100 dark:divide-slate-800">
          {loading ? (
            <div className="text-center py-12 text-gray-500 dark:text-slate-400 text-sm">Loading orders...</div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="p-4 flex flex-col gap-3 bg-white dark:bg-[#1a1f2c]">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] text-gray-900 dark:text-white font-semibold">
                      {order.orderNumber || order.id}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {new Date(order.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}
                    </span>
                  </div>
                  <span className="text-[16px] text-gray-900 dark:text-slate-200 font-bold">
                    ${order.amount.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-1.5 border-y border-gray-50 dark:border-slate-800/60">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase tracking-wider mb-0.5">Payment Method</span>
                    {order.paymentMethod && order.paymentMethod !== "—" ? (
                      <span className="text-gray-700 dark:text-slate-300 font-medium">{order.paymentMethod}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase tracking-wider mb-0.5">Payment ID</span>
                    <span className="text-gray-600 dark:text-slate-400 break-all">{order.paymentId || "—"}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded ${order.status === "Pending" ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"}`}>
                      {order.status}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded ${order.paymentStatus === "Unpaid" || order.paymentStatus === "Pending" ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"}`}>
                      {order.paymentStatus}
                    </span>
                    {order.isRecurring === 1 && (
                      <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[9px] px-1.5 py-0.5 font-bold uppercase rounded">
                        Subs
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {order.paymentStatus === "Paid" && !order.detailsFilled && (
                      <Link
                        href={`/order/${order.id}/details`}
                        className="rounded-[5px] bg-[#1E3A8A] dark:bg-blue-600 px-2.5 py-1.5 text-[10px] font-medium text-white shadow-sm"
                      >
                        Details
                      </Link>
                    )}

                    {order.paymentStatus !== "Paid" && (
                      <PayNowDropdown orderId={order.id} fallbackUrl={order.payUrl} />
                    )}

                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="p-1.5 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 rounded-lg hover:bg-gray-50"
                    >
                      <Eye size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-slate-400 text-sm">No orders found.</div>
          )}
        </div>

        {/* Pagination Footer */}
        {!loading && totalPages >= 1 && (
          <div className="px-4 py-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30 transition-colors">
            <p className="text-[13px] sm:text-[14px] text-gray-600 dark:text-slate-400 order-2 sm:order-1">
              Showing {showingFrom} to {showingTo} of {total} Entries
            </p>
            <div className="flex items-center gap-1 order-1 sm:order-2">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors text-gray-600 dark:text-slate-400"
                title="First page"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors text-gray-600 dark:text-slate-400"
                title="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center max-w-[140px] sm:max-w-none overflow-x-auto scrollbar-none">
                {getPageNumbers().map((p, idx) => (
                  p === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-1.5 text-gray-400 text-xs select-none">…</span>
                  ) : (
                    <button
                      key={`page-${p}`}
                      onClick={() => goToPage(p as number)}
                      className={`w-7 h-7 shrink-0 rounded-full text-[13px] font-medium transition-colors ${currentPage === p ? "bg-black dark:bg-white text-white dark:text-black shadow-sm" : "text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800"
                        }`}
                    >
                      {p}
                    </button>
                  )
                ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors text-gray-600 dark:text-slate-400"
                title="Next page"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors text-gray-600 dark:text-slate-400"
                title="Last page"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}