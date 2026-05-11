"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function DashboardSupportPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!session?.user?.id) {
      setError("You must be signed in to create support tickets.");
      return;
    }

    if (!subject.trim() || !query.trim()) {
      setError("Please provide both a subject and a message.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          name: session.user.name,
          email: session.user.email,
          subject: subject.trim(),
          query: query.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Unable to create ticket.");
        return;
      }

      router.push(`/dashboard/tickets/${data.ticketId}`);
    } catch (err) {
      console.error(err);
      setError("Unable to create ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1f2c] p-6 shadow-sm transition-colors">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Create Support Ticket</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Submit a new ticket and our support team will respond in the chat thread.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1f2c] p-6 shadow-sm transition-colors">
        {error && <p className="rounded-2xl bg-rose-50 dark:bg-rose-900/20 px-4 py-3 text-sm text-rose-700 dark:text-rose-400">{error}</p>}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="What can we help you with?"
            className="w-full rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition focus:border-violet-500 dark:focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
          <textarea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            rows={8}
            placeholder="Describe your issue or question in detail."
            className="w-full rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition focus:border-violet-500 dark:focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full bg-violet-600 dark:bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 dark:hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating ticket..." : "Create Ticket"}
        </button>
      </form>
    </div>
  );
}
