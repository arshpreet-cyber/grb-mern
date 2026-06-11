'use client';
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Wrapper from "@/components/ui/Wrapper";
import { SectionProps } from '@/types/section';

export default function ImageTextSection({ data, settings }: SectionProps) {
  const {
    title = "Turn Reviews into Brand <br/> <span class='font-semibold'>Visibility and Growth</span>",
    content = "<p>Customer reviews shape how people see your business. They often decide whether someone chooses you or looks elsewhere. Most customers rely on reviews to judge quality and trust, and they look for real experiences.</p><p>Regular feedback builds credibility over time. It shows that your business consistently delivers value.</p>",
    image = "https://getreviews.buzz/storage/app/blog/0547241001776770835_0936012001776065359_right-img.png",
    buttonText = "Read More",
    buttonLink = "#",
    imagePosition = "right",
    showButton = true,
  } = data;

  const titleStyles: React.CSSProperties = {
    color: settings.titleColor || 'inherit',
    fontSize: settings.titleSize || 'inherit',
    fontWeight: settings.titleWeight || 'inherit',
  };

  const contentStyles: React.CSSProperties = {
    color: settings.contentColor || 'inherit',
    fontSize: settings.contentSize || 'inherit',
    fontWeight: settings.contentWeight || 'inherit',
  };

  const sectionStyles: React.CSSProperties = {
    padding: settings.padding || '4rem 1.5rem',
    margin: settings.margin || '0',
    backgroundColor: settings.backgroundColor || '#ffffff',
    borderRadius: settings.borderRadius || '0',
  };

  return (
    <section style={sectionStyles} className="overflow-hidden font-sans">
      <Wrapper>
        <div className="w-full mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`max-w-xl mx-auto lg:mx-0 ${imagePosition === 'left' ? 'lg:order-2 lg:ml-auto lg:mr-0' : 'lg:order-1 lg:mr-auto lg:ml-0'}`}>
              <h2
                className="text-[38px] lg:text-[40px] leading-tight mb-6 text-center lg:text-left"
                style={titleStyles}
                dangerouslySetInnerHTML={{ __html: title }}
              />

              <div
                className="leading-[2] mb-6 text-justify [&_p]:text-justify [&_div]:text-justify"
                style={{ ...contentStyles, textAlign: 'justify' }}
                dangerouslySetInnerHTML={{ __html: content }}
              />

              {showButton !== false && buttonText && (
                <div className="text-center lg:text-left w-full">
                  <a
                    href={buttonLink}
                    className="inline-block bg-[#fcd535] text-gray-900 px-8 py-4 rounded-md font-bold text-sm tracking-wider hover:bg-black hover:text-white transition-all uppercase"
                  >
                    {buttonText}
                  </a>
                </div>
              )}
            </div>

            <div className={`relative flex justify-center ${imagePosition === 'left' ? 'lg:order-1 lg:justify-start' : 'lg:order-2 lg:justify-end'}`}>
              {image ? (
                <img
                  src={image}
                  alt="Illustration"
                  className="w-full h-auto max-w-[743px] object-contain"
                />
              ) : (
                <div className="w-full aspect-square bg-[#f9fafb] rounded-2xl flex items-center justify-center border-2 border-dashed border-black/5">
                  <span className="text-black/20 font-bold text-xs">NO IMAGE SELECTED</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
