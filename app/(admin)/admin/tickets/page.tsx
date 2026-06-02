"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DataTable, { Column, StatusPill } from "@/components/ui/DataTable";
import { Eye, Headphones, RefreshCw, User, ShieldCheck } from "lucide-react";

type Ticket = {
  id: number;
  ticketId: string;
  displayId?: number | null;
  ticketNumber?: string | null;
  subject?: string | null;
  status: string;
  readStatus?: number | null;
  user?: { name?: string | null; email?: string | null };
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

function sortTickets(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort((a, b) => {
    const aLast = getLastThread(a);
    const bLast = getLastThread(b);

    // No-thread tickets = customer opened, treat as client reply → comes first
    const aIsClientReply = !aLast || String(aLast.direction) === "1";
    const bIsClientReply = !bLast || String(bLast.direction) === "1";

    if (aIsClientReply && !bIsClientReply) return -1;
    if (!aIsClientReply && bIsClientReply) return 1;

    // Within same group, sort by latest activity (newest first)
    return getLastActivityTs(b) - getLastActivityTs(a);
  });
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

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const loadTickets = () => {
    setLoading(true);
    fetch("/api/support/tickets")
      .then(async (r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => setTickets(sortTickets(data ?? [])))
      .catch(() => setError("Unable to load tickets."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadTickets(); }, []);

  const columns: Column<Ticket>[] = [
    {
      key: "ticketId",
      header: "Ticket #",
      render: (t) => (
        <div className="flex items-center gap-2">
          {t.readStatus === 1 && (
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" title="Unread" />
          )}
          <span className="font-mono font-semibold text-[13px]">
            #{t.displayId ?? t.ticketNumber ?? t.ticketId}
          </span>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      render: (t) => (
        <span className="text-[13px]">{t.subject ?? "Support ticket"}</span>
      ),
    },
    {
      key: "user",
      header: "Customer",
      render: (t) => (
        <div className="text-[13px]">
          <div className="font-medium">{t.user?.name || "Anonymous"}</div>
          {t.user?.email && <div className="text-gray-400 text-[11px]">{t.user.email}</div>}
        </div>
      ),
    },
    {
      key: "lastReply",
      header: "Reply Status",
      render: (t) => {
        const last = getLastThread(t);
        // No threads = customer just opened the ticket (query only)
        const isCustomer = !last || String(last.direction) === "1";
        const time = last ? last.createdAt : t.createdAt;
        return (
          <div>
            <span className={`inline-flex items-center gap-2 text-[13px] font-semibold px-3 py-1.5 rounded-lg border ${
              isCustomer
                ? "bg-orange-100 text-orange-800 border-orange-300"
                : "bg-green-100 text-green-800 border-green-300"
            }`}>
              <span className={`w-2 h-2 rounded-full shrink-0 ${isCustomer ? "bg-orange-500" : "bg-green-500"}`} />
              {isCustomer ? "Customer Replied" : "Admin Replied"}
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
          }}
        />
      ),
    },
    {
      key: "createdAt",
      header: "Last Activity",
      render: (t) => (
        <span className="text-[12px] text-gray-500">
          {timeAgo(getLastActivityTs(t) ? new Date(getLastActivityTs(t)).toISOString() : t.createdAt)}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (t) => (
        <Link
          href={`/admin/tickets/${t.ticketId}`}
          title="View Ticket"
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#FFCE2E] text-gray-500 hover:text-black transition"
        >
          <Eye size={15} />
        </Link>
      ),
    },
  ];

  const counts = {
    all: tickets.length,
    open: tickets.filter(t => t.status === "Open").length,
    awaiting: tickets.filter(t => t.status === "Awaiting Reply" || t.status === "Answered").length,
    closed: tickets.filter(t => t.status === "Closed").length,
    pending: tickets.filter(t => t.status === "Pending").length,
  };
  const FILTER_TABS = [
    { key: "all", label: "All", color: "bg-gray-800 text-white" },
    { key: "open", label: "Open", color: "bg-emerald-600 text-white" },
    { key: "awaiting", label: "Customer Replied", color: "bg-amber-500 text-white" },
    { key: "closed", label: "Closed", color: "bg-gray-400 text-white" },
    { key: "pending", label: "Pending", color: "bg-violet-600 text-white" },
  ];
  const filteredTickets = sortTickets(filter === "all" ? tickets
    : filter === "open" ? tickets.filter(t => t.status === "Open")
    : filter === "awaiting" ? tickets.filter(t => t.status === "Awaiting Reply" || t.status === "Answered")
    : filter === "closed" ? tickets.filter(t => t.status === "Closed")
    : tickets.filter(t => t.status === "Pending"));

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] bg-white dark:bg-[#1a1f2c] border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <Headphones size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Support Tickets</h1>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
                Tickets are sorted — customer replies appear first.
              </p>
            </div>
          </div>
          <button onClick={loadTickets} className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 transition" title="Refresh">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
              filter === tab.key
                ? `${tab.color} border-transparent shadow-md`
                : "bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border-gray-100 dark:border-slate-800 hover:border-gray-300"
            }`}
          >
            {tab.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${filter === tab.key ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-slate-800 text-gray-500"}`}>
              {counts[tab.key as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#1a1f2c] rounded-[20px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <DataTable
          data={filteredTickets}
          columns={columns}
          loading={loading}
          searchable
          searchPlaceholder="Search tickets..."
          pageSize={10}
          rowClassName={(t) => {
            const last = getLastThread(t);
            const isClientReply = last?.direction === "1";
            if (isClientReply) return "bg-amber-50/40 dark:bg-amber-900/10";
            return "";
          }}
        />
      </div>
    </div>
  );
}
