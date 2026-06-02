"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Plus, Trash2, ToggleLeft, ToggleRight, Globe, RefreshCw } from "lucide-react";

type Redirect = {
  id: string;
  fromPath: string;
  toPath: string;
  type: number;
  active: boolean;
  hits: number;
  createdAt: string;
};

export default function AdminRedirectionsPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ fromPath: "", toPath: "", type: 301 });

  const load = () => {
    setLoading(true);
    fetch("/api/admin/redirections")
      .then(r => r.json())
      .then(data => setRedirects(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load redirections."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/redirections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create");
      setForm({ fromPath: "", toPath: "", type: 301 });
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    await fetch("/api/admin/redirections", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active: !active }),
    });
    setRedirects(prev => prev.map(r => r.id === id ? { ...r, active: !active } : r));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this redirect?")) return;
    await fetch("/api/admin/redirections", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setRedirects(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="rounded-2xl bg-white dark:bg-[#1a1f2c] border border-gray-100 dark:border-slate-800 p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
            <ArrowRight size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">URL Redirections</h1>
            <p className="text-xs text-gray-500">Manage 301/302 redirects across the site.</p>
          </div>
        </div>
        <button onClick={load} className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 transition" title="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Add form */}
      <div className="bg-white dark:bg-[#1a1f2c] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6">
        <h2 className="text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-4">Add New Redirect</h2>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="/old-page"
            required
            value={form.fromPath}
            onChange={e => setForm(f => ({ ...f, fromPath: e.target.value }))}
            className="flex-1 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-white outline-none focus:border-blue-400"
          />
          <div className="flex items-center gap-1 text-gray-400 shrink-0">
            <ArrowRight size={16} />
          </div>
          <input
            type="text"
            placeholder="/new-page or https://..."
            required
            value={form.toPath}
            onChange={e => setForm(f => ({ ...f, toPath: e.target.value }))}
            className="flex-1 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-white outline-none focus:border-blue-400"
          />
          <select
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: Number(e.target.value) }))}
            className="border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-white outline-none"
          >
            <option value={301}>301 Permanent</option>
            <option value={302}>302 Temporary</option>
          </select>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition disabled:opacity-60 shrink-0"
          >
            <Plus size={15} /> Add
          </button>
        </form>
        {error && <p className="mt-2 text-[13px] text-red-500">{error}</p>}
      </div>

      {/* List */}
      <div className="bg-white dark:bg-[#1a1f2c] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide">
              {redirects.length} Redirect{redirects.length !== 1 ? "s" : ""}
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <Globe size={12} />
              <span>Active redirects apply to all visitors in real-time</span>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading...</div>
        ) : redirects.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No redirections yet. Add your first one above.</div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-slate-800">
            {redirects.map(r => (
              <div key={r.id} className={`flex items-center gap-4 px-5 py-4 ${!r.active ? "opacity-50" : ""}`}>
                <div className={`text-[10px] font-black px-2 py-0.5 rounded border shrink-0 ${r.type === 301 ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                  {r.type}
                </div>
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <code className="text-[13px] font-mono text-gray-700 dark:text-slate-300 truncate bg-gray-50 dark:bg-slate-900 px-2 py-0.5 rounded">
                    {r.fromPath}
                  </code>
                  <ArrowRight size={14} className="text-gray-400 shrink-0 hidden sm:block" />
                  <code className="text-[13px] font-mono text-amber-600 dark:text-amber-400 truncate bg-gray-50 dark:bg-slate-900 px-2 py-0.5 rounded">
                    {r.toPath}
                  </code>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[11px] text-gray-400 mr-1">{r.hits} hits</span>
                  <button
                    onClick={() => toggleActive(r.id, r.active)}
                    className={`p-1.5 rounded-lg transition ${r.active ? "text-green-500 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"}`}
                    title={r.active ? "Disable" : "Enable"}
                  >
                    {r.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-4 text-[13px] text-blue-700 dark:text-blue-400">
        <strong>Note:</strong> After adding redirects, run <code className="bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.5 rounded text-[12px] font-mono">npx prisma db push</code> if this is a new installation, then deploy for redirects to take effect in production.
      </div>
    </div>
  );
}
