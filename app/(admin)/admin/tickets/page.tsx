"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DataTable, { Column } from "@/components/ui/DataTable";
import { Eye, Headphones, RefreshCw, Trash2, DownloadCloud, Loader2 } from "lucide-react";

type Ticket = {
  id: number;
  ticketId: string;
  displayId?: number | null;
  ticketNumber?: string | null;
  subject?: string | null;
  status: string;
  readStatus?: number | null;
  repliedStatus?: number | null;
  assignedTo?: string | null;
  name?: string | null;
  user?: { name?: string | null; email?: string | null };
  createdAt: string;
  updatedAt?: string | null;
  threads?: { direction: string; createdAt: string; id: number }[];
};

type Staff = { id: number; name?: string | null; email: string };

const STATUS_OPTIONS = ["Open", "Pending", "Answered", "Hold", "Escalated", "Closed"];

function fmtDateTime(s: string | null | undefined) {
  if (!s) return "—";
  return new Date(s).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function getLastThread(t: Ticket) {
  if (!t.threads || t.threads.length === 0) return null;
  return t.threads[0];
}

function getLastActivityTs(t: Ticket): number {
  const last = getLastThread(t);
  return last ? new Date(last.createdAt).getTime() : new Date(t.createdAt).getTime();
}

// repliedStatus is the authoritative field: 2 = admin replied, 1/null = customer
// replied (awaiting admin). It mirrors the legacy PHP `replied_status` column.
function isCustomerReplied(t: Ticket): boolean {
  return t.repliedStatus !== 2;
}

function sortTickets(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort((a, b) => {
    const aCustomer = isCustomerReplied(a);
    const bCustomer = isCustomerReplied(b);

    // Customer-replied tickets need attention → come first
    if (aCustomer && !bCustomer) return -1;
    if (!aCustomer && bCustomer) return 1;

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
  const [dbCounts, setDbCounts] = useState({ all: 0, open: 0, awaiting: 0, closed: 0, pending: 0 });
  const [staff, setStaff] = useState<Staff[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  const syncFromZoho = async () => {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch("/api/support/zoho-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pull-tickets" }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setSyncMsg(data.error || "Sync failed.");
      } else {
        setSyncMsg(`Synced from Zoho — ${data.imported ?? 0} new, ${data.updated ?? 0} updated.`);
        loadTickets();
      }
    } catch {
      setSyncMsg("Sync failed. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetch("/api/admin/users?staff=1")
      .then((r) => r.json())
      .then((d) => setStaff(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  // Optimistically patch a ticket, then persist.
  const patchTicket = (ticketId: string, patch: Partial<Ticket>) => {
    setTickets((prev) => prev.map((t) => (t.ticketId === ticketId ? { ...t, ...patch } : t)));
    fetch(`/api/support/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).catch(() => loadTickets());
  };

  const deleteTicket = (t: Ticket) => {
    if (!window.confirm(`Delete ticket ${t.ticketNumber ?? `#${t.id}`} permanently? This cannot be undone.`)) return;
    setTickets((prev) => prev.filter((x) => x.ticketId !== t.ticketId));
    fetch(`/api/support/tickets/${t.ticketId}`, { method: "DELETE" }).catch(() => loadTickets());
  };

  const loadTickets = (currentFilter: string = filter) => {
    setLoading(true);
    fetch(`/api/support/tickets?filter=${encodeURIComponent(currentFilter)}`)
      .then(async (r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => {
        if (data && typeof data === "object" && !Array.isArray(data)) {
          setTickets(sortTickets(data.tickets ?? []));
          setDbCounts(data.counts ?? { all: 0, open: 0, awaiting: 0, closed: 0, pending: 0 });
        } else {
          setTickets(sortTickets(data ?? []));
        }
      })
      .catch(() => setError("Unable to load tickets."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadTickets(); }, []);

  const columns: Column<Ticket>[] = [
    {
      key: "ticketId",
      header: "Ticket ID",
      render: (t) => (
        <div className="flex items-center gap-2">
          {t.readStatus === 1 && (
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" title="Unread" />
          )}
          <span className="font-mono font-semibold text-[13px]">
            {t.ticketNumber ?? `#${t.id}`}
          </span>
        </div>
      ),
    },
    {
      key: "user",
      header: "Customer",
      render: (t) => (
        <div className="text-[13px]">
          <div className="font-semibold uppercase">{t.user?.name || t.name || "Anonymous"}</div>
          {t.user?.email && <div className="text-gray-400 text-[11px] normal-case">{t.user.email}</div>}
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      render: (t) => (
        <Link href={`/admin/tickets/${t.ticketId}`} className="text-[13px] font-medium text-blue-600 hover:underline">
          {t.subject ?? "Support ticket"}
        </Link>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (t) => (
        <select
          value={STATUS_OPTIONS.includes(t.status) ? t.status : "Open"}
          onChange={(e) => patchTicket(t.ticketId, { status: e.target.value })}
          className="rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-[12px] font-medium text-gray-700 dark:text-slate-200 outline-none focus:border-blue-400 cursor-pointer"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      ),
    },
    {
      key: "lastReply",
      header: "Replied Status",
      render: (t) => {
        const isCustomer = isCustomerReplied(t);
        return (
          <span className={`inline-flex items-center gap-2 text-[12px] font-semibold px-3 py-1.5 rounded-lg border ${
            isCustomer
              ? "bg-orange-100 text-orange-800 border-orange-300"
              : "bg-green-100 text-green-800 border-green-300"
          }`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${isCustomer ? "bg-orange-500" : "bg-green-500"}`} />
            {isCustomer ? "Customer Replied" : "Admin Replied"}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      header: "Created on",
      render: (t) => (
        <span className="text-[12px] text-gray-500 whitespace-nowrap">{fmtDateTime(t.createdAt)}</span>
      ),
    },
    {
      key: "updatedAt",
      header: "Last Update By User",
      render: (t) => {
        const last = getLastThread(t);
        const ts = last ? last.createdAt : (t.updatedAt ?? t.createdAt);
        return <span className="text-[12px] text-gray-500 whitespace-nowrap">{fmtDateTime(ts)}</span>;
      },
    },
    {
      key: "action",
      header: "Action",
      render: (t) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/tickets/${t.ticketId}`}
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-[11px] font-semibold text-white transition whitespace-nowrap"
          >
            <Eye size={13} /> View Ticket
          </Link>
          <button
            onClick={() => deleteTicket(t)}
            title="Delete ticket"
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-500 hover:bg-red-600 text-white transition"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
    {
      key: "assignedTo",
      header: "Assign To",
      render: (t) => (
        <select
          value={t.assignedTo ?? ""}
          onChange={(e) => patchTicket(t.ticketId, { assignedTo: e.target.value || null })}
          className="rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-[12px] font-medium text-gray-700 dark:text-slate-200 outline-none focus:border-blue-400 cursor-pointer max-w-[150px]"
        >
          <option value="">Unassigned</option>
          {staff.map((s) => (
            <option key={s.id} value={String(s.id)}>{s.name || s.email}</option>
          ))}
        </select>
      ),
    },
  ];

  const counts = dbCounts;
  const FILTER_TABS = [
    { key: "all", label: "All", color: "bg-gray-800 text-white" },
    { key: "open", label: "Open", color: "bg-emerald-600 text-white" },
    { key: "awaiting", label: "Customer Replied", color: "bg-amber-500 text-white" },
    { key: "closed", label: "Closed", color: "bg-gray-400 text-white" },
    { key: "pending", label: "Pending", color: "bg-[#fc0] text-slate-900" },
  ];
  // Tickets are already filtered server-side by the selected tab and sorted on load.
  const filteredTickets = tickets;

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] bg-white dark:bg-[#1a1f2c] border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-yellow-950/40 flex items-center justify-center text-[#D8A720] dark:text-yellow-400">
              <Headphones size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Support Tickets</h1>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
                Tickets are sorted — customer replies appear first.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {syncMsg && <span className="text-xs text-gray-500 dark:text-slate-400 max-w-[240px] truncate">{syncMsg}</span>}
            <button
              onClick={syncFromZoho}
              disabled={syncing}
              className="inline-flex items-center gap-2 rounded-lg bg-[#FFCE2E] hover:bg-[#EBB81E] px-3 py-2 text-[13px] font-bold text-black transition disabled:opacity-60"
              title="Pull tickets from Zoho Desk"
            >
              {syncing ? <Loader2 size={15} className="animate-spin" /> : <DownloadCloud size={15} />}
              {syncing ? "Syncing…" : "Sync from Zoho"}
            </button>
            <button onClick={() => loadTickets()} className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 transition" title="Refresh">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              setFilter(tab.key);
              loadTickets(tab.key);
            }}
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
          searchFields={["ticketNumber", "subject", "name", "ticketId"]}
          searchPlaceholder="Search tickets..."
          pageSize={10}
          rowClassName={(t) => (isCustomerReplied(t) ? "bg-amber-50/40 dark:bg-amber-900/10" : "")}
        />
      </div>
    </div>
  );
}
