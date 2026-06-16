"use client";

import React, { useState } from "react";
import { SectionProps } from "@/types/section";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";
import Wrapper from "@/components/ui/Wrapper";
import MediaPickerModal from "../editor/MediaPickerModal";
import { Star } from "lucide-react";

// Inline Storefront SVG component with theme customization
const StorefrontIllustration = ({ color, isHappy }: { color: string; isHappy: boolean }) => {
  return (
    <svg viewBox="0 0 220 140" className="w-full max-w-[200px] h-auto mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ground Line */}
      <line x1="10" y1="130" x2="210" y2="130" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
      
      {/* Building Base */}
      <rect x="35" y="60" width="150" height="70" rx="4" fill="#FFFFFF" stroke={color} strokeWidth="2" />
      
      {/* Windows */}
      <rect x="50" y="80" width="35" height="30" rx="3" fill="#FFFFFF" stroke={color} strokeWidth="2" />
      {isHappy ? (
        <rect x="135" y="80" width="35" height="30" rx="3" fill="#FFFFFF" stroke={color} strokeWidth="2" />
      ) : (
        <rect x="135" y="80" width="35" height="30" rx="3" fill="#FFFFFF" stroke={color} strokeWidth="2" />
      )}
      
      {/* Door */}
      <rect x="98" y="85" width="24" height="45" rx="2" fill={color} />
      
      {/* Closed/Open Hanging Sign */}
      <line x1="104" y1="95" x2="110" y2="92" stroke="#FFFFFF" strokeWidth="1.5" />
      <line x1="116" y1="95" x2="110" y2="92" stroke="#FFFFFF" strokeWidth="1.5" />
      <rect x="103" y="95" width="14" height="8" rx="1" fill="#FFFFFF" stroke={color} strokeWidth="1" />
      
      {/* Roof Awning (Stripes) */}
      <path d="M 25 60 L 195 60 L 185 30 L 35 30 Z" fill="#FFFFFF" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      
      {/* Roof Awning Segments */}
      <path d="M 35 30 L 45 60" stroke={color} strokeWidth="2" />
      <path d="M 60 30 L 70 60" stroke={color} strokeWidth="2" />
      <path d="M 85 30 L 95 60" stroke={color} strokeWidth="2" />
      <path d="M 110 30 L 120 60" stroke={color} strokeWidth="2" />
      <path d="M 135 30 L 145 60" stroke={color} strokeWidth="2" />
      <path d="M 160 30 L 170 60" stroke={color} strokeWidth="2" />
      <path d="M 185 30 L 195 60" stroke={color} strokeWidth="2" />
      
      {/* Color fills for stripes */}
      <path d="M 35 30 L 60 30 L 70 60 L 45 60 Z" fill={color} opacity="0.15" />
      <path d="M 85 30 L 110 30 L 120 60 L 95 60 Z" fill={color} opacity="0.15" />
      <path d="M 135 30 L 160 30 L 170 60 L 145 60 Z" fill={color} opacity="0.15" />
      
      {/* Decorative details */}
      <circle cx="25" cy="85" r="3" fill={color} opacity="0.3" />
      <circle cx="195" cy="75" r="4" fill={color} opacity="0.3" />
      <circle cx="15" cy="50" r="2" fill={color} opacity="0.2" />
    </svg>
  );
};

// Custom Hand SVGs matching the yellow indicators
const ThumbsDownIcon = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 transform rotate-12 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M70,55 C70,65 55,75 40,75 C25,75 25,65 25,55 C25,45 35,40 38,25 C40,15 48,15 48,25 C48,35 48,45 55,45 C62,45 70,45 70,55 Z" fill="#FFCD05" stroke="#D8A720" strokeWidth="2" />
    {/* Fingers details */}
    <path d="M25,50 L35,50" stroke="#D8A720" strokeWidth="2" />
    <path d="M25,57 L35,57" stroke="#D8A720" strokeWidth="2" />
    <path d="M26,64 L36,64" stroke="#D8A720" strokeWidth="2" />
    {/* Thumb pointing down */}
    <path d="M60,45 C65,45 78,38 78,28 C78,20 68,20 60,32" stroke="#D8A720" strokeWidth="2" fill="#FFCD05" />
  </svg>
);

const ThumbsUpIcon = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 transform -rotate-12 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30,45 C30,35 45,25 60,25 C75,25 75,35 75,45 C75,55 65,60 62,75 C60,85 52,85 52,75 C52,65 52,55 45,55 C38,55 30,55 30,45 Z" fill="#FFCD05" stroke="#D8A720" strokeWidth="2" />
    {/* Fingers details */}
    <path d="M75,50 L65,50" stroke="#D8A720" strokeWidth="2" />
    <path d="M75,43 L65,43" stroke="#D8A720" strokeWidth="2" />
    <path d="M74,36 L64,36" stroke="#D8A720" strokeWidth="2" />
    {/* Thumb pointing up */}
    <path d="M40,55 C35,55 22,62 22,72 C22,80 32,80 40,68" stroke="#D8A720" strokeWidth="2" fill="#FFCD05" />
  </svg>
);

const defaultBeforeData = {
  rating: "3.2",
  reviewsCount: "18 Reviews",
  bullets: ["Low Visibility", "Limited Engagement"],
  image: "https://beta.getreviews.buzz/storage/app/blog/0450574001779966320_Group-1000006827.svg"
};

const defaultAfterData = {
  rating: "4.5",
  reviewsCount: "128 Reviews",
  bullets: ["Improved Trust", "Better Customer Confidence"],
  image: "https://beta.getreviews.buzz/storage/app/blog/0901246001779966329_Group-1000006839.svg"
};

