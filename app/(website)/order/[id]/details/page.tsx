"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Wrapper from "@/components/ui/Wrapper";

interface ItemForm {
  id: string;
  platform: string;
  quantity: number;
  amount: number;
  image?: string;
  profileUrl: string;
  submissionType: "provide" | "expert";
  businessDetails: string;
  additionalInstructions: string;
  files: File[];
}

interface OrderData {
  id: string;
  orderNumber: string;
  amount: number;
  orderDetails: {
    id: string;
    platform: string;
    quantity: number;
    amount: number;
    image?: string;
    profileUrl: string;
  }[];
}

const steps = [
  { number: 1, label: "Configure & Order" },
  { number: 2, label: "Order Details" },
  { number: 3, label: "Order Placed" },
];

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [items, setItems] = useState<ItemForm[]>([]);
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
          data.orderDetails.map((d: OrderData["orderDetails"][number]) => ({
            id: d.id,
            platform: d.platform,
            quantity: d.quantity,
            amount: d.amount,
            image: d.image,
            profileUrl: d.profileUrl ?? "",
            submissionType: "provide",
            businessDetails: "",
            additionalInstructions: "",
            files: [],
          }))
        );
        setLoading(false);
      })
      .catch(() => { setError("Failed to load order."); setLoading(false); });
  }, [id]);

  function updateItem<K extends keyof ItemForm>(idx: number, key: K, value: ItemForm[K]) {
    setItems((prev) => prev.map((item, i) => i === idx ? { ...item, [key]: value } : item));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const notes = JSON.stringify(
        items.map((item) => ({
          itemId: item.id,
          platform: item.platform,
          submissionType: item.submissionType,
          businessDetails: item.businessDetails,
          additionalInstructions: item.additionalInstructions,
        }))
      );
      const res = await fetch("/api/orders/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: id,
          notes,
          items: items.map(({ id: itemId, profileUrl }) => ({ id: itemId, profileUrl })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save details");
      router.push(`/order/${id}/thank-you`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-['Poppins']">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#fcd535] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[15px] text-[#555]">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-['Poppins']">
        <p className="text-[#dc3545] text-[15px]">{error || "Order not found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] font-['Poppins']">
      <div className="py-[50px] md:pb-[70px]">
        <Wrapper>
          {/* Progress Steps */}
          <div className="flex justify-center mb-[50px] pt-[10px]">
            <div className="relative flex justify-between w-[600px] max-w-full">
              <div className="absolute top-[25px] left-[40px] w-[87%] h-[2px] z-0">
                <div className="bg-[#fcd535] w-full h-full" />
              </div>
              {steps.map((step) => {
                const isActive = step.number === 2;
                const isDone = step.number < 2;
                return (
                  <div key={step.number} className="relative z-[2] text-center w-[120px]">
                    <div className={`w-[50px] h-[50px] rounded-full flex items-center justify-center border-2 mx-auto mb-[10px] font-semibold text-[18px] ${
                      isActive
                        ? "bg-[#fcd535] border-[#212529] text-[#212529] outline outline-[2px] outline-[#212529]"
                        : isDone
                        ? "bg-[#fcd535] border-[#fcd535] text-[#212529]"
                        : "bg-white border-[#e9ecef] text-[#adb5bd]"
                    }`}>
                      {step.number}
                    </div>
                    <div className={`text-[11px] font-bold uppercase tracking-[0.5px] whitespace-nowrap ${
                      isActive || isDone ? "text-[#212529]" : "text-[#adb5bd]"
                    }`}>
                      {step.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-[11px] max-w-3xl mx-auto shadow-sm border border-[#e9ecef] overflow-hidden">
            <div className="px-[30px] pt-[30px] pb-4 border-b border-[#f0f0f0]">
              <h2 className="text-[17px] font-bold uppercase tracking-[1px] text-[#212529]">Order Details</h2>
              <p className="text-[13px] text-[#888] mt-1">
                Order #{order?.orderNumber} — Please provide the details needed to complete your order.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="divide-y divide-[#f0f0f0]">
              {items.map((item, idx) => (
                <ItemSection
                  key={item.id}
                  item={item}
                  idx={idx}
                  onChange={updateItem}
                />
              ))}

              {error && (
                <div className="px-[30px] py-4">
                  <p className="text-[13px] text-[#dc3545]">{error}</p>
                </div>
              )}

              <div className="px-[30px] py-[24px]">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#212529] text-white font-bold text-[14px] uppercase tracking-[1px] py-[16px] rounded-[6px] hover:bg-[#343a40] transition-all disabled:opacity-60"
                >
                  {submitting ? "Saving..." : "Submit Order Details"}
                </button>
              </div>
            </form>
          </div>
        </Wrapper>
      </div>
    </div>
  );
}

function ItemSection({
  item,
  idx,
  onChange,
}: {
  item: ItemForm;
  idx: number;
  onChange: <K extends keyof ItemForm>(idx: number, key: K, value: ItemForm[K]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const valid = Array.from(fileList).filter((f) => f.size <= 50 * 1024 * 1024);
    onChange(idx, "files", [...item.files, ...valid]);
  }

  function removeFile(i: number) {
    onChange(idx, "files", item.files.filter((_, fi) => fi !== i));
  }

  return (
    <div className="px-[30px] py-[28px] space-y-5">
      {/* Product header */}
      <div className="flex items-center gap-3">
        {item.image && (
          <img src={item.image} alt={item.platform} className="w-10 h-10 object-contain rounded" />
        )}
        <h3 className="text-[15px] font-bold text-[#212529]">
          {item.platform} Reviews{" "}
          <span className="font-normal text-[#666]">(Qty:{item.quantity})</span>
        </h3>
      </div>

      {/* Profile URL */}
      <div>
        <label className="block text-[13px] font-semibold text-[#444] mb-1.5">
          {item.platform} Business Profile URL <span className="text-[#dc3545]">*</span>
        </label>
        <input
          type="url"
          required
          placeholder="Enter URL here"
          value={item.profileUrl}
          onChange={(e) => onChange(idx, "profileUrl", e.target.value)}
          className="w-full border border-[#d0d0d0] rounded-[5px] px-4 py-[10px] text-[14px] text-[#333] outline-none focus:border-[#fcd535] focus:ring-2 focus:ring-[#fcd535]/20 transition-all placeholder:text-[#bbb]"
        />
      </div>

      {/* Submission Type */}
      <div>
        <p className="text-[12px] font-semibold text-[#444] mb-2 text-center">Review Submission Type</p>
        <div className="flex flex-wrap justify-center gap-2">
          {(["provide", "expert"] as const).map((type) => {
            const label = type === "provide" ? "Provide Reviews Content" : "Let Our Expert Write";
            const checked = item.submissionType === type;
            return (
              <label
                key={type}
                onClick={() => onChange(idx, "submissionType", type)}
                className={`flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-full border text-[12px] transition-all ${
                  checked
                    ? "border-[#fcd535] bg-[#fffde7] text-[#212529] font-semibold"
                    : "border-[#d0d0d0] bg-white text-[#555] hover:border-[#bbb]"
                }`}
              >
                <input
                  type="radio"
                  name={`submissionType-${idx}`}
                  value={type}
                  checked={checked}
                  onChange={() => onChange(idx, "submissionType", type)}
                  className="sr-only"
                />
                <span className={`w-3 h-3 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  checked ? "border-[#fcd535]" : "border-[#bbb]"
                }`}>
                  {checked && <span className="w-1.5 h-1.5 rounded-full bg-[#fcd535] block" />}
                </span>
                {label}
              </label>
            );
          })}
        </div>
      </div>

      {/* Business Details (only when expert) */}
      {item.submissionType === "expert" && (
        <div>
          <label className="block text-[13px] font-semibold text-[#444] mb-1.5">
            Provide Business Details <span className="text-[#dc3545]">*</span>
          </label>
          <textarea
            rows={5}
            required={item.submissionType === "expert"}
            placeholder={`This information will enable our review writers to create reviews tailored to your business ensuring they are credible, authentic, and feel genuinely reliable to readers.\n\nWe kindly request a few details from your side to ensure accuracy and completeness. Please share the following information at your convenience:`}
            value={item.businessDetails}
            onChange={(e) => onChange(idx, "businessDetails", e.target.value)}
            className="w-full border border-[#d0d0d0] rounded-[5px] px-4 py-3 text-[14px] text-[#333] outline-none focus:border-[#fcd535] focus:ring-2 focus:ring-[#fcd535]/20 transition-all resize-y placeholder:text-[#bbb] placeholder:text-[12px]"
          />
        </div>
      )}

      {/* Additional Instructions */}
      <div>
        <label className="block text-[13px] font-semibold text-[#444] mb-1.5">Additional Instructions</label>
        <textarea
          rows={3}
          placeholder="Any additional instructions will enable our review publishing team to execute your order as requested."
          value={item.additionalInstructions}
          onChange={(e) => onChange(idx, "additionalInstructions", e.target.value)}
          className="w-full border border-[#d0d0d0] rounded-[5px] px-4 py-3 text-[14px] text-[#333] outline-none focus:border-[#fcd535] focus:ring-2 focus:ring-[#fcd535]/20 transition-all resize-none placeholder:text-[#bbb] placeholder:text-[12px]"
        />
      </div>

      {/* File Upload */}
      <div>
        <p className="text-[13px] font-semibold text-[#444] mb-1">Upload and Attach Files</p>
        <p className="text-[12px] text-[#888] mb-2">Upload and attach files to this project.</p>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          className={`border-2 border-dashed rounded-[8px] p-8 text-center cursor-pointer transition-all ${
            dragging ? "border-[#fcd535] bg-[#fffde7]" : "border-[#d0d0d0] bg-[#fafafa] hover:border-[#fcd535] hover:bg-[#fffde7]/40"
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-[#fcd535]">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="text-[13px] text-[#555]">
              <span className="text-[#1a73e8] font-semibold underline cursor-pointer">Click to upload</span> or drag and drop
            </p>
            <p className="text-[11px] text-[#aaa]">Maximum file size 50 MB</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {item.files.length > 0 && (
          <ul className="mt-2 space-y-1">
            {item.files.map((f, fi) => (
              <li key={fi} className="flex items-center justify-between text-[12px] text-[#555] bg-[#f8f9fa] rounded px-3 py-1.5 border border-[#e9ecef]">
                <span className="truncate max-w-[80%]">{f.name}</span>
                <button type="button" onClick={() => removeFile(fi)} className="text-[#dc3545] hover:text-red-700 ml-2 font-bold">×</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
