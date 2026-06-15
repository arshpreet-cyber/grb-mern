"use client";

import React, { useState } from "react";
import { SectionProps } from "@/types/section";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";
import Wrapper from "@/components/ui/Wrapper";
import * as Icons from "lucide-react";
import MediaPickerModal from "../editor/MediaPickerModal";

// Helper to resolve dynamic icons in Lucide
const DynamicLucideIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    return <Icons.Briefcase className={className} />;
  }
  return <IconComponent className={className} />;
};

const defaultSolutions = [
  { title: "Restaurants & Cafes", desc: "Build a stronger local reputation and customer confidence.", iconName: "Utensils" },
  { title: "Local Storefronts", desc: "Attract nearby buyers with high ratings and active local search maps.", iconName: "Store" },
  { title: "Services & Consulting", desc: "Showcase professionalism and client satisfaction to win long-term contracts.", iconName: "Briefcase" },
  { title: "E-commerce & Retail", desc: "Increase conversion rates and minimize shopping cart abandonment.", iconName: "ShoppingCart" },
  { title: "Real Estate & Construction", desc: "Establish trust among home buyers and property investors.", iconName: "Home" },
  { title: "Healthcare & Medical", desc: "Gain patient confidence with safe and compliant review solutions.", iconName: "Heart" },
  { title: "Travel & Hospitality", desc: "Drive more bookings and improve rankings on major reservation portals.", iconName: "Plane" },
  { title: "Tech & Startups", desc: "Build credibility for new software launches and scale search rankings.", iconName: "Rocket" },
  { title: "Professional Services", desc: "Highlight authority and verified client testimonials in your niche.", iconName: "User" },
  { title: "Business Services", desc: "Verify your B2B credibility and stand out in directories.", iconName: "Folder" }
];

