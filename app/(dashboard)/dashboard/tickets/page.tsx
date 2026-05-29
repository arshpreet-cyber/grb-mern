"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Eye, Plus, RefreshCw, MessageSquare } from "lucide-react";
import Link from "next/link";
import DataTable, { Column, StatusPill } from "@/components/ui/DataTable";

type Ticket = {
  id: number;
  ticketId: string;
  ticketNumber?: string | null;
  subject?: string | null;
  status: string;
  createdAt: string;
  threads?: { direction: string; createdAt: string; id: number }[];
};

function getLastThread(t: Ticket) {
  if (!t.threads || t.threads.length === 0) return null;
  return t.threads[0];
}

function getLastActivityTs(t: Ticket): number {
  const last = getLastThread(t);
  return last ? new Date(last.createdAt).getTime() : new Date(t.createdAt).getTime();
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
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
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
      .then(data => { setTickets(data ?? []); setError(null); })
      .catch(() => setError("Unable to load tickets."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadTickets(); }, [session]);

  const columns: Column<Ticket>[] = [
    {
      key: "ticketId",
      header: "Ticket #",
      render: (t) => {
        const hasNewReply = getLastThread(t)?.direction === "2";
        return (
          <div className="flex items-center gap-2">
            {hasNewReply && (
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" title="New Reply" />
            )}
            <span className="font-mono font-semibold text-[13px]">
              {t.ticketNumber ?? t.ticketId}
            </span>
          </div>
        );
      },
    },
    {
      key: "subject",
      header: "Subject",
      render: (t) => (
        <div className="flex items-center gap-2">
          <span className="text-[13px]">{t.subject ?? "Support conversation"}</span>
          {getLastThread(t)?.direction === "2" && (
            <span className="text-[10px] font-bold bg-[#FFCE2E] text-black px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0">
              New Reply
            </span>
          )}
        </div>
      ),
    },
    {
      key: "replyStatus",
      header: "Reply Status",
      render: (t) => {
        const last = getLastThread(t);
        const isAdminReply = last?.direction === "2";
        const isWaiting = last?.direction === "1";
        const time = last ? last.createdAt : t.createdAt;

        if (!last) {
          return (
            <div>
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold px-3 py-1.5 rounded-lg border bg-gray-50 text-gray-500 border-gray-200">
                <span className="w-2 h-2 rounded-full shrink-0 bg-gray-400" />
                Open
              </span>
              <div className="text-[11px] text-gray-400 mt-1 pl-1">{timeAgo(time)}</div>
            </div>
          );
        }

        return (
          <div>
            <span className={`inline-flex items-center gap-2 text-[13px] font-semibold px-3 py-1.5 rounded-lg border ${
              isAdminReply
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-orange-50 text-orange-800 border-orange-200"
            }`}>
              <span className={`w-2 h-2 rounded-full shrink-0 ${isAdminReply ? "bg-green-500" : "bg-orange-500"}`} />
              {isAdminReply ? "Admin Replied" : "Waiting for Reply"}
            </span>
            <div className="text-[11px] text-gray-400 mt-1 pl-1">{timeAgo(time)}</div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (t) => (
        <StatusPill
          value={t.status}
          colorMap={{
            Open: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400",
            Closed: "border-gray-200 bg-gray-50 text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white",
            Pending: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400",
            Answered: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400",
            Hold: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-900/20 dark:text-orange-400",
            Escalated: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/50 dark:bg-purple-900/20 dark:text-purple-400",
          }}
        />
      ),
    },
    {
      key: "createdAt",
      header: "Last Activity",
      render: (t) => (
        <span className="text-[12px] text-gray-500">
          {timeAgo(new Date(getLastActivityTs(t)).toISOString())}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (t) => (
        <Link
          href={`/dashboard/tickets/${t.ticketId}`}
          title="View Ticket"
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#FFCE2E] text-gray-500 hover:text-black transition"
        >
          <Eye size={15} />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] bg-white dark:bg-[#1a1f2c] border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
              <MessageSquare size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">My Support Tickets</h1>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
                View and manage all your support requests.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadTickets}
              className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>
            <Link
              href="/dashboard/support"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFCE2E] hover:bg-[#EBB81E] text-black text-[13px] font-bold transition shadow-sm"
            >
              <Plus size={14} /> Open Ticket
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-[#1a1f2c] rounded-[20px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <DataTable
          data={tickets}
          columns={columns}
          loading={loading}
          searchable
          searchPlaceholder="Search tickets..."
          pageSize={10}
          emptyText="No tickets found. Open a support ticket and we'll get back to you shortly."
          rowClassName={(t) => {
            const last = getLastThread(t);
            if (last?.direction === "2") return "bg-yellow-50/40 dark:bg-yellow-900/10";
            return "";
          }}
        />
      </div>
    </div>
  );
}
