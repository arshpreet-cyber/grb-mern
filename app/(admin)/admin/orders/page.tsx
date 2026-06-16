"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClipboardList, Eye, Trash2, Mail, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

type Order = {
  id: string;
  displayId: number | null;
  orderNumber: string | null;
  userId: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  amount: number | null;
  currency: string | null;
  status: string | null;
  paymentStatus: string | null;
  paymentMethod: string | null;
  paymentId: string | null;
  completedOn: string | null;
  createdAt: string;
  deletedAt: string | null;
  subscriptionId: string | null;
  rzpaySubscriptionId: string | null;
  isRecurring: number | null;
  user?: { name: string | null; email: string } | null;
};

const TABS = [
  { key: "all",          label: "All Orders" },
  { key: "paid",         label: "Paid Orders" },
  { key: "pending",      label: "Pending Orders" },
  { key: "processing",   label: "Processing Orders" },
  { key: "unpaid",       label: "Unpaid Orders" },
  { key: "completed",    label: "Completed Orders" },
  { key: "hold",         label: "Hold Orders" },
  { key: "subscription", label: "Subscription Orders" },
  { key: "deleted",      label: "Deleted Orders" },
];

const STATUS_OPTIONS = [
  { value: "1", label: "Pending" },
  { value: "2", label: "Complete" },
  { value: "3", label: "Hold" },
  { value: "4", label: "Cancelled" },
  { value: "5", label: "Processing" },
  { value: "6", label: "Refund" },
  { value: "7", label: "Failed" },
  { value: "8", label: "Fraud" },
  { value: "9", label: "Active" },
];

const PAYMENT_OPTIONS = [
  { value: "1", label: "Unpaid" },
  { value: "2", label: "Paid" },
  { value: "3", label: "Cancelled" },
  { value: "4", label: "Unconfirmed" },
];

import { paymentMethodLabel, paymentMethodColor, PAYMENT_METHODS } from "@/lib/status-labels";

const STATUS_COLORS: Record<string, string> = {
  "1": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "2": "bg-green-100 text-green-700 border-green-300",
  "3": "bg-orange-100 text-orange-700 border-orange-300",
  "4": "bg-red-100 text-red-700 border-red-300",
  "5": "bg-blue-100 text-blue-700 border-blue-300",
  "6": "bg-purple-100 text-purple-700 border-purple-300",
  "7": "bg-red-100 text-red-700 border-red-300",
  "8": "bg-red-100 text-red-700 border-red-300",
  "9": "bg-emerald-100 text-emerald-700 border-emerald-300",
};

const PAYMENT_COLORS: Record<string, string> = {
  "1": "bg-red-100 text-red-700 border-red-300",
  "2": "bg-green-100 text-green-700 border-green-300",
  "3": "bg-gray-100 text-gray-600 border-gray-300",
  "4": "bg-yellow-100 text-yellow-700 border-yellow-300",
};

const PAGE_SIZE_OPTIONS = [25, 50, 100];

