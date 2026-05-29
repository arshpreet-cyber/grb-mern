"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TicketChat from "@/components/dashboard/TicketChat";

type Ticket = {
  ticketId: string;
  ticketNumber?: string | null;
  subject?: string | null;
  status: string;
};

export default function DashboardTicketThreadPage() {
  const params = useParams();
  const rawTicketId = params?.ticketId;
  const ticketId = Array.isArray(rawTicketId) ? rawTicketId[0] : rawTicketId ?? "";
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticketId) return;

    fetch(`/api/support/tickets/${ticketId}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Ticket not found");
        return response.json();
      })
      .then((data) => setTicket(data))
      .catch(() => {
        setError("Unable to load ticket details.");
      })
      .finally(() => setLoading(false));
  }, [ticketId]);

  if (!ticketId) {
    return <div className="p-6 text-slate-700">Missing ticket identifier.</div>;
  }

  if (loading) {
    return <div className="p-6 text-slate-700">Loading ticket...</div>;
  }

  if (error) {
    return <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <TicketChat ticketId={ticketId} ticketSubject={ticket?.subject ?? ticket?.ticketNumber ?? ticketId} />
    </div>
  );
}
