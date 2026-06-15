"use client";

import React, { useState } from "react";
import { SectionProps } from "@/types/section";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";
import Wrapper from "@/components/ui/Wrapper";
import MediaPickerModal from "../editor/MediaPickerModal";
import { ShieldCheck } from "lucide-react";

const defaultTrustCards = [
  { title: "7+ Years Experience", desc: "Trusted reputation management expertise across multiple industries." },
  { title: "10000+ Orders Delivered", desc: "Successfully completed campaigns for businesses worldwide." },
  { title: "95% Client Satisfaction", desc: "Focused on transparency, support, and organized delivery." },
  { title: "Authentic Review Content", desc: "Personalized content tailored to your business needs." },
  { title: "Streamlined Delivery Workflow", desc: "Optimized processes designed for smooth and timely campaign management." },
  { title: "Search-Friendly Review Strategy", desc: "Content designed to support online visibility and brand relevance." }
];

export default function HowItWorksWhyTrust({ id, data = {}, settings, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();
  const [mediaPicker, setMediaPicker] = useState<{
    isOpen: boolean;
    onSelect: (url: string) => void;
  } | null>(null);

  const openMediaPicker = (onSelect: (url: string) => void) => {
    setMediaPicker({ isOpen: true, onSelect });
  };

  const {
    heading = "Why Do Customers Trust Our Process?",
    image = "https://beta.getreviews.buzz/storage/app/blog/0470557001779956136_Rectangle-10048.webp",
    cards = defaultTrustCards
  } = data;

  const handleChange = (field: string, value: any) => {
    dispatch(updateSectionData({ id, data: { [field]: value } }));
  };

  const handleCardChange = (index: number, field: string, value: string) => {
    const updated = cards.map((card: any, idx: number) =>
      idx === index ? { ...card, [field]: value } : card
    );
    handleChange("cards", updated);
  };

  const containerStyle: React.CSSProperties = {
    padding: settings?.padding || "80px 0",
    margin: settings?.margin || "0",
    backgroundColor: settings?.backgroundColor || "#FFFFFF",
  };

  return (
    <section style={containerStyle} className="w-full font-sans">
      <Wrapper>
        {/* Main Header */}
        <div className="text-center max-w-[850px] mx-auto px-4 mb-16">
          {isEditing ? (
            <div className="space-y-1">
              <label className="block text-left text-xs font-bold text-gray-400">Heading</label>
              <input
                className="w-full text-2xl md:text-3xl font-semibold text-center border-b border-dashed border-[#FFCD05] bg-transparent outline-none"
                value={heading}
                onChange={(e) => handleChange("heading", e.target.value)}
              />
            </div>
          ) : (
            <h2 
              className="text-2xl md:text-3xl font-normal text-gray-900 leading-tight"
              dangerouslySetInnerHTML={{ __html: heading }}
            />
          )}
        </div>

        {/* Layout: Side Image and Card Grid */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12 px-4">
          {/* Left Side: Image with dots grid */}
          <div className="w-full lg:w-[48%] flex flex-col items-center">
            <div className="relative group/img w-full max-w-[540px]">
              {/* Decorative Dots */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[radial-gradient(#FFE26E_2px,transparent_2px)] [background-size:12px_12px] opacity-70 -z-10" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[radial-gradient(#FFE26E_2px,transparent_2px)] [background-size:12px_12px] opacity-70 -z-10" />

              <div className="w-full rounded-[24px] overflow-hidden shadow-lg border border-black/5 aspect-[3/4] bg-slate-50">
                <img
                  src={image}
                  alt={heading}
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out transform group-hover/img:scale-105"
                />
              </div>
            </div>
            {isEditing && (
              <div className="mt-4 w-full max-w-[540px] space-y-1">
                <label className="text-xs font-bold text-gray-400">Image URL</label>
                <div className="flex gap-2">
                  <input
                    className="w-full text-xs text-gray-500 border-b border-dashed border-slate-400 bg-transparent outline-none"
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

          {/* Right Side: 2-Column Cards Grid */}
          <div className="w-full lg:w-[48%] grid grid-cols-1 sm:grid-cols-2 gap-5">
            {cards.map((card: any, idx: number) => (
              <div
                key={idx}
                className="bg-[rgba(245,245,245,0.6)] hover:bg-[#FFFCE8]/60 border border-gray-100 hover:border-amber-300 rounded-[20px] p-6 flex flex-col justify-between min-h-[180px] transition-all duration-300"
              >
                {/* Shield Check Icon */}
                <div className="w-7 h-7 flex items-center justify-center mb-4">
                  <img
                    src="/uploads/media/1781524369913-5421bd04-bc78-43bc-8629-479e607be450-Vector-5-.png"
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content */}
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        className="font-semibold text-[20px] text-gray-900 border-b border-dashed border-slate-300 bg-transparent outline-none w-full"
                        value={card.title}
                        onChange={(e) => handleCardChange(idx, "title", e.target.value)}
                      />
                      <textarea
                        className="text-[18px] text-gray-600 border-b border-dashed border-slate-300 bg-transparent outline-none w-full resize-none"
                        rows={2}
                        value={card.desc}
                        onChange={(e) => handleCardChange(idx, "desc", e.target.value)}
                      />
                    </div>
                  ) : (
                    <>
                      <h3 
                        className="font-semibold text-[20px] text-gray-900 mb-2"
                        dangerouslySetInnerHTML={{ __html: card.title }}
                      />
                      <p 
                        className="text-gray-600 text-[18px] leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: card.desc }}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
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
