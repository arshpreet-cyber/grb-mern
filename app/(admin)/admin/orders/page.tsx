"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClipboardList, Eye, Trash2, Mail, Search } from "lucide-react";

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

const STATUS_OPTIONS = [
  { value: "1", label: "Pending" },
  { value: "2", label: "Processing" },
  { value: "3", label: "Complete" },
  { value: "4", label: "Hold" },
  { value: "5", label: "Cancelled" },
  { value: "6", label: "Refund" },
];

const PAYMENT_OPTIONS = [
  { value: "1", label: "Unpaid" },
  { value: "2", label: "Paid" },
  { value: "3", label: "Unconfirmed" },
  { value: "4", label: "Cancelled" },
];

const PM_MAP: Record<string, { label: string; color: string }> = {
  "1": { label: "Card",     color: "bg-gray-800 text-white" },
  "2": { label: "Stripe",   color: "bg-indigo-600 text-white" },
  "3": { label: "Razorpay", color: "bg-blue-500 text-white" },
  "4": { label: "PayPal",   color: "bg-blue-700 text-white" },
  "5": { label: "Card",     color: "bg-gray-800 text-white" },
};

const STATUS_COLORS: Record<string, string> = {
  "1": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "2": "bg-blue-100 text-blue-700 border-blue-300",
  "3": "bg-green-100 text-green-700 border-green-300",
  "4": "bg-orange-100 text-orange-700 border-orange-300",
  "5": "bg-red-100 text-red-700 border-red-300",
  "6": "bg-purple-100 text-purple-700 border-purple-300",
};

const PAYMENT_COLORS: Record<string, string> = {
  "1": "bg-red-100 text-red-700 border-red-300",
  "2": "bg-green-100 text-green-700 border-green-300",
  "3": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "4": "bg-gray-100 text-gray-600 border-gray-300",
};

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

  const fetchOrders = async (filter: string, q = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?filter=${filter}&search=${encodeURIComponent(q)}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    const keys = TABS.map(t => t.key);
    const results = await Promise.all(keys.map(k => fetch(`/api/orders?filter=${k}`).then(r => r.json())));
    const c: Record<string, number> = {};
    keys.forEach((k, i) => { c[k] = Array.isArray(results[i]) ? results[i].length : 0; });
    setCounts(c);
  };

  useEffect(() => { fetchCounts(); fetchOrders("all"); }, []);
  useEffect(() => {
    const t = setTimeout(() => fetchOrders(activeTab, search), 400);
    return () => clearTimeout(t);
  }, [search, activeTab]);

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
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSearch(""); }}
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
        {/* Search */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-800">
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order no, customer, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-[13px] border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-white outline-none focus:border-[#fc0]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900">
                {["#Order No.", "User", "Payment ID", "Amount", "Order Date", "Admin Status", "Payment Status", "Completed On", "Action"].map(h => (
                  <th key={h} className="px-4 py-3 font-semibold text-gray-500 dark:text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-gray-400">Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-gray-400">No orders found</td></tr>
              ) : orders.map(o => {
                const pm = PM_MAP[o.paymentMethod ?? ""] ?? { label: o.paymentMethod ?? "—", color: "bg-gray-200 text-gray-700" };
                const customerName = o.firstName ? `${o.firstName} ${o.lastName ?? ""}`.trim() : (o.user?.name ?? "—");
                return (
                  <tr key={o.id} className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    {/* Order No */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link href={`/admin/orders/${o.id}`} className="font-bold text-amber-600 dark:text-amber-400 hover:underline font-mono text-[12px]">
                        {o.id}
                      </Link>
                    </td>
                    {/* User */}
                    <td className="px-4 py-3">
                      {o.userId ? (
                        <Link href={`/admin/users/${o.userId}`} className="font-semibold text-gray-900 dark:text-white hover:text-[#D8A720] dark:hover:text-yellow-400 hover:underline transition-colors">
                          {customerName}
                        </Link>
                      ) : (
                        <div className="font-semibold text-gray-900 dark:text-white">{customerName}</div>
                      )}
                      <div className="text-gray-400 text-[11px]">{o.email ?? o.user?.email ?? ""}</div>
                    </td>
                    {/* Payment ID */}
                    <td className="px-4 py-3 font-mono text-gray-500 dark:text-slate-400 max-w-[120px]">
                      <span className="truncate block">{o.paymentId ? o.paymentId.slice(0, 12) + "..." : "—"}</span>
                    </td>
                    {/* Amount */}
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                      {o.amount != null ? `$${o.amount}` : "—"}
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
      </div>
    </div>
  );
}
