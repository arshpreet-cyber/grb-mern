'use client';
import React from 'react';
import Wrapper from "@/components/ui/Wrapper";
import { SectionProps } from '@/types/section';

export default function CustomPlatform({ data, settings }: SectionProps) {
  const {
    title = "Can't Find Your Platform Listed Above?",
    description = "Share your preferred platform with us, and our team will design a customized approach to help you build a credible review presence where it matters the most.",
    buttonText = "Contact Us",
    buttonLink = "/contact-us"
  } = data;

  const styles: React.CSSProperties = {
    padding: settings.padding || '1.25rem 0',
    margin: settings.margin || '0',
    backgroundColor: settings.backgroundColor || '#FFFEF9',
  };

  return (
    <section style={styles} className="relative w-full overflow-hidden flex items-center justify-center">
      <Wrapper>
        <img
          src="https://beta.getreviews.buzz/storage/app/blog/0339272001776325180_golden-star-icon-transparent-background-2.png"
          alt=""
          className="absolute z-0 pointer-events-none hidden md:block w-[220px] top-1/2 left-[3%] -translate-y-1/2 rotate-[15deg] opacity-50"
        />
        <img
          src="https://beta.getreviews.buzz/storage/app/blog/0339272001776325180_golden-star-icon-transparent-background-2.png"
          alt=""
          className="absolute z-0 pointer-events-none hidden md:block w-[280px] top-1/2 right-[3%] -translate-y-1/2 -rotate-[-15deg] opacity-50"
        />

        <div className="relative z-10 w-full mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-[40px] leading-tight text-black mb-5 font-normal" 
              dangerouslySetInnerHTML={{ __html: title }} />

          <p className="text-base md:text-[16px] text-[#4b5563] max-w-[800px] mx-auto mb-10 leading-relaxed"
             dangerouslySetInnerHTML={{ __html: description }} />

          <a
            href={buttonLink}
            className="inline-flex items-center justify-center text-black font-medium rounded-lg transition-transform hover:-translate-y-1 shadow-sm hover:shadow bg-gradient-to-r from-[#FFE26E] to-[#FFCD05] px-[60px] py-[10px] text-[14px] gap-[8px]"
          >
            {buttonText} <span className="text-[18px] leading-none">&rarr;</span>
          </a>
        </div>
      </Wrapper>
    </section>
  );
}
