import React from 'react';
import { SectionProps } from '@/types/section';
import CTABanner from '@/components/home/CTABanner';

export default function CTABannerSection({ settings }: SectionProps) {
  const styles: React.CSSProperties = {
    padding: settings.padding || '0',
    margin: settings.margin || '0',
    backgroundColor: settings.backgroundColor || '#ffffff',
  };

  return (
    <div style={styles}>
      <CTABanner />
    </div>
  );
}
