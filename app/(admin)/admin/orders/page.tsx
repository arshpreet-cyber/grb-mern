"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import DataTable, { Column, StatusPill } from "@/components/ui/DataTable";
import { ClipboardList, Search, Eye, ExternalLink, Download } from "lucide-react";

type Order = {
  id: string;
  orderNumber: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  itemName: string | null;
  amount: number | null;
  currency: string | null;
  status: string | null;
  paymentStatus: string | null;
  paymentMethod: string | null;
  workStatus: number | null;
  isOrderApi: number;
  coupon: string | null;
  couponDiscount: number | null;
  createdAt: string;
  deletedAt: string | null;
  user?: { name: string | null; email: string } | null;
};

const TABS = [
  { key: "all",        label: "All Orders" },
  { key: "paid",       label: "Paid Orders" },
  { key: "pending",    label: "Pending Orders" },
  { key: "processing", label: "Processing Orders" },
  { key: "unpaid",     label: "Unpaid Orders" },
  { key: "completed",  label: "Completed Orders" },
  { key: "deleted",    label: "Deleted Orders" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>({});

  const fetchOrders = async (filter: string, q = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?filter=${filter}&search=${encodeURIComponent(q)}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const keys = ["all", "paid", "pending", "processing", "unpaid", "completed", "deleted"];
      const results = await Promise.all(keys.map(k => fetch(`/api/orders?filter=${k}`).then(r => r.json())));
      const c: Record<string, number> = {};
      keys.forEach((k, i) => { c[k] = Array.isArray(results[i]) ? results[i].length : 0; });
      setCounts(c);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchCounts(); fetchOrders("all"); }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchOrders(activeTab, search), 400);
    return () => clearTimeout(t);
  }, [search, activeTab]);

  const columns: Column<Order>[] = [
    {
      key: "orderNumber",
      header: "Order #",
      render: (o) => (
        <span className="font-mono font-bold text-gray-900 dark:text-white text-[12px]">{o.orderNumber ?? "—"}</span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (o) => (
        <div className="flex flex-col gap-0.5 max-w-[150px]">
          <span className="font-bold text-gray-900 dark:text-white text-[13px] truncate">
            {o.firstName ? `${o.firstName} ${o.lastName ?? ""}`.trim() : (o.user?.name ?? "—")}
          </span>
          <span className="text-[11px] text-gray-400 dark:text-white/50 truncate font-mono">{o.email ?? o.user?.email ?? ""}</span>
        </div>
      ),
    },
    {
      key: "itemName",
      header: "Item Details",
      render: (o) => (
        <div className="flex flex-col gap-0.5 max-w-[180px]">
          <span className="text-gray-700 dark:text-white text-[12px] truncate font-medium">{o.itemName ?? "—"}</span>
          <div className="flex items-center gap-2">
             <span className="text-[10px] text-gray-400 dark:text-white/50 uppercase">{o.paymentMethod ?? "—"}</span>
             {o.isOrderApi === 2 && <span className="text-[9px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1 rounded-sm font-bold">API</span>}
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (o) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-gray-900 dark:text-white text-[14px]">
            {o.amount != null ? `${o.currency ?? "$"}${o.amount}` : "—"}
          </span>
          {o.coupon && (
            <span className="text-[10px] text-violet-500 font-mono">
              COUPON: {o.coupon} {o.couponDiscount ? `(-${o.couponDiscount}%)` : ""}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Order Status",
      render: (o) => (
        <StatusPill 
          value={o.status ?? "Pending"} 
          colorMap={{
            Pending:    "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-400",
            Complete:   "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400",
            Completed:  "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400",
            Hold:       "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400",
            Cancelled:  "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400",
            Processing: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-900/20 dark:text-indigo-400",
            Refund:     "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-900/20 dark:text-orange-400",
            Failed:     "border-rose-300 bg-rose-100 text-rose-800 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400",
            Active:     "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400",
          }}
        />
      ),
    },
    {
      key: "paymentStatus",
      header: "Payment",
      render: (o) => (
        <StatusPill 
          value={o.paymentStatus ?? "Pending"} 
          colorMap={{
            Pending:     "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400",
            Complete:    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400",
            Cancelled:   "border-gray-200 bg-gray-50 text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white",
            Unconfirmed: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-400",
          }}
        />
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      render: (o) => <span className="text-gray-400 dark:text-white/50 text-[11px] font-mono whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString()}</span>,
    },
  ];

  const actions = [
    {
      label: "View Details",
      icon: <Eye size={14} />,
      onClick: (o: Order) => { /* Details logic */ },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] bg-white dark:bg-[#1a1f2c] border border-gray-100 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <ClipboardList size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Order Management</h1>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-white">Track and manage all customer transactions.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <button className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2">
                <Download size={16} />
                Export CSV
            </button>
        </div>
      </div>

      {/* Custom Tab Filter - Premium UI */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map(tab => (
          <button 
            key={tab.key} 
            onClick={() => { setActiveTab(tab.key); setSearch(""); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                activeTab === tab.key 
                ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/20 scale-105" 
                : "bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border-gray-100 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-violet-400 shadow-sm"
            }`}
          >
            {tab.label}
            {counts[tab.key] !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400"}`}>
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#1a1f2c] rounded-[20px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <DataTable
          data={orders}
          columns={columns}
          loading={loading}
          actions={actions}
          searchable
          searchPlaceholder="Search by order no, customer email or item name..."
          searchValue={search}
          onSearchChange={setSearch}
          pageSize={10}
        />
      </div>
    </div>
  );
}
