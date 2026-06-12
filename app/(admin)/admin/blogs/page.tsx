"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Edit, Trash2, Eye, Plus, PenTool } from "lucide-react";
import DataTable, { Column, StatusPill } from "@/components/ui/DataTable";

const PAGE_SIZE = 10;

export default function BlogsListing() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Derive page and search directly from the URL params
  const page = Number(searchParams.get("page")) || 1;
  const urlSearch = searchParams.get("search") || "";

  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Local state only manages immediate keystrokes for typing
  const [search, setSearch] = useState(urlSearch);
  const [total, setTotal] = useState(0);

  const fetchBlogs = async (pageArg = page, searchArg = urlSearch) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(pageArg),
        limit: String(PAGE_SIZE),
        status: "all",
      });
      if (searchArg.trim()) params.set("search", searchArg.trim());

      const res = await fetch(`/api/blog?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs);
        setTotal(data.pagination?.total ?? data.blogs.length);
      } else {
        setError(data.error || "Failed to fetch blogs");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Keep local input in sync if URL changes (e.g., browser back button)
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  // 3. Debounce the search input and push it straight to the URL
  useEffect(() => {
    const t = setTimeout(() => {
      if (search !== urlSearch) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1"); // Reset to page 1 on a new search query
        if (search.trim()) {
          params.set("search", search.trim());
        } else {
          params.delete("search");
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 400);
    return () => clearTimeout(t);
  }, [search, urlSearch, pathname, router, searchParams]);

  // 4. Fetch data whenever the URL changes
  useEffect(() => {
    fetchBlogs(page, urlSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, urlSearch]);

  // 5. Update URL params when page changes
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      const { toast } = await import("sonner");
      if (data.success) {
        fetchBlogs();
        toast.success("Blog deleted.");
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      const { toast } = await import("sonner");
      toast.error("An error occurred");
    }
  };

  const columns: Column<any>[] = [
    {
      key: "title",
      header: "Blog Title",
      render: (b) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-gray-900 dark:text-white text-[13px]">{b.title}</span>
          <span className="text-[11px] text-gray-400 dark:text-white/50 font-mono">/{b.slug}</span>
        </div>
      ),
    },
    {
      key: "author",
      header: "Author",
      render: (b) => <span className="text-gray-600 dark:text-white text-[13px]">{b.author || "-"}</span>,
    },
    {
      key: "category",
      header: "Category",
      render: (b) => <span className="text-gray-600 dark:text-white text-[13px] font-medium">{b.category || "-"}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (b) => (
        <StatusPill
          value={b.status === 1 ? "Published" : "Draft"}
          colorMap={{
            Published: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400",
            Draft: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400",
          }}
        />
      ),
    },
    {
      key: "created_at",
      header: "Created Date",
      render: (b) => <span className="text-gray-500 dark:text-white text-[12px]">{new Date(b.created_at).toLocaleDateString()}</span>,
    },
  ];

  const actions = [
    {
      label: "View Live",
      icon: <Eye size={14} />,
      onClick: (b: any) => window.open(`/blog/${b.slug}`, "_blank"),
    },
    {
      label: "Edit Blog",
      icon: <Edit size={14} />,
      onClick: (b: any) => { window.location.href = `/admin/blogs/${b.id}`; },
    },
    {
      label: "Delete",
      icon: <Trash2 size={14} className="text-red-500" />,
      onClick: (b: any) => handleDelete(b.id),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] bg-white dark:bg-[#1a1f2c] border border-gray-100 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-yellow-950/40 flex items-center justify-center text-[#D8A720] dark:text-yellow-400">
            <PenTool size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Blogs</h1>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-white">Manage your content and articles.</p>
          </div>
        </div>
        <Link
          href="/admin/blogs/create"
          className="bg-[#fc0] hover:bg-[#e6bb00] text-slate-900 text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Blog
        </Link>
      </div>

      <div className="bg-white dark:bg-[#1a1f2c] rounded-[20px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <DataTable
          data={blogs}
          columns={columns}
          loading={loading}
          actions={actions}
          searchable
          searchPlaceholder="Search blogs by title or content..."
          searchValue={search}
          onSearchChange={setSearch}
          pageSize={PAGE_SIZE}
          serverSidePagination
          totalRows={total}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}