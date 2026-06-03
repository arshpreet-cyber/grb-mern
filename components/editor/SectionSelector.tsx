'use client';
import React from 'react';
import { Layout, Type, Image as ImageIcon, ShoppingCart, X, BarChart3, MessageSquare, Megaphone, Globe } from 'lucide-react';

interface SectionSelectorProps {
  onSelect: (type: string, data?: any) => void;
  onClose: () => void;
}

export default function SectionSelector({ onSelect, onClose }: SectionSelectorProps) {
  const [customTemplates, setCustomTemplates] = React.useState<any[]>([]);

  React.useEffect(() => {
    try {
      const templates = JSON.parse(localStorage.getItem('grb_custom_templates') || '[]');
      setCustomTemplates(templates);
    } catch (e) {}
  }, []);
  const options = [
    { type: 'sitemap', label: 'Site Map', icon: <Globe />, description: 'Sitemap with main pages, case studies & services' },
    { type: 'text', label: 'Custom Section', icon: <Type />, description: 'Full width custom HTML/rich text content' },
    { type: 'hero', label: 'Hero Banner', icon: <Megaphone />, description: 'The original typing banner' },
    { type: 'buy-reviews', label: 'Product Grid', icon: <ShoppingCart />, description: 'The dynamic review platform grid' },
    { type: 'image-text', label: 'Image & Text', icon: <Layout />, description: 'Text with an image on the side' },
    { type: 'stats-bar', label: 'Stats Bar', icon: <BarChart3 />, description: 'Animated statistics and growth numbers' },
    { type: 'custom-platform', label: 'Custom CTA', icon: <MessageSquare />, description: "Can't find platform banner" },
    { type: 'icon-grid', label: 'Feature Grid', icon: <Layout />, description: '6-item icon grid with why trust us text' },
    { type: 'faq-section', label: 'FAQ Accordion', icon: <Layout />, description: 'Frequently asked questions with CTA' },
    { type: 'blog-section', label: 'Blog Section', icon: <MessageSquare />, description: 'Recent blog posts grid' },
    { type: 'image', label: 'Simple Image', icon: <ImageIcon />, description: 'A single full-width image' },
    { type: 'productbanner', label: 'Product Banner', icon: <ShoppingCart />, description: 'A customizable product banner' },
    { type: 'similar-products', label: 'Similar Products', icon: <ShoppingCart />, description: 'Showcase similar products in a grid' },
    { type: 'how-it-work-card', label: 'How It Works Card', icon: <Layout />, description: 'A 3-step how it works card' },
    { type: 'benefits-section', label: 'Benefits Section', icon: <Layout />, description: 'A premium 3-column benefits overview section' },
    { type: 'safe-reviews-carousel', label: 'Safe Reviews Carousel', icon: <Layout />, description: 'A premium slider detailing secure review delivery' },
    { type: 'organic-drawbacks', label: 'Organic Drawbacks Grid', icon: <Layout />, description: 'A card grid showing the drawbacks of organic review collection' },
    { type: 'customer-reviews', label: 'Customer Reviews', icon: <MessageSquare />, description: 'A slider showcasing customer reviews' },
    { type: 'steps', label: 'Steps Section', icon: <BarChart3 />, description: 'A section showcasing steps or processes' },
    { type: 'cta-product', label: 'CTA Product', icon: <Megaphone />, description: 'A call-to-action section for products' },
    { type: 'rating-calculator', label: 'Rating Calculator', icon: <BarChart3 />, description: 'A review rating calculator hero section' },
    { type: 'rating-stats-bar', label: 'Rating Stats Bar', icon: <BarChart3 />, description: 'Industry statistics for reviews' },
    { type: 'rating-cta', label: 'Rating CTA', icon: <Megaphone />, description: 'A specialized CTA section for ratings' },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col" style={{ maxHeight: '90vh' }}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Choose a Section Type</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
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
          
          {customTemplates.length > 0 && (
            <div className="col-span-1 md:col-span-2 mt-6 mb-2 border-t border-slate-200 pt-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Type size={20} className="text-[#fc0]" /> Saved Templates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => onSelect('text', { content: template.content })}
                    className="flex items-start gap-4 p-4 border border-[#fc0]/30 bg-[#fc0]/5 rounded-xl hover:border-[#fc0] hover:bg-[#fc0]/10 transition-all text-left group relative"
                  >
                    <div className="p-3 bg-white text-[#fc0] rounded-lg group-hover:bg-[#fc0] group-hover:text-white transition-colors shadow-sm">
                      <Layout size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 transition-colors">{template.name}</h3>
                      <p className="text-sm text-slate-500 leading-tight line-clamp-1">Custom Section</p>
                    </div>
                    <div 
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 text-red-500 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this template?')) {
                          const updated = customTemplates.filter(t => t.id !== template.id);
                          setCustomTemplates(updated);
                          localStorage.setItem('grb_custom_templates', JSON.stringify(updated));
                        }
                      }}
                    >
                      <X size={14} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
