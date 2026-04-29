"use client";

import { useEffect, useMemo, useState } from "react";
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

export default function AdminMediaClient() {
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Media Library</h1>
        </div>
      </div>

      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
        {([
          { id: "new", label: "Upload New Media" },
          { id: "all", label: "All Media" },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              currentTab === tab.id
                ? "bg-white text-violet-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {currentTab === "new" ? (
        <form
          onSubmit={handleUpload}
          className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-800">Upload New Media</h2>
              <p className="text-sm text-slate-500">
                Choose an image file, add its details, and save it to the media
                library.
              </p>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Image File
                </span>
                <input
                  type="file"
                  accept="image/*,.svg"
                  onChange={(event) =>
                    setSelectedFile(event.target.files?.[0] ?? null)
                  }
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-violet-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Media Type
                  </span>
                  <select
                    value={type}
                    onChange={(event) => setType(event.target.value as MediaAttachmentType)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  >
                    {attachmentTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex items-end gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isTitle}
                    onChange={(event) => setIsTitle(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-400"
                  />
                  <span className="text-sm text-slate-700">
                    Mark as title image
                  </span>
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Alt Text
                </span>
                <input
                  value={alt}
                  onChange={(event) => setAlt(event.target.value)}
                  placeholder="Describe the image for accessibility"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </label>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload Media"}
              </button>
              <button
                type="button"
                onClick={() => setTab("all")}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                View All Media
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-800">Preview</h2>
              <p className="text-sm text-slate-500">
                Check the selected file before saving it.
              </p>
            </div>

            {previewUrl ? (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img
                    src={previewUrl}
                    alt={alt || "Media preview"}
                    className="h-72 w-full object-contain"
                  />
                </div>
                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-700">File:</span>{" "}
                    {selectedFile?.name}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Format:</span>{" "}
                    {selectedFile?.type || "Unknown"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Size:</span>{" "}
                    {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "-"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                Select a file to preview it here.
              </div>
            )}
          </div>
        </form>
      ) : (
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-80">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search media by alt text, type, or link..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <button
              onClick={fetchMedia}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-4xl mb-3">🖼️</div>
              <p className="text-slate-500 font-medium">No media found</p>
              <p className="text-sm text-slate-400 mt-1">
                Upload your first file from the Upload New Media tab.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {[
                      "Preview",
                      "Details",
                      "Static Link",
                      "Dynamic Link",
                      "Meta",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                  {filteredMedia.map((item) => (
                    <tr key={item.id} className="align-top hover:bg-slate-50 transition">
                      <td className="px-5 py-4">
                        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                          {item.staticUrl ? (
                            <img
                              src={item.staticUrl}
                              alt={item.alt || "Uploaded media"}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <span className="px-2 text-center text-xs text-slate-400">
                              No preview
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-2">
                          <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-violet-700">
                            {attachmentTypeOptions.find((option) => option.value === item.type)?.label ?? item.type}
                          </span>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Alt Text
                            </p>
                            <p className="mt-1 max-w-xs break-words text-sm text-slate-700">
                              {item.alt || "No alt text provided"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={item.staticUrl ?? "#"}
                            target="_blank"
                            rel="noreferrer"
                            title={item.staticUrl ?? ""}
                            className="block max-w-[220px] truncate rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-700 hover:bg-violet-100 hover:text-violet-800"
                          >
                            {formatDisplayLink(item.staticUrl)}
                          </a>
                          <button
                            type="button"
                            title="Copy static link"
                            onClick={() =>
                              copyToClipboard(
                                item.staticUrl,
                                () => {
                                  setMessage("Static link copied.");
                                  setError(null);
                                },
                                (message) => {
                                  setError(message);
                                  setMessage(null);
                                }
                              )
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-violet-200 bg-white text-sm text-violet-700 transition hover:bg-violet-50"
                          >
                            ⧉
                          </button>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={item.absoluteUrl ?? "#"}
                            target="_blank"
                            rel="noreferrer"
                            title={item.absoluteUrl ?? ""}
                            className="block max-w-[220px] truncate rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-700 hover:bg-sky-100 hover:text-sky-800"
                          >
                            {formatDisplayLink(item.absoluteUrl)}
                          </a>
                          <button
                            type="button"
                            title="Copy dynamic link"
                            onClick={() =>
                              copyToClipboard(
                                item.absoluteUrl,
                                () => {
                                  setMessage("Dynamic link copied.");
                                  setError(null);
                                },
                                (message) => {
                                  setError(message);
                                  setMessage(null);
                                }
                              )
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-sky-200 bg-white text-sm text-sky-700 transition hover:bg-sky-50"
                          >
                            ⧉
                          </button>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-1 text-xs text-slate-500">
                          <p>{item.mediaType || "Unknown format"}</p>
                          <p>{item.isTitle ? "Title image" : "Regular media"}</p>
                          <p>
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : ""}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
