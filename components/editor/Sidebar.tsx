'use client';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { updateSectionData, updateSectionSettings, setSelectedSectionId, updatePageMeta, setTitle, setSlug } from '@/lib/redux/features/pageEditorSlice';
import { X, Layout, Type, Image as ImageIcon, ShoppingCart, Globe } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import MediaPickerModal from './MediaPickerModal';
import { defaultHowItWorksProcessPhases } from '@/components/sections/HowItWorksProcess';

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const selectedSectionId = useAppSelector((state) => state.pageEditor.selectedSectionId);
  const sections = useAppSelector((state) => state.pageEditor.sections);
  const { title, slug, meta } = useAppSelector((state) => state.pageEditor);
  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  const [mediaPicker, setMediaPicker] = useState<{
    isOpen: boolean;
    onSelect: (url: string) => void;
  } | null>(null);

  const openMediaPicker = (onSelect: (url: string) => void) => {
    setMediaPicker({ isOpen: true, onSelect });
  };

  const inputCls = "w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0]/40 focus:border-[#fc0] text-sm font-medium text-[#1a1a1a] transition placeholder:text-black/20";
  const labelCls = "text-[11px] font-black text-[#1a1a1a]/40 uppercase tracking-[0.15em] block mb-2";

  if (!selectedSection) {
    return (
      <>
        <div className="w-full flex flex-col h-full overflow-hidden bg-white font-[Poppins]">
          <div className="p-6 border-b border-black/5 flex items-center gap-3 bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <span className="p-2 bg-[#fc0] text-[#1a1a1a] rounded-xl shadow-lg shadow-[#fc0]/20">
              <Globe size={18} />
            </span>
            <div className="flex flex-col">
              <h2 className="font-black text-[#1a1a1a] text-sm tracking-tight">Page Settings</h2>
              <span className="text-[10px] text-black/40 font-bold uppercase tracking-wider">Title, SEO & Meta</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-hide">
            {/* Page Title */}
            <div>
              <label className={labelCls}>Page Title</label>
              <input type="text" value={title} onChange={(e) => dispatch(setTitle(e.target.value))} placeholder="Page Title" className={inputCls} />
            </div>

            {/* Slug */}
            <div>
              <label className={labelCls}>URL Slug</label>
              <div className="flex items-center rounded-xl border border-black/5 overflow-hidden bg-white">
                <span className="px-3 py-3 text-xs text-black/30 bg-[#fafafa] border-r border-black/5 font-bold">/</span>
                <input type="text" value={slug} onChange={(e) => dispatch(setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/(^-|-$)/g, '')))} placeholder="page-slug" className="flex-1 px-3 py-3 text-sm font-medium text-[#1a1a1a] bg-transparent outline-none" />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className={labelCls}>Status</label>
              <select value={meta.status} onChange={(e) => dispatch(updatePageMeta({ status: e.target.value }))} className={inputCls}>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 pt-2">
              <div className="h-px flex-1 bg-black/5" />
              <span className="text-[10px] font-black text-black/20 uppercase tracking-widest">SEO</span>
              <div className="h-px flex-1 bg-black/5" />
            </div>

            {/* Meta Title */}
            <div>
              <label className={labelCls}>Meta Title</label>
              <input type="text" value={meta.metaTitle} onChange={(e) => dispatch(updatePageMeta({ metaTitle: e.target.value }))} placeholder="SEO title" className={inputCls} />
              <p className="text-[10px] text-black/20 mt-1 font-bold">{(meta.metaTitle || '').length}/60</p>
            </div>

            {/* Meta Description */}
            <div>
              <label className={labelCls}>Meta Description</label>
              <textarea value={meta.metaDescription} onChange={(e) => dispatch(updatePageMeta({ metaDescription: e.target.value }))} placeholder="Brief description for search engines..." rows={3} className={`${inputCls} min-h-[80px] resize-none`} />
              <p className="text-[10px] text-black/20 mt-1 font-bold">{(meta.metaDescription || '').length}/160</p>
            </div>

            {/* Keywords */}
            <div>
              <label className={labelCls}>Keywords</label>
              <input type="text" value={meta.keywords} onChange={(e) => dispatch(updatePageMeta({ keywords: e.target.value }))} placeholder="keyword1, keyword2" className={inputCls} />
            </div>

            {/* Canonical */}
            <div>
              <label className={labelCls}>Canonical Link</label>
              <input type="url" value={meta.canonicalLink} onChange={(e) => dispatch(updatePageMeta({ canonicalLink: e.target.value }))} placeholder="https://..." className={inputCls} />
            </div>

            {/* Robots */}
            <div>
              <label className={labelCls}>Robots</label>
              <select value={meta.robotsText} onChange={(e) => dispatch(updatePageMeta({ robotsText: e.target.value }))} className={inputCls}>
                <option>index, follow</option>
                <option>noindex, follow</option>
                <option>index, nofollow</option>
                <option>noindex, nofollow</option>
              </select>
            </div>

            {/* Sitemap Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#fc0]/5 rounded-2xl border border-[#fc0]/10">
              <label className="text-[11px] font-black text-[#1a1a1a] uppercase tracking-wider">In Sitemap</label>
              <button type="button" onClick={() => dispatch(updatePageMeta({ inSitemap: !meta.inSitemap }))} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${meta.inSitemap ? 'bg-[#fc0]' : 'bg-black/10'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${meta.inSitemap ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* OG Image */}
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

            {/* Tip */}
            <div className="rounded-xl bg-[#fc0]/5 border border-[#fc0]/10 p-4 text-[11px] text-[#1a1a1a]/50 font-medium leading-relaxed">
              💡 Click any section on the canvas to edit its content. Use the ⚙️ toolbar button for scripts & schema.
            </div>
          </div>
        </div>
        <MediaPickerModal
          isOpen={mediaPicker?.isOpen || false}
          onClose={() => setMediaPicker(null)}
          onSelect={(url) => { mediaPicker?.onSelect(url); setMediaPicker(null); }}
        />
      </>
    );
  }

  const handleDataChange = (key: string, value: any) => {
    dispatch(updateSectionData({ id: selectedSection.id, data: { [key]: value } }));
  };

  const handleSettingChange = (key: string, value: any) => {
    dispatch(updateSectionSettings({ id: selectedSection.id, settings: { [key]: value } }));
  };

  return (
    <>
      <div className="w-full flex flex-col h-full overflow-hidden bg-white font-[Poppins]">
        <div className="p-6 border-b border-black/5 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-[#1a1a1a] text-[#FFE582] rounded-xl shadow-lg">
              {selectedSection.type === 'hero' && <Layout size={18} />}
              {selectedSection.type === 'text' && <Type size={18} />}
              {selectedSection.type === 'image' && <ImageIcon size={18} />}
              {selectedSection.type === 'buy-reviews' && <ShoppingCart size={18} />}
              {selectedSection.type === 'sitemap' && <Globe size={18} />}
              {['stats-bar', 'custom-platform', 'image-text'].includes(selectedSection.type) && <Layout size={18} />}
            </span>
            <div className="flex flex-col">
              <h2 className="font-black text-[#1a1a1a] capitalize text-sm tracking-tight">{selectedSection.type.replace(/-/g, ' ')}</h2>
              <span className="text-[10px] text-black/40 font-bold uppercase tracking-wider">Properties</span>
            </div>
          </div>
          <button
            onClick={() => dispatch(setSelectedSectionId(null))}
            className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/40 hover:text-black"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-12 scrollbar-hide">
          {/* Content Settings */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h3 className="text-[10px] font-black text-[#1a1a1a]/30 uppercase tracking-[0.2em] whitespace-nowrap">Content Setup</h3>
              <div className="h-px w-full bg-[#1a1a1a]/5" />
            </div>

            {selectedSection.type === 'hero' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Static Title Start</label>
                  <input
                    type="text"
                    value={selectedSection.data.staticTitle1 || ''}
                    onChange={(e) => handleDataChange('staticTitle1', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Bold Word</label>
                  <input
                    type="text"
                    value={selectedSection.data.staticTitleBold || ''}
                    onChange={(e) => handleDataChange('staticTitleBold', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    value={selectedSection.data.description || ''}
                    onChange={(e) => handleDataChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Typing Services (Comma separated)</label>
                  <textarea
                    value={(selectedSection.data.typingServices || []).join(', ')}
                    onChange={(e) => handleDataChange('typingServices', e.target.value.split(',').map(s => s.trim()))}
                    placeholder="Service 1, Service 2, Service 3"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  />
                </div>
              </>
            )}

            {selectedSection.type === 'image-text' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Title (HTML allowed)</label>
                  <input
                    type="text"
                    value={selectedSection.data.title || ''}
                    onChange={(e) => handleDataChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Content</label>
                  <RichTextEditor
                    content={selectedSection.data.content || ''}
                    onChange={(html) => handleDataChange('content', html)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedSection.data.image || ''}
                      onChange={(e) => handleDataChange('image', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker((url) => handleDataChange('image', url))}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors border border-slate-200 whitespace-nowrap"
                    >
                      Browse
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Image Position</label>
                  <select
                    value={selectedSection.data.imagePosition || 'right'}
                    onChange={(e) => handleDataChange('imagePosition', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#fc0]/5 rounded-2xl border border-[#fc0]/10">
                  <label className="text-[11px] font-black text-[#1a1a1a] uppercase tracking-wider">Show Button</label>
                  <button
                    onClick={() => handleDataChange('showButton', selectedSection.data.showButton === false ? true : false)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${selectedSection.data.showButton !== false ? 'bg-[#fc0]' : 'bg-black/10'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${selectedSection.data.showButton !== false ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
                {selectedSection.data.showButton !== false && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Button Text</label>
                      <input
                        type="text"
                        value={selectedSection.data.buttonText || ''}
                        onChange={(e) => handleDataChange('buttonText', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Button Link</label>
                      <input
                        type="text"
                        value={selectedSection.data.buttonLink || ''}
                        onChange={(e) => handleDataChange('buttonLink', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {selectedSection.type === 'blog-section' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Title</label>
                  <input
                    type="text"
                    value={selectedSection.data.title || ''}
                    onChange={(e) => handleDataChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Insights & Perspectives"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    value={selectedSection.data.description || ''}
                    onChange={(e) => handleDataChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Number of Posts</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={selectedSection.data.limit || 3}
                    onChange={(e) => handleDataChange('limit', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Button Text</label>
                  <input
                    type="text"
                    value={selectedSection.data.buttonText || ''}
                    onChange={(e) => handleDataChange('buttonText', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="View All Blogs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Button Link</label>
                  <input
                    type="text"
                    value={selectedSection.data.buttonLink || ''}
                    onChange={(e) => handleDataChange('buttonLink', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/blog"
                  />
                </div>
              </>
            )}

            {selectedSection.type === 'custom-platform' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Title</label>
                  <input
                    type="text"
                    value={selectedSection.data.title || ''}
                    onChange={(e) => handleDataChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    value={selectedSection.data.description || ''}
                    onChange={(e) => handleDataChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Button Text</label>
                  <input
                    type="text"
                    value={selectedSection.data.buttonText || ''}
                    onChange={(e) => handleDataChange('buttonText', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {selectedSection.type === 'text' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Content</label>
                  <RichTextEditor
                    content={selectedSection.data.content || ''}
                    onChange={(html) => handleDataChange('content', html)}
                  />
                </div>
                <button
                  onClick={() => {
                    const name = window.prompt("Enter a name for this custom template:");
                    if (name && name.trim()) {
                      const templates = JSON.parse(localStorage.getItem('grb_custom_templates') || '[]');
                      templates.push({
                        id: `custom_${Date.now()}`,
                        name: name.trim(),
                        content: selectedSection.data.content
                      });
                      localStorage.setItem('grb_custom_templates', JSON.stringify(templates));
                      alert("Template saved! You can now select it from the Add New Section menu.");
                    }
                  }}
                  className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-sm transition-colors border border-slate-200"
                >
                  Save as Reusable Template
                </button>
              </div>
            )}

            {selectedSection.type === 'image' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedSection.data.imageUrl || ''}
                      onChange={(e) => handleDataChange('imageUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker((url) => handleDataChange('imageUrl', url))}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors border border-slate-200 whitespace-nowrap"
                    >
                      Browse
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Alt Text</label>
                  <input
                    type="text"
                    value={selectedSection.data.alt || ''}
                    onChange={(e) => handleDataChange('alt', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {selectedSection.type === 'icon-grid' && (
              <>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Main Title (HTML)</label>
                  <input
                    type="text"
                    value={selectedSection.data.title || ''}
                    onChange={(e) => handleDataChange('title', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Subtitle</label>
                  <textarea
                    value={selectedSection.data.subtitle || ''}
                    onChange={(e) => handleDataChange('subtitle', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[100px]"
                  />
                </div>
                <div className="space-y-4 pt-4">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Features List</label>
                  {(selectedSection.data.features || []).map((feature: any, idx: number) => (
                    <div key={idx} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Icon URL"
                          value={feature.icon || ''}
                          onChange={(e) => {
                            const newFeatures = [...selectedSection.data.features];
                            newFeatures[idx] = { ...newFeatures[idx], icon: e.target.value };
                            handleDataChange('features', newFeatures);
                          }}
                          className="flex-1 min-w-0 px-3 py-2 text-xs border border-black/5 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => openMediaPicker((url) => {
                            const newFeatures = [...selectedSection.data.features];
                            newFeatures[idx] = { ...newFeatures[idx], icon: url };
                            handleDataChange('features', newFeatures);
                          })}
                          className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-[10px] transition-colors border border-slate-200 whitespace-nowrap"
                        >
                          Browse
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Title"
                        value={feature.title || ''}
                        onChange={(e) => {
                          const newFeatures = [...selectedSection.data.features];
                          newFeatures[idx] = { ...newFeatures[idx], title: e.target.value };
                          handleDataChange('features', newFeatures);
                        }}
                        className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg font-bold"
                      />
                      <textarea
                        placeholder="Description"
                        value={feature.description || ''}
                        onChange={(e) => {
                          const newFeatures = [...selectedSection.data.features];
                          newFeatures[idx] = { ...newFeatures[idx], description: e.target.value };
                          handleDataChange('features', newFeatures);
                        }}
                        className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedSection.type === 'faq-section' && (
              <>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Main Title</label>
                  <input
                    type="text"
                    value={selectedSection.data.title || ''}
                    onChange={(e) => handleDataChange('title', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Description</label>
                  <textarea
                    value={selectedSection.data.description || ''}
                    onChange={(e) => handleDataChange('description', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">CTA Title</label>
                  <input
                    type="text"
                    value={selectedSection.data.ctaTitle || ''}
                    onChange={(e) => handleDataChange('ctaTitle', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">CTA Description</label>
                  <textarea
                    value={selectedSection.data.ctaDescription || ''}
                    onChange={(e) => handleDataChange('ctaDescription', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">CTA Button Text</label>
                  <input
                    type="text"
                    value={selectedSection.data.ctaButtonText || ''}
                    onChange={(e) => handleDataChange('ctaButtonText', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">CTA Button Link</label>
                  <input
                    type="text"
                    value={selectedSection.data.ctaButtonLink || ''}
                    onChange={(e) => handleDataChange('ctaButtonLink', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                  />
                </div>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Questions & Answers</label>
                    <button
                      onClick={() => {
                        const newFaqs = [...(selectedSection.data.faqs || []), { q: 'New Question', a: 'New Answer' }];
                        handleDataChange('faqs', newFaqs);
                      }}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                    >
                      + Add Question
                    </button>
                  </div>
                  {(selectedSection.data.faqs || []).map((faq: any, idx: number) => (
                    <div key={idx} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3 relative group/item">
                      <button
                        onClick={() => {
                          const newFaqs = selectedSection.data.faqs.filter((_: any, i: number) => i !== idx);
                          handleDataChange('faqs', newFaqs);
                        }}
                        className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover/item:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                      <input
                        type="text"
                        placeholder="Question"
                        value={faq.q || ''}
                        onChange={(e) => {
                          const newFaqs = [...selectedSection.data.faqs];
                          newFaqs[idx] = { ...newFaqs[idx], q: e.target.value };
                          handleDataChange('faqs', newFaqs);
                        }}
                        className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg font-bold"
                      />
                      <textarea
                        placeholder="Answer"
                        value={faq.a || ''}
                        onChange={(e) => {
                          const newFaqs = [...selectedSection.data.faqs];
                          newFaqs[idx] = { ...newFaqs[idx], a: e.target.value };
                          handleDataChange('faqs', newFaqs);
                        }}
                        className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg min-h-[80px]"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedSection.type === 'stats-bar' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Main Title</label>
                  <input
                    type="text"
                    value={selectedSection.data.title || ''}
                    onChange={(e) => handleDataChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Subtitle</label>
                  <input
                    type="text"
                    value={selectedSection.data.subtitle || ''}
                    onChange={(e) => handleDataChange('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-4 pt-4">
                  <label className="text-sm font-bold text-slate-700 block">Stats Items</label>
                  {(selectedSection.data.stats || []).map((stat: any, idx: number) => (
                    <div key={idx} className="p-4 border border-slate-100 rounded-lg bg-slate-50 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase">Item #{idx + 1}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Target"
                          value={stat.target || ''}
                          onChange={(e) => {
                            const newStats = [...selectedSection.data.stats];
                            newStats[idx] = { ...newStats[idx], target: parseInt(e.target.value) };
                            handleDataChange('stats', newStats);
                          }}
                          className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                        />
                        <input
                          type="text"
                          placeholder="Suffix (+, %, etc)"
                          value={stat.suffix || ''}
                          onChange={(e) => {
                            const newStats = [...selectedSection.data.stats];
                            newStats[idx] = { ...newStats[idx], suffix: e.target.value };
                            handleDataChange('stats', newStats);
                          }}
                          className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Label"
                        value={stat.label || ''}
                        onChange={(e) => {
                          const newStats = [...selectedSection.data.stats];
                          newStats[idx] = { ...newStats[idx], label: e.target.value };
                          handleDataChange('stats', newStats);
                        }}
                        className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                      />
                      <textarea
                        placeholder="Description"
                        value={stat.description || ''}
                        onChange={(e) => {
                          const newStats = [...selectedSection.data.stats];
                          newStats[idx] = { ...newStats[idx], description: e.target.value };
                          handleDataChange('stats', newStats);
                        }}
                        className="w-full px-2 py-1 text-sm border border-slate-200 rounded min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedSection.type === 'rating-calculator' && (
              <>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Main Title (HTML)</label>
                  <input
                    type="text"
                    value={selectedSection.data.title || ''}
                    onChange={(e) => handleDataChange('title', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Description</label>
                  <textarea
                    value={selectedSection.data.description || ''}
                    onChange={(e) => handleDataChange('description', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[100px]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Calculator Title</label>
                  <input
                    type="text"
                    value={selectedSection.data.calculatorTitle || ''}
                    onChange={(e) => handleDataChange('calculatorTitle', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                  />
                </div>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Feature Pills / Facts</label>
                    <button
                      onClick={() => {
                        const newPills = [...(selectedSection.data.pills || []), { num: '99%', text: 'New Fact' }];
                        handleDataChange('pills', newPills);
                      }}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                    >
                      + Add Pill
                    </button>
                  </div>
                  {(selectedSection.data.pills || []).map((pill: any, idx: number) => (
                    <div key={idx} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3 relative group/item">
                      <button
                        onClick={() => {
                          const newPills = selectedSection.data.pills.filter((_: any, i: number) => i !== idx);
                          handleDataChange('pills', newPills);
                        }}
                        className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover/item:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                      <input
                        type="text"
                        placeholder="Number/Stat (e.g. 98%)"
                        value={pill.num || ''}
                        onChange={(e) => {
                          const newPills = [...selectedSection.data.pills];
                          newPills[idx] = { ...newPills[idx], num: e.target.value };
                          handleDataChange('pills', newPills);
                        }}
                        className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg font-bold"
                      />
                      <textarea
                        placeholder="Fact Text"
                        value={pill.text || ''}
                        onChange={(e) => {
                          const newPills = [...selectedSection.data.pills];
                          newPills[idx] = { ...newPills[idx], text: e.target.value };
                          handleDataChange('pills', newPills);
                        }}
                        className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedSection.type === 'rating-stats-bar' && (
              <>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Main Title (HTML)</label>
                  <input
                    type="text"
                    value={selectedSection.data.title || ''}
                    onChange={(e) => handleDataChange('title', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                  />
                </div>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Stats Items</label>
                    <button
                      onClick={() => {
                        const newStats = [...(selectedSection.data.stats || []), { num: '100', suffix: '+', label: 'New Stat' }];
                        handleDataChange('stats', newStats);
                      }}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                    >
                      + Add Stat
                    </button>
                  </div>
                  {(selectedSection.data.stats || []).map((stat: any, idx: number) => (
                    <div key={idx} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3 relative group/item">
                      <button
                        onClick={() => {
                          const newStats = selectedSection.data.stats.filter((_: any, i: number) => i !== idx);
                          handleDataChange('stats', newStats);
                        }}
                        className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover/item:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Number"
                          value={stat.num || ''}
                          onChange={(e) => {
                            const newStats = [...selectedSection.data.stats];
                            newStats[idx] = { ...newStats[idx], num: e.target.value };
                            handleDataChange('stats', newStats);
                          }}
                          className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Suffix"
                          value={stat.suffix || ''}
                          onChange={(e) => {
                            const newStats = [...selectedSection.data.stats];
                            newStats[idx] = { ...newStats[idx], suffix: e.target.value };
                            handleDataChange('stats', newStats);
                          }}
                          className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg"
                        />
                      </div>
                      <textarea
                        placeholder="Label"
                        value={stat.label || ''}
                        onChange={(e) => {
                          const newStats = [...selectedSection.data.stats];
                          newStats[idx] = { ...newStats[idx], label: e.target.value };
                          handleDataChange('stats', newStats);
                        }}
                        className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedSection.type === 'rating-cta' && (
              <>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Main Title (HTML)</label>
                  <input
                    type="text"
                    value={selectedSection.data.title || ''}
                    onChange={(e) => handleDataChange('title', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Description</label>
                  <textarea
                    value={selectedSection.data.description || ''}
                    onChange={(e) => handleDataChange('description', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Button Text</label>
                  <input
                    type="text"
                    value={selectedSection.data.buttonText || ''}
                    onChange={(e) => handleDataChange('buttonText', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Button Link</label>
                  <input
                    type="text"
                    value={selectedSection.data.buttonLink || ''}
                    onChange={(e) => handleDataChange('buttonLink', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                  />
                </div>
              </>
            )}

            {selectedSection.type === 'buy-reviews' && (
              <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-600 italic">
                The product grid pulls data automatically from your products list.
              </div>
            )}

            {selectedSection.type === 'refund-policy-section' && (
              <>
                {/* When Refunds May Apply */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">When Refunds May Apply</label>
                    <button
                      onClick={() => {
                        const newItems = [...(selectedSection.data.whenRefunds || []), { title: 'New Title', body: 'New Description' }];
                        handleDataChange('whenRefunds', newItems);
                      }}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                    >
                      + Add Item
                    </button>
                  </div>
                  {(selectedSection.data.whenRefunds || []).map((item: any, idx: number) => (
                    <div key={`wr-${idx}`} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3 relative group/item">
                      <button
                        onClick={() => {
                          const newItems = selectedSection.data.whenRefunds.filter((_: any, i: number) => i !== idx);
                          handleDataChange('whenRefunds', newItems);
                        }}
                        className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover/item:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                      <input
                        type="text"
                        placeholder="Title"
                        value={item.title || ''}
                        onChange={(e) => {
                          const newItems = [...selectedSection.data.whenRefunds];
                          newItems[idx] = { ...newItems[idx], title: e.target.value };
                          handleDataChange('whenRefunds', newItems);
                        }}
                        className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg font-bold"
                      />
                      <textarea
                        placeholder="Body text"
                        value={item.body || ''}
                        onChange={(e) => {
                          const newItems = [...selectedSection.data.whenRefunds];
                          newItems[idx] = { ...newItems[idx], body: e.target.value };
                          handleDataChange('whenRefunds', newItems);
                        }}
                        className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>

                {/* Not Eligible List */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Situations Where Refunds May Not Apply</label>
                    <button
                      onClick={() => {
                        const newItems = [...(selectedSection.data.notEligible || []), 'New condition'];
                        handleDataChange('notEligible', newItems);
                      }}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                    >
                      + Add Item
                    </button>
                  </div>
                  {(selectedSection.data.notEligible || []).map((item: string, idx: number) => (
                    <div key={`ne-${idx}`} className="flex items-center gap-2 relative group/item">
                      <input
                        type="text"
                        value={item || ''}
                        onChange={(e) => {
                          const newItems = [...selectedSection.data.notEligible];
                          newItems[idx] = e.target.value;
                          handleDataChange('notEligible', newItems);
                        }}
                        className="flex-1 px-3 py-2 text-xs border border-black/5 rounded-lg"
                      />
                      <button
                        onClick={() => {
                          const newItems = selectedSection.data.notEligible.filter((_: any, i: number) => i !== idx);
                          handleDataChange('notEligible', newItems);
                        }}
                        className="p-2 text-red-400 hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Compliance List */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Acceptable Use & Compliance</label>
                    <button
                      onClick={() => {
                        const newItems = [...(selectedSection.data.compliance || []), 'New rule'];
                        handleDataChange('compliance', newItems);
                      }}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                    >
                      + Add Rule
                    </button>
                  </div>
                  {(selectedSection.data.compliance || []).map((item: string, idx: number) => (
                    <div key={`c-${idx}`} className="flex items-center gap-2 relative group/item">
                      <input
                        type="text"
                        value={item || ''}
                        onChange={(e) => {
                          const newItems = [...selectedSection.data.compliance];
                          newItems[idx] = e.target.value;
                          handleDataChange('compliance', newItems);
                        }}
                        className="flex-1 px-3 py-2 text-xs border border-black/5 rounded-lg"
                      />
                      <button
                        onClick={() => {
                          const newItems = selectedSection.data.compliance.filter((_: any, i: number) => i !== idx);
                          handleDataChange('compliance', newItems);
                        }}
                        className="p-2 text-red-400 hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Steps */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">How to Request Steps</label>
                    <button
                      onClick={() => {
                        const newSteps = [...(selectedSection.data.steps || []), { step: 'Step X', title: 'New Step', desc: 'Step description' }];
                        handleDataChange('steps', newSteps);
                      }}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                    >
                      + Add Step
                    </button>
                  </div>
                  {(selectedSection.data.steps || []).map((s: any, idx: number) => (
                    <div key={`s-${idx}`} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3 relative group/item">
                      <button
                        onClick={() => {
                          const newSteps = selectedSection.data.steps.filter((_: any, i: number) => i !== idx);
                          handleDataChange('steps', newSteps);
                        }}
                        className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover/item:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Step Prefix (e.g. Step 1)"
                          value={s.step || ''}
                          onChange={(e) => {
                            const newSteps = [...selectedSection.data.steps];
                            newSteps[idx] = { ...newSteps[idx], step: e.target.value };
                            handleDataChange('steps', newSteps);
                          }}
                          className="w-1/3 px-3 py-2 text-xs border border-black/5 rounded-lg font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Title"
                          value={s.title || ''}
                          onChange={(e) => {
                            const newSteps = [...selectedSection.data.steps];
                            newSteps[idx] = { ...newSteps[idx], title: e.target.value };
                            handleDataChange('steps', newSteps);
                          }}
                          className="w-2/3 px-3 py-2 text-xs border border-black/5 rounded-lg font-bold"
                        />
                      </div>
                      <textarea
                        placeholder="Description"
                        value={s.desc || ''}
                        onChange={(e) => {
                          const newSteps = [...selectedSection.data.steps];
                          newSteps[idx] = { ...newSteps[idx], desc: e.target.value };
                          handleDataChange('steps', newSteps);
                        }}
                        className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="space-y-4 pt-4">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Contact & Footer Settings</label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Contact Image URL"
                        value={selectedSection.data.contactImage || ''}
                        onChange={(e) => handleDataChange('contactImage', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => openMediaPicker((url) => handleDataChange('contactImage', url))}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors border border-slate-200 whitespace-nowrap"
                      >
                        Browse
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Contact Email"
                      value={selectedSection.data.contactEmail || ''}
                      onChange={(e) => handleDataChange('contactEmail', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Contact Phone"
                      value={selectedSection.data.contactPhone || ''}
                      onChange={(e) => handleDataChange('contactPhone', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Average Response Time"
                      value={selectedSection.data.contactTime || ''}
                      onChange={(e) => handleDataChange('contactTime', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Footer Date (e.g. Last Updated: May 2026)"
                      value={selectedSection.data.footerDate || ''}
                      onChange={(e) => handleDataChange('footerDate', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg"
                    />
                  </div>
                </div>
              </>
            )}

            {selectedSection.type === 'how-it-work-card' && (
              <>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Heading</label>
                  <input
                    type="text"
                    value={selectedSection.data.heading || ''}
                    onChange={(e) => handleDataChange('heading', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Subheading</label>
                  <textarea
                    value={selectedSection.data.subheading || ''}
                    onChange={(e) => handleDataChange('subheading', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]"
                  />
                </div>
                <div className="space-y-4 pt-2">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Steps</label>
                  {(selectedSection.data.steps || []).map((step: any, idx: number) => (
                    <div key={idx} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3">
                      <span className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase">Step {idx + 1}</span>
                      <input
                        type="text"
                        placeholder="Icon (emoji)"
                        value={step.icon || ''}
                        onChange={(e) => {
                          const updated = [...selectedSection.data.steps];
                          updated[idx] = { ...updated[idx], icon: e.target.value };
                          handleDataChange('steps', updated);
                        }}
                        className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Title"
                        value={step.title || ''}
                        onChange={(e) => {
                          const updated = [...selectedSection.data.steps];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          handleDataChange('steps', updated);
                        }}
                        className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg font-bold"
                      />
                      <textarea
                        placeholder="Description"
                        value={step.desc || ''}
                        onChange={(e) => {
                          const updated = [...selectedSection.data.steps];
                          updated[idx] = { ...updated[idx], desc: e.target.value };
                          handleDataChange('steps', updated);
                        }}
                        className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg min-h-[60px]"
                      />
                      <select
                        value={step.color || 'bg-yellow-100'}
                        onChange={(e) => {
                          const updated = [...selectedSection.data.steps];
                          updated[idx] = { ...updated[idx], color: e.target.value };
                          handleDataChange('steps', updated);
                        }}
                        className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg"
                      >
                        <option value="bg-yellow-100">Yellow</option>
                        <option value="bg-blue-100">Blue</option>
                        <option value="bg-green-100">Green</option>
                        <option value="bg-indigo-100">Indigo</option>
                        <option value="bg-red-100">Red</option>
                        <option value="bg-pink-100">Pink</option>
                        <option value="bg-purple-100">Purple</option>
                        <option value="bg-orange-100">Orange</option>
                      </select>
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedSection.type === 'benefits-section' && (
              <>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Heading</label>
                  <input
                    type="text"
                    value={selectedSection.data.heading || ''}
                    onChange={(e) => handleDataChange('heading', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Subheading</label>
                  <textarea
                    value={selectedSection.data.subheading || ''}
                    onChange={(e) => handleDataChange('subheading', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Center Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedSection.data.centerImage || ''}
                      onChange={(e) => handleDataChange('centerImage', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker((url) => handleDataChange('centerImage', url))}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors border border-slate-200 whitespace-nowrap"
                    >
                      Browse
                    </button>
                  </div>
                </div>
                <div className="space-y-4 pt-2">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Benefits Cards (Max 4)</label>
                  {(selectedSection.data.benefits || []).map((benefit: any, idx: number) => (
                    <div key={idx} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3">
                      <span className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase">Benefit {idx + 1}</span>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="col-span-1">
                          <input
                            placeholder="Badge"
                            value={benefit.badge || ''}
                            onChange={(e) => {
                              const updated = [...selectedSection.data.benefits];
                              updated[idx] = { ...updated[idx], badge: e.target.value };
                              handleDataChange('benefits', updated);
                            }}
                            className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg text-center"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            placeholder="Title"
                            value={benefit.title || ''}
                            onChange={(e) => {
                              const updated = [...selectedSection.data.benefits];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              handleDataChange('benefits', updated);
                            }}
                            className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg font-bold"
                          />
                        </div>
                      </div>
                      <textarea
                        placeholder="Description"
                        value={benefit.description || ''}
                        onChange={(e) => {
                          const updated = [...selectedSection.data.benefits];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          handleDataChange('benefits', updated);
                        }}
                        className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedSection.type === 'safe-reviews-carousel' && (
              <>
                {/* Slide Selector */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Editing Slide</label>
                  <div className="flex gap-2">
                    {(selectedSection.data.slides || []).map((_: any, idx: number) => {
                      const isEditingThisSlide = (selectedSection.data._activeEditIdx ?? 0) === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleDataChange('_activeEditIdx', idx)}
                          className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${isEditingThisSlide
                              ? "bg-[#fc0] text-[#1a1a1a] border-[#fc0] shadow-sm"
                              : "bg-white text-gray-500 border-black/5 hover:bg-black/5"
                            }`}
                        >
                          Slide {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {(() => {
                  const activeSlideIdx = selectedSection.data._activeEditIdx ?? 0;
                  const slide = (selectedSection.data.slides || [])[activeSlideIdx];
                  if (!slide) return <p className="text-xs text-red-500 font-bold">No slides found. Click to add a section with template data.</p>;

                  const handleActiveSlideChange = (field: string, val: any) => {
                    const updatedSlides = [...selectedSection.data.slides];
                    updatedSlides[activeSlideIdx] = { ...updatedSlides[activeSlideIdx], [field]: val };
                    handleDataChange('slides', updatedSlides);
                  };

                  const handleActiveFeatChange = (featIdx: number, field: string, val: string) => {
                    const updatedFeatures = [...(slide.features || [])];
                    updatedFeatures[featIdx] = { ...updatedFeatures[featIdx], [field]: val };
                    handleActiveSlideChange('features', updatedFeatures);
                  };

                  return (
                    <div className="space-y-6 pt-4 border-t border-black/5">
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Slide Heading</label>
                        <input
                          type="text"
                          value={slide.heading || ''}
                          onChange={(e) => handleActiveSlideChange('heading', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Subheading</label>
                        <textarea
                          value={slide.subheading || ''}
                          onChange={(e) => handleActiveSlideChange('subheading', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">List Header</label>
                        <input
                          type="text"
                          value={slide.listTitle || ''}
                          onChange={(e) => handleActiveSlideChange('listTitle', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Showcase Image URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={slide.image || ''}
                            onChange={(e) => handleActiveSlideChange('image', e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => openMediaPicker((url) => handleActiveSlideChange('image', url))}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors border border-slate-200 whitespace-nowrap"
                          >
                            Browse
                          </button>
                        </div>
                      </div>

                      {/* Features list edits */}
                      <div className="space-y-4 pt-2">
                        <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Slide Bullet Points</label>
                        {(slide.features || []).map((feature: any, featIdx: number) => (
                          <div key={featIdx} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3">
                            <span className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase">Bullet #{featIdx + 1}</span>
                            <input
                              placeholder="Title"
                              value={feature.title || ''}
                              onChange={(e) => handleActiveFeatChange(featIdx, 'title', e.target.value)}
                              className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg font-bold"
                            />
                            <textarea
                              placeholder="Description"
                              value={feature.desc || ''}
                              onChange={(e) => handleActiveFeatChange(featIdx, 'desc', e.target.value)}
                              className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg min-h-[60px]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </>
            )}

            {selectedSection.type === 'organic-drawbacks' && (() => {
              interface DrawbackCard {
                title: string;
                iconType: string;
                iconImage?: string;
                paragraphs: string[];
              }
              const cards = (selectedSection.data.cards || []) as DrawbackCard[];
              return (
                <>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Heading</label>
                    <input
                      type="text"
                      value={selectedSection.data.heading ?? ''}
                      onChange={(e) => handleDataChange('heading', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                      placeholder="Section Heading"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Subheading</label>
                    <textarea
                      value={selectedSection.data.subheading ?? ''}
                      onChange={(e) => handleDataChange('subheading', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]"
                      placeholder="Section Subheading..."
                    />
                  </div>
                  <div className="space-y-4 pt-2">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Drawback Cards</label>
                    {cards.map((card: DrawbackCard, cardIdx: number) => (
                      <div key={cardIdx} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase">Card #{cardIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = cards.filter((_: DrawbackCard, i: number) => i !== cardIdx);
                              handleDataChange('cards', updated);
                            }}
                            className="text-xs text-red-500 hover:text-red-700 font-bold cursor-pointer"
                          >
                            Delete Card
                          </button>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-[#1a1a1a]/40 uppercase tracking-wider block">Title</label>
                          <input
                            placeholder="Title"
                            value={card.title || ''}
                            onChange={(e) => {
                              const updated = [...cards];
                              updated[cardIdx] = { ...updated[cardIdx], title: e.target.value };
                              handleDataChange('cards', updated);
                            }}
                            className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg font-bold bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-[#1a1a1a]/40 uppercase tracking-wider block">Icon Type</label>
                          <select
                            value={card.iconType || 'warning'}
                            onChange={(e) => {
                              const updated = [...cards];
                              updated[cardIdx] = { ...updated[cardIdx], iconType: e.target.value };
                              handleDataChange('cards', updated);
                            }}
                            className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg bg-white"
                          >
                            <option value="warning">Warning / Shield</option>
                            <option value="chart">Growth Chart</option>
                            <option value="competition">Competition Graph</option>
                            <option value="custom">Custom PNG Image</option>
                          </select>
                        </div>

                        {card.iconType === 'custom' && (
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-[#1a1a1a]/40 uppercase tracking-wider block">Custom PNG Icon</label>
                            <div className="flex gap-2 w-full">
                              <input
                                className="flex-1 min-w-0 px-3 py-2 bg-white text-gray-800 rounded-lg text-xs border border-black/5 outline-none focus:ring-2 focus:ring-[#fc0]"
                                value={card.iconImage || ''}
                                onChange={(e) => {
                                  const updated = [...cards];
                                  updated[cardIdx] = { ...updated[cardIdx], iconImage: e.target.value };
                                  handleDataChange('cards', updated);
                                }}
                                placeholder="Image URL..."
                              />
                              <button
                                type="button"
                                onClick={() => openMediaPicker((url) => {
                                  const updated = [...cards];
                                  updated[cardIdx] = { ...updated[cardIdx], iconImage: url };
                                  handleDataChange('cards', updated);
                                })}
                                className="px-3 py-2 bg-[#fc0] hover:bg-[#e6bb00] text-slate-900 rounded-lg font-bold text-xs transition shrink-0 cursor-pointer"
                              >
                                Browse
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-[#1a1a1a]/40 uppercase tracking-wider block">Paragraphs</label>
                          {(card.paragraphs || []).map((p: string, pIdx: number) => (
                            <textarea
                              key={pIdx}
                              placeholder={`Paragraph ${pIdx + 1}`}
                              value={p || ''}
                              onChange={(e) => {
                                const updatedCards = [...cards];
                                const updatedParagraphs = [...(card.paragraphs || [])];
                                updatedParagraphs[pIdx] = e.target.value;
                                updatedCards[cardIdx] = { ...updatedCards[cardIdx], paragraphs: updatedParagraphs };
                                handleDataChange('cards', updatedCards);
                              }}
                              className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg min-h-[60px] bg-white"
                            />
                          ))}

                          <div className="flex justify-between gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                const updatedCards = [...cards];
                                const updatedParagraphs = [...(card.paragraphs || [])];
                                updatedParagraphs.push("");
                                updatedCards[cardIdx] = { ...updatedCards[cardIdx], paragraphs: updatedParagraphs };
                                handleDataChange('cards', updatedCards);
                              }}
                              className="text-[10px] text-[#fc0] hover:text-[#e6bb00] font-black cursor-pointer"
                            >
                              + Add Paragraph
                            </button>
                            {(card.paragraphs || []).length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedCards = [...cards];
                                  const updatedParagraphs = (card.paragraphs || []).slice(0, -1);
                                  updatedCards[cardIdx] = { ...updatedCards[cardIdx], paragraphs: updatedParagraphs };
                                  handleDataChange('cards', updatedCards);
                                }}
                                className="text-[10px] text-red-500 hover:text-red-700 font-bold cursor-pointer"
                              >
                                - Remove Paragraph
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...cards];
                        updated.push({
                          title: "New Drawback Card",
                          iconType: "warning",
                          paragraphs: ["Drawback description paragraph."]
                        });
                        handleDataChange('cards', updated);
                      }}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition border border-slate-200 cursor-pointer"
                    >
                      + Add Drawback Card
                    </button>
                  </div>
                </>
              );
            })()}

            {selectedSection.type === 'customer-reviews' && (
              <>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Heading</label>
                  <input type="text" value={selectedSection.data.heading || ''} onChange={(e) => handleDataChange('heading', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Subheading</label>
                  <textarea value={selectedSection.data.subheading || ''} onChange={(e) => handleDataChange('subheading', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]" />
                </div>
                <div className="space-y-4 pt-2">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Reviews</label>
                  {(selectedSection.data.reviews || []).map((review: any, idx: number) => (
                    <div key={idx} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3">
                      <span className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase">Review {idx + 1}</span>
                      <textarea placeholder="Review text" value={review.text || ''} onChange={(e) => { const u = [...selectedSection.data.reviews]; u[idx] = { ...u[idx], text: e.target.value }; handleDataChange('reviews', u); }} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg min-h-[80px]" />
                      <input placeholder="Name" value={review.name || ''} onChange={(e) => { const u = [...selectedSection.data.reviews]; u[idx] = { ...u[idx], name: e.target.value }; handleDataChange('reviews', u); }} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg font-bold" />
                      <input placeholder="Date" value={review.date || ''} onChange={(e) => { const u = [...selectedSection.data.reviews]; u[idx] = { ...u[idx], date: e.target.value }; handleDataChange('reviews', u); }} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg" />
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedSection.type === 'steps' && (
              <>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Heading</label>
                  <textarea value={selectedSection.data.heading || ''} onChange={(e) => handleDataChange('heading', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Subheading</label>
                  <textarea value={selectedSection.data.subheading || ''} onChange={(e) => handleDataChange('subheading', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]" />
                </div>
                <div className="space-y-4 pt-2">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Steps</label>
                  {(selectedSection.data.steps || []).map((step: any, idx: number) => (
                    <div key={idx} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3">
                      <span className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase">Step {idx + 1}</span>
                      <input placeholder="Step label (e.g. STEP 01)" value={step.step || ''} onChange={(e) => { const u = [...selectedSection.data.steps]; u[idx] = { ...u[idx], step: e.target.value }; handleDataChange('steps', u); }} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg" />
                      <input placeholder="Title" value={step.title || ''} onChange={(e) => { const u = [...selectedSection.data.steps]; u[idx] = { ...u[idx], title: e.target.value }; handleDataChange('steps', u); }} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg font-bold" />
                      <textarea placeholder="Description" value={step.desc || ''} onChange={(e) => { const u = [...selectedSection.data.steps]; u[idx] = { ...u[idx], desc: e.target.value }; handleDataChange('steps', u); }} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg min-h-[60px]" />
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedSection.type === 'cta-product' && (
              <>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Heading</label>
                  <textarea value={selectedSection.data.heading || ''} onChange={(e) => handleDataChange('heading', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Subheading</label>
                  <textarea value={selectedSection.data.subheading || ''} onChange={(e) => handleDataChange('subheading', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Button Text</label>
                  <input type="text" value={selectedSection.data.buttonText || ''} onChange={(e) => handleDataChange('buttonText', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Button Link</label>
                  <input type="text" value={selectedSection.data.buttonLink || ''} onChange={(e) => handleDataChange('buttonLink', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium" placeholder="#" />
                </div>
                <div className="space-y-4 pt-2">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Floating Icons</label>
                  {(selectedSection.data.icons || []).map((icon: any, idx: number) => (
                    <div key={idx} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3">
                      <span className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase">Icon {idx + 1}</span>
                      <div className="flex gap-2">
                        <input
                          placeholder="Image URL"
                          value={icon.src || ''}
                          onChange={(e) => {
                            const u = [...selectedSection.data.icons];
                            u[idx] = { ...u[idx], src: e.target.value };
                            handleDataChange('icons', u);
                          }}
                          className="flex-1 min-w-0 px-3 py-2 text-xs border border-black/5 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => openMediaPicker((url) => {
                            const u = [...selectedSection.data.icons];
                            u[idx] = { ...u[idx], src: url };
                            handleDataChange('icons', u);
                          })}
                          className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-[10px] transition-colors border border-slate-200 whitespace-nowrap"
                        >
                          Browse
                        </button>
                      </div>
                      <input placeholder="Position class (e.g. top-20 left-10)" value={icon.className || ''} onChange={(e) => { const u = [...selectedSection.data.icons]; u[idx] = { ...u[idx], className: e.target.value }; handleDataChange('icons', u); }} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg" />
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedSection.type === 'productbanner' && (
              <>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Product ID</label>
                  <input
                    type="text"
                    value={selectedSection.data.productId || ''}
                    onChange={(e) => handleDataChange('productId', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                    placeholder="e.g. google-reviews"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    value={selectedSection.data.title || ''}
                    onChange={(e) => handleDataChange('title', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                    placeholder="Buy Google Reviews"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Description</label>
                  <textarea
                    value={selectedSection.data.description || ''}
                    onChange={(e) => handleDataChange('description', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[100px]"
                    placeholder="Improve your business's online reputation..."
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedSection.data.image || ''}
                      onChange={(e) => handleDataChange('image', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker((url) => handleDataChange('image', url))}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors border border-slate-200 whitespace-nowrap"
                    >
                      Browse
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Rating Text</label>
                  <input
                    type="text"
                    value={selectedSection.data.ratingText || ''}
                    onChange={(e) => handleDataChange('ratingText', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                    placeholder="4.9 (11 verified Customer Reviews)"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Price Per Review ($)</label>
                  <input
                    type="number"
                    value={selectedSection.data.pricePerReview || 15}
                    onChange={(e) => handleDataChange('pricePerReview', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                    placeholder="15"
                  />
                </div>

                {/* Checklist items section */}
                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Checklist Items</label>
                    <button
                      onClick={() => {
                        const currentChecklist = selectedSection.data.checklist || [
                          "Real, verified accounts — no bots or fakes",
                          "Gradual drip-feed for natural-looking growth",
                          "Custom written content tailored to your brand",
                          "Free replacements within 30 days"
                        ];
                        const newChecklist = [...currentChecklist, "New checklist item"];
                        handleDataChange('checklist', newChecklist);
                      }}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                    >
                      + Add Item
                    </button>
                  </div>
                  {(selectedSection.data.checklist || [
                    "Real, verified accounts — no bots or fakes",
                    "Gradual drip-feed for natural-looking growth",
                    "Custom written content tailored to your brand",
                    "Free replacements within 30 days"
                  ]).map((item: string, idx: number) => (
                    <div key={idx} className="flex gap-2 items-center relative group/item">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newChecklist = [...(selectedSection.data.checklist || [
                            "Real, verified accounts — no bots or fakes",
                            "Gradual drip-feed for natural-looking growth",
                            "Custom written content tailored to your brand",
                            "Free replacements within 30 days"
                          ])];
                          newChecklist[idx] = e.target.value;
                          handleDataChange('checklist', newChecklist);
                        }}
                        className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg font-medium"
                      />
                      <button
                        onClick={() => {
                          const newChecklist = (selectedSection.data.checklist || [
                            "Real, verified accounts — no bots or fakes",
                            "Gradual drip-feed for natural-looking growth",
                            "Custom written content tailored to your brand",
                            "Free replacements within 30 days"
                          ]).filter((_: any, i: number) => i !== idx);
                          handleDataChange('checklist', newChecklist);
                        }}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Stats Cards Section */}
                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Stats Cards</label>
                    <button
                      onClick={() => {
                        const currentStats = selectedSection.data.stats || [
                          { img: "/uploads/media/1781499499702-738565c9-f87d-403e-9e60-0dbd3ee00f71-Vector-1-.svg", val: "10K+", lbl: "Happy Clients" },
                          { img: "/uploads/media/1781499507867-a4c5174e-3a63-4316-83b4-13af71e98937-diagram-2.svg", val: "99%", lbl: "Retention" },
                          { img: "/uploads/media/1781499520046-54ff665e-db79-4218-9d0f-ba3e1ef89cbf-Group-1000006419.svg", val: "100%", lbl: "Safe & secure" }
                        ];
                        const newStats = [...currentStats, { img: "/uploads/media/1781499499702-738565c9-f87d-403e-9e60-0dbd3ee00f71-Vector-1-.svg", val: "10K+", lbl: "New Stat" }];
                        handleDataChange('stats', newStats);
                      }}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                    >
                      + Add Stat
                    </button>
                  </div>
                  {(selectedSection.data.stats || [
                    { img: "/uploads/media/1781499499702-738565c9-f87d-403e-9e60-0dbd3ee00f71-Vector-1-.svg", val: "10K+", lbl: "Happy Clients" },
                    { img: "/uploads/media/1781499507867-a4c5174e-3a63-4316-83b4-13af71e98937-diagram-2.svg", val: "99%", lbl: "Retention" },
                    { img: "/uploads/media/1781499520046-54ff665e-db79-4218-9d0f-ba3e1ef89cbf-Group-1000006419.svg", val: "100%", lbl: "Safe & secure" }
                  ]).map((stat: any, idx: number) => (
                    <div key={idx} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3 relative group/item">
                      <button
                        onClick={() => {
                          const newStats = (selectedSection.data.stats || [
                            { img: "/uploads/media/1781499499702-738565c9-f87d-403e-9e60-0dbd3ee00f71-Vector-1-.svg", val: "10K+", lbl: "Happy Clients" },
                            { img: "/uploads/media/1781499507867-a4c5174e-3a63-4316-83b4-13af71e98937-diagram-2.svg", val: "99%", lbl: "Retention" },
                            { img: "/uploads/media/1781499520046-54ff665e-db79-4218-9d0f-ba3e1ef89cbf-Group-1000006419.svg", val: "100%", lbl: "Safe & secure" }
                          ]).filter((_: any, i: number) => i !== idx);
                          handleDataChange('stats', newStats);
                        }}
                        className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover/item:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Icon Image URL"
                          value={stat.img || ''}
                          onChange={(e) => {
                            const newStats = [...(selectedSection.data.stats || [
                              { img: "/uploads/media/1781499499702-738565c9-f87d-403e-9e60-0dbd3ee00f71-Vector-1-.svg", val: "10K+", lbl: "Happy Clients" },
                              { img: "/uploads/media/1781499507867-a4c5174e-3a63-4316-83b4-13af71e98937-diagram-2.svg", val: "99%", lbl: "Retention" },
                              { img: "/uploads/media/1781499520046-54ff665e-db79-4218-9d0f-ba3e1ef89cbf-Group-1000006419.svg", val: "100%", lbl: "Safe & secure" }
                            ])];
                            newStats[idx] = { ...newStats[idx], img: e.target.value };
                            handleDataChange('stats', newStats);
                          }}
                          className="flex-1 min-w-0 px-3 py-2 text-xs border border-black/5 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => openMediaPicker((url) => {
                            const newStats = [...(selectedSection.data.stats || [
                              { img: "/uploads/media/1781499499702-738565c9-f87d-403e-9e60-0dbd3ee00f71-Vector-1-.svg", val: "10K+", lbl: "Happy Clients" },
                              { img: "/uploads/media/1781499507867-a4c5174e-3a63-4316-83b4-13af71e98937-diagram-2.svg", val: "99%", lbl: "Retention" },
                              { img: "/uploads/media/1781499520046-54ff665e-db79-4218-9d0f-ba3e1ef89cbf-Group-1000006419.svg", val: "100%", lbl: "Safe & secure" }
                            ])];
                            newStats[idx] = { ...newStats[idx], img: url };
                            handleDataChange('stats', newStats);
                          })}
                          className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-[10px] transition-colors border border-slate-200 whitespace-nowrap"
                        >
                          Browse
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Value (e.g. 10K+)"
                          value={stat.val || ''}
                          onChange={(e) => {
                            const newStats = [...(selectedSection.data.stats || [
                              { img: "/uploads/media/1781499499702-738565c9-f87d-403e-9e60-0dbd3ee00f71-Vector-1-.svg", val: "10K+", lbl: "Happy Clients" },
                              { img: "/uploads/media/1781499507867-a4c5174e-3a63-4316-83b4-13af71e98937-diagram-2.svg", val: "99%", lbl: "Retention" },
                              { img: "/uploads/media/1781499520046-54ff665e-db79-4218-9d0f-ba3e1ef89cbf-Group-1000006419.svg", val: "100%", lbl: "Safe & secure" }
                            ])];
                            newStats[idx] = { ...newStats[idx], val: e.target.value };
                            handleDataChange('stats', newStats);
                          }}
                          className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Label"
                          value={stat.lbl || ''}
                          onChange={(e) => {
                            const newStats = [...(selectedSection.data.stats || [
                              { img: "/uploads/media/1781499499702-738565c9-f87d-403e-9e60-0dbd3ee00f71-Vector-1-.svg", val: "10K+", lbl: "Happy Clients" },
                              { img: "/uploads/media/1781499507867-a4c5174e-3a63-4316-83b4-13af71e98937-diagram-2.svg", val: "99%", lbl: "Retention" },
                              { img: "/uploads/media/1781499520046-54ff665e-db79-4218-9d0f-ba3e1ef89cbf-Group-1000006419.svg", val: "100%", lbl: "Safe & secure" }
                            ])];
                            newStats[idx] = { ...newStats[idx], lbl: e.target.value };
                            handleDataChange('stats', newStats);
                          }}
                          className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedSection.type === 'sitemap' && (
              <>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    value={selectedSection.data.title || ''}
                    onChange={(e) => handleDataChange('title', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Description</label>
                  <textarea
                    value={selectedSection.data.description || ''}
                    onChange={(e) => handleDataChange('description', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]"
                  />
                </div>
              </>
            )}
          {/* ======== HOW IT WORKS – HERO ======== */}
          {selectedSection.type === 'how-it-works-hero' && (
            <>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Title</label>
                <textarea
                  value={selectedSection.data.title || ''}
                  onChange={(e) => handleDataChange('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]"
                />

              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Highlighted Text</label>
                <input
                  type="text"
                  value={selectedSection.data.highlightText || ''}
                  onChange={(e) => handleDataChange('highlightText', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                  placeholder="Part of the title to highlight in yellow"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Subtitle</label>
                <textarea
                  value={selectedSection.data.subtitle || ''}
                  onChange={(e) => handleDataChange('subtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSection.data.showPrimaryButton !== false}
                    onChange={(e) => handleDataChange('showPrimaryButton', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#fc0] focus:ring-[#fc0]"
                  />
                  Primary Btn
                </label>
                <label className="flex items-center gap-2 text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSection.data.showSecondaryButton !== false}
                    onChange={(e) => handleDataChange('showSecondaryButton', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#fc0] focus:ring-[#fc0]"
                  />
                  Secondary Btn
                </label>
              </div>

              {selectedSection.data.showPrimaryButton !== false && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Primary Btn Text</label>
                    <input type="text" value={selectedSection.data.primaryBtnText || ''} onChange={(e) => handleDataChange('primaryBtnText', e.target.value)} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Primary Btn Link</label>
                    <input type="text" value={selectedSection.data.primaryBtnLink || ''} onChange={(e) => handleDataChange('primaryBtnLink', e.target.value)} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg" />
                  </div>
                </div>
              )}

              {selectedSection.data.showSecondaryButton !== false && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Secondary Btn Text</label>
                    <input type="text" value={selectedSection.data.secondaryBtnText || ''} onChange={(e) => handleDataChange('secondaryBtnText', e.target.value)} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Secondary Btn Link</label>
                    <input type="text" value={selectedSection.data.secondaryBtnLink || ''} onChange={(e) => handleDataChange('secondaryBtnLink', e.target.value)} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg" />
                  </div>
                </div>
              )}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Badges</label>
                  <button
                    onClick={() => {
                      const newBadges = [...(selectedSection.data.badges || []), 'New Badge'];
                      handleDataChange('badges', newBadges);
                    }}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                  >
                    + Add Badge
                  </button>
                </div>
                {(selectedSection.data.badges || []).map((badge: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 relative group/item">
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => {
                        const updated = [...(selectedSection.data.badges || [])];
                        updated[idx] = e.target.value;
                        handleDataChange('badges', updated);
                      }}
                      className="flex-1 px-3 py-2 text-xs border border-black/5 rounded-lg"
                    />
                    <button
                      onClick={() => {
                        const updated = (selectedSection.data.badges || []).filter((_: any, i: number) => i !== idx);
                        handleDataChange('badges', updated);
                      }}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ======== HOW IT WORKS – PROCESS ======== */}
          {selectedSection.type === 'how-it-works-process' && (() => {
            const phases = (selectedSection.data.phases && selectedSection.data.phases.length > 0)
              ? selectedSection.data.phases
              : defaultHowItWorksProcessPhases;
            const activePhaseIdx = selectedSection.data._activePhaseIdx ?? 0;
            const activePhase = phases[activePhaseIdx];

            const handlePhaseField = (field: string, val: any) => {
              const updated = [...phases];
              updated[activePhaseIdx] = { ...updated[activePhaseIdx], [field]: val };
              handleDataChange('phases', updated);
            };

            const handleStepField = (stepIdx: number, field: string, val: any) => {
              const updatedSteps = [...(activePhase?.steps || [])];
              updatedSteps[stepIdx] = { ...updatedSteps[stepIdx], [field]: val };
              handlePhaseField('steps', updatedSteps);
            };

            return (
              <>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Main Heading</label>
                  <textarea
                    value={selectedSection.data.heading || ''}
                    onChange={(e) => handleDataChange('heading', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Subheading</label>
                  <textarea
                    value={selectedSection.data.subheading || ''}
                    onChange={(e) => handleDataChange('subheading', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]"
                  />
                </div>
                <label className="flex items-center gap-2 text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSection.data.showIntro === true}
                    onChange={(e) => handleDataChange('showIntro', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#fc0] focus:ring-[#fc0]"
                  />
                  Show Main Heading On Website
                </label>

                {/* Phase Selector */}
                <div className="space-y-3 pt-4 border-t border-black/5">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Editing Phase</label>
                  <div className="flex gap-2 flex-wrap">
                    {phases.map((_: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleDataChange('_activePhaseIdx', idx)}
                        className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                          activePhaseIdx === idx
                            ? "bg-[#fc0] text-[#1a1a1a] border-[#fc0] shadow-sm"
                            : "bg-white text-gray-500 border-black/5 hover:bg-black/5"
                        }`}
                      >
                        Phase {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {activePhase && (
                  <div className="space-y-4 pt-4 border-t border-black/5">
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Phase Title</label>
                      <input type="text" value={activePhase.title || ''} onChange={(e) => handlePhaseField('title', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Phase Image URL</label>
                      <div className="flex gap-2">
                        <input type="text" value={activePhase.image || ''} onChange={(e) => handlePhaseField('image', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium" />
                        <button type="button" onClick={() => openMediaPicker((url) => handlePhaseField('image', url))} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors border border-slate-200 whitespace-nowrap">Browse</button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Image Position</label>
                      <select value={activePhase.imagePosition || 'right'} onChange={(e) => handlePhaseField('imagePosition', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium">
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>

                    {/* Steps within the active phase */}
                    <div className="space-y-4 pt-2">
                      <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Steps</label>
                      {(activePhase.steps || []).map((step: any, stepIdx: number) => (
                        <div key={stepIdx} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3">
                          <span className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase">Step {stepIdx + 1}</span>
                          <input placeholder="Title" value={step.title || ''} onChange={(e) => handleStepField(stepIdx, 'title', e.target.value)} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg font-bold" />
                          <textarea placeholder="Description" value={step.desc || ''} onChange={(e) => handleStepField(stepIdx, 'desc', e.target.value)} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg min-h-[60px]" />
                          <div className="flex gap-3 items-center">
                            <input placeholder="Icon Name (click, cart, check...)" value={step.iconName || ''} onChange={(e) => handleStepField(stepIdx, 'iconName', e.target.value)} className="flex-1 px-3 py-2 text-xs border border-black/5 rounded-lg" />
                            <label className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
                              <input type="checkbox" checked={step.active || false} onChange={(e) => handleStepField(stepIdx, 'active', e.target.checked)} />
                              Active
                            </label>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase">Uploaded Icon</label>
                            <div className="flex gap-2">
                              <input placeholder="Icon image URL" value={step.iconUrl || ''} onChange={(e) => handleStepField(stepIdx, 'iconUrl', e.target.value)} className="flex-1 px-3 py-2 text-xs border border-black/5 rounded-lg" />
                              <button type="button" onClick={() => openMediaPicker((url) => handleStepField(stepIdx, 'iconUrl', url))} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs transition-colors border border-slate-200 whitespace-nowrap">Browse</button>
                            </div>
                            {step.iconUrl && (
                              <img src={step.iconUrl} alt="" className="h-10 w-10 rounded-full border border-black/5 bg-white object-contain p-2" onError={(e) => (e.currentTarget.style.display = 'none')} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}

          {/* ======== HOW IT WORKS – MORE THAN SERVICE ======== */}
          {selectedSection.type === 'how-it-works-more-than-service' && (
            <>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Heading</label>
                <input
                  type="text"
                  value={selectedSection.data.heading || ''}
                  onChange={(e) => handleDataChange('heading', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                />
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Features</label>
                  <button
                    onClick={() => {
                      const updated = [...(selectedSection.data.features || []), { title: 'New Feature', desc: 'Feature description' }];
                      handleDataChange('features', updated);
                    }}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                  >
                    + Add Feature
                  </button>
                </div>
                {(selectedSection.data.features || []).map((feature: any, idx: number) => (
                  <div key={idx} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3 relative group/item">
                    <button
                      onClick={() => {
                        const updated = (selectedSection.data.features || []).filter((_: any, i: number) => i !== idx);
                        handleDataChange('features', updated);
                      }}
                      className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover/item:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    <span className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase">Feature {idx + 1}</span>
                    <input placeholder="Title" value={feature.title || ''} onChange={(e) => { const u = [...(selectedSection.data.features || [])]; u[idx] = { ...u[idx], title: e.target.value }; handleDataChange('features', u); }} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg font-bold" />
                    <textarea placeholder="Description" value={feature.desc || ''} onChange={(e) => { const u = [...(selectedSection.data.features || [])]; u[idx] = { ...u[idx], desc: e.target.value }; handleDataChange('features', u); }} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg min-h-[60px]" />
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-4 border-t border-black/5">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Yellow CTA</label>
                <input
                  placeholder="CTA Title"
                  value={selectedSection.data.ctaTitle || ''}
                  onChange={(e) => handleDataChange('ctaTitle', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg font-bold"
                />
                <textarea
                  placeholder="CTA Description"
                  value={selectedSection.data.ctaDescription || ''}
                  onChange={(e) => handleDataChange('ctaDescription', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg min-h-[60px]"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Button Text"
                    value={selectedSection.data.ctaButtonText || ''}
                    onChange={(e) => handleDataChange('ctaButtonText', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg"
                  />
                  <input
                    placeholder="Button Link"
                    value={selectedSection.data.ctaButtonLink || ''}
                    onChange={(e) => handleDataChange('ctaButtonLink', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg"
                  />
                </div>
              </div>
            </>
          )}

          {/* ======== HOW IT WORKS – BEFORE AFTER ======== */}
          {selectedSection.type === 'how-it-works-before-after' && (
            <>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Heading</label>
                <input type="text" value={selectedSection.data.heading || ''} onChange={(e) => handleDataChange('heading', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium" />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Subheading</label>
                <textarea value={selectedSection.data.subheading || ''} onChange={(e) => handleDataChange('subheading', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[100px]" />
              </div>

              {/* Before Column */}
              <div className="space-y-4 pt-4 border-t border-black/5">
                <label className="text-[11px] font-bold text-red-500/80 uppercase tracking-wider block">Before Section</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Rating</label>
                    <input type="text" value={selectedSection.data.before?.rating || ''} onChange={(e) => handleDataChange('before', { ...(selectedSection.data.before || {}), rating: e.target.value })} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Reviews Count</label>
                    <input type="text" value={selectedSection.data.before?.reviewsCount || ''} onChange={(e) => handleDataChange('before', { ...(selectedSection.data.before || {}), reviewsCount: e.target.value })} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Bullets</label>
                  {(selectedSection.data.before?.bullets || []).map((bullet: string, idx: number) => (
                    <input key={`b-${idx}`} type="text" value={bullet} onChange={(e) => { const u = [...(selectedSection.data.before?.bullets || [])]; u[idx] = e.target.value; handleDataChange('before', { ...(selectedSection.data.before || {}), bullets: u }); }} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg" />
                  ))}
                </div>
              </div>

              {/* After Column */}
              <div className="space-y-4 pt-4 border-t border-black/5">
                <label className="text-[11px] font-bold text-emerald-500/80 uppercase tracking-wider block">After Section</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Rating</label>
                    <input type="text" value={selectedSection.data.after?.rating || ''} onChange={(e) => handleDataChange('after', { ...(selectedSection.data.after || {}), rating: e.target.value })} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Reviews Count</label>
                    <input type="text" value={selectedSection.data.after?.reviewsCount || ''} onChange={(e) => handleDataChange('after', { ...(selectedSection.data.after || {}), reviewsCount: e.target.value })} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Bullets</label>
                  {(selectedSection.data.after?.bullets || []).map((bullet: string, idx: number) => (
                    <input key={`a-${idx}`} type="text" value={bullet} onChange={(e) => { const u = [...(selectedSection.data.after?.bullets || [])]; u[idx] = e.target.value; handleDataChange('after', { ...(selectedSection.data.after || {}), bullets: u }); }} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg" />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ======== HOW IT WORKS – STANDARDS ======== */}
          {selectedSection.type === 'how-it-works-standards' && (
            <>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Heading</label>
                <input type="text" value={selectedSection.data.heading || ''} onChange={(e) => handleDataChange('heading', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium" />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Image URL</label>
                <div className="flex gap-2">
                  <input type="text" value={selectedSection.data.image || ''} onChange={(e) => handleDataChange('image', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium" />
                  <button type="button" onClick={() => openMediaPicker((url) => handleDataChange('image', url))} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors border border-slate-200 whitespace-nowrap">Browse</button>
                </div>
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Standards</label>
                  <button
                    onClick={() => {
                      const updated = [...(selectedSection.data.standards || []), { title: 'New Standard', desc: 'Standard description' }];
                      handleDataChange('standards', updated);
                    }}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                  >
                    + Add Standard
                  </button>
                </div>
                {(selectedSection.data.standards || []).map((item: any, idx: number) => (
                  <div key={idx} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3 relative group/item">
                    <button
                      onClick={() => {
                        const updated = (selectedSection.data.standards || []).filter((_: any, i: number) => i !== idx);
                        handleDataChange('standards', updated);
                      }}
                      className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover/item:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    <span className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase">Standard {idx + 1}</span>
                    <input placeholder="Title" value={item.title || ''} onChange={(e) => { const u = [...(selectedSection.data.standards || [])]; u[idx] = { ...u[idx], title: e.target.value }; handleDataChange('standards', u); }} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg font-bold" />
                    <textarea placeholder="Description" value={item.desc || ''} onChange={(e) => { const u = [...(selectedSection.data.standards || [])]; u[idx] = { ...u[idx], desc: e.target.value }; handleDataChange('standards', u); }} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg min-h-[60px]" />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ======== HOW IT WORKS – WHY TRUST ======== */}
          {selectedSection.type === 'how-it-works-why-trust' && (
            <>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Heading</label>
                <input type="text" value={selectedSection.data.heading || ''} onChange={(e) => handleDataChange('heading', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium" />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Image URL</label>
                <div className="flex gap-2">
                  <input type="text" value={selectedSection.data.image || ''} onChange={(e) => handleDataChange('image', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium" />
                  <button type="button" onClick={() => openMediaPicker((url) => handleDataChange('image', url))} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors border border-slate-200 whitespace-nowrap">Browse</button>
                </div>
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Trust Cards</label>
                  <button
                    onClick={() => {
                      const updated = [...(selectedSection.data.cards || []), { title: 'New Card', desc: 'Card description' }];
                      handleDataChange('cards', updated);
                    }}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                  >
                    + Add Card
                  </button>
                </div>
                {(selectedSection.data.cards || []).map((card: any, idx: number) => (
                  <div key={idx} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3 relative group/item">
                    <button
                      onClick={() => {
                        const updated = (selectedSection.data.cards || []).filter((_: any, i: number) => i !== idx);
                        handleDataChange('cards', updated);
                      }}
                      className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover/item:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    <span className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase">Card {idx + 1}</span>
                    <input placeholder="Title" value={card.title || ''} onChange={(e) => { const u = [...(selectedSection.data.cards || [])]; u[idx] = { ...u[idx], title: e.target.value }; handleDataChange('cards', u); }} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg font-bold" />
                    <textarea placeholder="Description" value={card.desc || ''} onChange={(e) => { const u = [...(selectedSection.data.cards || [])]; u[idx] = { ...u[idx], desc: e.target.value }; handleDataChange('cards', u); }} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg min-h-[60px]" />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ======== HOW IT WORKS – SOLUTIONS ======== */}
          {selectedSection.type === 'how-it-works-solutions' && (
            <>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Heading</label>
                <input type="text" value={selectedSection.data.heading || ''} onChange={(e) => handleDataChange('heading', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium" />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Description 1</label>
                <textarea value={selectedSection.data.desc1 || ''} onChange={(e) => handleDataChange('desc1', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]" />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Description 2</label>
                <textarea value={selectedSection.data.desc2 || ''} onChange={(e) => handleDataChange('desc2', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]" />
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Solutions</label>
                  <button
                    onClick={() => {
                      const updated = [...(selectedSection.data.solutions || []), { title: 'New Industry', desc: 'Industry description', iconName: 'Briefcase' }];
                      handleDataChange('solutions', updated);
                    }}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                  >
                    + Add Solution
                  </button>
                </div>
                {(selectedSection.data.solutions || []).map((item: any, idx: number) => (
                  <div key={idx} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3 relative group/item">
                    <button
                      onClick={() => {
                        const updated = (selectedSection.data.solutions || []).filter((_: any, i: number) => i !== idx);
                        handleDataChange('solutions', updated);
                      }}
                      className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover/item:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    <span className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase">Solution {idx + 1}</span>
                    <div className="flex gap-2">
                      <input placeholder="Title" value={item.title || ''} onChange={(e) => { const u = [...(selectedSection.data.solutions || [])]; u[idx] = { ...u[idx], title: e.target.value }; handleDataChange('solutions', u); }} className="flex-1 px-3 py-2 text-xs border border-black/5 rounded-lg font-bold" />
                      <input placeholder="Icon (Lucide)" value={item.iconName || ''} onChange={(e) => { const u = [...(selectedSection.data.solutions || [])]; u[idx] = { ...u[idx], iconName: e.target.value }; handleDataChange('solutions', u); }} className="w-28 px-3 py-2 text-xs border border-black/5 rounded-lg" />
                    </div>
                    <textarea placeholder="Description" value={item.desc || ''} onChange={(e) => { const u = [...(selectedSection.data.solutions || [])]; u[idx] = { ...u[idx], desc: e.target.value }; handleDataChange('solutions', u); }} className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg min-h-[50px]" />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ======== HOW IT WORKS – CTA ======== */}
          {selectedSection.type === 'how-it-works-cta' && (
            <>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Heading (HTML)</label>
                <textarea
                  value={selectedSection.data.heading || ''}
                  onChange={(e) => handleDataChange('heading', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Subheading</label>
                <textarea
                  value={selectedSection.data.subheading || ''}
                  onChange={(e) => handleDataChange('subheading', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium min-h-[80px]"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Button Text</label>
                <input type="text" value={selectedSection.data.btnText || ''} onChange={(e) => handleDataChange('btnText', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium" />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Button Link</label>
                <input type="text" value={selectedSection.data.btnLink || ''} onChange={(e) => handleDataChange('btnLink', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium" />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Image URL</label>
                <div className="flex gap-2">
                  <input type="text" value={selectedSection.data.image || ''} onChange={(e) => handleDataChange('image', e.target.value)} className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium" />
                  <button type="button" onClick={() => openMediaPicker((url) => handleDataChange('image', url))} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors border border-slate-200 whitespace-nowrap">Browse</button>
                </div>
              </div>
            </>
          )}
        </div>

          {/* Style Settings */}
          <div className="space-y-8 pt-8 border-t border-black/5">
            <div className="flex items-center gap-4">
              <h3 className="text-[10px] font-black text-[#1a1a1a]/30 uppercase tracking-[0.2em] whitespace-nowrap">Design & Layout</h3>
              <div className="h-px w-full bg-[#1a1a1a]/5" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Padding</label>
                <input
                  type="text"
                  value={selectedSection.settings.padding || ''}
                  onChange={(e) => handleSettingChange('padding', e.target.value)}
                  placeholder="2rem 0"
                  className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Margin</label>
                <input
                  type="text"
                  value={selectedSection.settings.margin || ''}
                  onChange={(e) => handleSettingChange('margin', e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                />
              </div>
            </div>

            {/* Title Typography Settings */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <h3 className="text-[10px] font-bold text-[#1a1a1a]/20 uppercase tracking-[0.2em] whitespace-nowrap">Title Style</h3>
                <div className="h-px w-full bg-[#1a1a1a]/5" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Title Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedSection.settings.titleColor || '#1a1a1a'}
                      onChange={(e) => handleSettingChange('titleColor', e.target.value)}
                      className="h-10 w-10 p-1 bg-white border border-black/5 rounded-lg cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={selectedSection.settings.titleColor || ''}
                      onChange={(e) => handleSettingChange('titleColor', e.target.value)}
                      placeholder="#1a1a1a"
                      className="flex-1 min-w-0 px-2 py-2 bg-white border border-black/5 rounded-lg focus:outline-none text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Title Weight</label>
                  <select
                    value={selectedSection.settings.titleWeight || '700'}
                    onChange={(e) => handleSettingChange('titleWeight', e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-black/5 rounded-xl focus:outline-none text-xs font-bold"
                  >
                    <option value="300">Light</option>
                    <option value="400">Regular</option>
                    <option value="500">Medium</option>
                    <option value="600">SemiBold</option>
                    <option value="700">Bold</option>
                    <option value="900">Black</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Title Size</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="20"
                    max="120"
                    value={parseInt(selectedSection.settings.titleSize || '40')}
                    onChange={(e) => handleSettingChange('titleSize', e.target.value + 'px')}
                    className="flex-1 accent-[#fc0]"
                  />
                  <span className="text-xs font-black text-[#1a1a1a] w-12 text-right">{selectedSection.settings.titleSize || '40px'}</span>
                </div>
              </div>
            </div>

            {/* Content Typography Settings */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <h3 className="text-[10px] font-bold text-[#1a1a1a]/20 uppercase tracking-[0.2em] whitespace-nowrap">Content Style</h3>
                <div className="h-px w-full bg-[#1a1a1a]/5" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Text Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedSection.settings.contentColor || '#555555'}
                      onChange={(e) => handleSettingChange('contentColor', e.target.value)}
                      className="h-10 w-10 p-1 bg-white border border-black/5 rounded-lg cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={selectedSection.settings.contentColor || ''}
                      onChange={(e) => handleSettingChange('contentColor', e.target.value)}
                      placeholder="#555555"
                      className="flex-1 min-w-0 px-2 py-2 bg-white border border-black/5 rounded-lg focus:outline-none text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Font Weight</label>
                  <select
                    value={selectedSection.settings.contentWeight || '400'}
                    onChange={(e) => handleSettingChange('contentWeight', e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-black/5 rounded-xl focus:outline-none text-xs font-bold"
                  >
                    <option value="300">Light</option>
                    <option value="400">Regular</option>
                    <option value="500">Medium</option>
                    <option value="600">SemiBold</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Content Size</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="12"
                    max="40"
                    value={parseInt(selectedSection.settings.contentSize || '16')}
                    onChange={(e) => handleSettingChange('contentSize', e.target.value + 'px')}
                    className="flex-1 accent-[#fc0]"
                  />
                  <span className="text-xs font-black text-[#1a1a1a] w-12 text-right">{selectedSection.settings.contentSize || '16px'}</span>
                </div>
              </div>
            </div>

            {/* Background Settings */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <h3 className="text-[10px] font-bold text-[#1a1a1a]/20 uppercase tracking-[0.2em] whitespace-nowrap">Background & Border</h3>
                <div className="h-px w-full bg-[#1a1a1a]/5" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">BG Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedSection.settings.backgroundColor || '#ffffff'}
                      onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                      className="h-10 w-10 p-1 bg-white border border-black/5 rounded-lg cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={selectedSection.settings.backgroundColor || ''}
                      onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1 min-w-0 px-2 py-2 bg-white border border-black/5 rounded-lg focus:outline-none text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider">Corner Radius</label>
                  <input
                    type="text"
                    value={selectedSection.settings.borderRadius || ''}
                    onChange={(e) => handleSettingChange('borderRadius', e.target.value)}
                    placeholder="0px"
                    className="w-full px-3 py-2 bg-white border border-black/5 rounded-xl focus:outline-none text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#fc0]/5 rounded-2xl border border-[#fc0]/10">
              <label className="text-[11px] font-black text-[#1a1a1a] uppercase tracking-wider">Visible on Page</label>
              <button
                onClick={() => handleSettingChange('visibility', !selectedSection.settings.visibility)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${selectedSection.settings.visibility !== false ? 'bg-[#fc0]' : 'bg-black/10'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${selectedSection.settings.visibility !== false ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <MediaPickerModal
        isOpen={mediaPicker?.isOpen || false}
        onClose={() => setMediaPicker(null)}
        onSelect={(url) => { mediaPicker?.onSelect(url); setMediaPicker(null); }}
      />
    </>
  );
}
