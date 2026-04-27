"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Ticket = {
  id: number;
  ticketId: string;
  ticketNumber?: string | null;
  subject?: string | null;
  status: string;
  user?: { name?: string | null; email?: string | null };
  createdAt: string;
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/support/tickets")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load tickets");
        return response.json();
      })
      .then((data) => setTickets(data ?? []))
      .catch((err) => {
        console.error(err);
        setError("Unable to load tickets.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Tickets</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review and respond to active support tickets from users.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          Loading tickets...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">{error}</div>
      ) : tickets.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          No tickets have been created yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-[0.2em] text-[11px]">
                <tr>
                  <th className="px-5 py-4">Ticket</th>
                  <th className="px-5 py-4">Subject</th>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-800">{ticket.ticketNumber ?? ticket.ticketId}</td>
                    <td className="px-5 py-4 text-slate-700">{ticket.subject ?? "Support ticket"}</td>
                    <td className="px-5 py-4 text-slate-700">
                      {ticket.user?.name || ticket.user?.email || "Anonymous"}
                    </td>
                    <td className="px-5 py-4 text-slate-700">{ticket.status}</td>
                    <td className="px-5 py-4 text-slate-700">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/tickets/${ticket.ticketId}`}
                        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-slate-800"
                      >
                        Open Chat
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
