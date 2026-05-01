import React from 'react';
import { SectionProps } from '@/types/section';
import VisionMissionSection from '@/components/home/VisionMissionSection';

export default function VisionMissionSectionBuilder({ settings }: SectionProps) {
  const styles: React.CSSProperties = {
    padding: settings.padding || '0',
    margin: settings.margin || '0',
    backgroundColor: settings.backgroundColor || '#ffffff',
  };

  return (
    <div style={styles}>
      <VisionMissionSection />
    </div>
  );
}
