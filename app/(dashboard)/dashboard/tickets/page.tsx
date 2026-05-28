"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare, Clock, CheckCircle2, XCircle, AlertCircle, Plus, ChevronRight, RefreshCw } from "lucide-react";

type Ticket = {
  id: number;
  ticketId: string;
  ticketNumber?: string | null;
  subject?: string | null;
  status: string;
  createdAt: string;
  threads?: { direction: string; createdAt: string; id: number }[];
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; dot: string }> = {
    "Open":    { bg: "bg-emerald-50 border-emerald-200 text-emerald-700", dot: "bg-emerald-500" },
    "Closed":  { bg: "bg-gray-100 border-gray-200 text-gray-500", dot: "bg-gray-400" },
    "Pending": { bg: "bg-amber-50 border-amber-200 text-amber-700", dot: "bg-amber-500" },
  };
  const s = map[status] ?? map["Pending"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
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
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
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

  const open = tickets.filter(t => t.status === "Open").length;
  const pending = tickets.filter(t => t.status === "Pending").length;
  const closed = tickets.filter(t => t.status === "Closed").length;
  const hasNewReply = (t: Ticket) => t.threads && t.threads.length > 0 && t.threads[0].direction === "2";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Support Tickets</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Track and manage your support requests</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadTickets} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition">
            <RefreshCw size={13} /> Refresh
          </button>
          <Link href="/dashboard/support" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFCE2E] hover:bg-[#EBB81E] text-black text-[13px] font-bold transition shadow-sm">
            <Plus size={14} /> New Ticket
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Open", count: open, icon: <CheckCircle2 size={16} />, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          { label: "Pending", count: pending, icon: <Clock size={16} />, color: "text-amber-600 bg-amber-50 border-amber-100" },
          { label: "Closed", count: closed, icon: <XCircle size={16} />, color: "text-gray-500 bg-gray-50 border-gray-100" },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 flex items-center gap-3 ${s.color}`}>
            <div className="shrink-0">{s.icon}</div>
            <div>
              <div className="text-[20px] font-bold leading-none">{s.count}</div>
              <div className="text-[12px] font-medium mt-0.5 opacity-80">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket List */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-[14px]">
          <RefreshCw size={20} className="animate-spin mx-auto mb-3 opacity-40" />
          Loading tickets...
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-xl border border-red-200 p-6 flex items-center gap-3 text-red-600 text-[14px]">
          <AlertCircle size={16} /> {error}
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-14 text-center">
          <MessageSquare size={32} className="mx-auto mb-3 text-gray-300" />
          <p className="font-semibold text-gray-500 text-[15px]">No tickets yet</p>
          <p className="text-[13px] text-gray-400 mt-1 mb-5">Submit a ticket and we'll get back to you shortly.</p>
          <Link href="/dashboard/support" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FFCE2E] hover:bg-[#EBB81E] text-black text-[13px] font-bold transition">
            <Plus size={14} /> Open a Ticket
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {tickets.map((ticket) => {
            const newReply = hasNewReply(ticket);
            const lastActivity = ticket.threads?.[0]?.createdAt ?? ticket.createdAt;
            return (
              <Link
                key={ticket.id}
                href={`/dashboard/tickets/${ticket.ticketId}`}
                className={`block bg-white rounded-xl border transition hover:shadow-md group ${newReply ? "border-[#FFCE2E] ring-1 ring-[#FFCE2E]/30" : "border-gray-200 hover:border-gray-300"}`}
              >
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Icon */}
                  <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${newReply ? "bg-[#FFCE2E]" : "bg-gray-100"}`}>
                    <MessageSquare size={16} className={newReply ? "text-black" : "text-gray-500"} />
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[13px] font-bold text-gray-900 truncate">
                        {ticket.subject ?? "Support conversation"}
                      </span>
                      {newReply && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#FFCE2E] text-black px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0">
                          New Reply
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[12px] text-gray-400">
                      <span className="font-mono">#{ticket.ticketNumber ?? ticket.ticketId}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {timeAgo(lastActivity)}</span>
                      <span>·</span>
                      <span>{ticket.threads?.length ?? 0} {(ticket.threads?.length ?? 0) === 1 ? "reply" : "replies"}</span>
                    </div>
                  </div>

                  {/* Status + arrow */}
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={ticket.status} />
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
