"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState, useCallback, Fragment } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClipboardList, Eye, Trash2, Mail, RotateCcw, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown, ChevronUp } from "lucide-react";

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
  siblingCount?: number;
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

  // Subscription expand state
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [siblingMap, setSiblingMap] = useState<Record<string, Order[]>>({});
  const [loadingExpand, setLoadingExpand] = useState<string | null>(null);

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
    fetchCounts();
  };

  const handleRestore = async (id: string) => {
    if (!confirm("Restore this order?")) return;
    await fetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deletedAt: null }) });
    setOrders(prev => prev.filter(o => o.id !== id));
    setTotal(prev => prev - 1);
    fetchCounts();
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

  const toggleSubscriptionExpand = async (o: Order) => {
    const id = o.id;
    if (expandedRows.has(id)) {
      setExpandedRows(prev => { const s = new Set(prev); s.delete(id); return s; });
      return;
    }
    if (!o.orderNumber) return;
    setLoadingExpand(id);
    try {
      const res = await fetch(`/api/orders?exactOrderNumber=${encodeURIComponent(o.orderNumber)}&adminView=true`);
      const data = await res.json();
      const all: Order[] = Array.isArray(data.orders) ? data.orders : [];
      // Exclude the parent row itself
      const siblings = all.filter(s => s.id !== id);
      setSiblingMap(prev => ({ ...prev, [id]: siblings }));
      setExpandedRows(prev => new Set(prev).add(id));
    } finally {
      setLoadingExpand(null);
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
                const isSubscription = !!(o.isRecurring === 1 || o.subscriptionId || o.rzpaySubscriptionId);
                const isExpanded = expandedRows.has(o.id);
                const siblings = siblingMap[o.id] ?? [];

                const renderRow = (row: Order, isChild = false) => {
                  const isNull = (val: string | null | undefined) => !val || val === "NULL" || val === "null";
                  const fName = isNull(row.firstName) ? "" : row.firstName;
                  const lName = isNull(row.lastName) ? "" : row.lastName;
                  let customerName = `${fName} ${lName}`.trim();
                  if (!customerName) customerName = isNull(row.user?.name) ? "—" : (row.user?.name || "—");
                  const displayPaymentId = isNull(row.paymentId) ? "—" : row.paymentId;

                  return (
                    <tr
                      key={`${row.id}-${isChild ? "child" : "parent"}`}
                      className={`border-b border-gray-50 dark:border-slate-800 transition-colors ${
                        isChild
                          ? "bg-violet-50/40 dark:bg-violet-950/10 hover:bg-violet-50 dark:hover:bg-violet-950/20"
                          : "hover:bg-gray-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      {/* Order No */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={`flex flex-col gap-1 ${isChild ? "pl-5" : ""}`}>
                          {isChild && (
                            <span className="text-violet-400 dark:text-violet-500 text-[10px] font-bold flex items-center gap-1">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                              Previous
                            </span>
                          )}
                          <div className="flex items-center gap-1.5">
                            {/* Expand toggle for subscription parent rows */}
                            {isSubscription && !isChild && (row.siblingCount ?? 0) > 0 && (
                              <button
                                onClick={() => toggleSubscriptionExpand(o)}
                                disabled={loadingExpand === o.id}
                                title={isExpanded ? "Collapse" : "Show previous payments"}
                                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${
                                  isExpanded
                                    ? "bg-violet-600 border-violet-600 text-white"
                                    : "bg-violet-100 border-violet-300 text-violet-700 hover:bg-violet-200"
                                } disabled:opacity-50`}
                              >
                                {loadingExpand === o.id ? (
                                  <svg className="animate-spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                                ) : isExpanded ? (
                                  <ChevronUp size={10} />
                                ) : (
                                  <ChevronDown size={10} />
                                )}
                              </button>
                            )}
                            <Link href={`/admin/orders/${row.id}`} className="font-bold text-amber-600 dark:text-amber-400 hover:underline font-mono text-[12px]">
                              {row.orderNumber || `#${row.id}`}
                            </Link>
                          </div>
                          {(row.isRecurring === 1 || row.subscriptionId || row.rzpaySubscriptionId) && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-700 border border-violet-200 w-fit">
                              <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
                              Subscription
                            </span>
                          )}
                        </div>
                      </td>
                      {/* User */}
                      <td className="px-4 py-3">
                        {row.userId && row.userId !== "NULL" ? (
                          <Link href={`/admin/users/${row.userId}`} className="font-semibold text-gray-900 dark:text-white hover:text-[#D8A720] dark:hover:text-yellow-400 hover:underline transition-colors">
                            {customerName}
                          </Link>
                        ) : (
                          <div className="font-semibold text-gray-900 dark:text-white">{customerName}</div>
                        )}
                        <div className="text-gray-400 text-[11px]">{isNull(row.email) ? (isNull(row.user?.email) ? "—" : row.user?.email) : row.email}</div>
                      </td>
                      {/* Payment ID */}
                      <td className="px-4 py-3 font-mono text-gray-500 dark:text-slate-400">
                        <span className="block whitespace-nowrap">{displayPaymentId}</span>
                      </td>
                      {/* Amount */}
                      <td className="px-4 py-3 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                        {row.amount != null ? `$${row.amount}` : "—"}
                      </td>
                      {/* Payment Method */}
                      <td className="px-4 py-3">
                        {row.paymentMethod ? (
                          <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md ${paymentMethodColor(row.paymentMethod)}`}>
                            {paymentMethodLabel(row.paymentMethod)}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[11px]">—</span>
                        )}
                      </td>
                      {/* Order Date */}
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-slate-400">
                        {new Date(row.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        <div className="text-[10px] text-gray-400">{new Date(row.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
                      </td>
                      {/* Admin Status */}
                      <td className="px-4 py-3">
                        <StatusDropdown value={row.status} options={STATUS_OPTIONS} colors={STATUS_COLORS} orderId={row.id} field="status" onChange={updateField} />
                      </td>
                      {/* Payment Status */}
                      <td className="px-4 py-3">
                        <StatusDropdown value={row.paymentStatus} options={PAYMENT_OPTIONS} colors={PAYMENT_COLORS} orderId={row.id} field="paymentStatus" onChange={updateField} />
                      </td>
                      {/* Completed On */}
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-[11px]">
                        {row.completedOn ? new Date(row.completedOn).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </td>
                      {/* Action */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link href={`/admin/orders/${row.id}`} title="View" className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors inline-block">
                            <Eye size={15} />
                          </Link>
                          {activeTab === "deleted" ? (
                            <button title="Restore order" onClick={() => handleRestore(row.id)} className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                              <RotateCcw size={15} />
                            </button>
                          ) : (
                            <>
                              <button title="Delete" onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                <Trash2 size={15} />
                              </button>
                              <button title="Send unpaid reminder" onClick={() => handleSendUnpaidEmail(row.id)} disabled={sendingEmail === row.id} className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-40">
                                <Mail size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                };

                return (
                  <Fragment key={o.id}>
                    {renderRow(o, false)}
                    {isExpanded && siblings.map(sibling => renderRow(sibling, true))}
                    {isExpanded && siblings.length === 0 && (
                      <tr key={`${o.id}-empty`} className="bg-violet-50/40 dark:bg-violet-950/10">
                        <td colSpan={10} className="px-8 py-2 text-[11px] text-violet-400 italic">No previous subscription payments found.</td>
                      </tr>
                    )}
                  </Fragment>
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
