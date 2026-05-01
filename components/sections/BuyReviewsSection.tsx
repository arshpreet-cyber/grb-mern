import React from 'react';
import { SectionProps } from '@/types/section';
import { BuyReviewsSection as OriginalBuyReviewsSection } from '@/components/home/BuyReviewsSection';

export default function BuyReviewsSectionBuilder({ data, settings }: SectionProps) {
  const styles: React.CSSProperties = {
    padding: settings.padding || '0',
    margin: settings.margin || '0',
  };

  return (
    <div style={styles}>
      <OriginalBuyReviewsSection />
    </div>
  );
}
