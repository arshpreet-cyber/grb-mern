"use client";

import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

const METHODS = [
  { key: "paypal", label: "PayPal" },
  { key: "card", label: "Pay by Card" },
  { key: "razorpay", label: "Razorpay" },
] as const;

type Links = Partial<Record<(typeof METHODS)[number]["key"], string>>;

// Same payment choices as the cart (PayPal / Pay by Card / Razorpay). Picking
// one opens that gateway for the existing order.
export default function PayNowDropdown({
  orderId,
  fallbackUrl,
  align = "right",
  openUpward = false,
}: {
  orderId: string;
  fallbackUrl?: string | null;
  align?: "left" | "right";
  openUpward?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState<Links | null>(null);
  const [loading, setLoading] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (!open && !links) {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/${orderId}/pay-links`);
        const data = await res.json();
        if (res.ok) setLinks(data);
      } catch {
        /* fall back below */
      } finally {
        setLoading(false);
      }
    }
    setOpen((o) => !o);
  }

  function go(key: (typeof METHODS)[number]["key"]) {
    const url = links?.[key] ?? fallbackUrl;
    if (url) window.location.href = url;
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={toggle}
        className="inline-flex items-center gap-1.5 rounded-[5px] bg-[#0084FF] hover:bg-blue-700 px-3 py-1.5 text-[11px] font-medium text-white transition-colors whitespace-nowrap"
      >
        Pay Now {loading ? <Loader2 size={12} className="animate-spin" /> : <ChevronDown size={12} />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
          <div
            className={`absolute ${align === "right" ? "right-0" : "left-0"} ${openUpward ? "bottom-[calc(100%+4px)]" : "top-[calc(100%+4px)]"} z-50 w-36 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden`}
          >
            {METHODS.map((m, i) => (
              <button
                key={m.key}
                onClick={(e) => { e.stopPropagation(); go(m.key); }}
                className={`block w-full text-left px-4 py-2.5 text-[12px] font-medium text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors ${i > 0 ? "border-t border-gray-100 dark:border-slate-800" : ""}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
