"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [statCards, setStatCards] = useState([
    { label: "View Total Order", value: 35 },
    { label: "View Active Subscriptions", value: 25 },
    { label: "View Pending Orders", value: 15 },
    { label: "View Open Ticket", value: 5 },
  ]);

  type Order = {
    id: string;
    paymentId: string;
    amount: string;
    date: string;
    method: string;
    status: string;
    paymentStatus: string;
    details: string;
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();
        
        // Format orders for display
        const formattedOrders = data.map((order: any) => ({
          id: order.orderNumber,
          paymentId: order.id.substring(0, 8),
          amount: `$${order.amount.toFixed(2)}`,
          date: new Date(order.date).toLocaleDateString(),
          method: order.paymentMethod,
          status: order.status,
          paymentStatus: order.paymentStatus,
          details: "Input Details",
        }));
        
        setOrders(formattedOrders.length > 0 ? formattedOrders : generateDummyOrders());
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders(generateDummyOrders());
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const generateDummyOrders = () => [
    {
      id: "#177150846",
      paymentId: "123456",
      amount: "$100",
      date: "19-2-2026",
      method: "Credit Card",
      status: "Pending",
      paymentStatus: "Pending",
      details: "Input Details",
    },
    {
      id: "#177150846",
      paymentId: "123456",
      amount: "$100",
      date: "19-2-2026",
      method: "Credit Card",
      status: "Complete",
      paymentStatus: "Complete",
      details: "Input Details",
    },
    {
      id: "#177150846",
      paymentId: "123456",
      amount: "$100",
      date: "19-2-2026",
      method: "Credit Card",
      status: "Pending",
      paymentStatus: "Pending",
      details: "Input Details",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-72">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[36px] border border-slate-200 bg-gradient-to-r from-emerald-100 via-white to-violet-100 p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Hello! Sourabh.D</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Hello! Sourabh.D</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Lorem ipsum is simply dummy text of the printing and typesetting industry.
            </p>
          </div>

          <button className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
            Create New Ticket
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">{card.label}</p>
            <p className="mt-5 text-3xl font-semibold text-slate-900">{card.value.toString().padStart(2, "0")}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-[30px] bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Recent Order Details</p>
          </div>
          <Link href="#" className="text-sm font-medium text-slate-500 hover:text-slate-700">
            View All Orders
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-[0.15em] text-xs">
              <tr>
                {['# Order No', 'Payment ID', 'Amount', 'Date', 'Payment Method', 'Status', 'Payment Status', 'Order Details', 'Payment option', 'Action'].map((heading) => (
                  <th key={heading} className="px-5 py-4 font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {orders.map((order, index) => (
                <tr key={`${order.id}-${index}`} className="hover:bg-slate-50">
                  <td className="px-5 py-4 text-slate-700">{order.id}</td>
                  <td className="px-5 py-4 text-slate-700">{order.paymentId}</td>
                  <td className="px-5 py-4 text-slate-700">{order.amount}</td>
                  <td className="px-5 py-4 text-slate-700">{order.date}</td>
                  <td className="px-5 py-4 text-slate-700">{order.method}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${order.status === 'Pending' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${order.paymentStatus === 'Pending' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-blue-600 font-medium">{order.details}</td>
                  <td className="px-5 py-4">
                    <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none">
                      <option>Choose Methods</option>
                      <option>Credit Card</option>
                      <option>PayPal</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <button className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white hover:bg-blue-700 transition">
                      Pay Now
                    </button>
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
