"use client";

import { useEffect, useState } from "react";

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

const STATUS_COLOR: Record<string, string> = {
  Pending:    "bg-yellow-100 text-yellow-700",
  Complete:   "bg-green-100 text-green-700",
  Completed:  "bg-green-100 text-green-700",
  Hold:       "bg-blue-100 text-blue-700",
  Cancelled:  "bg-red-100 text-red-600",
  Processing: "bg-indigo-100 text-indigo-700",
  Refund:     "bg-orange-100 text-orange-700",
  Failed:     "bg-red-200 text-red-800",
  Active:     "bg-emerald-100 text-emerald-700",
};
const PAY_STATUS_COLOR: Record<string, string> = {
  Pending:     "bg-red-100 text-red-600",
  Complete:    "bg-green-100 text-green-700",
  Cancelled:   "bg-gray-100 text-gray-500",
  Unconfirmed: "bg-yellow-100 text-yellow-700",
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
    const res = await fetch(`/api/orders?filter=${filter}&search=${encodeURIComponent(q)}`);
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const fetchCounts = async () => {
    const keys = ["all", "paid", "pending", "processing", "unpaid", "completed", "deleted"];
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

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-800">Order Management</h1>

      {/* Tab Stats */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSearch(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition border ${activeTab === tab.key ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-600"}`}>
            {tab.label}
            {counts[tab.key] !== undefined && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <input type="text" placeholder="Search by order no, email, item..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-sm border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Order No</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Item</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Method</th>
                <th className="px-4 py-3 text-left">Coupon</th>
                <th className="px-4 py-3 text-left">Source</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={11} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={11} className="text-center py-10 text-gray-400">No orders found.</td></tr>
              ) : orders.map((o, i) => (
                <tr key={o.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">{o.orderNumber ?? "—"}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{o.firstName ? `${o.firstName} ${o.lastName ?? ""}`.trim() : (o.user?.name ?? "—")}</p>
                    <p className="text-xs text-gray-400">{o.email ?? o.user?.email ?? ""}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{o.itemName ?? "—"}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{o.amount != null ? `${o.currency ?? "$"}${o.amount}` : "—"}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{o.paymentMethod ?? "—"}</td>
                  <td className="px-4 py-3 text-xs">
                    {o.coupon ? (
                      <span className="font-mono text-violet-600">{o.coupon} {o.couponDiscount ? `(${o.couponDiscount}%)` : ""}</span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{o.isOrderApi === 2 ? "API" : "Website"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[o.status ?? ""] ?? "bg-gray-100 text-gray-500"}`}>
                      {o.status ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PAY_STATUS_COLOR[o.paymentStatus ?? ""] ?? "bg-gray-100 text-gray-500"}`}>
                      {o.paymentStatus ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
