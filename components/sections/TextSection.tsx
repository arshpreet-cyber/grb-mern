import React from 'react';
import { SectionProps } from '@/types/section';

export default function TextSection({ data, settings }: SectionProps) {
  const { content } = data;
  
  const styles: React.CSSProperties = {
    padding: settings.padding || '4rem 0',
    margin: settings.margin || '0',
    backgroundColor: settings.backgroundColor || '#f9fafb',
    color: settings.contentColor || 'inherit',
    fontSize: settings.contentSize || 'inherit',
    fontWeight: settings.contentWeight || 'inherit',
    borderRadius: settings.borderRadius || '0',
    textAlign: settings.alignment || 'left',
  };

  return (
    <section style={styles}>
      <div className="max-w-4xl mx-auto prose prose-slate max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content || '<p>Enter your text here...</p>' }} />
      </div>
    </section>
  );
}