export default function HowItWorksBeforeAfter({ id, data = {}, settings, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();
  const [mediaPicker, setMediaPicker] = useState<{
    isOpen: boolean;
    onSelect: (url: string) => void;
  } | null>(null);

  const openMediaPicker = (onSelect: (url: string) => void) => {
    setMediaPicker({ isOpen: true, onSelect });
  };

  const {
    heading = "Before Vs. After Online Reputation Growth",
    subheading = "Transform customer feedback into lasting business growth. A strong online reputation doesn't happen by chance. With a steady flow of genuine positive reviews, your business can strengthen credibility, improve search visibility, and stand out from competitors. As trust grows, customers are more likely to engage with your brand and choose your services with confidence.",
    before = defaultBeforeData,
    after = defaultAfterData
  } = data;

  const handleChange = (field: string, value: any) => {
    dispatch(updateSectionData({ id, data: { [field]: value } }));
  };

  const handleSubFieldChange = (section: "before" | "after", field: string, value: any) => {
    const targetObj = section === "before" ? before : after;
    handleChange(section, { ...targetObj, [field]: value });
  };

  const handleBulletChange = (section: "before" | "after", bulletIdx: number, value: string) => {
    const targetObj = section === "before" ? before : after;
    const updatedBullets = [...targetObj.bullets];
    updatedBullets[bulletIdx] = value;
    handleSubFieldChange(section, "bullets", updatedBullets);
  };

  const containerStyle: React.CSSProperties = {
    padding: settings?.padding || "80px 0",
    margin: settings?.margin || "0",
    backgroundColor: settings?.backgroundColor || "#FFFFFF",
  };

  return (
    <section style={containerStyle} className="w-full font-sans">
      <Wrapper>
        {/* Header */}
        <div className="text-center max-w-[850px] mx-auto px-4 mb-20">
          {isEditing ? (
            <div className="space-y-3">
              <label className="block text-left text-xs font-bold text-gray-400">Heading</label>
              <input
                className="w-full text-2xl md:text-3xl font-semibold text-center border-b border-dashed border-[#FFCD05] bg-transparent outline-none"
                value={heading}
                onChange={(e) => handleChange("heading", e.target.value)}
              />
              <label className="block text-left text-xs font-bold text-gray-400">Subheading</label>
              <textarea
                className="w-full text-sm text-gray-500 text-center border-b border-dashed border-[#FFCD05] bg-transparent outline-none resize-none"
                rows={4}
                value={subheading}
                onChange={(e) => handleChange("subheading", e.target.value)}
              />
            </div>
          ) : (
            <>
              <h2 
                className="text-2xl md:text-3xl font-normal text-gray-900 leading-tight mb-4"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
              <p 
                className="text-gray-600 text-sm md:text-base leading-relaxed max-w-[760px] mx-auto"
                dangerouslySetInnerHTML={{ __html: subheading }}
              />
            </>
          )}
        </div>

        {/* Before / After Columns */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-center max-w-[1000px] mx-auto px-6 mt-12">
          {/* BEFORE COLUMN */}
          <div className="flex-1 w-full max-w-[460px] relative group/before">
            <img
              src={before.image || "https://beta.getreviews.buzz/storage/app/blog/0450574001779966320_Group-1000006827.svg"}
              alt="Before reputation"
              className="w-full h-auto object-contain rounded-[28px]"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/65 rounded-[28px] flex flex-col items-center justify-center p-4 text-center text-white opacity-0 group-hover/before:opacity-100 transition-opacity duration-300 gap-2 z-20">
                <span className="text-xs font-semibold">Before Image URL</span>
                <div className="flex gap-2 w-full px-4">
                  <input
                    className="flex-1 min-w-0 px-3 py-2 bg-white text-gray-800 rounded-md text-xs outline-none"
                    value={before.image || ""}
                    onChange={(e) => handleSubFieldChange("before", "image", e.target.value)}
                    placeholder="Image URL..."
                  />
                  <button
                    type="button"
                    onClick={() => openMediaPicker((url) => handleSubFieldChange("before", "image", url))}
                    className="px-3 py-2 bg-[#FFCD05] text-slate-900 rounded-md font-bold text-xs cursor-pointer shrink-0 transition"
                  >
                    Browse
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* AFTER COLUMN */}
          <div className="flex-1 w-full max-w-[460px] relative group/after">
            <img
              src={after.image || "https://beta.getreviews.buzz/storage/app/blog/0901246001779966329_Group-1000006839.svg"}
              alt="After reputation"
              className="w-full h-auto object-contain rounded-[28px]"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/65 rounded-[28px] flex flex-col items-center justify-center p-4 text-center text-white opacity-0 group-hover/after:opacity-100 transition-opacity duration-300 gap-2 z-20">
                <span className="text-xs font-semibold">After Image URL</span>
                <div className="flex gap-2 w-full px-4">
                  <input
                    className="flex-1 min-w-0 px-3 py-2 bg-white text-gray-800 rounded-md text-xs outline-none"
                    value={after.image || ""}
                    onChange={(e) => handleSubFieldChange("after", "image", e.target.value)}
                    placeholder="Image URL..."
                  />
                  <button
                    type="button"
                    onClick={() => openMediaPicker((url) => handleSubFieldChange("after", "image", url))}
                    className="px-3 py-2 bg-[#FFCD05] text-slate-900 rounded-md font-bold text-xs cursor-pointer shrink-0 transition"
                  >
                    Browse
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Wrapper>
      <MediaPickerModal
        isOpen={mediaPicker?.isOpen || false}
        onClose={() => setMediaPicker(null)}
        onSelect={(url) => {
          mediaPicker?.onSelect(url);
          setMediaPicker(null);
        }}
      />
    </section>
  );
}
