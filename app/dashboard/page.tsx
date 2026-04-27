"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PlusCircle,ArrowUpRight,MoreVertical,CheckCircle2, FileText, Eye } from "lucide-react";

type Order = {
  id: string; paymentId: string; amount: string; date: string;
  method: string; status: string; paymentStatus: string;
};

type ApiOrder = {
  id: string;
  orderNumber: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: string;
  paymentStatus: string;
};

const dummyOrders: Order[] = [
  { id: "#177150846", paymentId: "12345678", amount: "$100.00", date: "19-2-2026", method: "Credit Card", status: "Pending", paymentStatus: "Pending" },
  { id: "#177150847", paymentId: "87654321", amount: "$250.00", date: "18-2-2026", method: "PayPal", status: "Complete", paymentStatus: "Complete" },
  { id: "#177150848", paymentId: "11223344", amount: "$75.50", date: "17-2-2026", method: "Credit Card", status: "Complete", paymentStatus: "Complete" },
];

export default function UserDashboard() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const name = session?.user?.name ?? "User";

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data.map((o: ApiOrder) => ({
            id: o.orderNumber, paymentId: o.id.substring(0, 8),
            amount: `$${o.amount.toFixed(2)}`, date: new Date(o.date).toLocaleDateString(),
            method: o.paymentMethod, status: o.status, paymentStatus: o.paymentStatus,
          })));
        } else {
          setOrders(dummyOrders);
        }
      })
      .catch(() => setOrders(dummyOrders))
      .finally(() => setLoading(false));
  }, []);

const stats = [
  { label: "VIEW TOTAL ORDER", value: "35", bg: "bg-[#FBF0E2]", iconColor: "text-[#DA7A00]" },
  { label: "VIEW ACTIVE SUBSCRIPTIONS", value: "25", bg: "bg-[#F0F4FF]", iconColor: "text-[#001E70]" },
  { label: "VIEW PENDING ORDERS", value: "15", bg: "bg-[#EDF5E8]", iconColor: "text-[#317607]" },
  { label: "VIEW OPEN TICKET", value: "05", bg: "bg-[#F6EEFF]", iconColor: "text-[#48009D]" },
];

