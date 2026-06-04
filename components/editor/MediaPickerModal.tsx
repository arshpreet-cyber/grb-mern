"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Search, Check, Loader2 } from "lucide-react";

interface MediaItem {
  id: number;
  staticUrl: string | null;
  absoluteUrl: string | null;
  alt: string | null;
  mediaType: string | null;
  type: string;
  createdAt: string | null;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function MediaPickerModal({ isOpen, onClose, onSelect }: MediaPickerModalProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelectedUrl(null);
      setUploadFile(null);
      setUploadAlt("");
      setError(null);
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/media");
      if (!res.ok) throw new Error("Failed to fetch media");
      const data = await res.json();
      setMedia(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load media gallery";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("alt", uploadAlt);
    formData.append("type", "PAGE");

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      // Upload successful
      const newUrl = data.staticUrl || data.mediaUrl;
      if (newUrl) {
        onSelect(newUrl);
      } else {
        throw new Error("Could not retrieve uploaded file URL");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload image";
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const filteredMedia = media.filter((item) => {
    if (!item.staticUrl) return false;
    const haystack = `${item.alt || ""} ${item.staticUrl}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-[Poppins]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden border border-black/5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#fc0] px-6 py-4 flex items-center justify-between border-b border-black/5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-black/10 rounded-lg text-slate-900">
              <Upload size={18} />
            </span>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Select Media Asset</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-black/10 rounded-full transition-colors text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-b border-red-100 px-6 py-3 text-sm text-red-600 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-800 hover:text-red-950 font-bold">Dismiss</button>
          </div>
        )}

        {/* Content body split into two sections: Gallery & Upload */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Panel: Gallery Grid */}
          <div className="flex-1 flex flex-col p-6 overflow-hidden border-r border-black/5">
            {/* Search Bar */}
            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-black/30">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search media by alt text, URL..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#fc0] focus:bg-white transition"
              />
            </div>

            {/* Gallery Grid Container */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-1">
              {loading ? (
                <div className="h-full flex items-center justify-center flex-col gap-2">
                  <Loader2 className="animate-spin text-[#fc0]" size={32} />
                  <span className="text-xs text-black/40 font-bold uppercase tracking-wider">Loading Library...</span>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="h-full flex items-center justify-center flex-col text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <span className="text-3xl mb-2">🖼️</span>
                  <span className="text-sm font-bold text-slate-700">No matching media</span>
                  <p className="text-xs text-slate-400 mt-1">Upload a new image using the panel on the right or try a different search term.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-0.5">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedUrl === item.staticUrl;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedUrl(item.staticUrl)}
                        className={`group relative aspect-square rounded-xl overflow-hidden bg-slate-50 border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? "border-[#fc0] ring-4 ring-[#fc0]/20" 
                            : "border-black/5 hover:border-black/20 hover:shadow-md"
                        }`}
                      >
                        {item.staticUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.staticUrl}
                            alt={item.alt || ""}
                            className="w-full h-full object-contain p-2"
                          />
                        )}
                        
                        {/* Overlay with details */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                          <p className="text-[10px] text-white font-bold truncate">{item.alt || "Unnamed Asset"}</p>
                          <p className="text-[8px] text-white/70 truncate">{item.staticUrl}</p>
                        </div>

                        {/* Selected Indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 p-1 bg-[#fc0] text-slate-900 rounded-full shadow">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selection Actions */}
            <div className="mt-4 pt-4 border-t border-black/5 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedUrl}
                onClick={() => {
                  if (selectedUrl) onSelect(selectedUrl);
                }}
                className="px-5 py-2 bg-[#fc0] hover:bg-[#e6bb00] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-slate-900 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/10 transition"
              >
                Insert Selected
              </button>
            </div>
          </div>

          {/* Right Panel: Upload Form */}
          <div className="w-[300px] bg-slate-50 p-6 flex flex-col overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-black/5 pb-2">Upload New Asset</h3>
            
            <form onSubmit={handleUpload} className="flex-1 flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-2">File</label>
                <div className="relative group rounded-xl border border-slate-200 bg-white p-4 text-center cursor-pointer hover:border-[#fc0] transition flex flex-col items-center justify-center min-h-[140px]">
                  <input
                    type="file"
                    accept="image/*,.svg"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setUploadFile(file);
                      if (file && !uploadAlt) {
                        // Prefill alt text with clean file name
                        const cleanName = file.name.split(".")[0].replace(/[-_]/g, " ");
                        setUploadAlt(cleanName);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {uploadFile ? (
                    <div className="w-full flex flex-col items-center">
                      <div className="h-16 w-16 mb-2 overflow-hidden rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={URL.createObjectURL(uploadFile)}
                          alt="preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 truncate max-w-[200px]">{uploadFile.name}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="text-slate-400 group-hover:text-[#fc0] mb-2 transition" size={24} />
                      <span className="text-xs font-bold text-slate-600">Choose Image File</span>
                      <span className="text-[10px] text-slate-400 mt-1">SVG, PNG, JPG, WEBP, GIF</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-2">Alt Text</label>
                <input
                  type="text"
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                  placeholder="e.g. Google Reviews badge"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#fc0]"
                />
              </div>

              <div className="mt-auto pt-4">
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="w-full py-2.5 bg-black hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span>Upload & Select</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
