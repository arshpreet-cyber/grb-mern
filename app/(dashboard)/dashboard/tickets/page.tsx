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
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1f2c] p-6 shadow-sm sm:flex sm:items-center sm:justify-between transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Your Support Tickets</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            All open support tickets are shown here with live chat access.
          </p>
        </div>
        <Link
          href="/dashboard/support"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-violet-600 dark:bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 dark:hover:bg-violet-400 sm:mt-0"
        >
          New Ticket
        </Link>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1f2c] p-10 text-center text-slate-500 dark:text-slate-400 shadow-sm transition-colors">
          Loading your tickets...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/20 p-6 text-rose-700 dark:text-rose-400 shadow-sm transition-colors">{error}</div>
      ) : tickets.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1f2c] p-10 text-center text-slate-500 dark:text-slate-400 shadow-sm transition-colors">
          No tickets found. Submit a new ticket to start support.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1f2c] shadow-sm transition-colors">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] text-[11px]">
                <tr>
                  <th className="px-5 py-4">Ticket</th>
                  <th className="px-5 py-4">Subject</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Reply Status</th>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-transparent">
                {tickets.map((ticket) => {
                  const isAwaitingUser = ticket.threads && ticket.threads.length > 0 && ticket.threads[0].direction === "2";
                  return (
                  <tr key={ticket.id} className={`transition-colors ${isAwaitingUser ? "bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"}`}>
                    <td className="px-5 py-4 font-medium text-slate-800 dark:text-slate-200">{ticket.ticketNumber ?? ticket.ticketId}</td>
                    <td className="px-5 py-4 text-slate-700 dark:text-slate-300">{ticket.subject ?? "Support conversation"}</td>
                    <td className="px-5 py-4 text-slate-700 dark:text-slate-300">{ticket.status}</td>
                    <td className="px-5 py-4">
                      {isAwaitingUser ? (
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">New Reply</span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800">Awaiting Admin</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-700 dark:text-slate-400">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/dashboard/tickets/${ticket.ticketId}`}
                        className="rounded-full bg-slate-900 dark:bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white dark:text-black transition hover:bg-slate-800 dark:hover:bg-slate-200"
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
