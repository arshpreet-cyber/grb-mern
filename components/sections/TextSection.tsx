'use client';

import React from 'react';
import { SectionProps } from '@/types/section';

export default function TextSection({ data = {}, settings = {} as any }: SectionProps) {
  const { content = '<p>Enter your text here...</p>' } = data;

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
      <div className="max-w-[1300] mx-auto px-4">
        <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </section>
  );
}
