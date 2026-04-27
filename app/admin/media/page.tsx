"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { attachmentTypeOptions, MediaAttachmentType } from "@/lib/media";

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
      setTab("all");
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
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Media Manager</h1>
          <p className="mt-2 text-sm text-slate-500">
            Upload and manage assets for blogs, pages, and products.
          </p>
        </div>
      </div>

      <div className="flex gap-2 rounded-2xl bg-white p-1 ring-1 ring-slate-200 w-fit">
        <button
          onClick={() => setTab("all")}
          className={`rounded-xl px-6 py-2 text-sm font-semibold transition ${
            currentTab === "all" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          All Media
        </button>
        <button
          onClick={() => setTab("new")}
          className={`rounded-xl px-6 py-2 text-sm font-semibold transition ${
            currentTab === "new" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          Upload New
        </button>
      </div>

      {currentTab === "all" ? (
        <div className="space-y-6">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by alt text, URL or type..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
              Loading library...
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-rose-50 px-5 py-4 text-sm text-rose-700 ring-1 ring-rose-100">
              {error}
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
              No media found.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMedia.map((item) => (
                <div key={item.id} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                  <div className="aspect-video bg-slate-100 overflow-hidden">
                    {item.mediaType?.startsWith("image/") ? (
                      <img src={item.absoluteUrl || item.staticUrl || ""} alt={item.alt || ""} className="h-full w-full object-cover transition duration-300 group-hover:scale-110" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.type}</p>
                    <p className="mt-1 truncate text-sm font-bold text-slate-900">{item.alt || "Untitled"}</p>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => copyToClipboard(item.absoluteUrl || item.staticUrl, () => setMessage("Link copied!"), (msg) => setError(msg))}
                        className="flex-1 rounded-xl bg-slate-100 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-2xl">
          <form onSubmit={handleUpload} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            {message && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">{message}</div>}
            {error && <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">{error}</div>}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">File</label>
              <div className="flex items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 transition hover:border-violet-300">
                {previewUrl ? (
                  <div className="relative h-48 w-full">
                    <img src={previewUrl} className="h-full w-full object-contain" alt="Preview" />
                    <button type="button" onClick={() => setSelectedFile(null)} className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm hover:bg-rose-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center gap-2">
                    <div className="rounded-full bg-white p-4 shadow-sm ring-1 ring-slate-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-slate-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-500">Click to choose image</p>
                    <input type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} accept="image/*" />
                  </label>
                )}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Alt Text</label>
                <input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Accessibility description" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Type</label>
                <select value={type} onChange={(e) => setType(e.target.value as MediaAttachmentType)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100">
                  {attachmentTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button disabled={uploading} type="submit" className="w-full rounded-full bg-violet-600 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-violet-700 disabled:opacity-50">
              {uploading ? "Uploading..." : "Upload Media Asset"}
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
