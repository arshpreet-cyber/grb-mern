'use client';

import React from 'react';
import { SectionProps } from '@/types/section';
import { useAppDispatch } from '@/lib/redux/hooks';
import { updateSectionData } from '@/lib/redux/features/pageEditorSlice';
import RichTextEditor from '@/components/editor/RichTextEditor';

export default function TextSection({ id, data = {}, settings = {} as any, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();
  const { content = '<p>Enter your text here...</p>' } = data;

  const styles: React.CSSProperties = {
    padding: settings.padding || '4rem 0',
    margin: settings.margin || '0',
    backgroundColor: settings.backgroundColor || '#fff',
    color: settings.contentColor || 'inherit',
    fontSize: settings.contentSize || 'inherit',
    fontWeight: settings.contentWeight || 'inherit',
    borderRadius: settings.borderRadius || '0',
    textAlign: settings.alignment || 'left',
  };

  return (
    <section style={styles}>
      <div className="max-w-[1500] mx-auto px-4">
        {isEditing ? (
          <RichTextEditor
            content={content}
            onChange={(html) => dispatch(updateSectionData({ id, data: { content: html } }))}
          />
        ) : (
          <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </div>
    </section>
  );
}
