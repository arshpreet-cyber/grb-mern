"use client";

import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

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

  const isClient = typeof window !== "undefined";
  const sessionUserId = session?.user?.id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, ticket]);

  const connectSocket = () => {
    if (!isClient) return;
    
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io(window.location.origin, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });
    
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      setError(null);
      socket.emit("join-ticket", ticketId);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect error", err);
      setConnected(false);
      setError("Unable to connect to chat server. Trying to reconnect...");
    });

    socket.on("ticket-history", (history: TicketMessage[]) => {
      setMessages(history);
    });

    socket.on("ticket-message", (message: TicketMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("ticket-error", ({ message }: { message: string }) => {
      setError(message);
    });

    return socket;
  };

  useEffect(() => {
    const socket = connectSocket();

    // Fetch ticket details to get the initial query
    fetch(`/api/support/tickets/${ticketId}`)
      .then(res => res.json())
      .then(data => setTicket(data))
      .catch(err => console.error("Failed to load ticket details", err));

    return () => {
      socket?.disconnect();
      socketRef.current = null;
    };
  }, [ticketId]);

  const handleSend = async () => {
    if (!draft.trim() || !sessionUserId) return;
    setSending(true);
    setError(null);

    try {
      if (!socketRef.current?.connected) {
        throw new Error("Chat is disconnected. Please wait or refresh.");
      }

      socketRef.current.emit("send-ticket-message", {
        ticketId,
        content: draft.trim(),
        agentId: sessionUserId,
        direction: isAdmin ? "2" : "1",
      });
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
                <span className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                <p className="text-xs font-medium text-slate-500">
                  {connected ? "Live Connection" : "Disconnected"} • {isAdmin ? "Admin View" : "User Support"}
                </p>
              </div>
            </div>
          </div>
          {!connected && (
            <button 
              onClick={connectSocket}
              className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              Retry Connection
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-6 overflow-y-auto bg-slate-50 p-6">
        {/* Initial Ticket Query */}
        {ticket && (
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

        {messages.map((message) => {
          const fromAdmin = message.direction === "2";
          const isOwnMessage = isAdmin ? fromAdmin : !fromAdmin;

          return (
            <div key={message.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] space-y-1`}>
                <div 
                  className={`rounded-2xl p-4 shadow-sm ${
                    isOwnMessage 
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
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
            disabled={!draft.trim() || !connected || sending}
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg transition hover:bg-violet-700 disabled:opacity-50 disabled:shadow-none"
          >
            {sending ? (
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 rotate-90">
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
