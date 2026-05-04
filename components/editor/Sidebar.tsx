'use client';
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { updateSectionData, updateSectionSettings, setSelectedSectionId } from '@/lib/redux/features/pageEditorSlice';
import { X, ChevronRight, Layout, Type, Image as ImageIcon, Settings as SettingsIcon, ShoppingCart } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const selectedSectionId = useAppSelector((state) => state.pageEditor.selectedSectionId);
  const sections = useAppSelector((state) => state.pageEditor.sections);
  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  if (!selectedSection) {
    return (
      <div className="w-full h-full p-12 flex flex-col items-center justify-center text-center bg-[#fafafa]">
        <div className="w-20 h-20 bg-white shadow-sm border border-black/5 rounded-3xl flex items-center justify-center mb-6">
          <SettingsIcon className="text-[#1a1a1a]/20" size={32} />
        </div>
        <h3 className="text-[#1a1a1a] font-bold text-lg mb-2">Editor Panel</h3>
        <p className="text-[#1a1a1a]/40 text-sm max-w-[200px] leading-relaxed">Select a section on the canvas to configure its content and design.</p>
      </div>
    );
  }

  const handleDataChange = (key: string, value: any) => {
    dispatch(updateSectionData({ id: selectedSection.id, data: { [key]: value } }));
  };

  const handleSettingChange = (key: string, value: any) => {
    dispatch(updateSectionSettings({ id: selectedSection.id, settings: { [key]: value } }));
  };

  return (
    <div className="w-full flex flex-col h-full overflow-hidden bg-white font-[Poppins]">
      <div className="p-6 border-b border-black/5 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-[#1a1a1a] text-[#FFE582] rounded-xl shadow-lg">
            {selectedSection.type === 'hero' && <Layout size={18} />}
            {selectedSection.type === 'text' && <Type size={18} />}
            {selectedSection.type === 'image' && <ImageIcon size={18} />}
            {selectedSection.type === 'buy-reviews' && <ShoppingCart size={18} />}
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
                <input 
                  type="text"
                  value={selectedSection.data.image || ''}
                  onChange={(e) => handleDataChange('image', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    selectedSection.data.showButton !== false ? 'bg-[#fc0]' : 'bg-black/10'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                      selectedSection.data.showButton !== false ? 'translate-x-6' : 'translate-x-1'
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Content</label>
              <RichTextEditor 
                content={selectedSection.data.content || ''}
                onChange={(html) => handleDataChange('content', html)}
              />
            </div>
          )}

          {selectedSection.type === 'image' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Image URL</label>
                <input 
                  type="text"
                  value={selectedSection.data.imageUrl || ''}
                  onChange={(e) => handleDataChange('imageUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
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
                    <input 
                      type="text"
                      placeholder="Icon URL"
                      value={feature.icon || ''}
                      onChange={(e) => {
                        const newFeatures = [...selectedSection.data.features];
                        newFeatures[idx] = { ...newFeatures[idx], icon: e.target.value };
                        handleDataChange('features', newFeatures);
                      }}
                      className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg"
                    />
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
              <div className="space-y-4 pt-4">
                <label className="text-[11px] font-bold text-[#1a1a1a]/60 uppercase tracking-wider block">Questions & Answers</label>
                {(selectedSection.data.faqs || []).map((faq: any, idx: number) => (
                  <div key={idx} className="p-4 border border-black/5 rounded-2xl bg-[#fafafa] space-y-3">
                    <input 
                      type="text"
                      placeholder="Question"
                      value={faq.question || ''}
                      onChange={(e) => {
                        const newFaqs = [...selectedSection.data.faqs];
                        newFaqs[idx] = { ...newFaqs[idx], question: e.target.value };
                        handleDataChange('faqs', newFaqs);
                      }}
                      className="w-full px-3 py-2 text-xs border border-black/5 rounded-lg font-bold"
                    />
                    <textarea 
                      placeholder="Answer"
                      value={faq.answer || ''}
                      onChange={(e) => {
                        const newFaqs = [...selectedSection.data.faqs];
                        newFaqs[idx] = { ...newFaqs[idx], answer: e.target.value };
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

          {selectedSection.type === 'buy-reviews' && (
            <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-600 italic">
              The product grid pulls data automatically from your products list.
            </div>
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
                <input
                  type="text"
                  value={selectedSection.data.image || ''}
                  onChange={(e) => handleDataChange('image', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc0] text-sm font-medium"
                  placeholder="https://..."
                />
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
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                selectedSection.settings.visibility !== false ? 'bg-[#fc0]' : 'bg-black/10'
              }`}
            >
              <span 
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  selectedSection.settings.visibility !== false ? 'translate-x-6' : 'translate-x-1'
                }`} 
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
