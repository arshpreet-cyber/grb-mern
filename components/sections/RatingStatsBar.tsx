'use client';
import React from 'react';
import Wrapper from "@/components/ui/Wrapper";
import { SectionProps } from '@/types/section';
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";

export default function RatingStatsBar({ id, data, settings, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();
  const {
    title = "Numbers that decide<br> whether customers click or scroll past",
    stats = [
      { num: "98", suffix: "%", label: "Of consumers read reviews before making a purchase decision" },
      { num: "4.7", suffix: "★", label: "Is the sweet spot for ranking in Google's local 3-pack" },
      { num: "42", suffix: "%", label: "Conversion rate uplift for businesses rated above 4.5 stars" },
      { num: "24/7", suffix: "", label: "Real-time rating analytics and instant forecast recalculation" }
    ]
  } = data;

  const sectionStyle: React.CSSProperties = {
    padding: settings.padding || '72px 0',
    margin: settings.margin || '0',
    backgroundColor: settings.backgroundColor || '#fffdf0',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: settings.titleSize || '40px',
    color: settings.titleColor || '#0a0e1a',
    fontWeight: settings.titleWeight || 'normal',
    lineHeight: '1.2',
  };

  const statNumStyle: React.CSSProperties = {
    color: settings.statColor || '#0a0e1a',
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: settings.contentSize || '16px',
    color: settings.contentColor || 'black',
    fontWeight: settings.contentWeight || 'normal',
    lineHeight: '1.4',
  };

  return (
    <section style={sectionStyle} className="overflow-hidden font-[Poppins]">
      <Wrapper>
        <div className="text-center mb-12">
          <p 
            style={titleStyle}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat: any, index: number) => (
            <div key={index} className="text-left pt-6 transition-colors hover:border-[#0a0e1a]">
              <div className="text-[44px] md:text-[50px] font-light leading-none tracking-[-0.03em] mb-2" style={statNumStyle}>
                {stat.num}<span className="text-[#ffcd05] text-[50px]">{stat.suffix}</span>
              </div>
              
              <div style={statLabelStyle}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Wrapper>
    </section>
  );
}
