"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Send, RefreshCw, ShieldCheck, User, AlertCircle, Loader2, Clock, CheckCircle2, XCircle, Paperclip, ChevronDown } from "lucide-react";

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
    " · " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
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

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; dot: string; text: string }> = {
    "Open":    { bg: "bg-emerald-50 border-emerald-200 text-emerald-700", dot: "bg-emerald-500", text: "Open" },
    "Closed":  { bg: "bg-gray-100 border-gray-200 text-gray-500", dot: "bg-gray-400", text: "Closed" },
    "Pending": { bg: "bg-amber-50 border-amber-200 text-amber-700", dot: "bg-amber-500", text: "Pending" },
  };
  const s = map[status] ?? map["Pending"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold border ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.text}
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
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
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
    <div className="min-h-screen bg-[#f5f6fa]">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-[#FFCE2E] flex items-center justify-center">
              <ShieldCheck size={18} className="text-black" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] font-mono text-gray-400">#{ticketId}</span>
                {ticket?.status && <StatusBadge status={ticket.status} />}
                {!connected && (
                  <button onClick={connectSocket} className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200 hover:bg-red-100 transition">
                    <RefreshCw size={10} className="animate-spin" /> Reconnect
                  </button>
                )}
              </div>
              <h1 className="text-[15px] font-bold text-gray-900 truncate mt-0.5">
                {ticket?.subject ?? ticketSubject ?? "Support Ticket"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-gray-500">
            {ticket?.createdAt && (
              <span className="flex items-center gap-1.5">
                <Clock size={13} /> Opened {formatDateTime(ticket.createdAt)}
              </span>
            )}
            {ticket?.user && (
              <div className="text-right hidden sm:block">
                <div className="font-semibold text-gray-700 text-[13px]">{customerName}</div>
                <div className="text-gray-400">{ticket.user.email}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thread */}
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-0">

        {/* Original Query */}
        {ticket?.query && (
          <TicketPost
            name={customerName}
            role="Customer"
            isStaff={false}
            time={ticket.createdAt}
            content={ticket.query}
            isFirst
          />
        )}

        {grouped.map(({ date, messages: dayMessages }) => (
          <div key={date}>
            {/* Date divider */}
            <div className="flex items-center gap-3 py-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 bg-[#f5f6fa] px-3">{date}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {dayMessages.map((msg) => {
              const isAgent = String(msg.direction) === "2";
              return (
                <TicketPost
                  key={msg.id}
                  name={isAgent ? "Support Team" : customerName}
                  role={isAgent ? "Staff" : "Customer"}
                  isStaff={isAgent}
                  time={msg.createdAt}
                  content={msg.content ?? ""}
                />
              );
            })}
          </div>
        ))}

        {!ticket?.query && filteredMessages.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400">
            <ShieldCheck size={32} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No messages yet</p>
          </div>
        )}

        <div ref={bottomRef} />

        {/* Reply Box */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
            <div className="w-7 h-7 rounded-full bg-[#FFCE2E] flex items-center justify-center text-[11px] font-bold text-black shrink-0">
              {getInitials(session?.user?.name || "You")}
            </div>
            <span className="text-[13px] font-semibold text-gray-700">
              {isAdmin ? "Reply as Support Team" : `Replying as ${session?.user?.name || "You"}`}
            </span>
          </div>

          {error && (
            <div className="mx-5 mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-600 border border-red-100">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="p-5">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) { e.preventDefault(); handleSend(); } }}
              placeholder={isAdmin ? "Write your response to the customer..." : "Write your reply here..."}
              rows={5}
              className="w-full resize-none rounded-lg border border-gray-200 bg-white text-[14px] text-gray-800 placeholder:text-gray-400 px-4 py-3 outline-none focus:border-[#FFCE2E] focus:ring-2 focus:ring-[#FFCE2E]/20 transition min-h-30 max-h-60"
            />
          </div>

          <div className="flex items-center justify-between px-5 pb-5 gap-3">
            <p className="text-[11px] text-gray-400 hidden sm:block">
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">Ctrl+Enter</kbd> to send quickly
            </p>
            <button
              onClick={handleSend}
              disabled={!draft.trim() || !connected || sending}
              className="ml-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#FFCE2E] hover:bg-[#EBB81E] text-black text-[14px] font-bold transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
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

function TicketPost({ name, role, isStaff, time, content, isFirst }: {
  name: string;
  role: string;
  isStaff: boolean;
  time: string;
  content: string;
  isFirst?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const initials = name.split(" ").map(c => c[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className={`bg-white rounded-xl border ${isStaff ? "border-l-4 border-l-[#FFCE2E] border-gray-200" : "border-gray-200"} mb-3 overflow-hidden shadow-sm`}>
      {/* Post Header */}
      <div
        className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100 cursor-pointer select-none"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${isStaff ? "bg-[#FFCE2E] text-black" : "bg-gray-200 text-gray-600"}`}>
            {isStaff ? <ShieldCheck size={14} /> : initials}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[13px] font-bold text-gray-900">{name}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${isStaff ? "bg-[#FFCE2E]/20 text-yellow-700 border border-[#FFCE2E]/40" : "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                {role}
              </span>
              {isFirst && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wide">Original Post</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-400">
          <span className="text-[12px]">{formatDateTime(time)}</span>
          <ChevronDown size={15} className={`transition-transform ${collapsed ? "-rotate-90" : ""}`} />
        </div>
      </div>

      {/* Post Body */}
      {!collapsed && (
        <div className="px-5 py-4">
          <p className="text-[14px] text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
      )}
    </div>
  );
}
