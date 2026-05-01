import React from 'react';
import { SectionProps } from '@/types/section';
import PartnerLogos from '@/components/home/PartnerLogos';

export default function PartnerLogosSection({ settings }: SectionProps) {
  const styles: React.CSSProperties = {
    padding: settings.padding || '0',
    margin: settings.margin || '0',
    backgroundColor: settings.backgroundColor || '#ffffff',
  };

  return (
    <div style={styles}>
      <PartnerLogos />
    </div>
  );
}
