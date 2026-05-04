"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Send, Wifi, WifiOff, RefreshCw, Headset, ShieldCheck, User, AlertCircle, Loader2 } from "lucide-react";

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

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
}

/** Customer avatar = gray, Agent avatar = yellow */
function Avatar({ isAgent }: { isAgent: boolean }) {
  return (
    <div
      className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center font-bold shadow-sm ${
        isAgent
          ? "text-[#111]"
          : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300"
      }`}
      style={isAgent ? { background: "#ffcc00" } : {}}
    >
      {isAgent ? <ShieldCheck size={16} /> : <User size={16} />}
    </div>
  );
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

export default function TicketChat({ ticketId, ticketSubject, isAdmin = false }: Props) {
  const { data: session } = useSession();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionUserId = session?.user?.id;

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages, ticket]);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [draft]);

  const connectSocket = () => {
    if (typeof window === "undefined") return;
    if (socketRef.current) socketRef.current.disconnect();
    const socket = io({ transports: ["websocket", "polling"], reconnectionAttempts: 5 });
    socketRef.current = socket;
    socket.on("connect", () => { setConnected(true); setError(null); socket.emit("join-ticket", ticketId); });
    socket.on("connect_error", () => { setConnected(false); setError("Unable to connect. Retrying..."); });
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
    setSending(true); setError(null);
    try {
      if (!socketRef.current?.connected) throw new Error("Disconnected. Please refresh.");
      socketRef.current.emit("send-ticket-message", { ticketId, content: draft.trim(), agentId: sessionUserId, direction: isAdmin ? "2" : "1" });
      setDraft("");
    } catch (err: any) {
      setError(err.message || "Failed to send.");
    } finally { setSending(false); }
  };

  // Filter duplicate of original query
  const filteredMessages = messages.filter(m =>
    !(ticket?.query && m.content?.trim().toLowerCase() === ticket.query.trim().toLowerCase())
  );

  const grouped = groupByDate(filteredMessages);
  const customerName = ticket?.user?.name || ticket?.userName || "Customer";

  return (
    <div className="flex h-[80vh] flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1117] shadow-2xl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#13161f] px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-[#111] shadow-lg"
              style={{ background: "#ffcc00", boxShadow: "0 8px 24px rgba(255,204,0,0.35)" }}
            >
              <Headset size={22} />
            </div>
            {connected && (
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-[#13161f]" />
              </span>
            )}
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight">
              {customerName}
            </h2>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-semibold">
              {connected ? (
                <><Wifi size={11} className="text-emerald-500" /><span className="text-emerald-500">Live</span></>
              ) : (
                <><WifiOff size={11} className="text-rose-500" /><span className="text-rose-500">Disconnected</span></>
              )}
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-slate-400 dark:text-slate-500">{isAdmin ? "Admin View" : "User Support"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Full ticket ID */}
          <span
            className="inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black tracking-wider border font-mono"
            style={{ background: "rgba(255,204,0,0.12)", color: "#b38a00", borderColor: "rgba(255,204,0,0.3)" }}
          >
            #{ticketId}
          </span>
          {!connected && (
            <button
              onClick={connectSocket}
              className="flex items-center gap-1.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 px-3 py-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all border border-rose-100 dark:border-rose-900/40"
            >
              <RefreshCw size={11} className="animate-spin" />
              Reconnect
            </button>
          )}
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto bg-slate-50/60 dark:bg-[#0f1117] px-4 py-6 space-y-3 scroll-smooth">

        {/* Original ticket query — Customer → LEFT */}
        {ticket?.query && (
          <div className="flex items-end gap-2.5 mb-4">
            {/* Avatar on LEFT */}
            <Avatar isAgent={false} />
            <div className="max-w-[70%] flex flex-col items-start">
              <span className="mb-1 px-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#b38a00" }}>
                {customerName}
              </span>
              <div
                className="rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed text-[#111] font-medium"
                style={{ background: "#ffcc00", boxShadow: "0 4px 16px rgba(255,204,0,0.25)" }}
              >
                {ticket.query}
              </div>
              <p className="mt-1 px-1 text-[10px] font-medium text-slate-400 dark:text-slate-600 flex items-center gap-1">
                {formatTime(ticket.createdAt)}
                <span className="opacity-50">·</span>
                <span className="font-semibold" style={{ color: "#b38a00" }}>Original Request</span>
              </p>
            </div>
          </div>
        )}

        {/* Grouped messages */}
        {grouped.map(({ date, messages: dayMessages }) => (
          <div key={date} className="space-y-1.5">
            {/* Date divider */}
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">{date}</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            </div>

            {dayMessages.map((message, idx) => {
              // direction "2" = Agent/Admin, direction "1" = Customer
              const isAgent = String(message.direction) === "2";

              const isSameDir = (m: TicketMessage) => String(m.direction) === String(message.direction);
              const isFirst = idx === 0 || !isSameDir(dayMessages[idx - 1]);
              const isLast  = idx === dayMessages.length - 1 || !isSameDir(dayMessages[idx + 1]);

              // Bubble corner rounding
              const corners = (() => {
                if (isFirst && isLast) return "rounded-2xl";
                if (!isAgent) {
                  // Customer LEFT: flat corners on left side
                  if (isFirst) return "rounded-2xl rounded-bl-sm";
                  if (isLast)  return "rounded-2xl rounded-tl-sm rounded-bl-sm";
                  return "rounded-r-2xl rounded-l-sm";
                } else {
                  // Agent RIGHT: flat corners on right side
                  if (isFirst) return "rounded-2xl rounded-br-sm";
                  if (isLast)  return "rounded-2xl rounded-tr-sm rounded-br-sm";
                  return "rounded-l-2xl rounded-r-sm";
                }
              })();

              if (!isAgent) {
                // ── CUSTOMER message: Avatar LEFT, Bubble RIGHT-of-avatar, row left-aligned ──
                return (
                  <div key={message.id} className="flex items-end gap-2.5">
                    {/* Avatar slot: always reserve space, only render on last */}
                    <div className="w-9 shrink-0 flex justify-center">
                      {isLast && <Avatar isAgent={false} />}
                    </div>
                    <div className="max-w-[68%] flex flex-col items-start">
                      {isFirst && (
                        <span className="mb-1 px-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#b38a00" }}>
                          {customerName}
                        </span>
                      )}
                      <div
                        className={`${corners} px-4 py-2.5 text-sm leading-relaxed font-medium text-[#111]`}
                        style={{ background: "#ffcc00", boxShadow: "0 3px 12px rgba(255,204,0,0.2)" }}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {isLast && (
                        <p className="mt-1 px-1 text-[10px] font-medium text-slate-400 dark:text-slate-600">
                          {formatTime(message.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              } else {
                // ── AGENT message: Bubble LEFT-of-avatar, Avatar RIGHT, row right-aligned ──
                return (
                  <div key={message.id} className="flex items-end gap-2.5 justify-end">
                    <div className="max-w-[68%] flex flex-col items-end">
                      {isFirst && (
                        <span className="mb-1 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {isAdmin ? "You (Agent)" : "Support Agent"}
                        </span>
                      )}
                      <div
                        className={`${corners} px-4 py-2.5 text-sm leading-relaxed bg-white dark:bg-[#1c1f2e] text-slate-800 dark:text-slate-200 ring-1 ring-slate-200 dark:ring-slate-700/50 shadow-sm`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {isLast && (
                        <p className="mt-1 px-1 text-[10px] font-medium text-slate-400 dark:text-slate-600">
                          {formatTime(message.createdAt)}
                          {!isAdmin && <span className="ml-1 font-semibold" style={{ color: "#b38a00" }}>· Agent</span>}
                        </p>
                      )}
                    </div>
                    {/* Avatar slot: always reserve space, only render on last */}
                    <div className="w-9 shrink-0 flex justify-center">
                      {isLast && <Avatar isAgent={true} />}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        ))}

        {/* Empty state */}
        {!ticket && filteredMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 pt-20">
            <div className="h-16 w-16 rounded-3xl flex items-center justify-center" style={{ background: "rgba(255,204,0,0.12)" }}>
              <Headset size={28} style={{ color: "#ffcc00" }} />
            </div>
            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">No messages yet</p>
            <p className="text-xs text-slate-300 dark:text-slate-600">Start the conversation below</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#13161f] px-5 pt-4 pb-5">
        {error && (
          <div className="mb-3 flex items-center gap-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 px-4 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 ring-1 ring-rose-100 dark:ring-rose-900/40">
            <AlertCircle size={14} className="shrink-0" />
            {error}
          </div>
        )}

        <div className="flex items-end gap-3">
          <div
            className="relative flex-1 rounded-2xl bg-slate-50 dark:bg-[#1c1f2e] ring-1 ring-slate-200 dark:ring-slate-700/50 overflow-hidden transition-all duration-200"
            onFocusCapture={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 2px #ffcc00"; }}
            onBlurCapture={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
          >
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Type a message..."
              rows={1}
              className="w-full resize-none bg-transparent py-3.5 pl-4 pr-4 text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none min-h-[48px] max-h-[120px]"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!draft.trim() || !connected || sending}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[#111] font-black shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:shadow-none disabled:scale-100"
            style={{ background: "#ffcc00", boxShadow: draft.trim() ? "0 8px 20px rgba(255,204,0,0.4)" : "none" }}
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={17} />}
          </button>
        </div>

        <p className="mt-2.5 text-center text-[10px] font-medium text-slate-300 dark:text-slate-700">
          Press <kbd className="rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 font-mono text-[9px] text-slate-500 dark:text-slate-400">Enter</kbd> to send &nbsp;·&nbsp; <kbd className="rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 font-mono text-[9px] text-slate-500 dark:text-slate-400">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
