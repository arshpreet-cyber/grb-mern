"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import DataTable, { Column, StatusPill, RowAction } from "@/components/ui/DataTable";
import { FileText, ExternalLink, Trash2, Edit3 } from "lucide-react";

const EditorWrapper = dynamic(() => import("@/components/editor/EditorWrapper"), { ssr: false });

type PageRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  inSitemap: boolean;
  createdAt: string;
  updatedAt: string;
};

function toSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminPagesPage() {
  const [tab, setTab] = useState<"all" | "new">("all");
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const deletePage = async (page: PageRow) => {
    if (!confirm(`Delete "${page.title}"?`)) return;
    await fetch(`/api/pages/${page.id}`, { method: "DELETE" });
    fetchPages();
  };

  /* ── Column definitions ── */
  const columns: Column<PageRow>[] = [
    {
      key: "title",
      header: "Page",
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 rounded-xl bg-amber-100 dark:bg-yellow-950/40 flex items-center justify-center text-[#D8A720] dark:text-yellow-400">
            <FileText size={16} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-gray-900 dark:text-white text-[13px]">{p.title}</span>
            <span className="text-[11px] text-gray-400 dark:text-white/50 font-mono">/{p.slug}</span>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (p) => (
        <StatusPill
          value={p.status}
          colorMap={{
            Published: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400",
            Draft: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400",
          }}
        />
      ),
    },
    {
      key: "inSitemap",
      header: "Sitemap",
      render: (p) => (
        <span className={`text-xs font-semibold ${p.inSitemap ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-600"}`}>
          {p.inSitemap ? "✓ Yes" : "✗ No"}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Last Updated",
      sortable: true,
      render: (p) => (
        <span className="text-gray-400 dark:text-white/50 text-[11px] font-mono whitespace-nowrap">
          {new Date(p.updatedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      ),
    },
  ];

  /* ── Row actions ── */
  const actions: RowAction<PageRow>[] = [
    {
      label: "Edit Page",
      icon: <Edit3 size={14} />,
      onClick: (p) => {
        window.location.href = `/${p.slug === "home" ? "" : p.slug}?edit=true`;
      },
    },
    {
      label: "View Live",
      icon: <ExternalLink size={14} />,
      onClick: (p) => {
        window.open(`/${p.slug === "home" ? "" : p.slug}`, "_blank");
      },
    },
    {
      label: "Delete",
      icon: <Trash2 size={14} />,
      onClick: deletePage,
      className: "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-[20px] bg-white dark:bg-[#1a1f2c] border border-gray-100 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-yellow-950/40 flex items-center justify-center text-[#D8A720] dark:text-yellow-400">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Pages</h1>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-white/60">Manage your website pages and SEO.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 dark:bg-slate-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700">
            <span className="text-xs font-black text-gray-500 dark:text-white uppercase tracking-widest">{pages.length} Pages</span>
          </div>
          <button onClick={() => setTab("new")}
            className="rounded-xl bg-[#fc0] hover:bg-[#e6bb00] px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg shadow-amber-500/10 transition">
            + New Page
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 w-fit">
        {(["all", "new"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${tab === t ? "bg-white dark:bg-slate-700 text-[#D8A720] dark:text-yellow-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"}`}>
            {t === "all" ? "All Pages" : "Create New Page"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "new" ? (
        <CreatePageTab onSuccess={fetchPages} />
      ) : (
        <div className="bg-white dark:bg-[#1a1f2c] rounded-[20px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <DataTable
            data={pages}
            columns={columns}
            loading={loading}
            actions={actions}
            searchable
            searchPlaceholder="Search by title or slug..."
            searchValue={search}
            onSearchChange={setSearch}
            searchFields={["title", "slug"]}
            pageSize={10}
            emptyText="No pages found. Create your first page!"
          />
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
 *  CREATE NEW PAGE TAB
 * ──────────────────────────────────────────────────────────────────── */
function CreatePageTab({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [createdPage, setCreatedPage] = useState<any>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(toSlug(val));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, slug,
          status: "Draft",
          metaTitle: title,
          sections: [],
          draftSections: [],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create page");
        return;
      }

      onSuccess();
      setCreatedPage(data);
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (createdPage) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#F4F4F4]">
        <EditorWrapper initialPage={createdPage} />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Create New Page</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter a title and the full editor will open right here.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
          <span>⚠</span> {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="space-y-6">
        <div className="rounded-2xl bg-white dark:bg-[#1a1f2c] border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-5 transition-colors">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Page Title *</label>
            <input
              type="text" value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Buy Google Reviews"
              required autoFocus
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-white outline-none focus:border-[#fc0] focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-yellow-950/40 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">URL Slug *</label>
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden">
              <span className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 whitespace-nowrap">/</span>
              <input
                type="text" value={slug}
                onChange={(e) => setSlug(toSlug(e.target.value))}
                placeholder="page-slug" required
                className="flex-1 px-4 py-3 text-sm text-slate-800 dark:text-white bg-transparent outline-none"
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="rounded-xl bg-[#fc0] hover:bg-[#e6bb00] px-8 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-amber-500/10 transition disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2">
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Creating...
            </span>
          ) : (
            <>
              Create &amp; Open Editor
              <span className="text-lg">→</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
