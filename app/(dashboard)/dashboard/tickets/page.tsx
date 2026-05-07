"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Ticket = {
  id: number;
  ticketId: string;
  ticketNumber?: string | null;
  subject?: string | null;
  status: string;
  createdAt: string;
  threads?: { direction: string; createdAt: string; id: number }[];
};

export default function DashboardTicketsPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`/api/support/tickets?userId=${encodeURIComponent(userId)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load tickets");
        return response.json();
      })
      .then((data) => {
        setTickets(data ?? []);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load tickets.");
      })
      .finally(() => setLoading(false));
  }, [session]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Support Tickets</h1>
          <p className="mt-2 text-sm text-slate-500">
            All open support tickets are shown here with live chat access.
          </p>
        </div>
        <Link
          href="/dashboard/support"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 sm:mt-0"
        >
          New Ticket
        </Link>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          Loading your tickets...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">{error}</div>
      ) : tickets.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          No tickets found. Submit a new ticket to start support.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-[0.2em] text-[11px]">
                <tr>
                  <th className="px-5 py-4">Ticket</th>
                  <th className="px-5 py-4">Subject</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Reply Status</th>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {tickets.map((ticket) => {
                  const isAwaitingUser = ticket.threads && ticket.threads.length > 0 && ticket.threads[0].direction === "2";
                  return (
                  <tr key={ticket.id} className={`transition-colors ${isAwaitingUser ? "bg-emerald-50/50 hover:bg-emerald-50" : "hover:bg-slate-50"}`}>
                    <td className="px-5 py-4 font-medium text-slate-800">{ticket.ticketNumber ?? ticket.ticketId}</td>
                    <td className="px-5 py-4 text-slate-700">{ticket.subject ?? "Support conversation"}</td>
                    <td className="px-5 py-4 text-slate-700">{ticket.status}</td>
                    <td className="px-5 py-4">
                      {isAwaitingUser ? (
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">New Reply</span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">Awaiting Admin</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-700">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/dashboard/tickets/${ticket.ticketId}`}
                        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-slate-800"
                      >
                        Open Chat
                      </Link>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
