"use client";

import React, { useState } from "react";
import { SectionProps } from "@/types/section";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";
import Wrapper from "@/components/ui/Wrapper";
import MediaPickerModal from "../editor/MediaPickerModal";
import { ShieldCheck } from "lucide-react";

const defaultStandards = [
  { title: "Privacy Guarantee", desc: "Secure and confidential handling of all your business information." },
  { title: "Replacement Support", desc: "Protected with one-time replacement support, based on the plan you pick." },
  { title: "Refund Assurance", desc: "Transparent resolution and refund review process for eligible order concerns." },
  { title: "Quality-Focused Delivery", desc: "Content prepared to align naturally with your business needs." },
  { title: "Customer Satisfaction Commitment", desc: "Responsive support, regular updates, and a transparent experience from start to finish." }
];

export default function HowItWorksStandards({ id, data = {}, settings, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();
  const [mediaPicker, setMediaPicker] = useState<{
    isOpen: boolean;
    onSelect: (url: string) => void;
  } | null>(null);

  const openMediaPicker = (onSelect: (url: string) => void) => {
    setMediaPicker({ isOpen: true, onSelect });
  };

  const {
    heading = "Our Service Standards That Put Customer First",
    image = "/uploads/media/1781523255744-7fa65282-960f-4ab2-9fd7-42d29fb8b758-Rectangle-10483.webp",
    standards = defaultStandards
  } = data;

  const handleChange = (field: string, value: any) => {
    dispatch(updateSectionData({ id, data: { [field]: value } }));
  };

  const handleStandardChange = (index: number, field: string, value: string) => {
    const updated = standards.map((item: any, idx: number) =>
      idx === index ? { ...item, [field]: value } : item
    );
    handleChange("standards", updated);
  };

  const containerStyle: React.CSSProperties = {
    padding: settings?.padding || "80px 0",
    margin: settings?.margin || "0",
    backgroundColor: settings?.backgroundColor || "#FFFFFF",
  };

  return (
    <section style={containerStyle} className="w-full font-sans">
      <Wrapper>
        {/* Main Outer Box with Border Radius to overlay image like mockup */}
        <div 
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="relative rounded-[32px] overflow-hidden flex flex-col lg:flex-row items-stretch min-h-[500px] border border-black/5 mx-4 shadow-lg"
        >
          {/* Left Content Card (Width 50%) */}
          <div className="w-full lg:w-[50%] bg-white p-8 md:p-12 flex flex-col justify-center rounded-[32px] m-1 md:m-2.5 z-10">
            {isEditing ? (
              <div className="space-y-1 mb-8">
                <label className="block text-left text-xs text-gray-400">Heading</label>
                <input
                  className="w-full text-[35px] md:text-[42px] border-b border-dashed border-[#FFCD05] bg-transparent outline-none"
                  value={heading}
                  onChange={(e) => handleChange("heading", e.target.value)}
                />
              </div>
            ) : (
              <h2 
                className="text-[35px] md:text-[42px] text-gray-900 leading-tight mb-8"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}

            {/* Standards List */}
            <div className="flex flex-col gap-6">
              {standards.map((item: any, idx: number) => (
                <div key={idx} className="flex items-start gap-4">
                  {/* Badge */}
                  <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                    <img 
                      src="/uploads/media/1781522945576-5acc23f8-60a7-40ce-8859-aafbc569653b-Vector-4-.png"
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Text */}
                  <div className="flex flex-col flex-1">
                    {isEditing ? (
                      <div className="space-y-1">
                        <input
                          className="font-semibold text-[20px] md:text-[24px] text-gray-900 border-b border-dashed border-slate-300 bg-transparent outline-none w-full"
                          value={item.title}
                          onChange={(e) => handleStandardChange(idx, "title", e.target.value)}
                        />
                        <textarea
                          className="text-[18px] text-gray-600 border-b border-dashed border-slate-300 bg-transparent outline-none w-full resize-none"
                          rows={2}
                          value={item.desc}
                          onChange={(e) => handleStandardChange(idx, "desc", e.target.value)}
                        />
                      </div>
                    ) : (
                      <>
                        <h3 
                          className="font-semibold text-[20px] text-gray-900 mb-0.5"
                          dangerouslySetInnerHTML={{ __html: item.title }}
                        />
                        <p 
                          className="text-gray-500 text-[18px] leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: item.desc }}
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit image controls overlayed inside the relative container */}
          {isEditing && (
            <div className="absolute bottom-4 right-4 bg-white/95 p-3 rounded-xl shadow-md space-y-1 z-20 w-80">
              <label className="text-xs font-bold text-gray-500">Background Image URL</label>
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