export default function HowItWorksSolutions({ id, data = {}, settings, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();
  const [mediaPicker, setMediaPicker] = useState<{
    isOpen: boolean;
    onSelect: (url: string) => void;
  } | null>(null);

  const openMediaPicker = (onSelect: (url: string) => void) => {
    setMediaPicker({ isOpen: true, onSelect });
  };

  const {
    heading = "Reputation Solutions for Every Business Type",
    desc1 = "Every industry faces unique challenges when it comes to managing customer perception.",
    desc2 = "Our reputation solutions are designed to support businesses across a wide range of sectors, helping them showcase customer satisfaction and maintain a strong presence across major review platforms.",
    solutions = defaultSolutions
  } = data;

  const handleChange = (field: string, value: any) => {
    dispatch(updateSectionData({ id, data: { [field]: value } }));
  };

  const handleSolutionChange = (index: number, field: string, value: string) => {
    const updated = solutions.map((item: any, idx: number) =>
      idx === index ? { ...item, [field]: value } : item
    );
    handleChange("solutions", updated);
  };

  const addSolution = () => {
    const newSolution = { title: "New Business Type", desc: "Description of the solution.", iconName: "Briefcase" };
    handleChange("solutions", [...solutions, newSolution]);
  };

  const deleteSolution = (index: number) => {
    const updated = solutions.filter((_: any, idx: number) => idx !== index);
    handleChange("solutions", updated);
  };

  const containerStyle: React.CSSProperties = {
    padding: settings?.padding || "80px 0",
    margin: settings?.margin || "0",
    backgroundColor: settings?.backgroundColor || "#FFFDF6",
  };

  return (
    <section style={containerStyle} className="w-full font-sans">
      <Wrapper>
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16 px-4">
          
          {/* Left Text Column (Width 40%) */}
          <div className="w-full lg:w-[40%] flex flex-col lg:sticky lg:top-28 self-start">
            {isEditing ? (
              <div className="space-y-3">
                <label className="block text-left text-xs font-bold text-gray-400">Heading</label>
                <input
                  className="w-full text-2xl md:text-3xl font-semibold border-b border-dashed border-[#FFCD05] bg-transparent outline-none"
                  value={heading}
                  onChange={(e) => handleChange("heading", e.target.value)}
                />
                <label className="block text-left text-xs font-bold text-gray-400">Subtitle 1</label>
                <textarea
                  className="w-full text-sm text-gray-700 border-b border-dashed border-[#FFCD05] bg-transparent outline-none resize-none"
                  rows={2}
                  value={desc1}
                  onChange={(e) => handleChange("desc1", e.target.value)}
                />
                <label className="block text-left text-xs font-bold text-gray-400">Subtitle 2</label>
                <textarea
                  className="w-full text-sm text-gray-700 border-b border-dashed border-[#FFCD05] bg-transparent outline-none resize-none"
                  rows={3}
                  value={desc2}
                  onChange={(e) => handleChange("desc2", e.target.value)}
                />
              </div>
            ) : (
              <>
                <h2 
                  className="text-2xl md:text-3xl font-normal text-gray-900 leading-tight mb-6"
                  dangerouslySetInnerHTML={{ __html: heading }}
                />
                <p 
                  className="text-gray-700 text-sm md:text-base leading-relaxed mb-4"
                  dangerouslySetInnerHTML={{ __html: desc1 }}
                />
                <p 
                  className="text-gray-500 text-xs md:text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: desc2 }}
                />
              </>
            )}
          </div>

          {/* Right Solutions List Column (Width 55%) */}
          <div className="w-full lg:w-[55%] flex flex-col gap-5">
            {solutions.map((item: any, idx: number) => (
              <div
                key={idx}
                className="bg-[rgba(245,245,245,0.6)] hover:bg-[#FFFCE8]/60 border border-gray-100 hover:border-amber-300 rounded-[20px] p-6 flex flex-col justify-between min-h-[180px] transition-all duration-300"
              >
                {/* Icon box */}
                <div className="w-7 h-7 flex items-center justify-center mb-4 relative group/icon-edit">
                  {item.iconUrl ? (
                    <img src={item.iconUrl} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <DynamicLucideIcon name={item.iconName} className="w-6 h-6 text-black" />
                  )}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => openMediaPicker((url) => handleSolutionChange(idx, "iconUrl", url))}
                      className="absolute -top-1.5 -right-1.5 bg-[#FFCD05] rounded-full p-1 shadow-md hover:bg-[#FFE26E] transition cursor-pointer z-10"
                      title="Change Icon"
                    >
                      <Icons.Upload className="w-2.5 h-2.5 text-black" />
                    </button>
                  )}
                </div>

                {/* Content */}
                <div>
                  {isEditing ? (
                    <div className="space-y-1.5">
                      <div className="flex gap-4 items-center">
                        <input
                          className="font-bold text-[20px] text-gray-900 border-b border-dashed border-slate-300 bg-transparent outline-none flex-1"
                          value={item.title}
                          onChange={(e) => handleSolutionChange(idx, "title", e.target.value)}
                        />
                        <input
                          className="text-xs text-gray-400 border-b border-dashed border-slate-300 bg-transparent outline-none w-24"
                          placeholder="Lucide Icon Name"
                          value={item.iconName || ""}
                          onChange={(e) => handleSolutionChange(idx, "iconName", e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => openMediaPicker((url) => handleSolutionChange(idx, "iconUrl", url))}
                          className="rounded bg-[#FFCD05] px-2 py-0.5 text-[10px] font-bold text-black hover:bg-[#FFE26E] cursor-pointer transition shrink-0"
                        >
                          Browse Icon
                        </button>
                      </div>
                      <textarea
                        className="text-[18px] text-gray-600 border-b border-dashed border-slate-300 bg-transparent outline-none w-full resize-none"
                        rows={1}
                        value={item.desc}
                        onChange={(e) => handleSolutionChange(idx, "desc", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => deleteSolution(idx)}
                        className="text-[10px] font-bold text-red-500 hover:text-red-700 transition cursor-pointer mt-1"
                      >
                        Delete Card
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 
                        className="font-bold text-[20px] text-gray-900 mb-2"
                        dangerouslySetInnerHTML={{ __html: item.title }}
                      />
                      <p 
                        className="text-gray-600 text-[18px] leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: item.desc }}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
            {isEditing && (
              <button
                type="button"
                onClick={addSolution}
                className="w-full py-3 border-2 border-dashed border-[#FFCD05] text-[#FFCD05] hover:bg-[#FFCD05]/10 rounded-2xl font-bold text-sm transition cursor-pointer mt-4"
              >
                + Add New Card
              </button>
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
