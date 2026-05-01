"use client";

import { useEffect, useState } from "react";
import { FileEdit, Eye, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

type PageRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  sections: any;
  draftSections: any;
  updatedAt: string;
};

export default function DraftsPage() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pages");
      const data = await res.json();
      
      // Filter pages that have a draft different from live
      const draftPages = (Array.isArray(data) ? data : []).filter((page: PageRow) => {
        const draftStr = JSON.stringify(page.draftSections || []);
        const liveStr = JSON.stringify(page.sections || []);
        return draftStr !== liveStr && draftStr !== "[]";
      });
      
      setPages(draftPages);
    } catch {
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPages(); }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1a1a1a] tracking-tight">Unpublished Drafts</h1>
          <p className="text-sm text-slate-500">Pages with changes that are not yet live</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{pages.length} Drafts Pending</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#fc0]/20 border-t-[#fc0]" />
        </div>
      ) : pages.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileEdit size={40} className="text-slate-200" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Pending Drafts</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">All your pages are currently up to date with their live versions.</p>
          <Link href="/admin/pages" className="inline-flex items-center gap-2 mt-8 text-sm font-bold text-[#fc0] hover:underline">
            Go to All Pages <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <div key={page.id} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#fc0]/20 transition-all duration-300 overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-[#fc0]/10 p-3 rounded-2xl">
                    <FileEdit size={24} className="text-[#fc0]" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Last Saved: {new Date(page.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-[#fc0] transition-colors">{page.title}</h3>
                <p className="text-xs text-slate-400 font-mono mb-6">/{page.slug}</p>
                
                <div className="flex items-center gap-2 mb-6">
                   <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                          {i}
                        </div>
                      ))}
                   </div>
                   <span className="text-[11px] font-bold text-slate-500">
                      {page.draftSections?.length || 0} Sections modified
                   </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50/50 border-t border-slate-100 grid grid-cols-2 gap-3">
                <Link 
                  href={`/${page.slug === 'home' ? '' : page.slug}?preview=true`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <Eye size={14} />
                  PREVIEW
                </Link>
                <Link 
                  href={`/${page.slug === 'home' ? '' : page.slug}?edit=true`}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#fc0] text-[#1a1a1a] text-xs font-black hover:shadow-lg hover:shadow-[#fc0]/20 transition-all"
                >
                  <FileEdit size={14} />
                  EDIT DRAFT
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
