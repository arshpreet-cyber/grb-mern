"use client";

import React, { useState } from "react";
import { SectionProps } from "@/types/section";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";
import MediaPickerModal from "../editor/MediaPickerModal";

export default function HowItWorksCTA({ id, data = {}, settings, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();
  const [mediaPicker, setMediaPicker] = useState<{
    isOpen: boolean;
    onSelect: (url: string) => void;
  } | null>(null);

  const openMediaPicker = (onSelect: (url: string) => void) => {
    setMediaPicker({ isOpen: true, onSelect });
  };

  const {
    heading = "Your Future Customers Are Already Checking <span class='font-semibold'>Your Reviews. Let's Get Started!</span>",
    subheading = "Every day, your rating sits neglected; competitors take your customers. You've seen our process, our principles, and our proof. Now it's time to act.",
    btnText = "Get Reviews Now",
    btnLink = "/",
    image = "https://beta.getreviews.buzz/storage/app/blog/0707270001780033172_Group-1000008234.webp"
  } = data;

  const handleChange = (field: string, value: any) => {
    dispatch(updateSectionData({ id, data: { [field]: value } }));
  };

  const containerStyle: React.CSSProperties = {
    padding: settings?.padding,
    margin: settings?.margin,
    backgroundColor: settings?.backgroundColor,
  };

  return (
    <section 
      style={containerStyle} 
      className="bg-gradient-to-b from-[#FFE26E] to-[#FFCD05] py-16 md:py-20 px-5"
    >
      <div className="w-full max-w-[1500px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Left Text content */}
        <div className="w-full lg:max-w-[685px] text-center lg:text-left flex flex-col items-center lg:items-start">
          {isEditing ? (
            <div className="space-y-3 w-full">
              <label className="block text-left text-xs font-bold text-gray-800">Heading (HTML Allowed)</label>
              <input
                className="w-full text-2xl md:text-3xl font-bold border-b border-dashed border-black bg-transparent outline-none"
                value={heading}
                onChange={(e) => handleChange("heading", e.target.value)}
              />
              <label className="block text-left text-xs font-bold text-gray-800">Subheading</label>
              <textarea
                className="w-full text-sm text-black/80 border-b border-dashed border-black bg-transparent outline-none resize-none"
                rows={3}
                value={subheading}
                onChange={(e) => handleChange("subheading", e.target.value)}
              />
            </div>
          ) : (
            <>
              <h2 
                className="text-[28px] md:text-[40px] font-normal leading-[1.25] mb-6 tracking-[-0.5px] text-[#111]"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
              <p 
                className="text-[15px] md:text-[16px] leading-[1.6] font-medium text-black mb-8"
                dangerouslySetInnerHTML={{ __html: subheading }}
              />
            </>
          )}

          {/* Button */}
          {isEditing ? (
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              <input
                className="text-xs text-center border-b border-dashed border-black bg-transparent"
                placeholder="Button Text"
                value={btnText}
                onChange={(e) => handleChange("btnText", e.target.value)}
              />
              <input
                className="text-xs text-center border-b border-dashed border-black bg-transparent"
                placeholder="Button Link"
                value={btnLink}
                onChange={(e) => handleChange("btnLink", e.target.value)}
              />
            </div>
          ) : (
            <a
              href={btnLink}
              className="inline-flex items-center gap-2 bg-black text-white px-7 py-4 rounded-[10px] font-medium text-[15px] transition hover:bg-[#222] hover:-translate-y-0.5"
            >
              {btnText} <span className="text-[1.1rem]">→</span>
            </a>
          )}
        </div>

        {/* Right Image */}
        <div className="hidden lg:flex flex-1 justify-center items-center">
          <div className="relative w-full max-w-[712px]">
            <img
              src={image}
              alt="Customer checking reviews"
              className="w-full object-contain rounded-[24px]"
            />
            {isEditing && (
              <div className="absolute -bottom-4 right-4 bg-white/95 p-3 rounded-xl shadow-md space-y-1 z-20 w-80 border border-gray-200">
                <label className="text-xs font-bold text-gray-500">Image URL</label>
                <div className="flex gap-2">
                  <input
                    className="w-full text-xs text-gray-600 border border-gray-300 rounded px-1.5 py-1"
                    value={image}
                    onChange={(e) => handleChange("image", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => openMediaPicker((url) => handleChange("image", url))}
                    className="rounded bg-[#FFCD05] px-2 py-1 text-xs font-bold text-black hover:bg-[#FFE26E] cursor-pointer transition shrink-0"
                  >
                    Browse
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
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
