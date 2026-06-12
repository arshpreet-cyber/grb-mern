export const ORDER_STATUS: Record<string, { label: string; tailwind: string }> = {
  "1": { label: "Pending",    tailwind: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  "2": { label: "Complete",   tailwind: "bg-green-100 text-green-700 border-green-300" },
  "3": { label: "On Hold",    tailwind: "bg-orange-100 text-orange-700 border-orange-300" },
  "4": { label: "Cancelled",  tailwind: "bg-red-100 text-red-700 border-red-300" },
  "5": { label: "Processing", tailwind: "bg-blue-100 text-blue-700 border-blue-300" },
  "6": { label: "Refund",     tailwind: "bg-purple-100 text-purple-700 border-purple-300" },
  "7": { label: "Failed",     tailwind: "bg-red-100 text-red-700 border-red-300" },
  "8": { label: "Fraud",      tailwind: "bg-red-100 text-red-700 border-red-300" },
  "9": { label: "Active",     tailwind: "bg-emerald-100 text-emerald-700 border-emerald-300" },
};

export const PAYMENT_STATUS: Record<string, { label: string; tailwind: string }> = {
  "1": { label: "Unpaid",       tailwind: "bg-red-100 text-red-700 border-red-300" },
  "2": { label: "Paid",         tailwind: "bg-green-100 text-green-700 border-green-300" },
  "3": { label: "Cancelled",    tailwind: "bg-gray-100 text-gray-600 border-gray-300" },
  "4": { label: "Unconfirmed",  tailwind: "bg-yellow-100 text-yellow-700 border-yellow-300" },
};

export function orderStatusLabel(val: string | null | undefined): string {
  return ORDER_STATUS[val ?? ""]?.label ?? val ?? "—";
}

export function paymentStatusLabel(val: string | null | undefined): string {
  return PAYMENT_STATUS[val ?? ""]?.label ?? val ?? "—";
}

export const PAYMENT_METHODS: Record<string, { label: string; tailwind: string }> = {
  "1": { label: "Bitcoin",       tailwind: "bg-amber-600 text-white" },
  "2": { label: "Razorpay",      tailwind: "bg-blue-500 text-white" },
  "3": { label: "Stripe",        tailwind: "bg-indigo-600 text-white" },
  "4": { label: "PayPal",        tailwind: "bg-blue-700 text-white" },
  "5": { label: "Bank Transfer", tailwind: "bg-gray-800 text-white" },
  "6": { label: "Binance",       tailwind: "bg-yellow-500 text-black" },
};

export function paymentMethodLabel(val: string | null | undefined): string {
  return PAYMENT_METHODS[val ?? ""]?.label ?? val ?? "—";
}

export function paymentMethodColor(val: string | null | undefined): string {
  return PAYMENT_METHODS[val ?? ""]?.tailwind ?? "bg-gray-200 text-gray-700";
}

// Legacy/Zoho tickets store numeric status codes; app-created tickets use string
// labels. Map codes to labels and pass through existing labels.
export const TICKET_STATUS: Record<string, { label: string; tailwind: string }> = {
  "1": { label: "Open",      tailwind: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "2": { label: "Closed",    tailwind: "bg-gray-50 text-gray-500 border-gray-200" },
  "3": { label: "On Hold",   tailwind: "bg-orange-50 text-orange-700 border-orange-200" },
  "4": { label: "Answered",  tailwind: "bg-blue-50 text-blue-700 border-blue-200" },
  "5": { label: "Escalated", tailwind: "bg-purple-50 text-purple-700 border-purple-200" },
};

export function ticketStatusLabel(val: string | null | undefined): string {
  if (!val) return "—";
  return TICKET_STATUS[val]?.label ?? val;
}

export function ticketStatusColor(val: string | null | undefined): string {
  const code = TICKET_STATUS[val ?? ""];
  if (code) return code.tailwind;
  switch (val) {
    case "Open": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Closed": return "bg-gray-50 text-gray-500 border-gray-200";
    case "On Hold":
    case "Hold": return "bg-orange-50 text-orange-700 border-orange-200";
    case "Answered":
    case "Awaiting Reply": return "bg-blue-50 text-blue-700 border-blue-200";
    case "Escalated": return "bg-purple-50 text-purple-700 border-purple-200";
    default: return "bg-blue-50 text-blue-700 border-blue-200";
  }
}
