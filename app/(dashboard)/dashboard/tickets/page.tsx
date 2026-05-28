"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Eye, Plus, RefreshCw, AlertCircle, MessageSquare, Clock } from "lucide-react";

type Ticket = {
  id: number;
  ticketId: string;
  ticketNumber?: string | null;
  subject?: string | null;
  status: string;
  createdAt: string;
  threads?: { direction: string; createdAt: string; id: number }[];
};

function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Open": "bg-emerald-500",
    "Answered": "bg-blue-500",
    "Pending": "bg-amber-500",
    "Closed": "bg-gray-400",
  };
  const color = map[status] ?? "bg-amber-500";
  return (
    <span className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full shrink-0 ${color}`} />
      <span className="text-[13px] text-gray-700">{status}</span>
    </span>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) +
    " (" + new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) + ")";
}

export default function DashboardTicketsPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = () => {
    const userId = session?.user?.id;
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    fetch(`/api/support/tickets?userId=${encodeURIComponent(userId)}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => setTickets(data ?? []))
      .catch(() => setError("Unable to load tickets."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadTickets(); }, [session]);

  const hasNewReply = (t: Ticket) => t.threads && t.threads.length > 0 && t.threads[0].direction === "2";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-bold text-gray-900">My Support Tickets</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">View and manage all your support requests</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadTickets} title="Refresh" className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
            <RefreshCw size={15} />
          </button>
          <Link href="/dashboard/support" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFCE2E] hover:bg-[#EBB81E] text-black text-[13px] font-bold transition shadow-sm">
            <Plus size={14} /> Open Ticket
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-14 text-center text-gray-400 text-[14px]">
            <RefreshCw size={20} className="animate-spin mx-auto mb-3 opacity-40" />
            Loading tickets...
          </div>
        ) : error ? (
          <div className="p-6 flex items-center gap-3 text-red-600 text-[13px]">
            <AlertCircle size={15} /> {error}
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-14 text-center">
            <MessageSquare size={30} className="mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-500 text-[14px]">No tickets found</p>
            <p className="text-[13px] text-gray-400 mt-1 mb-5">Open a support ticket and we'll get back to you shortly.</p>
            <Link href="/dashboard/support" className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#FFCE2E] hover:bg-[#EBB81E] text-black text-[13px] font-bold transition">
              <Plus size={13} /> Open a Ticket
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Ticket #</th>
                  <th className="px-5 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Subject</th>
                  <th className="px-5 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Last Updated</th>
                  <th className="px-5 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.map((ticket) => {
                  const newReply = hasNewReply(ticket);
                  const lastActivity = ticket.threads?.[0]?.createdAt ?? ticket.createdAt;
                  return (
                    <tr key={ticket.id} className={`transition-colors ${newReply ? "bg-yellow-50/60 hover:bg-yellow-50" : "hover:bg-gray-50/70"}`}>
                      <td className="px-5 py-4">
                        <span className="font-mono text-[12px] font-semibold text-blue-600">
                          #{ticket.ticketNumber ?? ticket.ticketId}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-800 font-medium">{ticket.subject ?? "Support conversation"}</span>
                          {newReply && (
                            <span className="text-[10px] font-bold bg-[#FFCE2E] text-black px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0">
                              New Reply
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <StatusDot status={ticket.status} />
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} className="text-gray-400" />
                          {formatDate(lastActivity)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Link
                          href={`/dashboard/tickets/${ticket.ticketId}`}
                          title="View Ticket"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#FFCE2E] text-gray-500 hover:text-black transition"
                        >
                          <Eye size={15} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
