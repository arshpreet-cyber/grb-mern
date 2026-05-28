"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ClipboardList } from "lucide-react";

type OrderDetail = {
  id: string;
  platform: string | null;
  itemName: string | null;
  quantity: number | null;
  amount: number | null;
  profileUrl: string | null;
  image: string | null;
};

type Order = {
  id: string;
  orderNumber: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  amount: number | null;
  currency: string | null;
  symbol: string | null;
  status: string | null;
  paymentStatus: string | null;
  paymentMethod: string | null;
  paymentId: string | null;
  completedOn: string | null;
  createdAt: string;
  notes: string | null;
  payUrl: string | null;
  detailsFilled: boolean;
  orderDetails?: OrderDetail[];
  user?: { name: string | null; email: string } | null;
};

const STATUS_LABELS: Record<string, string> = {
  "1": "Pending", "2": "Processing", "3": "Complete", "4": "Hold", "5": "Cancelled", "6": "Refund",
};
const PAYMENT_LABELS: Record<string, string> = {
  "1": "Unpaid", "2": "Paid", "3": "Unconfirmed", "4": "Cancelled",
};

export default function UserOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => { setOrder(d?.error ? null : d); setLoading(false); })
      .catch(() => { setOrder(null); setLoading(false); });
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-gray-400">Loading order...</div>;
  }
  if (!order) {
    return <div className="flex items-center justify-center py-24 text-gray-400">Order not found.</div>;
  }

  const customerName = order.firstName
    ? `${order.firstName} ${order.lastName ?? ""}`.trim()
    : (order.user?.name ?? "—");
  const sym = order.symbol ?? "$";
  const itemsList = Array.isArray(order.orderDetails) ? order.orderDetails : [];
  const subtotal = itemsList.reduce((s, d) => s + (d.amount ?? 0) * (d.quantity ?? 0), 0);

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="rounded-2xl bg-white dark:bg-[#1a1f2c] border border-gray-100 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600">
          <ClipboardList size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Order {order.orderNumber ?? order.id}
          </h1>
          <p className="text-xs text-gray-500">
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
              : "—"}
            {" · "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
              : "—"}
          </p>
        </div>
        <div className="ml-auto flex gap-2 flex-wrap">
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
            order.status === "2" ? "bg-blue-100 text-blue-700 border-blue-300"
            : order.status === "3" ? "bg-green-100 text-green-700 border-green-300"
            : "bg-yellow-100 text-yellow-700 border-yellow-300"
          }`}>
            {STATUS_LABELS[order.status ?? "1"] ?? "—"}
          </span>
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
            order.paymentStatus === "2" ? "bg-green-100 text-green-700 border-green-300"
            : order.paymentStatus === "1" ? "bg-red-100 text-red-700 border-red-300"
            : "bg-yellow-100 text-yellow-700 border-yellow-300"
          }`}>
            {PAYMENT_LABELS[order.paymentStatus ?? "1"] ?? "—"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Order Info */}
        <div className="md:col-span-1 bg-white dark:bg-[#1a1f2c] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-4 uppercase tracking-wide">Order Info</h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-[11px] text-gray-400 uppercase tracking-wide">Name</dt>
              <dd className="font-semibold text-gray-900 dark:text-white">{customerName}</dd>
            </div>
            {order.paymentId && (
              <div>
                <dt className="text-[11px] text-gray-400 uppercase tracking-wide">Payment ID</dt>
                <dd className="font-mono text-xs text-gray-500 break-all">{order.paymentId}</dd>
              </div>
            )}
            {order.completedOn && (
              <div>
                <dt className="text-[11px] text-gray-400 uppercase tracking-wide">Completed On</dt>
                <dd className="text-gray-700 dark:text-slate-300">
                  {new Date(order.completedOn).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </dd>
              </div>
            )}
            {order.paymentStatus !== "2" && order.payUrl && (
              <div>
                <dt className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">Payment</dt>
                <dd>
                  <a
                    href={order.payUrl}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FFCE2E] hover:bg-[#EBB81E] text-black text-[12px] font-bold transition"
                  >
                    Pay Now →
                  </a>
                </dd>
              </div>
            )}
          </dl>
          {order.notes && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
              <dt className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">Notes</dt>
              <p className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}
          {order.paymentStatus === "2" && !order.detailsFilled && (
            <div className="mt-4">
              <a
                href={`/order/${order.id}/details`}
                className="inline-flex w-full items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#1E3A8A] hover:bg-blue-900 text-white text-[12px] font-bold transition"
              >
                Input Details →
              </a>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="md:col-span-2 bg-white dark:bg-[#1a1f2c] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide">Order Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] text-left">
              <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
                <tr>
                  {["Product", "Qty", "Unit Price", "Total", "Profile URL"].map(h => (
                    <th key={h} className="px-4 py-3 font-semibold text-gray-500 dark:text-slate-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {itemsList.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No items found.</td></tr>
                ) : itemsList.map(d => (
                  <tr key={d.id} className="border-b border-gray-50 dark:border-slate-800">
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      {d.platform ?? d.itemName ?? "—"} Reviews
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-slate-400">{d.quantity ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-slate-400">
                      {d.amount != null ? `${sym}${d.amount.toFixed(2)}` : "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                      {d.amount != null && d.quantity != null ? `${sym}${(d.amount * d.quantity).toFixed(2)}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-slate-400 max-w-[180px]">
                      {d.profileUrl
                        ? <a href={d.profileUrl} target="_blank" rel="noopener noreferrer" className="text-violet-600 underline truncate block">{d.profileUrl}</a>
                        : <span className="text-gray-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-5 border-t border-gray-100 dark:border-slate-800 flex justify-end">
            <dl className="space-y-1 text-sm min-w-[200px]">
              <div className="flex justify-between">
                <dt className="text-gray-500">Subtotal</dt>
                <dd className="font-semibold text-gray-900 dark:text-white">{sym}{subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between border-t border-gray-100 dark:border-slate-800 pt-1 mt-1">
                <dt className="font-bold text-gray-700 dark:text-slate-300">Total</dt>
                <dd className="font-bold text-gray-900 dark:text-white">
                  {order.amount != null ? `${sym}${Number(order.amount).toFixed(2)}` : "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Payment</dt>
                <dd className={`font-semibold ${order.paymentStatus === "2" ? "text-green-600" : "text-red-500"}`}>
                  {PAYMENT_LABELS[order.paymentStatus ?? "1"] ?? "—"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
