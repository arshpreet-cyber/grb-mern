'use client';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { updatePageMeta, setTitle, setSlug } from '@/lib/redux/features/pageEditorSlice';
import { X, Search, Code, Settings } from 'lucide-react';
import MediaPickerModal from './MediaPickerModal';

interface Props { onClose: () => void; }

type Tab = 'general' | 'seo' | 'scripts';

export default function PageSettingsPanel({ onClose }: Props) {
  const dispatch = useAppDispatch();
  const { title, slug, meta } = useAppSelector((s) => s.pageEditor);
  const [tab, setTab] = useState<Tab>('general');

  const [mediaPicker, setMediaPicker] = useState<{
    isOpen: boolean;
    onSelect: (url: string) => void;
  } | null>(null);

  const openMediaPicker = (onSelect: (url: string) => void) => {
    setMediaPicker({ isOpen: true, onSelect });
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'general', label: 'General', icon: <Settings size={16} /> },
    { key: 'seo', label: 'SEO & Meta', icon: <Search size={16} /> },
    { key: 'scripts', label: 'Scripts', icon: <Code size={16} /> },
  ];

  const inputCls = "w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0]/40 focus:border-[#fc0] text-sm font-medium text-[#1a1a1a] transition placeholder:text-black/20";
  const labelCls = "text-[11px] font-black text-[#1a1a1a]/40 uppercase tracking-[0.15em] block mb-2";
  const textareaCls = `${inputCls} min-h-[100px] resize-none`;

  return (
    <>
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col" style={{ maxHeight: '85vh' }}>
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-black/5 flex items-center justify-between bg-[#fafafa] shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#fc0] rounded-2xl flex items-center justify-center shadow-lg shadow-[#fc0]/20">
              <Settings size={20} className="text-[#1a1a1a]" />
            </div>
            <div>
              <h2 className="font-black text-[#1a1a1a] text-lg tracking-tight">Page Settings</h2>
              <p className="text-[10px] text-black/30 font-bold uppercase tracking-[0.15em]">Title, SEO, Scripts & More</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-black/5 rounded-full transition-colors text-black/30 hover:text-black">
            <X size={22} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-8 pt-4 flex gap-2 shrink-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-black rounded-xl transition-all ${
                tab === t.key
                  ? 'bg-[#1a1a1a] text-[#fc0] shadow-lg'
                  : 'bg-black/5 text-black/30 hover:text-black/60 hover:bg-black/10'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">

          {tab === 'general' && (
            <>
              <div>
                <label className={labelCls}>Page Title</label>
                <input type="text" value={title} onChange={(e) => dispatch(setTitle(e.target.value))} placeholder="Page Title" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>URL Slug</label>
                <div className="flex items-center rounded-xl border border-black/5 overflow-hidden bg-white">
                  <span className="px-4 py-3 text-xs text-black/30 bg-[#fafafa] border-r border-black/5 font-bold whitespace-nowrap">/</span>
                  <input type="text" value={slug} onChange={(e) => dispatch(setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/(^-|-$)/g, '')))} placeholder="page-slug" className="flex-1 px-4 py-3 text-sm font-medium text-[#1a1a1a] bg-transparent outline-none" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select value={meta.status} onChange={(e) => dispatch(updatePageMeta({ status: e.target.value }))} className={inputCls}>
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Title Image URL</label>
                  <div className="flex gap-2">
                    <input type="url" value={meta.titleImage} onChange={(e) => dispatch(updatePageMeta({ titleImage: e.target.value }))} placeholder="https://..." className={inputCls} />
                    <button
                      type="button"
                      onClick={() => openMediaPicker((url) => dispatch(updatePageMeta({ titleImage: url })))}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors border border-slate-200 whitespace-nowrap"
                    >
                      Browse
                    </button>
                  </div>
                  {meta.titleImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={meta.titleImage} alt="title" className="mt-2 w-full h-20 object-cover rounded-lg border border-black/5" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  )}
                </div>
                <div>
                  <label className={labelCls}>OG Image URL</label>
                  <div className="flex gap-2">
                    <input type="url" value={meta.opengraphImage} onChange={(e) => dispatch(updatePageMeta({ opengraphImage: e.target.value }))} placeholder="https://..." className={inputCls} />
                    <button
                      type="button"
                      onClick={() => openMediaPicker((url) => dispatch(updatePageMeta({ opengraphImage: url })))}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors border border-slate-200 whitespace-nowrap"
                    >
                      Browse
                    </button>
                  </div>
                  {meta.opengraphImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={meta.opengraphImage} alt="og" className="mt-2 w-full h-20 object-cover rounded-lg border border-black/5" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  )}
                </div>
              </div>
            </>
          )}

          {tab === 'seo' && (
            <>
              <div>
                <label className={labelCls}>Meta Title</label>
                <input type="text" value={meta.metaTitle} onChange={(e) => dispatch(updatePageMeta({ metaTitle: e.target.value }))} placeholder="SEO title" className={inputCls} />
                <p className="text-[10px] text-black/20 mt-1 font-bold">{(meta.metaTitle || '').length}/60 characters</p>
              </div>
              <div>
                <label className={labelCls}>Meta Description</label>
                <textarea value={meta.metaDescription} onChange={(e) => dispatch(updatePageMeta({ metaDescription: e.target.value }))} placeholder="Brief description for search engines..." className={textareaCls} />
                <p className="text-[10px] text-black/20 mt-1 font-bold">{(meta.metaDescription || '').length}/160 characters</p>
              </div>
              <div>
                <label className={labelCls}>Keywords</label>
                <input type="text" value={meta.keywords} onChange={(e) => dispatch(updatePageMeta({ keywords: e.target.value }))} placeholder="keyword1, keyword2, keyword3" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Canonical Link</label>
                <input type="url" value={meta.canonicalLink} onChange={(e) => dispatch(updatePageMeta({ canonicalLink: e.target.value }))} placeholder="https://example.com/page" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Robots</label>
                <select value={meta.robotsText} onChange={(e) => dispatch(updatePageMeta({ robotsText: e.target.value }))} className={inputCls}>
                  <option>index, follow</option>
                  <option>noindex, follow</option>
                  <option>index, nofollow</option>
                  <option>noindex, nofollow</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#fc0]/5 rounded-2xl border border-[#fc0]/10">
                <label className="text-[11px] font-black text-[#1a1a1a] uppercase tracking-wider">Include in Sitemap</label>
                <button
                  type="button"
                  onClick={() => dispatch(updatePageMeta({ inSitemap: !meta.inSitemap }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${meta.inSitemap ? 'bg-[#fc0]' : 'bg-black/10'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${meta.inSitemap ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div>
                <label className={labelCls}>Schema Code (JSON-LD)</label>
                <textarea value={meta.schemaCode} onChange={(e) => dispatch(updatePageMeta({ schemaCode: e.target.value }))} placeholder='{"@context": "https://schema.org", ...}' className={`${textareaCls} font-mono text-xs`} />
              </div>
            </>
          )}

          {tab === 'scripts' && (
            <>
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-xs text-amber-700 font-medium">
                ⚠ Scripts are injected into the page HTML. Be careful with untrusted code.
              </div>
              <div>
                <label className={labelCls}>Header Script (inside &lt;head&gt;)</label>
                <textarea value={meta.headerScript} onChange={(e) => dispatch(updatePageMeta({ headerScript: e.target.value }))} placeholder="<script>...</script>" className={`${textareaCls} font-mono text-xs`} />
              </div>
              <div>
                <label className={labelCls}>Body Script (after &lt;body&gt;)</label>
                <textarea value={meta.bodyScript} onChange={(e) => dispatch(updatePageMeta({ bodyScript: e.target.value }))} placeholder="<script>...</script>" className={`${textareaCls} font-mono text-xs`} />
              </div>
              <div>
                <label className={labelCls}>Footer Script (before &lt;/body&gt;)</label>
                <textarea value={meta.footerScript} onChange={(e) => dispatch(updatePageMeta({ footerScript: e.target.value }))} placeholder="<script>...</script>" className={`${textareaCls} font-mono text-xs`} />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-black/5 bg-[#fafafa] flex items-center justify-between shrink-0">
          <p className="text-[10px] text-black/20 font-bold uppercase tracking-wider">Changes apply when you Save Draft or Publish</p>
          <button onClick={onClose} className="px-6 py-2.5 text-xs font-black bg-[#1a1a1a] text-[#fc0] rounded-xl hover:bg-[#fc0] hover:text-[#1a1a1a] transition-all shadow-lg">
            Done
          </button>
        </div>
      </div>
    </div>
    <MediaPickerModal
      isOpen={mediaPicker?.isOpen || false}
      onClose={() => setMediaPicker(null)}
      onSelect={(url) => {
        mediaPicker?.onSelect(url);
        setMediaPicker(null);
      }}
    />
    </>
  );
}
