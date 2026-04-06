"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
  id: string; paymentId: string; amount: string; date: string;
  method: string; status: string; paymentStatus: string;
};

const dummyOrders: Order[] = [
  { id: "#177150846", paymentId: "12345678", amount: "$100.00", date: "19-2-2026", method: "Credit Card", status: "Pending", paymentStatus: "Pending" },
  { id: "#177150847", paymentId: "87654321", amount: "$250.00", date: "18-2-2026", method: "PayPal", status: "Complete", paymentStatus: "Complete" },
  { id: "#177150848", paymentId: "11223344", amount: "$75.50", date: "17-2-2026", method: "Credit Card", status: "Complete", paymentStatus: "Complete" },
];

export default function UserDashboard() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const name = session?.user?.name ?? "User";

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data.map((o: any) => ({
            id: o.orderNumber, paymentId: o.id.substring(0, 8),
            amount: `$${o.amount.toFixed(2)}`, date: new Date(o.date).toLocaleDateString(),
            method: o.paymentMethod, status: o.status, paymentStatus: o.paymentStatus,
          })));
        } else {
          setOrders(dummyOrders);
        }
      })
      .catch(() => setOrders(dummyOrders))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total Orders", value: "35", icon: "📦", color: "from-violet-500 to-indigo-600" },
    { label: "Active Subscriptions", value: "25", icon: "♻️", color: "from-emerald-500 to-teal-600" },
    { label: "Pending Orders", value: "15", icon: "⏳", color: "from-amber-500 to-orange-500" },
    { label: "Open Tickets", value: "05", icon: "🎧", color: "from-sky-500 to-cyan-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-700 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-200">Welcome back</p>
            <h1 className="mt-2 text-3xl font-extrabold">Hello, {name}! 👋</h1>
            <p className="mt-2 max-w-xl text-sm text-violet-200 leading-relaxed">
              Manage your orders, track your reviews, and get support — all from your dashboard.
            </p>
          </div>
          <Link href="/dashboard/support"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-violet-700 shadow hover:bg-violet-50 transition shrink-0">
            🎧 Create New Ticket
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl bg-gradient-to-br ${s.color} p-5 text-white shadow-md`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-80">{s.label}</p>
              <span className="text-2xl">{s.icon}</span>
            </div>
            <p className="text-4xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">History</p>
            <h2 className="text-base font-bold text-slate-800">Recent Orders</h2>
          </div>
          <Link href="/dashboard/orders" className="text-xs font-semibold text-violet-600 hover:text-violet-700">View All →</Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["# Order No", "Payment ID", "Amount", "Date", "Method", "Status", "Payment Status", "Details", "Payment Option", "Action"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white">
                {orders.map((o, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-4 font-medium text-slate-800">{o.id}</td>
                    <td className="px-5 py-4 text-slate-500">{o.paymentId}</td>
                    <td className="px-5 py-4 font-semibold text-slate-800">{o.amount}</td>
                    <td className="px-5 py-4 text-slate-500">{o.date}</td>
                    <td className="px-5 py-4 text-slate-500">{o.method}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${o.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${o.paymentStatus === "Pending" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-violet-600 font-medium cursor-pointer hover:underline">View Details</td>
                    <td className="px-5 py-4">
                      <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 outline-none">
                        <option>Choose Method</option>
                        <option>Credit Card</option>
                        <option>PayPal</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <button className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white hover:opacity-90 transition">
                        Pay Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
