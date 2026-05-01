import React from 'react';
import { SectionProps } from '@/types/section';

export default function ImageSection({ data, settings }: SectionProps) {
  const { imageUrl, alt, caption } = data;
  
  const styles: React.CSSProperties = {
    padding: settings.padding || '2rem 1rem',
    margin: settings.margin || '0',
    backgroundColor: settings.backgroundColor || 'transparent',
    textAlign: settings.alignment || 'center',
  };

  return (
    <section style={styles}>
      <div className="max-w-5xl mx-auto">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={alt || 'Section Image'} 
            className="w-full h-auto rounded-xl shadow-lg"
            style={{ maxWidth: settings.width || '100%' }}
          />
        ) : (
          <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-20 text-slate-400">
            No image selected
          </div>
        )}
        {caption && (
          <p className="mt-4 text-sm text-slate-500 italic">{caption}</p>
        )}
      </div>
    </section>
  );
}