const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden h-[194px] mt-2 rounded-2xl bg-gradient-to-r from-[#e3f8ea] via-[##D3F8FC] to-[#fdf4d3] px-8 py-8 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
            
            {/* Decorative background curve to match the exact image */}
            <div className="absolute -bottom-24 -right-10 h-64 w-[55%] rounded-[100%] bg-[#fef7dd] opacity-70 blur-xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-5 h-40 w-[40%] rounded-tl-full bg-gradient-to-br from-[#fcf4d4] to-transparent opacity-80 pointer-events-none"></div>

            <div className="relative mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-[40px] font-medium text-black">Hello! {name}</h1>
                <p className="mt-1.5 text-[18px] text-gray-800">
                  Manage your orders, track your reviews, and get support — all from your dashboard.
                </p>
              </div>
              
              <Link 
                href="/dashboard/support"
                className="inline-flex items-center gap-2 rounded-xl bg-black px-5 h-[53px] w-[213px] py-2.5 text-[15px] text-white hover:bg-gray-800 transition-colors shrink-0"
              >
                <PlusCircle size={18} strokeWidth={1.5} className="text-white" />
                <span>Create New Ticket</span>
              </Link>
            </div>
          </div>

      {/* Stat Cards */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`${s.bg} rounded-[20px] p-6 h-[121px] flex flex-col justify-between`}>
            <div className="flex items-start justify-between">
              {/* Large Number */}
              <p className="text-4xl font-[500] text-slate-900">{s.value}</p>
              
              {/* Top-Right Arrow Button */}
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <ArrowUpRight className={`w-5 h-5 ${s.iconColor}`} />
              </div>
            </div>
            
            {/* Bottom Label */}
            <p className="mt-4 text-[15px] font-[500] text-slate-900 tracking-wide">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-[25px] font-[500] text-slate-800">Recent Order Details</h2>
          <Link href="/dashboard/one-time-orders" className="text-[15px] font-[500] text-slate-400 hover:text-slate-600 underline uppercase tracking-widest">
            View All Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {[
                  "# Order No", "Payment ID", "Amount", "Date", 
                  "Payment Method", "Status", "Payment Status", 
                  "Order Details", "Payment option", "Action"
                ].map((h) => (
                  <th key={h} className="px-5 py-4 text-[10px] font-[500] uppercase tracking-widest text-slate-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="text-[14px] px-5 py-5 font-[400]">{o.id}</td>
                  <td className="text-[14px] px-5 py-5 font-[400]">{o.paymentId}</td>
                  <td className="text-[14px] px-5 py-5 font-[400]">{o.amount}</td>
                  <td className="text-[14px] px-5 py-5 font-[400]">{o.date}</td>

                <td className="px-5 py-5">
                  <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-[400] text-amber-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {o.method}
                  </span>
                </td>

                  <td className="px-5 py-5">
                    <span className={`inline-flex items-center gap-1.5 rounded-[5px] border px-2.5 py-1 text-[10px] font-[400] ${o.status === "Pending" ? "border-rose-200 bg-rose-50 text-rose-600" : "border-emerald-200 bg-emerald-50 text-emerald-600"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${o.status === "Pending" ? "bg-rose-500" : "bg-emerald-500"}`} />
                      {o.status}
                    </span>
                  </td>

                  <td className="px-5 py-5">
                    <span className={`inline-flex items-center gap-1.5 rounded-[5px] border px-2.5 py-1 text-[10px] font-[400] ${o.paymentStatus === "Pending" ? "border-rose-200 bg-rose-50 text-rose-600" : "border-emerald-200 bg-emerald-50 text-emerald-600"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${o.paymentStatus === "Pending" ? "bg-rose-500" : "bg-emerald-500"}`} />
                      {o.paymentStatus}
                    </span>
                  </td>

                  <td className="px-5 py-5">
                    <button className="rounded-[5px] bg-blue-600 px-3 py-1 text-[10px] font-[400] text-white shadow-sm hover:bg-blue-700 transition">
                      Input Details
                    </button>
                  </td>

                  <td className="px-5 py-5">
                    {o.status === "Pending" && (
                      <div className="flex flex-col gap-2">
                        <select className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10px] text-slate-600 outline-none w-32">
                          <option>Credit Card</option>
                          <option>PayPal</option>
                        </select>
                        <button className="rounded-[5px] bg-blue-500 px-3 py-1.5 text-[10px] font-[400] text-white transition w-32">
                          Pay Now
                        </button>
                      </div>
                    )}
                  </td>

                  <td className="relative px-5 py-5">
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === o.id ? null : o.id)}
                      className="text-slate-400 hover:text-slate-600 transition"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === o.id && (
                      <>
                        {/* Click outside overlay - Increased z-index to 40 */}
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                        
                        {/* Changed positioning to 'bottom-8 right-8' to open UPWARDS. */}
                        <div className="absolute bottom-8 right-8 z-[9999] w-34 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden">
                          
                        {/* Live Status */}
                        <div className="group flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-[#54CE12] cursor-pointer transition">
                          <CheckCircle2 size={16} className="text-slate-400 group-hover:text-white transition"/>
                          <span className="text-[12px] font-[400] group-hover:text-white transition">Live Status</span>
                        </div>
                                                
                        {/* Invoices */}
                        <div className="group flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-[#54CE12] cursor-pointer transition">
                          <FileText size={16} className="text-slate-400 group-hover:text-white transition" />
                          <span className="text-[12px] font-[400] group-hover:text-white transition">Invoices</span>
                        </div>
                                                
                        {/* See More */}
                        <div className="group flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-[#54CE12] cursor-pointer transition">
                          <Eye size={16} className="text-slate-400 group-hover:text-white transition" />
                          <span className="text-[12px] font-[400] group-hover:text-white transition">See More</span>
                        </div>

                      </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
