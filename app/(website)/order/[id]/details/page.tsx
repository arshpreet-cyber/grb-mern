"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Wrapper from "@/components/ui/Wrapper";

interface OrderItem {
  id: string;
  platform: string;
  quantity: number;
  amount: number;
  image?: string;
  profileUrl: string;
}

interface OrderData {
  id: string;
  orderNumber: string;
  amount: number;
  orderDetails: OrderItem[];
}

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); setLoading(false); return; }
        setOrder(data);
        setItems(
          data.orderDetails.map((d: any) => ({
            id: d.id,
            platform: d.platform,
            quantity: d.quantity,
            amount: d.amount,
            image: d.image,
            profileUrl: d.profileUrl ?? "",
          }))
        );
        setLoading(false);
      })
      .catch(() => { setError("Failed to load order."); setLoading(false); });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id, notes, items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save details");
      router.push(`/order/${id}/thank-you`);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  const steps = [
    { number: 1, label: "Configure & Order", active: false },
    { number: 2, label: "Order Details", active: true },
    { number: 3, label: "Order Placed", active: false },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-['Poppins']">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#fcd535] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[15px] text-[#555]">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-['Poppins']">
        <p className="text-[#dc3545] text-[15px]">{error || "Order not found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      <div className="bg-[#f7f7f7] py-[50px] md:pb-[60px]">
        <Wrapper>
          {/* Progress Steps */}
          <div className="flex justify-center mb-[60px] pt-[10px]">
            <div className="relative flex justify-between w-[600px] max-w-full">
              <div className="absolute top-[25px] left-[40px] w-[87%] h-[2px] z-0 flex">
                <div className="bg-[#fcd535] flex-1"></div>
                <div className="bg-[#fcd535] flex-1"></div>
              </div>
              {steps.map((step) => (
                <div key={step.number} className="relative z-[2] text-center w-[120px]">
                  <div className={`w-[50px] h-[50px] rounded-full flex items-center justify-center border-2 mx-auto mb-[10px] font-semibold text-[18px] transition-all duration-300 ${
                    step.active
                      ? "bg-[#fcd535] border-[#fcd535] text-[#212529] outline outline-[2px] outline-[#212529]"
                      : step.number < 2
                      ? "bg-[#fcd535] border-[#fcd535] text-[#212529]"
                      : "bg-white border-[#e9ecef] text-[#adb5bd]"
                  }`}>
                    {step.number}
                  </div>
                  <div className={`text-[11px] font-bold uppercase tracking-[0.5px] whitespace-nowrap ${
                    step.active || step.number < 2 ? "text-[#212529]" : "text-[#adb5bd]"
                  }`}>
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[11px] p-[30px] max-w-3xl mx-auto">
            <h2 className="text-[18px] font-semibold uppercase tracking-[1px] text-[#333] mb-2">
              Order Details
            </h2>
            <p className="text-[13px] text-[#888] mb-8">
              Order #{order.orderNumber} — Please provide the details needed to complete your order.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile URL per item */}
              {items.map((item, idx) => (
                <div key={item.id} className="bg-[#f8f9fa] rounded-xl p-5 border border-[#e9ecef]">
                  <div className="flex items-center gap-3 mb-4">
                    {item.image && (
                      <img src={item.image} alt={item.platform} className="w-10 h-10 object-contain" />
                    )}
                    <div>
                      <p className="font-semibold text-[15px] text-[#333]">{item.platform}</p>
                      <p className="text-[12px] text-[#888]">Qty: {item.quantity} × ${item.amount}</p>
                    </div>
                  </div>
                  <label className="block text-[13px] font-semibold text-[#555] mb-2">
                    {item.platform} Profile / Page URL <span className="text-[#dc3545]">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder={`https://www.${item.platform?.toLowerCase().replace(/\s+/g, "")}.com/...`}
                    value={item.profileUrl}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[idx].profileUrl = e.target.value;
                      setItems(updated);
                    }}
                    className="w-full border border-[#ced4da] rounded-lg px-4 py-3 text-[14px] outline-none focus:border-[#fcd535] focus:ring-2 focus:ring-[#fcd535]/20 transition-all"
                  />
                </div>
              ))}

              {/* Special Instructions */}
              <div>
                <label className="block text-[13px] font-semibold text-[#555] mb-2">
                  Special Instructions <span className="text-[#adb5bd] font-normal">(optional)</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Any specific instructions for your order..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-[#ced4da] rounded-lg px-4 py-3 text-[14px] outline-none focus:border-[#fcd535] focus:ring-2 focus:ring-[#fcd535]/20 transition-all resize-none"
                />
              </div>

              {error && (
                <p className="text-[13px] text-[#dc3545]">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#fcd535] text-[#212529] font-bold text-[15px] py-[14px] rounded-[50px] hover:bg-[#f0c000] transition-all disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Submit & Continue →"}
              </button>
            </form>
          </div>
        </Wrapper>
      </div>
    </div>
  );
}
