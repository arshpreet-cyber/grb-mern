'use client';
import React from 'react';
import { Layout, Type, Image as ImageIcon, ShoppingCart, X, BarChart3, MessageSquare, Megaphone } from 'lucide-react';

interface SectionSelectorProps {
  onSelect: (type: string) => void;
  onClose: () => void;
}

export default function SectionSelector({ onSelect, onClose }: SectionSelectorProps) {
  const options = [
    { type: 'hero', label: 'Hero Banner', icon: <Megaphone />, description: 'The original typing banner' },
    { type: 'buy-reviews', label: 'Product Grid', icon: <ShoppingCart />, description: 'The dynamic review platform grid' },
    { type: 'image-text', label: 'Image & Text', icon: <Layout />, description: 'Text with an image on the side' },
    { type: 'stats-bar', label: 'Stats Bar', icon: <BarChart3 />, description: 'Animated statistics and growth numbers' },
    { type: 'custom-platform', label: 'Custom CTA', icon: <MessageSquare />, description: "Can't find platform banner" },
    { type: 'icon-grid', label: 'Feature Grid', icon: <Layout />, description: '6-item icon grid with why trust us text' },
    { type: 'faq-section', label: 'FAQ Accordion', icon: <Layout />, description: 'Frequently asked questions with CTA' },
    { type: 'text', label: 'Rich Text', icon: <Type />, description: 'Full width rich text/HTML content' },
    { type: 'image', label: 'Simple Image', icon: <ImageIcon />, description: 'A single full-width image' },
    { type: 'productbanner', label: 'Product Banner', icon: <ShoppingCart />, description: 'A customizable product banner' },
    { type: 'similar-products', label: 'Similar Products', icon: <ShoppingCart />, description: 'Showcase similar products in a grid' },
    { type: 'how-it-work-card', label: 'How It Works Card', icon: <Layout />, description: 'A 3-step how it works card' },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Choose a Section Type</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt) => (
            <button
              key={opt.type}
              onClick={() => onSelect(opt.type)}
              className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="p-3 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                {opt.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{opt.label}</h3>
                <p className="text-sm text-slate-500 leading-tight">{opt.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
