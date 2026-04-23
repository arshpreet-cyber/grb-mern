"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

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

const POLL_INTERVAL = 2000; // Poll every 2 seconds for new messages

export default function TicketChat({ ticketId, ticketSubject, isAdmin = false }: Props) {
  const { data: session } = useSession();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sessionUserId = session?.user?.id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, ticket]);

  // ── Fetch ticket details ──────────────────────────────────────
  useEffect(() => {
    if (!ticketId) return;
    fetch(`/api/support/tickets/${ticketId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setTicket(data);
      })
      .catch((err) => console.error("Failed to load ticket details", err));
  }, [ticketId]);

  // ── Fetch messages via HTTP ───────────────────────────────────
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/messages`);
      if (!res.ok) throw new Error("Failed to load messages");
      const data: TicketMessage[] = await res.json();
      setMessages((prev) => {
        // Only update if there are new messages (avoids unnecessary re-renders)
        if (data.length !== prev.length || (data.length > 0 && data[data.length - 1].id !== prev[prev.length - 1]?.id)) {
          return data;
        }
        return prev;
      });
      setConnected(true);
      setError(null);
    } catch (err) {
      console.error("Polling error:", err);
      setConnected(false);
    }
  }, [ticketId]);

  // ── Initial fetch + start polling ─────────────────────────────
  useEffect(() => {
    // Fetch immediately on mount
    fetchMessages();

    // Start polling interval
    pollingRef.current = setInterval(fetchMessages, POLL_INTERVAL);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [fetchMessages]);

  // ── Send message via HTTP POST ────────────────────────────────
  const handleSend = async () => {
    if (!draft.trim() || !sessionUserId) return;
    setSending(true);
    setError(null);

    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: draft.trim(),
          agentId: sessionUserId,
          direction: isAdmin ? "2" : "1",
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to send message");
      }

      const newMessage: TicketMessage = await res.json();
      // Optimistically add the message to the list
      setMessages((prev) => [...prev, newMessage]);
      setDraft("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[75vh] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      {/* Header */}
      <div className="border-b border-slate-100 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{ticketSubject || ticket?.subject || "Support Chat"}</h2>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
                <p className="text-xs font-medium text-slate-500">
                  {connected ? "Live" : "Connecting..."} • {isAdmin ? "Admin View" : "User Support"}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={fetchMessages}
            className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-6 overflow-y-auto bg-slate-50 p-6">
        {/* Initial Ticket Query */}
        {ticket && ticket.query && (
          <div className="flex justify-start">
            <div className="max-w-[85%] space-y-1">
              <div className="rounded-2xl rounded-tl-none bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm leading-relaxed text-slate-800">{ticket.query}</p>
              </div>
              <p className="pl-1 text-[10px] font-medium text-slate-400">
                {new Date(ticket.createdAt).toLocaleString()} • Original Request
              </p>
            </div>
          </div>
        )}

        {messages.length === 0 && !ticket?.query && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-500">No messages yet</p>
            <p className="text-xs text-slate-400">Start the conversation below.</p>
          </div>
        )}

        {messages.map((message) => {
          const fromAdmin = message.direction === "2";
          const isOwnMessage = isAdmin ? fromAdmin : !fromAdmin;

          return (
            <div key={message.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] space-y-1`}>
                <div
                  className={`rounded-2xl p-4 shadow-sm ${isOwnMessage
                    ? "rounded-tr-none bg-violet-600 text-white"
                    : "rounded-tl-none bg-white text-slate-800 ring-1 ring-slate-200"
                    }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                </div>
                <p className={`px-1 text-[10px] font-medium text-slate-400 ${isOwnMessage ? "text-right" : "text-left"}`}>
                  {new Date(message.createdAt).toLocaleString()} {fromAdmin && !isAdmin && "• Agent Support"}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 bg-white p-6">
        {error && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        )}
        <div className="relative">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message here..."
            className="w-full resize-none rounded-2xl border-0 bg-slate-50 py-4 pl-4 pr-16 text-sm text-slate-900 outline-none ring-1 ring-inset ring-slate-200 transition focus:ring-2 focus:ring-violet-600"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={!draft.trim() || sending}
            className="absolute bottom-[1.5rem] right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg transition hover:bg-violet-700 disabled:opacity-50 disabled:shadow-none"
          >
            {sending ? (
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            )}
          </button>
        </div>
        <p className="mt-3 text-center text-[10px] text-slate-400">
          Press Enter to send, Shift + Enter for new line.
        </p>
      </div>
    </div>
  );
}
