"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Send, RefreshCw, ShieldCheck, User, AlertCircle, Loader2, Tag, Clock, CheckCircle2, XCircle } from "lucide-react";

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

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    " at " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function groupByDate(messages: TicketMessage[]) {
  const groups: { date: string; messages: TicketMessage[] }[] = [];
  let currentDate = "";
  for (const msg of messages) {
    const date = formatDate(msg.createdAt);
    if (date !== currentDate) {
      currentDate = date;
      groups.push({ date, messages: [msg] });
    } else {
      groups[groups.length - 1].messages.push(msg);
    }
  }
  return groups;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; icon: React.ReactNode }> = {
    "Open":    { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <CheckCircle2 size={12} /> },
    "Closed":  { color: "bg-gray-100 text-gray-500 border-gray-200", icon: <XCircle size={12} /> },
    "Pending": { color: "bg-amber-100 text-amber-700 border-amber-200", icon: <Clock size={12} /> },
  };
  const s = map[status] ?? map["Pending"];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${s.color}`}>
      {s.icon}{status}
    </span>
  );
}

export default function TicketChat({ ticketId, ticketSubject, isAdmin = false }: Props) {
  const { data: session } = useSession();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionUserId = session?.user?.id;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [draft]);

  const connectSocket = () => {
    if (typeof window === "undefined") return;
    if (socketRef.current) socketRef.current.disconnect();
    const socket = io({ transports: ["websocket", "polling"], reconnectionAttempts: 5 });
    socketRef.current = socket;
    socket.on("connect", () => { setConnected(true); setError(null); socket.emit("join-ticket", ticketId); });
    socket.on("connect_error", () => { setConnected(false); setError("Unable to connect to support server. Retrying..."); });
    socket.on("ticket-history", (h: TicketMessage[]) => setMessages(h));
    socket.on("ticket-message", (m: TicketMessage) => setMessages(prev => prev.some(p => p.id === m.id) ? prev : [...prev, m]));
    socket.on("ticket-error", ({ message }: { message: string }) => setError(message));
    return socket;
  };

  useEffect(() => {
    const socket = connectSocket();
    fetch(`/api/support/tickets/${ticketId}`).then(r => r.json()).then(setTicket).catch(() => {});
    return () => { socket?.disconnect(); socketRef.current = null; };
  }, [ticketId]);

  const handleSend = async () => {
    if (!draft.trim() || !sessionUserId) return;
    setSending(true);
    setError(null);
    try {
      if (!socketRef.current?.connected) throw new Error("Not connected. Please reconnect.");
      socketRef.current.emit("send-ticket-message", {
        ticketId,
        content: draft.trim(),
        agentId: sessionUserId,
        direction: isAdmin ? "2" : "1",
      });
      setDraft("");
    } catch (err: any) {
      setError(err.message || "Failed to send.");
    } finally {
      setSending(false);
    }
  };

  const filteredMessages = messages.filter(m =>
    !(ticket?.query && m.content?.trim().toLowerCase() === ticket.query.trim().toLowerCase())
  );

  const grouped = groupByDate(filteredMessages);
  const customerName = ticket?.user?.name || ticket?.userName || "Customer";

  return (
    <div className="space-y-4">
      {/* Ticket Header Card */}
      <div className="bg-white dark:bg-[#1a1f2c] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 shrink-0">
              <Tag size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold font-mono text-gray-400 dark:text-slate-500">#{ticketId}</span>
                {ticket?.status && <StatusBadge status={ticket.status} />}
                {!connected && (
                  <button
                    onClick={connectSocket}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors"
                  >
                    <RefreshCw size={10} className="animate-spin" /> Reconnect
                  </button>
                )}
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mt-1">
                {ticket?.subject ?? ticketSubject ?? "Support Ticket"}
              </h2>
              {ticket?.createdAt && (
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <Clock size={11} /> Opened {formatDateTime(ticket.createdAt)}
                </p>
              )}
            </div>
          </div>
          {ticket?.user && (
            <div className="text-right text-xs text-gray-500 dark:text-slate-400">
              <div className="font-semibold text-gray-700 dark:text-slate-300">{customerName}</div>
              <div>{ticket.user.email}</div>
            </div>
          )}
        </div>
      </div>

      {/* Thread */}
      <div className="bg-white dark:bg-[#1a1f2c] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 dark:border-slate-800 px-5 py-3 bg-gray-50 dark:bg-slate-900/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Conversation Thread</h3>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-slate-800/60 max-h-130 overflow-y-auto">
          {/* Original query */}
          {ticket?.query && (
            <div className="px-5 py-5">
              <div className="flex items-start gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                  <User size={14} className="text-gray-500 dark:text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">{customerName}</span>
                    <span className="text-[10px] font-bold bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 px-2 py-0.5 rounded uppercase tracking-wide">Customer</span>
                    <span className="text-xs text-gray-400">{formatDateTime(ticket.createdAt)}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {ticket.query}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Message groups */}
          {grouped.map(({ date, messages: dayMessages }) => (
            <div key={date}>
              {/* Date separator */}
              <div className="flex items-center gap-3 px-5 py-2 bg-gray-50/50 dark:bg-slate-900/30">
                <div className="flex-1 h-px bg-gray-100 dark:bg-slate-800" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 shrink-0">{date}</span>
                <div className="flex-1 h-px bg-gray-100 dark:bg-slate-800" />
              </div>

              {dayMessages.map((msg) => {
                const isAgent = String(msg.direction) === "2";
                return (
                  <div key={msg.id} className={`px-5 py-4 ${isAgent ? "bg-violet-50/30 dark:bg-violet-900/5" : ""}`}>
                    <div className="flex items-start gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                        isAgent
                          ? "bg-violet-100 dark:bg-violet-900/40 text-violet-600"
                          : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400"
                      }`}>
                        {isAgent ? <ShieldCheck size={14} /> : <User size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-bold text-sm text-gray-900 dark:text-white">
                            {isAgent ? "Support Agent" : customerName}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                            isAgent
                              ? "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400"
                              : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400"
                          }`}>
                            {isAgent ? "Staff" : "Customer"}
                          </span>
                          <span className="text-xs text-gray-400">{formatDateTime(msg.createdAt)}</span>
                        </div>
                        <div className={`rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                          isAgent
                            ? "bg-white dark:bg-[#1c1f2e] text-gray-700 dark:text-slate-300 border border-violet-100 dark:border-violet-900/30"
                            : "bg-gray-50 dark:bg-slate-800/50 text-gray-700 dark:text-slate-300"
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Empty state */}
          {!ticket?.query && filteredMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                <Tag size={20} className="text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-400">No messages yet</p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Reply Box */}
        <div className="border-t border-gray-100 dark:border-slate-800 p-5 bg-gray-50/50 dark:bg-slate-900/30">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-3">
            {isAdmin ? "Reply to Customer" : "Add Reply"}
          </h4>

          {error && (
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 px-4 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40">
              <AlertCircle size={13} className="shrink-0" />
              {error}
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) { e.preventDefault(); handleSend(); } }}
            placeholder={isAdmin ? "Type your response to the customer..." : "Type your reply..."}
            rows={4}
            className="w-full resize-none rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#1c1f2e] text-sm text-gray-900 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-600 px-4 py-3 outline-none focus:border-violet-400 dark:focus:border-violet-500 transition-colors min-h-25 max-h-50"
          />

          <div className="flex items-center justify-between mt-3">
            <p className="text-[11px] text-gray-400 dark:text-slate-600">
              Press <kbd className="rounded bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">Ctrl+Enter</kbd> to send
            </p>
            <button
              onClick={handleSend}
              disabled={!draft.trim() || !connected || sending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              {sending ? "Sending..." : "Send Reply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
