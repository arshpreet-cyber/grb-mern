"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardList, FileText, Ticket, MailWarning, Loader2 } from "lucide-react";

type OrderDetail = {
  id: string;
  itemName: string | null;
  bannerTitle: string | null;
  quantity: number | null;
  amount: number | null;
  reviewData: string | null;
  productType: string | null;
};

type Order = {
  id: string;
  displayId?: number | null;
  orderNumber: string | null;
  userId: string | null;
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
  user?: { name: string | null; email: string; id?: string } | null;
};

type ItemNote = {
  itemId: string;
  platform: string;
  submissionType: "provide" | "expert";
  businessDetails: string;
  additionalInstructions: string;
};

import { paymentMethodLabel } from "@/lib/status-labels";

const STATUS_LABELS: Record<string, string> = {
  "1": "Pending", "2": "Complete", "3": "Hold", "4": "Cancelled", "5": "Processing", "6": "Refund", "7": "Failed", "8": "Fraud", "9": "Active",
};
const PAYMENT_LABELS: Record<string, string> = {
  "1": "Unpaid", "2": "Paid", "3": "Cancelled", "4": "Unconfirmed",
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingIncomplete, setSendingIncomplete] = useState(false);

  // Email the customer asking them to fill in the missing order details.
  async function sendIncompleteOrderEmail() {
    setSendingIncomplete(true);
    try {
      const res = await fetch(`/api/orders/${id}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "info-required" }),
      });
      const data = await res.json().catch(() => ({}));
      const { toast } = await import("sonner");
      if (res.ok) toast.success("Incomplete-order email sent to the customer.");
      else toast.error(data.error || "Could not send the email.");
    } catch {
      const { toast } = await import("sonner");
      toast.error("Could not send the email. Please try again.");
    } finally {
      setSendingIncomplete(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/orders/${id}`)
      .then(async (r) => {
        console.log("[AdminOrderDetail] fetch status:", r.status);
        if (!r.ok) {
          const errBody = await r.text();
          console.log("[AdminOrderDetail] error body:", errBody);
          throw new Error("Fetch failed");
        }
        return r.json();
      })
      .then((d) => { 
        console.log("[AdminOrderDetail] data keys:", Object.keys(d));
        console.log("[AdminOrderDetail] orderDetails:", JSON.stringify(d.orderDetails));
        console.log("[AdminOrderDetail] user:", JSON.stringify(d.user));
        if (d && !d.error) {
          setOrder(d);
        } else {
          setOrder(null);
        }
        setLoading(false); 
      })
      .catch((e) => {
        console.error("[AdminOrderDetail] catch error:", e);
        setOrder(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">Loading order...</div>
    );
  }

  // Defensively match any structure variants or error keys passed by API middleware
  if (!order || (order as any).error) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">Order not found.</div>
    );
  }

  const customerName = order.firstName
    ? `${order.firstName} ${order.lastName ?? ""}`.trim()
    : (order.user?.name ?? "—");

  const customerEmail = order.email ?? order.user?.email ?? "—";
  const customerId = order.userId ?? order.user?.id ?? null;
  const sym = order.symbol ?? "$";

  const itemsList = Array.isArray(order.orderDetails) ? order.orderDetails : [];
  const subtotal = itemsList.reduce((s, d) => s + (d.amount ?? 0) * (d.quantity ?? 0), 0);

  // Parse structured input details (submitted by customer via order details form)
  let itemNotes: ItemNote[] | null = null;
  if (order.notes) {
    try {
      const parsed = JSON.parse(order.notes);
      if (Array.isArray(parsed)) itemNotes = parsed as ItemNote[];
    } catch {
      // plain text notes — shown as-is
    }
  }

  return (
    <div className="space-y-5 w-full">
      {/* Header */}
      <div className="rounded-2xl bg-white dark:bg-[#1a1f2c] border border-gray-100 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="h-10 w-10 rounded-xl bg-[#fffdeb] dark:bg-[#fc0]/10 border border-[#ffe57f] dark:border-[#fc0]/20 flex items-center justify-center text-[#e6b800] dark:text-[#fc0]">
          <ClipboardList size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Order {order.orderNumber || `#${order.id}`}
          </h1>
          <p className="text-xs text-gray-500">
            {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
            {" · "}
            {order.createdAt ? new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "—"}
          </p>
        </div>
        <div className="ml-auto flex flex-col items-end gap-2">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              onClick={sendIncompleteOrderEmail}
              disabled={sendingIncomplete}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 px-3.5 py-1.5 text-[12px] font-bold transition disabled:opacity-60"
            >
              {sendingIncomplete ? <Loader2 size={14} className="animate-spin" /> : <MailWarning size={14} />}
              Incomplete Order
            </button>
            <Link
              href={`/dashboard/support?subject=${encodeURIComponent(`Order ${order.orderNumber ?? order.id} - `)}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#fc0] hover:bg-[#e6bb00] text-slate-900 px-3.5 py-1.5 text-[12px] font-bold transition shadow-sm"
            >
              <Ticket size={14} /> Create Ticket
            </Link>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
              order.status === "2" || order.status === "9" ? "bg-green-100 text-green-700 border-green-300"
              : order.status === "5" ? "bg-blue-100 text-blue-700 border-blue-300"
              : order.status === "3" ? "bg-orange-100 text-orange-700 border-orange-300"
              : order.status === "4" || order.status === "7" || order.status === "8" ? "bg-red-100 text-red-700 border-red-300"
              : order.status === "6" ? "bg-purple-100 text-purple-700 border-purple-300"
              : "bg-yellow-100 text-yellow-700 border-yellow-300"
            }`}>
              {STATUS_LABELS[order.status ?? "1"] ?? "—"}
            </span>
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
              order.paymentStatus === "2" ? "bg-green-100 text-green-700 border-green-300"
              : order.paymentStatus === "4" ? "bg-yellow-100 text-yellow-700 border-yellow-300"
              : "bg-red-100 text-red-700 border-red-300"
            }`}>
              {PAYMENT_LABELS[order.paymentStatus ?? "1"] ?? "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Customer Info */}
        <div className="md:col-span-1 bg-white dark:bg-[#1a1f2c] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-4 uppercase tracking-wide">Customer</h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-[11px] text-gray-400 uppercase tracking-wide">Name</dt>
              <dd className="font-semibold">
                {customerId ? (
                  <Link href={`/admin/users/${customerId}`} className="text-amber-600 dark:text-[#fc0] hover:text-amber-700 dark:hover:text-amber-400 hover:underline">
                    {customerName}
                  </Link>
                ) : (
                  <span className="text-gray-900 dark:text-white">{customerName}</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-gray-400 uppercase tracking-wide">Email</dt>
              <dd className="text-gray-700 dark:text-slate-300 break-all">{customerEmail}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-gray-400 uppercase tracking-wide">Payment Method</dt>
              <dd className="font-medium text-gray-700 dark:text-slate-300">{paymentMethodLabel(order.paymentMethod)}</dd>
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
            {order.payUrl && (
              <div>
                <dt className="text-[11px] text-gray-400 uppercase tracking-wide">Payment Link</dt>
                <dd>
                  <a href={order.payUrl} target="_blank" rel="noopener noreferrer"
                    className="text-amber-600 dark:text-[#fc0] hover:text-amber-700 dark:hover:text-amber-400 text-xs underline break-all">
                    Open payment page
                  </a>
                </dd>
              </div>
            )}
          </dl>
          {order.notes && !itemNotes && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">Notes</p>
              <p className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap">{order.notes}</p>
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
                  {["Product", "Qty", "Unit Price", "Total"].map(h => (
                    <th key={h} className="px-4 py-3 font-semibold text-gray-500 dark:text-slate-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {itemsList.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No items available for this order</td></tr>
                ) : itemsList.map(d => {
                  // Parse profileUrl from reviewData JSON
                  let profileUrl: string | null = null;
                  if (d.reviewData) {
                    try { profileUrl = JSON.parse(d.reviewData)?.profileUrl ?? null; } catch {}
                  }
                  return (
                  <tr key={d.id} className="border-b border-gray-50 dark:border-slate-800">
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white whitespace-pre-wrap">
                      {(() => {
                        const isNullStr = (v: any) => !v || v === "NULL" || v === "null";
                        const itemName = isNullStr(d.itemName) ? "" : d.itemName;
                        
                        let displayName = itemName || "—";
                        if (itemName && !itemName.toLowerCase().includes("reviews")) {
                          displayName = `${itemName} Reviews`;
                        }
                        return displayName;
                      })()}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-slate-400">{d.quantity ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-slate-400">
                      {d.amount != null ? `${sym}${d.amount.toFixed(2)}` : "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                      {d.amount != null && d.quantity != null ? `${sym}${(d.amount * d.quantity).toFixed(2)}` : "—"}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="p-5 border-t border-gray-100 dark:border-slate-800 flex justify-end">
            <dl className="space-y-1 text-sm min-w-[200px]">
              <div className="flex justify-between">
                <dt className="text-gray-500">Subtotal</dt>
                <dd className="font-semibold text-gray-900 dark:text-white">{sym}{subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between border-t border-gray-100 dark:border-slate-800 pt-1 mt-1">
                <dt className="font-bold text-gray-700 dark:text-slate-300">Amount</dt>
                <dd className="font-bold text-gray-900 dark:text-white">
                  {order.amount != null ? `${sym}${Number(order.amount).toFixed(2)}` : "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Payment Status</dt>
                <dd className={`font-semibold ${order.paymentStatus === "2" ? "text-green-600" : "text-red-500"}`}>
                  {PAYMENT_LABELS[order.paymentStatus ?? "1"] ?? "—"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Input Details (submitted by customer) */}
      {itemNotes && itemNotes.length > 0 && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white dark:bg-[#1a1f2c] border border-gray-100 dark:border-slate-800 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-2">
              <FileText size={18} className="text-[#fc0]" />
              Customer Input Details
            </h2>
          </div>

          <div className="space-y-6">
            {itemNotes.map((note, i) => {
              const detail = itemsList.find((d) => String(d.id) === String(note.itemId));
              const qty = detail?.quantity ?? 1;
              // Parse profileUrl from reviewData
              let profileUrl = "";
              if (detail?.reviewData) {
                try { profileUrl = JSON.parse(detail.reviewData)?.profileUrl ?? ""; } catch {}
              }

              return (
                <div key={i} className="bg-white dark:bg-[#1a1f2c] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 space-y-5">
                  {/* Heading */}
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
                    {i + 1}. Review for: {note.platform} Reviews (qty {qty}) <span className="text-gray-400 font-normal text-xs">[ID: {note.itemId}]</span>
                  </h3>
                  
                  {/* Profile Url */}
                  <div className="space-y-1">
                    <h4 className="text-[13px] font-bold text-gray-800 dark:text-slate-200">Profile Url:</h4>
                    {profileUrl ? (
                      <a
                        href={profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-xs break-all"
                      >
                        {profileUrl}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </div>

                  {/* Review Type */}
                  <div className="space-y-1">
                    <h4 className="text-[13px] font-bold text-gray-800 dark:text-slate-200">Review Type:</h4>
                    <p className="text-gray-600 dark:text-slate-400 text-xs font-normal">
                      {note.submissionType === "expert" ? "Expert review" : "Provide review content"}
                    </p>
                  </div>

                  {/* Write Reviews Based On These Instructions */}
                  {note.submissionType === "expert" && note.businessDetails && (
                    <div className="space-y-1">
                      <h4 className="text-[13px] font-bold text-gray-800 dark:text-slate-200">Write Reviews Based On These Instructions:</h4>
                      <p className="text-gray-600 dark:text-slate-400 text-xs font-normal whitespace-pre-wrap leading-relaxed">
                        {note.businessDetails}
                      </p>
                    </div>
                  )}

                  {/* Customer Provided Content or Instructions */}
                  {note.submissionType !== "expert" && note.additionalInstructions && (
                    <div className="space-y-1">
                      <h4 className="text-[13px] font-bold text-gray-800 dark:text-slate-200">Write Reviews Based On These Instructions:</h4>
                      <p className="text-gray-600 dark:text-slate-400 text-xs font-normal whitespace-pre-wrap leading-relaxed">
                        {note.additionalInstructions}
                      </p>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}