"use client";

import React from "react";
import { SectionProps } from "@/types/section";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";
import Wrapper from "@/components/ui/Wrapper";
import { Star } from "lucide-react";

export default function HowItWorksHero({ id, data = {}, settings, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();

  const {
    title = "Get More Reviews & Build A Strong Brand Reputation",
    highlightText = "A Strong Brand Reputation",
    subtitle = "A simple and transparent review management process designed to support local reputation management, business reputation growth, and stronger customer confidence across major platforms.",
    primaryBtnText = "Get Reviews Now",
    primaryBtnLink = "#",
    showPrimaryButton = true,
    secondaryBtnText = "Get Reviews Now",
    secondaryBtnLink = "#",
    showSecondaryButton = true,

    badges = [
      "1000 + Businesses trust Get Reviews Buzz",
      "Supporting 80+ Platforms",
      "Flexible Review Packages",
      "Timely and Consistent Delivery"
    ]
  } = data;

  const handleChange = (field: string, value: any) => {
    dispatch(updateSectionData({ id, data: { [field]: value } }));
  };

  const handleBadgeChange = (index: number, value: string) => {
    const updated = [...badges];
    updated[index] = value;
    handleChange("badges", updated);
  };

  // Safe styling mapping
  const containerStyle: React.CSSProperties = {
    padding: settings?.padding || "80px 0 0px 0",
    margin: settings?.margin || "0",
    backgroundColor: settings?.backgroundColor || "#FFFDF6",
  };

  // Split title to insert highlights
  const renderTitle = () => {
    if (!highlightText) return title;
    const parts = title.split(highlightText);
    if (parts.length <= 1) return title;
    return (
      <>
        {parts[0]}
        <span className="text-[#FFCD05] italic font-semibold">{highlightText}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <section style={containerStyle} className="w-full font-sans overflow-hidden">
      <Wrapper>
        <div className="flex flex-col items-center text-center  mx-auto px-4 pb-16">
          {/* Title Edit */}
          {isEditing ? (
            <div className="w-full space-y-2 mb-4">
              <label className="block text-left text-xs font-bold text-gray-500 uppercase">Title</label>
              <textarea
                className="w-full text-3xl md:text-5xl font-semibold leading-[1.25] text-[#111] bg-transparent border-b border-dashed border-[#FFCD05] outline-none resize-none text-center"
                rows={2}
                value={title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              <label className="block text-left text-xs font-bold text-gray-500 uppercase">Highlighted text</label>
              <input
                className="w-full text-sm font-semibold text-center bg-transparent border-b border-dashed border-[#FFCD05] outline-none"
                value={highlightText}
                onChange={(e) => handleChange("highlightText", e.target.value)}
              />
            </div>
          ) : (
            <h1 className="text-3xl md:text-5xl font-normal leading-[1.25] text-[#111] mb-6" style={{fontSize: settings.titleSize || '40px'}}>
              {renderTitle()}
            </h1>
          )}

          {/* Subtitle Edit */}
          {isEditing ? (
            <div className="w-full space-y-2 mb-8">
              <label className="block text-left text-xs font-bold text-black uppercase">Subtitle</label>
              <textarea
                className="w-full text-base text-gray-600 bg-transparent border-b border-dashed border-[#FFCD05] outline-none resize-none text-center"
                rows={3}
                value={subtitle}
                onChange={(e) => handleChange("subtitle", e.target.value)}
              />
            </div>
          ) : (
            <p 
              className="text-base md:text-lg text-black max-w-[900px] leading-[1.6] mb-8"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}

          {/* Button Editor */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {showPrimaryButton !== false && (
              isEditing ? (
                <div className="w-full sm:w-auto space-y-1">
                  <input
                    className="w-full text-xs font-bold text-center bg-transparent border-b border-dashed border-[#FFCD05]"
                    placeholder="Primary Button Text"
                    value={primaryBtnText}
                    onChange={(e) => handleChange("primaryBtnText", e.target.value)}
                  />
                  <input
                    className="w-full text-xs text-center bg-transparent border-b border-dashed border-[#FFCD05]"
                    placeholder="Primary Button Link"
                    value={primaryBtnLink}
                    onChange={(e) => handleChange("primaryBtnLink", e.target.value)}
                  />
                </div>
              ) : (
                <a
                  href={primaryBtnLink}
                  className="inline-block px-8 py-4 bg-[#FFCD05] text-black font-semibold rounded-lg shadow-md hover:bg-[#FFE26E] transition-all transform hover:-translate-y-0.5 text-center min-w-[200px]"
                >
                  {primaryBtnText}
                </a>
              )
            )}

            {showSecondaryButton !== false && (
              isEditing ? (
                <div className="w-full sm:w-auto space-y-1">
                  <input
                    className="w-full text-xs font-bold text-center bg-transparent border-b border-dashed border-[#FFCD05]"
                    placeholder="Secondary Button Text"
                    value={secondaryBtnText}
                    onChange={(e) => handleChange("secondaryBtnText", e.target.value)}
                  />
                  <input
                    className="w-full text-xs text-center bg-transparent border-b border-dashed border-[#FFCD05]"
                    placeholder="Secondary Button Link"
                    value={secondaryBtnLink}
                    onChange={(e) => handleChange("secondaryBtnLink", e.target.value)}
                  />
                </div>
              ) : (
                <a
                  href={secondaryBtnLink}
                  className="inline-block px-8 py-4 bg-white border border-gray-200 text-black font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-all transform hover:-translate-y-0.5 text-center min-w-[200px]"
                >
                  {secondaryBtnText}
                </a>
              )
            )}
          </div>
        </div>
      </Wrapper>

      {/* Badges strip banner */}
      <div className="w-full bg-[#FFFCE8] border-t border-[#FFCD05]/30 py-5">
        <Wrapper>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {badges.map((badge: string, idx: number) => (
              <div key={idx} className="flex items-center justify-center gap-2.5 text-center lg:text-left">
                <Star className="w-5 h-5 fill-[#FFCD05] text-[#FFCD05] shrink-0" />
                {isEditing ? (
                  <input
                    className="text-sm font-medium text-gray-800 bg-transparent border-b border-dashed border-[#FFCD05] outline-none"
                    value={badge}
                    onChange={(e) => handleBadgeChange(idx, e.target.value)}
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-800">{badge}</span>
                )}
              </div>
            ))}
          </div>
        </Wrapper>
      </div>
    </section>
  );
}
