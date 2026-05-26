export const ORDER_STATUS: Record<string, { label: string; tailwind: string }> = {
  "1": { label: "Pending",    tailwind: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  "2": { label: "Processing", tailwind: "bg-blue-100 text-blue-700 border-blue-300" },
  "3": { label: "Complete",   tailwind: "bg-green-100 text-green-700 border-green-300" },
  "4": { label: "On Hold",    tailwind: "bg-orange-100 text-orange-700 border-orange-300" },
  "5": { label: "Cancelled",  tailwind: "bg-red-100 text-red-700 border-red-300" },
  "6": { label: "Refund",     tailwind: "bg-purple-100 text-purple-700 border-purple-300" },
};

export const PAYMENT_STATUS: Record<string, { label: string; tailwind: string }> = {
  "1": { label: "Unpaid",       tailwind: "bg-red-100 text-red-700 border-red-300" },
  "2": { label: "Paid",         tailwind: "bg-green-100 text-green-700 border-green-300" },
  "3": { label: "Unconfirmed",  tailwind: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  "4": { label: "Cancelled",    tailwind: "bg-gray-100 text-gray-600 border-gray-300" },
};

export function orderStatusLabel(val: string | null | undefined): string {
  return ORDER_STATUS[val ?? ""]?.label ?? val ?? "—";
}

export function paymentStatusLabel(val: string | null | undefined): string {
  return PAYMENT_STATUS[val ?? ""]?.label ?? val ?? "—";
}