function StatusDropdown({
  value, options, colors, orderId, field, onChange
}: {
  value: string | null;
  options: { value: string; label: string }[];
  colors: Record<string, string>;
  orderId: string;
  field: string;
  onChange: (id: string, field: string, val: string) => void;
}) {
  const current = value ?? "1";
  const color = colors[current] ?? "bg-gray-100 text-gray-600 border-gray-300";
  return (
    <select
      value={current}
      onChange={(e) => onChange(orderId, field, e.target.value)}
      className={`text-[11px] font-semibold px-2 py-1 rounded border cursor-pointer outline-none ${color}`}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async (filter: string, q = "", pg = 1, ps = 25) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/orders?filter=${filter}&search=${encodeURIComponent(q)}&page=${pg}&pageSize=${ps}&adminView=true`
      );
      const data = await res.json();
      if (data.orders) {
        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
        setPage(data.page ?? 1);
      } else {
        // Fallback for unexpected response
        setOrders(Array.isArray(data) ? data : []);
        setTotal(0);
        setTotalPages(1);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCounts = async () => {
    try {
      const res = await fetch(`/api/orders?countsOnly=1&adminView=true`);
      const data = await res.json();
      if (data.counts) setCounts(data.counts);
    } catch {
      // Silently ignore count fetch errors
    }
  };

  useEffect(() => { fetchCounts(); fetchOrders("all", "", 1, pageSize); }, []);
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchOrders(activeTab, search, 1, pageSize);
    }, 400);
    return () => clearTimeout(t);
  }, [search, activeTab]);

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchOrders(activeTab, search, newPage, pageSize);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
    fetchOrders(activeTab, search, 1, newSize);
  };

  const updateField = async (id: string, field: string, value: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    await fetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deletedAt: new Date().toISOString() }) });
    setOrders(prev => prev.filter(o => o.id !== id));
    setTotal(prev => prev - 1);
  };

  const handleSendUnpaidEmail = async (id: string) => {
    setSendingEmail(id);
    try {
      const res = await fetch(`/api/orders/${id}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "unpaid" }),
      });
      const { toast } = await import("sonner");
      if (res.ok) toast.success("Unpaid reminder email sent.");
      else toast.error("Failed to send email.");
    } finally {
      setSendingEmail(null);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-2xl bg-white dark:bg-[#1a1f2c] border border-gray-100 dark:border-slate-800 p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-yellow-950/40 flex items-center justify-center text-[#D8A720]">
            <ClipboardList size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Order Management</h1>
            <p className="text-xs text-gray-500">Track and manage all customer transactions.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSearch(""); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-[#fc0] text-slate-900 border-[#fc0] shadow-lg shadow-amber-500/10"
                : "bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border-gray-100 dark:border-slate-800 hover:border-amber-300 hover:text-amber-600"
            }`}>
            {tab.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${activeTab === tab.key ? "bg-black/10 text-slate-900" : "bg-gray-100 dark:bg-slate-800 text-gray-500"}`}>
              {counts[tab.key] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-[#1a1f2c] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Search + Page Size */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative max-w-sm flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order no, customer, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-[13px] border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-white outline-none focus:border-[#fc0]"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value, 10))}
              className="border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-white px-2 py-1 text-xs outline-none cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900">
                {["#Order No.", "User", "Payment ID", "Amount", "Payment Method", "Order Date", "Admin Status", "Payment Status", "Completed On", "Action"].map(h => (
                  <th key={h} className="px-4 py-3 font-semibold text-gray-500 dark:text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-400">Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-400">No orders found</td></tr>
              ) : orders.map(o => {
                const isNull = (val: string | null | undefined) => !val || val === "NULL" || val === "null";
                const fName = isNull(o.firstName) ? "" : o.firstName;
                const lName = isNull(o.lastName) ? "" : o.lastName;
                let customerName = `${fName} ${lName}`.trim();
                if (!customerName) {
                  customerName = isNull(o.user?.name) ? "—" : (o.user?.name || "—");
                }
                
                const displayPaymentId = isNull(o.paymentId) ? "—" : o.paymentId;

                return (
                  <tr key={o.id} className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    {/* Order No */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <Link href={`/admin/orders/${o.id}`} className="font-bold text-amber-600 dark:text-amber-400 hover:underline font-mono text-[12px]">
                          {o.orderNumber || `#${o.id}`}
                        </Link>
                        {(o.isRecurring === 1 || o.subscriptionId || o.rzpaySubscriptionId) && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-700 border border-violet-200 w-fit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
                            Subscription
                          </span>
                        )}
                      </div>
                    </td>
                    {/* User */}
                    <td className="px-4 py-3">
                      {o.userId && o.userId !== "NULL" ? (
                        <Link href={`/admin/users/${o.userId}`} className="font-semibold text-gray-900 dark:text-white hover:text-[#D8A720] dark:hover:text-yellow-400 hover:underline transition-colors">
                          {customerName}
                        </Link>
                      ) : (
                        <div className="font-semibold text-gray-900 dark:text-white">{customerName}</div>
                      )}
                      <div className="text-gray-400 text-[11px]">{isNull(o.email) ? (isNull(o.user?.email) ? "—" : o.user?.email) : o.email}</div>
                    </td>
                    {/* Payment ID */}
                    <td className="px-4 py-3 font-mono text-gray-500 dark:text-slate-400">
                      <span className="block whitespace-nowrap">{displayPaymentId}</span>
                    </td>
                    {/* Amount */}
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                      {o.amount != null ? `$${o.amount}` : "—"}
                    </td>
                    {/* Payment Method */}
                    <td className="px-4 py-3">
                      {o.paymentMethod ? (
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md ${paymentMethodColor(o.paymentMethod)}`}>
                          {paymentMethodLabel(o.paymentMethod)}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">—</span>
                      )}
                    </td>
                    {/* Order Date */}
                    <td className="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-slate-400">
                      {new Date(o.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      <div className="text-[10px] text-gray-400">{new Date(o.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
                    </td>
                    {/* Admin Status */}
                    <td className="px-4 py-3">
                      <StatusDropdown
                        value={o.status}
                        options={STATUS_OPTIONS}
                        colors={STATUS_COLORS}
                        orderId={o.id}
                        field="status"
                        onChange={updateField}
                      />
                    </td>
                    {/* Payment Status */}
                    <td className="px-4 py-3">
                      <StatusDropdown
                        value={o.paymentStatus}
                        options={PAYMENT_OPTIONS}
                        colors={PAYMENT_COLORS}
                        orderId={o.id}
                        field="paymentStatus"
                        onChange={updateField}
                      />
                    </td>
                    {/* Completed On */}
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-[11px]">
                      {o.completedOn ? new Date(o.completedOn).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                    </td>
                    {/* Action */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {/* Converted button to Link for seamless, reliable client-side navigation */}
                        <Link 
                          href={`/admin/orders/${o.id}`}
                          title="View" 
                          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors inline-block"
                        >
                          <Eye size={15} />
                        </Link>

                        <button 
                          title="Delete" 
                          onClick={() => handleDelete(o.id)} 
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                        
                        <button
                          title="Send unpaid reminder"
                          onClick={() => handleSendUnpaidEmail(o.id)}
                          disabled={sendingEmail === o.id}
                          className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-40"
                        >
                          <Mail size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages >= 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
            <div className="text-xs text-gray-500 dark:text-slate-400">
              Showing <span className="font-semibold text-gray-700 dark:text-white">{startItem}</span>–<span className="font-semibold text-gray-700 dark:text-white">{endItem}</span> of <span className="font-semibold text-gray-700 dark:text-white">{total}</span> orders
            </div>
            <div className="flex items-center gap-1">
              {/* First Page */}
              <button
                onClick={() => goToPage(1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="First page"
              >
                <ChevronsLeft size={16} />
              </button>
              {/* Previous Page */}
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-xs select-none">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p as number)}
                    className={`min-w-[32px] h-8 rounded-lg text-xs font-semibold transition-all ${
                      page === p
                        ? "bg-[#fc0] text-slate-900 shadow-md shadow-amber-500/20"
                        : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              {/* Next Page */}
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Next page"
              >
                <ChevronRight size={16} />
              </button>
              {/* Last Page */}
              <button
                onClick={() => goToPage(totalPages)}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
