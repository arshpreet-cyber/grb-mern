'use client';
import React, { useEffect, useState } from 'react';
import { SectionProps } from '@/types/section';

export default function Hero({ data, settings }: SectionProps) {
  const { 
    staticTitle1 = "Turn Reputation into", 
    staticTitleBold = "Revenue",
    staticTitle2 = "with",
    typingServices = [
      "Hotel Reviews",
      "Health Services Reviews",
      "Plumbing Services Reviews",
      "Real Estate Reviews",
      "Legal Services Reviews",
      "Authentic Reviews",
    ],
    description = "Elevate your brand with reviews that actually convert."
  } = data;

  const [text, setText] = useState(typingServices[0] || '');
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(typingServices[0]?.length || 0);
  const [deleting, setDeleting] = useState(true);

  useEffect(() => {
    if (!typingServices || typingServices.length === 0) return;

    const TYPE_SPEED = 80;
    const DELETE_SPEED = 40;
    const PAUSE = 1000;

    let timeout: NodeJS.Timeout;

    const full = typingServices[index];

    if (!deleting) {
      timeout = setTimeout(() => {
        const next = full.slice(0, charIndex + 1);
        setText(next);
        setCharIndex(next.length);

        if (next.length === full.length) {
          setTimeout(() => setDeleting(true), PAUSE);
        }
      }, TYPE_SPEED);
    } else {
      timeout = setTimeout(() => {
        const next = full.slice(0, charIndex - 1);
        setText(next);
        setCharIndex(next.length);

        if (next.length === 0) {
          setDeleting(false);
          setIndex((prev) => (prev + 1) % typingServices.length);
        }
      }, DELETE_SPEED);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, index, typingServices]);

  const styles: React.CSSProperties = {
    padding: settings.padding || '10px 16px',
    margin: settings.margin || '0',
    backgroundColor: settings.backgroundColor || 'transparent',
  };

  return (
    <section 
      style={styles} 
      className="flex items-center justify-center text-center md:pb-[30px] min-[1470px]:px-[20px] min-[1470px]:py-[30px] bg-gradient-to-b from-transparent to-[#FDFCF2] font-[Poppins] w-full"
    >
      <div className="w-full max-w-full mx-auto">
        <h1 className="text-[40px] min-[480px]:text-[40px] md:text-[40px] min-[1470px]:text-[40px] font-[350] text-[#1a1a1a] leading-[1.3] mb-[7px] tracking-[-0.01em] min-[1470px]:tracking-[-0.02em]">
          {staticTitle1} <strong className="font-[510]">{staticTitleBold}</strong> {staticTitle2}
          <br />
          <span className="inline-flex items-center justify-center flex-nowrap align-middle box-border gap-[6px] px-[6px] py-[2px] min-h-[36px] min-[480px]:min-h-[44px] md:gap-[10px] md:px-[8px] md:py-[4px] md:min-h-[52px] min-[1470px]:min-h-[64px] bg-[#FFE58233]">
            <img
              src="https://getreviews.buzz/storage/app/blog/0571820001777624061_line1.png"
              alt="|"
              className="shrink-0 w-[5px] h-[26px] min-[480px]:h-[32px] md:w-[7px] md:h-[50px]"
            />
            <strong className="font-[510]">
              <span className="inline-block min-w-0 text-left align-middle leading-[1.3] text-[26px] min-[480px]:text-[40px] md:text-inherit">
                {text}
              </span>
            </strong>
            <img
              src="https://getreviews.buzz/storage/app/blog/0567963001777624061_line2.png"
              alt="|"
              className="shrink-0 w-[5px] h-[26px] min-[480px]:h-[32px] md:w-[7px] md:h-[50px]"
            />
          </span>
        </h1>
        <p className="text-[13px] min-[480px]:text-[14px] min-[1470px]:text-[16px] text-black m-0 mt-[8px] md:mt-0 tracking-[0.01em]">
          {description}
        </p>
      </div>
    </section>
  );
}
