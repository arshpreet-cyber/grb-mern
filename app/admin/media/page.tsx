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

  // import { Suspense } from "react";
  // import AdminMediaClient from "./MediaClient";

  // export default function AdminMediaPage() {
  //   return (
  //     <Suspense fallback={<div className="p-6 text-slate-500">Loading media manager...</div>}>
  //       <AdminMediaClient />
  //     </Suspense>
  //   );
  // }

  // export default function AdminMediaPage() {
  //   return (
  //     <Suspense fallback={<div className="p-6 text-slate-400">Loading...</div>}>
  //       <AdminMediaPageInner />
  //     </Suspense>
  //   );
}
