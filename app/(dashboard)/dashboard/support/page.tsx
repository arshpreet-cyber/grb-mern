"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useRef, useState } from "react";
import { Paperclip, X, Upload, Ticket, CheckCircle2, Clock, HeadphonesIcon } from "lucide-react";

export default function DashboardSupportPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const next = [...files, ...Array.from(incoming)].slice(0, 5);
    setFiles(next);
  };

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, [files]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!session?.user?.id) { setError("You must be signed in."); return; }
    if (!subject.trim() || !query.trim()) { setError("Please provide both a subject and a message."); return; }

    setLoading(true);
    try {
      // Upload files first
      let mediaUrls: string[] = [];
      if (files.length > 0) {
        const uploads = await Promise.all(files.map(async (file) => {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          const data = await res.json();
          return data.url as string;
        }));
        mediaUrls = uploads.filter(Boolean);
      }

      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          name: session.user.name,
          email: session.user.email,
          subject: subject.trim(),
          query: query.trim(),
          media: mediaUrls.length > 0 ? JSON.stringify(mediaUrls) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data?.error || "Unable to create ticket."); return; }
      router.push(`/dashboard/tickets/${data.ticketId}`);
    } catch {
      setError("Unable to create ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#ffe135] via-[#ffcc00] to-[#ffa000] px-8 py-8 text-slate-950 shadow-md border border-[#ffd54f]/30">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute right-20 bottom-0 h-24 w-48 rounded-full bg-white/20 blur-xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950/10 text-slate-950">
              <HeadphonesIcon size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Create Support Ticket</h1>
              <p className="mt-0.5 text-sm text-slate-800/90 font-medium">Our team typically responds within a few hours.</p>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            {[
              { icon: Clock, label: "Avg. Response", value: "< 4 hrs" },
              { icon: CheckCircle2, label: "Resolution", value: "98%" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 rounded-xl bg-slate-950/10 px-4 py-2.5 text-sm border border-slate-950/5">
                <Icon size={15} className="text-slate-800" />
                <div>
                  <p className="text-[10px] text-slate-800/70 font-bold uppercase tracking-wider">{label}</p>
                  <p className="font-extrabold text-slate-950 leading-tight">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — main form */}
          <div className="lg:col-span-2 space-y-5">

            {error && (
              <div className="flex items-center gap-3 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-900/20 dark:border-rose-800 px-4 py-3 text-sm text-rose-700 dark:text-rose-400">
                <X size={15} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Subject */}
            <div className="rounded-2xl bg-white dark:bg-[#1a1f2c] border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Subject <span className="text-rose-500">*</span>
              </label>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Issue with my order #1234"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-100 dark:focus:ring-amber-900/20 placeholder:text-slate-400"
              />
            </div>

            {/* Message */}
            <div className="rounded-2xl bg-white dark:bg-[#1a1f2c] border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={query}
                onChange={e => setQuery(e.target.value)}
                rows={8}
                placeholder="Describe your issue in detail. Include any relevant order numbers, error messages, or steps to reproduce."
                className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-100 dark:focus:ring-amber-900/20 placeholder:text-slate-400"
              />
              <p className="mt-2 text-xs text-slate-400">{query.length} characters</p>
            </div>

            {/* Attachments */}
            <div className="rounded-2xl bg-white dark:bg-[#1a1f2c] border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Attachments <span className="text-slate-400 font-normal">(optional, max 5)</span>
              </label>

              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 cursor-pointer transition-all
                  ${dragging
                    ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <Upload size={22} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Drop files here or <span className="text-amber-600 dark:text-[#fc0] font-semibold hover:underline">click to browse</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400">PNG, JPG, PDF, DOCX up to 10MB each · Max 5 files</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                  className="hidden"
                  onChange={e => addFiles(e.target.files)}
                />
              </div>

              {/* File list */}
              {files.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {files.map((file, i) => {
                    const isImage = file.type.startsWith("image/");
                    const sizeMB = (file.size / 1024 / 1024).toFixed(1);
                    return (
                      <li key={i} className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-[#fc0]">
                          {isImage
                            ? <img src={URL.createObjectURL(file)} alt="" className="h-9 w-9 rounded-lg object-cover" />
                            : <Paperclip size={15} />
                          }
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">{file.name}</p>
                          <p className="text-xs text-slate-400">{sizeMB} MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="text-slate-400 hover:text-rose-500 transition p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20"
                        >
                          <X size={15} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#fc0] hover:bg-[#e6b800] text-black px-6 py-3.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 shadow-sm active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  {files.length > 0 ? "Uploading & Creating..." : "Creating ticket..."}
                </>
              ) : (
                <>
                  <Ticket size={16} />
                  Submit Ticket
                </>
              )}
            </button>
          </div>

          {/* Right — tips */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-white dark:bg-[#1a1f2c] border border-slate-200 dark:border-slate-800 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Tips for faster support</h3>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                {[
                  { emoji: "🔖", text: "Include your order number in the subject" },
                  { emoji: "📸", text: "Attach screenshots of any errors you see" },
                  { emoji: "📋", text: "Describe what you expected vs. what happened" },
                  { emoji: "🌐", text: "Mention which platform the issue relates to" },
                ].map(({ emoji, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="text-base shrink-0">{emoji}</span>
                    <span className="leading-snug">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/50 p-5">
              <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-2">Response time</h3>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Normal", time: "Within 24 hrs", color: "bg-slate-400" },
                  { label: "Urgent", time: "Within 4 hrs", color: "bg-amber-400" },
                  { label: "Critical", time: "Within 1 hr", color: "bg-rose-500" },
                ].map(({ label, time, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <span className={`h-2 w-2 rounded-full ${color}`} />
                      {label}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
