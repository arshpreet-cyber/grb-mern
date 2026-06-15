"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Send, ShieldCheck, User, AlertCircle, Loader2, Paperclip, X } from "lucide-react";

export type TicketMessage = {
  id: number;
  ticketId: string;
  agentId: string | null;
  content: string | null;
  media: string | null;
  direction: string;
  createdAt: string;
};

type Props = {
  ticketId: string;
  ticketSubject?: string;
  isAdmin?: boolean;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) +
    " (" + new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) + ")";
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export default function TicketChat({ ticketId, ticketSubject, isAdmin = false }: Props) {
  const { data: session } = useSession();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sessionUserId = session?.user?.id;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const loadMessages = async () => {
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/messages`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setError("Unable to load messages.");
    }
  };

  useEffect(() => {
    fetch(`/api/support/tickets/${ticketId}`).then(r => r.json()).then(setTicket).catch(() => {});
    loadMessages();
    // Light polling stands in for realtime, since the app is serverless (no socket server).
    const interval = setInterval(loadMessages, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files].slice(0, 5));
    e.target.value = "";
  };

  const removeAttachment = (idx: number) => setAttachments(prev => prev.filter((_, i) => i !== idx));

  const handleSend = async () => {
    if (!draft.trim() || !sessionUserId) return;
    setSending(true); setError(null);
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: draft.trim(),
          agentId: isAdmin ? sessionUserId : null,
          direction: isAdmin ? "2" : "1",
        }),
      });
      if (!res.ok) throw new Error("Failed to send your reply. Please try again.");
      setDraft(""); setAttachments([]); setReplyOpen(false);
      await loadMessages();
    } catch (err: any) {
      setError(err.message || "Failed to send.");
    } finally {
      setSending(false);
    }
  };

  const filteredMessages = messages.filter(m =>
    !(ticket?.query && m.content?.trim().toLowerCase() === ticket.query.trim().toLowerCase())
  );

  const customerName = ticket?.user?.name || ticket?.userName || "Customer";
  const status = ticket?.status ?? "Open";

  const statusStyle: Record<string, string> = {
    "Open": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Answered": "bg-blue-100 text-blue-800 border-blue-200",
    "Pending": "bg-amber-100 text-amber-800 border-amber-200",
    "Closed": "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start">

      {/* ── LEFT SIDEBAR ── */}
      <div className="w-full lg:w-65 shrink-0 space-y-4">

        {/* Ticket Info */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-[12px] font-bold uppercase tracking-widest text-gray-500">Ticket Information</h3>
          </div>
          <div className="divide-y divide-gray-100 text-[13px]">
            <InfoRow label="Requestor">
              <span className="font-medium text-gray-800">{customerName}</span>
              <span className="ml-1.5 text-[10px] font-bold bg-gray-800 text-white px-1.5 py-0.5 rounded uppercase">Owner</span>
            </InfoRow>
            <InfoRow label="Ticket #">
              <span className="font-mono text-amber-600 dark:text-[#fc0] font-semibold">#{ticket?.ticketNumber ?? ticketId}</span>
            </InfoRow>
            <InfoRow label="Submitted">
              <span className="text-gray-600">{ticket?.createdAt ? formatDate(ticket.createdAt) : "—"}</span>
            </InfoRow>
            <InfoRow label="Last Updated">
              <span className="text-gray-600">{ticket?.updatedAt ? timeAgo(ticket.updatedAt) : ticket?.createdAt ? timeAgo(ticket.createdAt) : "—"}</span>
            </InfoRow>
            <InfoRow label="Status">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold border uppercase tracking-wide ${statusStyle[status] ?? statusStyle["Pending"]}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                {status}
              </span>
            </InfoRow>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => setReplyOpen(o => !o)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#FFCE2E] hover:bg-[#EBB81E] text-black text-[13px] font-bold transition shadow-sm"
          >
            <Send size={13} /> Reply
          </button>
        </div>

      </div>

      {/* ── MAIN THREAD ── */}
      <div className="flex-1 min-w-0 space-y-3">

        {/* Ticket Title */}
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 shadow-sm">
          <h2 className="text-[16px] font-bold text-gray-900">
            {ticket?.subject ?? ticketSubject ?? "Support Ticket"}
          </h2>
          <p className="text-[12px] text-gray-400 mt-0.5 font-mono">#{ticket?.ticketNumber ?? ticketId}</p>
        </div>

        {/* Reply Box */}
        {replyOpen && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
              <span className="text-[13px] font-bold text-gray-700 flex items-center gap-2"><Send size={13} /> {isAdmin ? "Reply to Customer" : "Add Reply"}</span>
              <button onClick={() => setReplyOpen(false)} className="text-gray-400 hover:text-gray-600 transition"><X size={15} /></button>
            </div>

            {error && (
              <div className="mx-4 mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-600 border border-red-100">
                <AlertCircle size={13} /> {error}
              </div>
            )}

            <div className="p-4">
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Type your message here..."
                rows={5}
                className="w-full resize-none rounded-lg border border-gray-200 text-[13px] text-gray-800 placeholder:text-gray-400 px-3 py-2.5 outline-none focus:border-[#FFCE2E] focus:ring-2 focus:ring-[#FFCE2E]/20 transition"
              />

              {/* Attachment preview */}
              {attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2.5 py-1.5 text-[12px] text-gray-700">
                      <Paperclip size={11} className="text-gray-400" />
                      <span className="max-w-35 truncate">{file.name}</span>
                      <button onClick={() => removeAttachment(i)} className="text-gray-400 hover:text-red-500 transition ml-0.5"><X size={11} /></button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-3 gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50 transition"
                  >
                    <Paperclip size={13} /> Attach File
                  </button>
                  <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
                  <span className="text-[11px] text-gray-400 hidden sm:inline">Max 5 files</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400 hidden sm:inline">
                    <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">Ctrl+Enter</kbd> to send
                  </span>
                  <button
                    onClick={handleSend}
                    disabled={!draft.trim() || sending}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#FFCE2E] hover:bg-[#EBB81E] text-black text-[13px] font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {sending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                    {sending ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Original Query */}
        {ticket?.query && (
          <MessageCard
            name={customerName}
            role="Owner"
            isStaff={false}
            time={ticket.createdAt}
            content={ticket.query}
            media={ticket.media ?? null}
          />
        )}

        {/* Messages */}
        {filteredMessages.map((msg) => {
          const isAgent = String(msg.direction) === "2";
          return (
            <MessageCard
              key={msg.id}
              name={isAgent ? "Support Team" : customerName}
              role={isAgent ? "Operator" : "Owner"}
              isStaff={isAgent}
              time={msg.createdAt}
              content={msg.content ?? ""}
              media={msg.media}
            />
          );
        })}

        {!ticket?.query && filteredMessages.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            <ShieldCheck size={28} className="mx-auto mb-3 opacity-30" />
            <p className="text-[14px] font-semibold">No messages yet</p>
            <p className="text-[12px] mt-1">Click Reply to start the conversation.</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-2.5">
      <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function MessageCard({ name, role, isStaff, time, content, media }: {
  name: string; role: string; isStaff: boolean; time: string; content: string; media?: string | null;
}) {
  return (
    <div className={`bg-white rounded-xl border overflow-hidden shadow-sm ${isStaff ? "border-amber-200 border-l-4 border-l-[#fc0]" : "border-gray-200"}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isStaff ? "bg-[#fffdeb] text-amber-600" : "bg-gray-100 text-gray-500"}`}>
            {isStaff ? <ShieldCheck size={14} /> : <User size={14} />}
          </div>
          <div>
            <span className="text-[13px] font-bold text-gray-900">{name}</span>
            <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide border ${isStaff ? "bg-[#fffdeb] text-amber-700 border-[#ffe57f]" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
              {role}
            </span>
          </div>
        </div>
        <span className="text-[12px] text-gray-400">{formatDate(time)}</span>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <p className="text-[14px] text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>

        {/* Media attachments */}
        {media && (() => {
          let urls: string[] = [];
          try { urls = JSON.parse(media); } catch { urls = [media]; }
          return (
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-3">
              {urls.map((url, i) => {
                const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(url);
                return isImage ? (
                  <a key={i} href={url} target="_blank" rel="noreferrer">
                    <img src={url} alt={`attachment-${i+1}`} className="h-24 w-auto rounded-lg border border-gray-200 object-cover hover:opacity-90 transition" />
                  </a>
                ) : (
                  <a key={i} href={url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[12px] text-amber-600 hover:underline bg-[#fffdeb] border border-[#ffe57f] rounded-lg px-3 py-2">
                    <Paperclip size={12} /> {url.split("/").pop() ?? `File ${i + 1}`}
                  </a>
                );
              })}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
