"use client";

import { useEffect, useState } from "react";
import PageForm from "@/components/page-builder/PageForm";

type PageRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  inSitemap: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function AdminPagesPage() {
  const [tab, setTab] = useState<"new" | "all">("all");
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pages");
      const data = await res.json();
      setPages(Array.isArray(data) ? data : []);
    } catch {
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPages(); }, []);

  const deletePage = async (id: string) => {
    if (!confirm("Delete this page?")) return;
    setDeleting(id);
    await fetch(`/api/pages/${id}`, { method: "DELETE" });
    await fetchPages();
    setDeleting(null);
  };

  const handleCreated = () => {
    fetchPages();
    setTab("all");
    setEditId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Pages</h1>
          <p className="text-sm text-slate-500">Manage your website pages</p>
        </div>
        <button onClick={() => { setTab("new"); setEditId(null); }}
          className="rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow transition hover:opacity-90">
          + New Page
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
        {(["all", "new"] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setEditId(null); }}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${tab === t && !editId ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            {t === "all" ? "All Pages" : "Add New Page"}
          </button>
        ))}
        {editId && (
          <button className="rounded-lg px-5 py-2 text-sm font-semibold bg-white text-violet-700 shadow-sm">
            Edit Page
          </button>
        )}
      </div>

      {/* Tab Content */}
      {editId ? (
        <EditPageTab pageId={editId} onSuccess={handleCreated} onCancel={() => setEditId(null)} />
      ) : tab === "new" ? (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800">Create New Page</h2>
            <p className="text-sm text-slate-500">Fill in the details below to create a new page.</p>
          </div>
          <PageForm onSuccess={handleCreated} />
        </div>
      ) : (
        <AllPagesTab
          pages={pages}
          loading={loading}
          deleting={deleting}
          onDelete={deletePage}
          onEdit={(id) => { setEditId(id); }}
          onRefresh={fetchPages}
        />
      )}
    </div>
  );
}

function AllPagesTab({
  pages, loading, deleting, onDelete, onEdit, onRefresh,
}: {
  pages: PageRow[];
  loading: boolean;
  deleting: string | null;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onRefresh: () => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = pages.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase())
  );

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="relative w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">⌕</span>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-4 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
          />
        </div>
        <button onClick={onRefresh} className="text-xs text-slate-400 hover:text-slate-600 transition">↺ Refresh</button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <div className="text-4xl mb-3">📄</div>
          <p className="text-slate-500 font-medium">No pages found</p>
          <p className="text-sm text-slate-400 mt-1">Create your first page using the &quot;Add New Page&quot; tab</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["Title", "Slug", "Status", "Sitemap", "Last Updated", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {filtered.map((page) => (
                <tr key={page.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{page.title}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded-lg">/{page.slug}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${page.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold ${page.inSitemap ? "text-emerald-600" : "text-slate-400"}`}>
                      {page.inSitemap ? "✓ Yes" : "✗ No"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-400">
                    {new Date(page.updatedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => onEdit(page.id)}
                        className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-100 transition">
                        ✏ Edit
                      </button>
                      <a href={`https://grb-mern-gilt.vercel.app/${page.slug}`} target="_blank" rel="noreferrer"
                        className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition">
                        👁 View
                      </a>
                      <button onClick={() => onDelete(page.id)} disabled={deleting === page.id}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition disabled:opacity-50">
                        {deleting === page.id ? "..." : "🗑 Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      {!loading && filtered.length > 0 && (
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-400">
          Showing {filtered.length} of {pages.length} pages
        </div>
      )}
    </div>
  );
}

function EditPageTab({ pageId, onSuccess, onCancel }: { pageId: string; onSuccess: () => void; onCancel: () => void }) {
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/pages/${pageId}`)
      .then((r) => r.json())
      .then((data) => {
        setInitial({ ...data, sections: Array.isArray(data.sections) ? data.sections : [] });
        setLoading(false);
      });
  }, [pageId]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Edit Page</h2>
          <p className="text-sm text-slate-500">Update the page details below.</p>
        </div>
        <button onClick={onCancel} className="text-sm text-slate-500 hover:text-slate-700 transition">← Back to All Pages</button>
      </div>
      <PageForm initial={initial} pageId={pageId} onSuccess={onSuccess} />
    </div>
  );
}
