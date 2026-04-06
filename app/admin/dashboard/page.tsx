"use client";
import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const earningsData = [
  { month: "Jan", value: 15000 },
  { month: "Feb", value: 18000 },
  { month: "Mar", value: 16000 },
  { month: "Apr", value: 21000 },
  { month: "May", value: 19000 },
  { month: "Jun", value: 24000 },
];

const usersData = [
  { month: "Jan", value: 260 },
  { month: "Feb", value: 290 },
  { month: "Mar", value: 270 },
  { month: "Apr", value: 310 },
  { month: "May", value: 340 },
  { month: "Jun", value: 380 },
];

const revenueSources = [
  { name: "Paid Orders", value: 38, color: "#7c3aed" },
  { name: "Pending", value: 30, color: "#f59e0b" },
  { name: "Cancelled", value: 18, color: "#ef4444" },
  { name: "Refunded", value: 14, color: "#10b981" },
];

const StatCard = ({
  label, value, sub, gradient,
}: { label: string; value: string | number; sub?: string; gradient: string }) => (
  <div className={`rounded-2xl p-5 text-white ${gradient} shadow-md`}>
    <p className="text-xs font-medium uppercase tracking-widest opacity-80">{label}</p>
    <p className="mt-3 text-3xl font-bold">{value}</p>
    {sub && <p className="mt-1 text-xs opacity-70">{sub}</p>}
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    openTickets: 206, awaitingTickets: 11, closedTickets: 7951,
    totalOrders: 16382, pendingOrders: 34, completeOrders: 11941,
    totalUsers: 6070, activeUsers: 229,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [revenue, setRevenue] = useState({ today: 350, monthly: 3895, yearly: 55357, allTime: 1597473 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/analytics")
      .then((r) => r.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
        if (data.recentOrders) setRecentOrders(data.recentOrders);
        if (data.recentTickets) setRecentTickets(data.recentTickets);
        if (data.revenue) setRevenue(data.revenue);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-xs text-slate-400 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Revenue" value={`$${(revenue.allTime / 1000).toFixed(0)}k`} sub="All time earnings" gradient="bg-gradient-to-br from-violet-600 to-indigo-700" />
        <StatCard label="Monthly Revenue" value={`$${revenue.monthly.toLocaleString()}`} sub="This month" gradient="bg-gradient-to-br from-sky-500 to-cyan-600" />
        <StatCard label="Total Users" value={stats.totalUsers.toLocaleString()} sub={`${stats.activeUsers} active now`} gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
        <StatCard label="Total Orders" value={stats.totalOrders.toLocaleString()} sub={`${stats.pendingOrders} pending`} gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
      </div>

      {/* Ticket Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Open Tickets", value: stats.openTickets, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
          { label: "Awaiting Reply", value: stats.awaitingTickets, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
          { label: "Closed Tickets", value: stats.closedTickets, color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" },
        ].map((c) => (
          <div key={c.label} className={`rounded-2xl border ${c.border} ${c.bg} p-5`}>
            <p className={`text-xs font-semibold uppercase tracking-widest ${c.color}`}>{c.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-800">{c.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        {/* Earnings Chart */}
        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Overview</p>
              <h2 className="text-base font-bold text-slate-800">Earnings Trend</h2>
            </div>
            <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 outline-none">
              <option>2026</option>
              <option>2025</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earningsData}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Sources Pie */}
        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Breakdown</p>
            <h2 className="text-base font-bold text-slate-800">Revenue Sources</h2>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueSources} innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {revenueSources.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {revenueSources.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-600 truncate">{item.name}</span>
                <span className="ml-auto text-xs font-semibold text-slate-700">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Summary + Users Chart */}
      <div className="grid gap-6 xl:grid-cols-[1fr_2fr]">
        {/* Revenue Cards */}
        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Revenue Summary</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Today", value: `$${revenue.today.toFixed(2)}`, color: "bg-violet-50 border-violet-200" },
              { label: "Monthly", value: `$${revenue.monthly.toLocaleString()}`, color: "bg-sky-50 border-sky-200" },
              { label: "This Year", value: `$${(revenue.yearly / 1000).toFixed(1)}k`, color: "bg-emerald-50 border-emerald-200" },
              { label: "All Time", value: `$${(revenue.allTime / 1000).toFixed(0)}k`, color: "bg-amber-50 border-amber-200" },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl border p-4 ${item.color}`}>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">{item.label}</p>
                <p className="mt-2 text-lg font-bold text-slate-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Users Chart */}
        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Analytics</p>
              <h2 className="text-base font-bold text-slate-800">User Activity</h2>
            </div>
            <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 outline-none">
              <option>2026</option>
              <option>2025</option>
            </select>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Tickets & Orders */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Tickets */}
        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Support</p>
              <h2 className="text-base font-bold text-slate-800">Recent Tickets</h2>
            </div>
            <button className="text-xs font-medium text-violet-600 hover:text-violet-700">View all →</button>
          </div>
          <div className="space-y-3">
            {recentTickets.length > 0 ? (
              recentTickets.map((ticket: any) => (
                <div key={ticket.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{ticket.ticketId}</p>
                    <p className="text-xs text-slate-500">{ticket.title}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">No tickets yet</div>
            )}
          </div>
        </div>

        {/* Orders */}
        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Sales</p>
              <h2 className="text-base font-bold text-slate-800">Recent Orders</h2>
            </div>
            <button className="text-xs font-medium text-violet-600 hover:text-violet-700">View all →</button>
          </div>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{order.orderNumber}</p>
                    <p className="text-xs text-slate-500">${order.amount.toFixed(2)}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">No orders yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
