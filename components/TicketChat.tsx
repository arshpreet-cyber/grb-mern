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
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const isClient = typeof window !== "undefined";
  const sessionUserId = session?.user?.id;

  useEffect(() => {
    if (!isClient) return;
    const socket = io(window.location.origin, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect_error", (err) => {
      console.error("Socket connect error", err);
      setError("Unable to connect to chat server.");
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

    socket.emit("join-ticket", ticketId);

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [ticketId, isClient]);

  const handleSend = async () => {
    if (!draft.trim() || !sessionUserId) return;
    setSending(true);
    setError(null);

    try {
      socketRef.current?.emit("send-ticket-message", {
        ticketId,
        content: draft.trim(),
        agentId: sessionUserId,
        direction: isAdmin ? "2" : "1",
      });
      setDraft("");
    } catch (err) {
      console.error(err);
      setError("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Ticket</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">{ticketSubject ?? `Ticket ${ticketId}`}</h1>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
            {isAdmin ? "Admin Chat" : "Your Support Chat"}
          </span>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="max-h-[60vh] space-y-4 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <p className="text-sm text-slate-500">No messages yet. Start the conversation.</p>
          ) : (
            messages.map((message) => {
              const fromAdmin = message.direction === "2";
              return (
                <div
                  key={message.id}
                  className={`flex flex-col gap-2 rounded-3xl p-4 shadow-sm ${
                    fromAdmin ? "self-end bg-violet-600 text-white" : "self-start bg-slate-100 text-slate-900"
                  } max-w-[90%]`}
                >
                  <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
                  <span className="text-[11px] text-slate-400">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t border-slate-200 p-6">
          {error && <p className="mb-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
          <div className="grid gap-3">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={4}
              className="w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              placeholder="Type your message..."
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!draft.trim() || sending}
              className="inline-flex items-center justify-center rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
