"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Loader2 } from "lucide-react";

const METHODS = [
  { key: "paypal", label: "PayPal" },
  { key: "card", label: "Pay by Card" },
  { key: "razorpay", label: "Razorpay" },
] as const;

type Links = Partial<Record<(typeof METHODS)[number]["key"], string>>;

const MENU_W = 160;
const MENU_H = 132;

// Same payment choices as the cart (PayPal / Pay by Card / Razorpay). Picking
// one opens that gateway for the existing order. The menu is portalled to
// <body> with fixed positioning so it never gets clipped by a scrolling table.
export default function PayNowDropdown({
  orderId,
  fallbackUrl,
}: {
  orderId: string;
  fallbackUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState<Links | null>(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function reposition() {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    const spaceBelow = window.innerHeight - r.bottom;
    const top = spaceBelow < MENU_H + 12 ? r.top - MENU_H - 6 : r.bottom + 6;
    const left = Math.max(8, Math.min(r.right - MENU_W, window.innerWidth - MENU_W - 8));
    setCoords({ top, left });
  }

  async function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (!open) {
      reposition();
      if (!links) {
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
    }
    setOpen((o) => !o);
  }

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  function go(key: (typeof METHODS)[number]["key"]) {
    const url = links?.[key] ?? fallbackUrl;
    if (url) window.location.href = url;
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#0084FF] hover:bg-blue-700 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors whitespace-nowrap shadow-sm"
      >
        Pay Now {loading ? <Loader2 size={12} className="animate-spin" /> : <ChevronDown size={12} />}
      </button>

      {open && mounted &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[998]" onClick={() => setOpen(false)} />
            <div
              className="fixed z-[999] rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-[0_10px_30px_rgba(0,0,0,0.12)] overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-150"
              style={{ top: coords.top, left: coords.left, width: MENU_W }}
            >
              {METHODS.map((m) => (
                <button
                  key={m.key}
                  onClick={(e) => { e.stopPropagation(); go(m.key); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-medium text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {m.label}
                </button>
              ))}
            </div>
          </>,
          document.body
        )}
    </>
  );
}
