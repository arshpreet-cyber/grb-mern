"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, User as UserIcon, Mail, Phone, Shield, Calendar,
  ClipboardList, MessageSquare, Eye
} from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  "1": "Pending", "2": "Processing", "3": "Complete",
  "4": "Hold", "5": "Cancelled", "6": "Refund",
};
const PAYMENT_LABELS: Record<string, string> = {
  "1": "Unpaid", "2": "Paid", "3": "Unconfirmed", "4": "Cancelled",
};
const PM_LABELS: Record<string, string> = {
  "1": "Card", "2": "Stripe", "3": "Razorpay", "4": "PayPal", "5": "Pay by Card",
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
  "1": "bg-red-100 text-red-700",
  "2": "bg-green-100 text-green-700",
  "3": "bg-yellow-100 text-yellow-700",
  "4": "bg-gray-100 text-gray-600",
};

type Order = {
  id: string;
  orderNumber: string | null;
  amount: number | null;
  symbol: string | null;
  status: string | null;
  paymentStatus: string | null;
  paymentMethod: string | null;
  createdAt: string;
  detailsFilled: boolean;
};

type Ticket = {
  id: number;
  ticketId: string;
  ticketNumber: string | null;
  subject: string | null;
  status: string;
  createdAt: string;
  threads: { direction: string; createdAt: string; id: number }[];
};

type UserDetail = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  createdAt: string;
  orders: Order[];
  tickets: Ticket[];
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then((r) => r.json())
      .then((d) => { setUser(d?.error ? null : d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-gray-400">Loading...</div>;
  }
  if (!user) {
    return <div className="flex items-center justify-center py-24 text-gray-400">User not found.</div>;
  }

  const totalSpend = user.orders.reduce((s, o) => s + (o.amount ?? 0), 0);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="rounded-2xl bg-white dark:bg-[#1a1f2c] border border-gray-100 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-yellow-950/40 flex items-center justify-center text-[#D8A720] font-bold text-lg">
          {user.name?.charAt(0)?.toUpperCase() ?? "?"}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user.name ?? "—"}</h1>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <div className="ml-auto flex gap-2 flex-wrap">
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
            user.role === "ADMIN" ? "bg-amber-100 text-amber-700 border-amber-300"
            : "bg-gray-100 text-gray-600 border-gray-300"
          }`}>{user.role}</span>
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
            user.status === "active" ? "bg-green-100 text-green-700 border-green-300"
            : "bg-gray-100 text-gray-500 border-gray-300"
          }`}>{user.status}</span>
        </div>
      </div>

      {/* Info + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Profile card */}
        <div className="bg-white dark:bg-[#1a1f2c] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-5 space-y-3">
          <h2 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">Profile</h2>
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
            <Mail size={14} className="text-gray-400 shrink-0" />
            <span className="break-all">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
              <Phone size={14} className="text-gray-400 shrink-0" />
              <span>{user.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
            <Shield size={14} className="text-gray-400 shrink-0" />
            <span>{user.role}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
            <Calendar size={14} className="text-gray-400 shrink-0" />
            <span>Joined {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="md:col-span-2 grid grid-cols-3 gap-4">
          {[
            { label: "Total Orders", value: user.orders.length, color: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" },
            { label: "Total Spent", value: `$${totalSpend.toFixed(2)}`, color: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" },
            { label: "Support Tickets", value: user.tickets.length, color: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-2xl p-5 flex flex-col gap-2 border border-transparent dark:border-slate-800`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white dark:bg-[#1a1f2c] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3">
          <ClipboardList size={18} className="text-[#D8A720]" />
          <h2 className="text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide">
            Orders ({user.orders.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] text-left">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
              <tr>
                {["Order #", "Amount", "Method", "Status", "Payment", "Details Filled", "Date", ""].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold text-gray-500 dark:text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {user.orders.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No orders yet.</td></tr>
              ) : user.orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-bold font-mono text-amber-600 dark:text-amber-400 hover:underline">
                      {o.orderNumber ?? o.id.toString().substring(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                    {o.amount != null ? `${o.symbol ?? "$"}${o.amount.toFixed(2)}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-slate-400">
                    {PM_LABELS[o.paymentMethod ?? ""] ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_COLORS[o.status ?? "1"] ?? ""}`}>
                      {STATUS_LABELS[o.status ?? "1"] ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${PAYMENT_COLORS[o.paymentStatus ?? "1"] ?? ""}`}>
                      {PAYMENT_LABELS[o.paymentStatus ?? "1"] ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {o.detailsFilled
                      ? <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">Filled</span>
                      : <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">Pending</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors inline-flex"
                      title="View Order"
                    >
                      <Eye size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tickets */}
      <div className="bg-white dark:bg-[#1a1f2c] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3">
          <MessageSquare size={18} className="text-amber-500" />
          <h2 className="text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide">
            Support Tickets ({user.tickets.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] text-left">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
              <tr>
                {["Ticket #", "Subject", "Status", "Last Activity", ""].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold text-gray-500 dark:text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {user.tickets.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No support tickets.</td></tr>
              ) : user.tickets.map((t) => {
                const last = t.threads[0];
                const isAdminReply = last?.direction === "2";
                return (
                  <tr key={t.id} className={`border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors ${isAdminReply ? "bg-yellow-50/40 dark:bg-yellow-900/10" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isAdminReply && <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shrink-0" />}
                        <span className="font-mono font-semibold text-gray-700 dark:text-slate-300">
                          {t.ticketNumber ?? t.ticketId}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-slate-300 max-w-[200px]">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{t.subject ?? "Support conversation"}</span>
                        {isAdminReply && (
                          <span className="text-[10px] font-bold bg-[#FFCE2E] text-black px-1.5 py-0.5 rounded-full shrink-0">New Reply</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        t.status === "Open" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : t.status === "Closed" ? "bg-gray-50 text-gray-500 border-gray-200"
                        : t.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>{t.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {timeAgo(last ? last.createdAt : t.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/tickets/${t.ticketId}`}
                        className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors inline-flex"
                        title="View Ticket"
                      >
                        <Eye size={14} />
                      </Link>
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
