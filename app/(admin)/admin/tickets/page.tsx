"use client";

import { useEffect, useState } from "react";
import DataTable, { Column, StatusPill } from "@/components/ui/DataTable";
import { MessageSquare, Headphones } from "lucide-react";

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

  const columns: Column<Ticket>[] = [
    {
      key: "ticketId",
      header: "Ticket",
      render: (t) => (
        <span className="font-mono font-semibold text-gray-800 dark:text-white text-[13px]">
          {t.ticketNumber ?? t.ticketId}
        </span>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      render: (t) => (
        <span className="text-gray-700 dark:text-white text-[13px]">
          {t.subject ?? "Support ticket"}
        </span>
      ),
    },
    {
      key: "user",
      header: "User",
      render: (t) => (
        <span className="text-gray-600 dark:text-white text-[13px]">
          {t.user?.name || t.user?.email || "Anonymous"}
        </span>
      ),
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
          }}
        />
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (t) => (
        <span className="text-gray-500 dark:text-white text-[12px]">
          {new Date(t.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: "Open Chat",
      icon: <MessageSquare size={14} />,
      onClick: (t: Ticket) => {
        window.location.href = `/admin/tickets/${t.ticketId}`;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] bg-white dark:bg-[#1a1f2c] border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <Headphones size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Tickets</h1>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-white">Review and respond to active support tickets from users.</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1f2c] rounded-[20px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <DataTable
          data={tickets}
          columns={columns}
          loading={loading}
          actions={actions}
          searchable
          searchPlaceholder="Search tickets..."
          pageSize={10}
        />
      </div>
    </div>
  );
}
