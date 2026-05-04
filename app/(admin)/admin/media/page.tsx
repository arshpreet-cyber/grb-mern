"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { attachmentTypeOptions, MediaAttachmentType } from "@/lib/media";
import { Image as ImageIcon, Upload, Copy, Check, Search, File, Trash2, X } from "lucide-react";

type MediaRow = {
  id: number;
  mediaUrl: string | null;
  alt: string | null;
  isTitle: string | null;
  mediaType: string | null;
  type: MediaAttachmentType;
  createdAt: string | null;
  updatedAt: string | null;
  staticUrl: string | null;
  absoluteUrl: string | null;
};

type MediaTab = "new" | "all";

const defaultType: MediaAttachmentType = "PAGE";

function formatDisplayLink(url: string | null, maxLength = 48) {
  if (!url) return "-";
  if (url.length <= maxLength) return url;
  return `${url.slice(0, maxLength)}...`;
}

async function copyToClipboard(text: string | null, onSuccess: () => void, onError: (message: string) => void) {
  if (!text) {
    onError("No link available to copy.");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    onSuccess();
  } catch {
    onError("Failed to copy link.");
  }
}

function AdminMediaPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") === "new" ? "new" : "all";

  const [media, setMedia] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [type, setType] = useState<MediaAttachmentType>(defaultType);
  const [isTitle, setIsTitle] = useState(false);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const previewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const setTab = (tab: MediaTab) => {
    router.replace(`/admin/media?tab=${tab}`);
  };

  const fetchMedia = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/media", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load media.");
      }

      setMedia(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load media.");
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!selectedFile) {
      setError("Please choose an image before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("alt", alt);
    formData.append("type", type);
    formData.append("isTitle", String(isTitle));

    setUploading(true);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      setSelectedFile(null);
      setAlt("");
      setType(defaultType);
      setIsTitle(false);
      setMessage("Media uploaded successfully.");
      await fetchMedia();
      setTimeout(() => setTab("all"), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const filteredMedia = media.filter((item) => {
    const haystack = [
      item.alt,
      item.mediaType,
      item.type,
      item.staticUrl,
      item.absoluteUrl,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] bg-white dark:bg-[#1a1f2c] border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Media Manager</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-white">Upload and manage assets for blogs, pages, and products.</p>
          </div>
          <div className="flex items-center gap-3 p-1 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800">
            <button
              onClick={() => setTab("all")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                currentTab === "all" ? "bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-slate-300"
              }`}
            >
              Library
            </button>
            <button
              onClick={() => setTab("new")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                currentTab === "new" ? "bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-slate-300"
              }`}
            >
              Upload New
            </button>
          </div>
        </div>
      </div>

      {currentTab === "all" ? (
        <div className="space-y-6">
          <div className="relative group max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by alt text, URL or type..."
              className="w-full rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-[#1a1f2c] pl-11 pr-5 py-3 text-sm text-gray-900 dark:text-white outline-none transition focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500"
            />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1a1f2c] rounded-[20px] border border-gray-100 dark:border-slate-800">
              <div className="h-12 w-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-4"></div>
              <p className="text-sm text-gray-500 dark:text-white font-medium">Loading your media library...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-rose-50 dark:bg-rose-900/10 px-5 py-4 text-sm text-rose-700 dark:text-rose-400 ring-1 ring-rose-100 dark:ring-rose-900/30">
              {error}
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1a1f2c] rounded-[20px] border border-gray-100 dark:border-slate-800 text-center px-6">
              <div className="h-16 w-16 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No media assets found</h3>
              <p className="text-sm text-gray-500 dark:text-white mt-1 max-w-xs">Start building your library by uploading images for your blogs or products.</p>
              <button onClick={() => setTab("new")} className="mt-6 text-violet-600 dark:text-violet-400 font-bold text-sm hover:underline">Upload your first asset</button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMedia.map((item) => (
                <div key={item.id} className="group relative overflow-hidden rounded-[20px] border border-gray-100 dark:border-slate-800 bg-white dark:bg-[#1a1f2c] shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="aspect-[4/3] bg-gray-50 dark:bg-slate-900 overflow-hidden relative">
                    {item.mediaType?.startsWith("image/") ? (
                      <img src={item.absoluteUrl || item.staticUrl || ""} alt={item.alt || ""} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <File className="h-12 w-12 opacity-20" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-black/40 backdrop-blur-md text-[10px] font-bold text-white rounded-md uppercase tracking-widest">
                        {item.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-900/20">
                    <p className="truncate text-sm font-bold text-gray-900 dark:text-white">{item.alt || "Untitled Asset"}</p>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => {
                          copyToClipboard(item.absoluteUrl || item.staticUrl, () => {
                            setCopiedId(item.id);
                            setTimeout(() => setCopiedId(null), 2000);
                          }, (msg) => setError(msg));
                        }}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gray-50 dark:bg-slate-800 py-2.5 text-xs font-bold text-gray-600 dark:text-white transition hover:bg-violet-600 hover:text-white"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check size={14} className="text-emerald-400" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Copy URL
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleUpload} className="space-y-6 rounded-[30px] border border-gray-100 dark:border-slate-800 bg-white dark:bg-[#1a1f2c] p-8 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload New Media</h2>
              <p className="text-sm text-gray-500 dark:text-white mt-1">Select a file to add to your library.</p>
            </div>

            {message && <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-100 dark:ring-emerald-900/30 font-medium">{message}</div>}
            {error && <div className="rounded-2xl bg-rose-50 dark:bg-rose-900/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-400 ring-1 ring-rose-100 dark:ring-rose-900/30 font-medium">{error}</div>}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-2 block">Source File</label>
              <div className={`relative group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed transition-all p-2 ${previewUrl ? 'border-violet-500/50 bg-violet-50/10' : 'border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 hover:border-violet-500'}`}>
                {previewUrl ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden group">
                    <img src={previewUrl} className="h-full w-full object-contain bg-black/5" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => setSelectedFile(null)} className="h-10 w-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center gap-3 py-12 w-full">
                    <div className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="h-8 w-8 text-violet-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Click to choose image</p>
                      <p className="text-xs text-gray-500 dark:text-white mt-1">PNG, JPG or WEBP up to 2MB</p>
                    </div>
                    <input type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} accept="image/*" />
                  </label>
                )}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-2 block">Alt Description</label>
                <input 
                  value={alt} 
                  onChange={(e) => setAlt(e.target.value)} 
                  placeholder="Accessibility description" 
                  className="w-full rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none transition focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-2 block">Asset Category</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value as MediaAttachmentType)} 
                  className="w-full rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none transition focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 appearance-none"
                >
                  {attachmentTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              disabled={uploading} 
              type="submit" 
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-violet-600 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/30 transition hover:bg-violet-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Uploading Asset...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Media Asset
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function AdminMediaPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-400">Loading...</div>}>
      <AdminMediaPageInner />
    </Suspense>
  );
}
