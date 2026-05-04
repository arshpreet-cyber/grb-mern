"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2, Eye, Plus, PenTool } from "lucide-react";
import DataTable, { Column, StatusPill } from "@/components/ui/DataTable";

export default function BlogsListing() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs);
      } else {
        setError(data.error || "Failed to fetch blogs");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchBlogs();
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (err: any) {
      alert("An error occurred");
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
          <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <PenTool size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Blogs</h1>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-white">Manage your content and articles.</p>
          </div>
        </div>
        <Link 
          href="/admin/blogs/create" 
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/20 flex items-center gap-2"
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
          searchPlaceholder="Search blogs by title or author..."
          searchValue={search}
          onSearchChange={setSearch}
          pageSize={10}
        />
      </div>
    </div>
  );
}
