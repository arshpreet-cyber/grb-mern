"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2, Eye, Plus } from "lucide-react";

export default function BlogsListing() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading blogs...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Blogs</h1>
        <Link 
          href="/admin/blogs/create" 
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} />
          <span>Add New Blog</span>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Author</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Created Date</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No blogs found. Create your first blog!
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 max-w-xs truncate font-medium">{blog.title}</td>
                  <td className="p-4">{blog.author || "-"}</td>
                  <td className="p-4">{blog.category || "-"}</td>
                  <td className="p-4">
                    {blog.status === 1 ? (
                      <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Published</span>
                    ) : blog.status === 2 ? (
                      <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Draft</span>
                    ) : (
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Unused</span>
                    )}
                  </td>
                  <td className="p-4">{new Date(blog.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-3">
                      <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700" title="View">
                        <Eye size={18} />
                      </a>
                      <Link href={`/admin/blogs/${blog.id}`} className="text-gray-500 hover:text-gray-700" title="Edit">
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => handleDelete(blog.id)} className="text-red-500 hover:text-red-700" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
