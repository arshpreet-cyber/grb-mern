'use client';
import React from 'react';
import Wrapper from "@/components/ui/Wrapper";
import { SectionProps } from '@/types/section';
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";

export default function RatingCTA({ id, data, settings, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();
  const {
    title = "Ready to Build Your <em>5-Star</em> Reputation?",
    description = "",
    buttonText = "Get Reviews Now",
    buttonLink = "/"
  } = data;

  const sectionStyle: React.CSSProperties = {
    padding: settings.padding || '100px 0',
    margin: settings.margin || '0',
    backgroundColor: settings.backgroundColor || 'transparent',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: settings.titleSize || '40px',
    color: settings.titleColor || 'black',
    fontWeight: settings.titleWeight || '350',
    lineHeight: '1.1',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: settings.contentSize || '16px',
    color: settings.contentColor || 'black',
    fontWeight: settings.contentWeight || 'normal',
    lineHeight: '1.6',
  };

  return (
    <section style={sectionStyle} className="relative overflow-hidden font-[Poppins] ">
      <div className="absolute inset-0 bg-[#FFFDF0] pointer-events-none"></div>
      
      <Wrapper>
        <div className="bg-[#FFFDF0] rounded-[40px] py-10 px-8 text-center relative overflow-hidden">
          {/* Decorative Stars */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-base text-[#ffcd05] tracking-[12px] opacity-40 whitespace-nowrap">
            ★ ★ ★ ★ ★
          </div>
          
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <span 
                key={i} 
                className="absolute text-[#ffcd05] opacity-20 text-2xl animate-twinkle"
                style={{
                  top: `${[20, 30, 75, 80][i]}%`,
                  left: i % 2 === 0 ? `${[8, 15][Math.floor(i/2)]}%` : 'auto',
                  right: i % 2 !== 0 ? `${[12, 10][Math.floor((i-1)/2)]}%` : 'auto',
                  fontSize: `${[24, 18, 16, 22][i]}px`,
                  animationDelay: `${i * 0.5}s`
                }}
              >
                ★
              </span>
            ))}
          </div>

          <div className="relative z-10">
            <h2 
              className="mb-4 max-w-[640px] mx-auto"
              style={titleStyle}
              dangerouslySetInnerHTML={{ __html: title }}
            />

            {description && (
              <p className="max-w-[540px] mx-auto mb-8" style={descriptionStyle}>
                {description}
              </p>
            )}

            <a 
              href={buttonLink} 
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#fc0] to-[#ffe786] text-[#0a0e1a] px-10 py-4 rounded-[10px] font-normal text-base shadow-[0_12px_28px_rgba(255,205,5,0.3)] transition-all hover:bg-[#ffde4a] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(255,205,5,0.4)] group"
            >
              {buttonText} <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
