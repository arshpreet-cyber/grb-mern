"use client";

import React from "react";
import { SectionProps } from "@/types/section";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";

export default function BenefitsSection({ id, data = {}, settings, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();
  const platform = data.platform || "Google";

  const defaultBenefits = [
    {
      badge: "01",
      title: "LOCAL SEO RANKINGS",
      description: `${platform} uses reviews as a ranking factor for local searches. A higher ${platform} Business Profile ranking will put you in the top results when prospective clients look for businesses similar to yours.`,
    },
    {
      badge: "02",
      title: "IMPROVE ONLINE VISIBILITY",
      description: `A well reviewed business will appear higher in ${platform} search results, making it easier for potential customers to find. More reviews boost your company's reliability and local-global reach.`,
    },
    {
      badge: "03",
      title: "BUILD TRUST",
      description: `People read reviews before they buy or visit a business. Paid ${platform} reviews reassure potential customers about your quality and dependability, leading them to choose you over competitors.`,
    },
    {
      badge: "04",
      title: "INCREASE CONVERSIONS",
      description: `Reviews are social proof and influence buying decisions. Businesses that receive more ${platform} 5 star reviews have higher conversion rates because customers feel more confident in their choices.`,
    },
  ];

  const {
    heading = `Benefits of Buying ${platform} Reviews`,
    subheading = `Below are the advantages of buying ${platform} reviews online, demonstrating how it improves your business profile:`,
    centerImage = "/uploads/media/benefits_center_image.png",
    benefits = defaultBenefits,
  } = data;

  const handleBenefitChange = (index: number, field: string, value: string) => {
    const updated = benefits.map((b: any, i: number) =>
      i === index ? { ...b, [field]: value } : b
    );
    dispatch(updateSectionData({ id, data: { benefits: updated } }));
  };

  const handleChange = (field: string, value: string) => {
    dispatch(updateSectionData({ id, data: { [field]: value } }));
  };

  // Group benefits into left (0, 2) and right (1, 3) columns matching the 01/03 and 02/04 layout
  const leftBenefits = [benefits[0] || defaultBenefits[0], benefits[2] || defaultBenefits[2]];
  const rightBenefits = [benefits[1] || defaultBenefits[1], benefits[3] || defaultBenefits[3]];

  return (
    <section
      className="w-full font-sans antialiased text-[#1A1A1A] select-none"
      style={{
        padding: settings?.padding || "80px 0",
        margin: settings?.margin,
        backgroundColor: settings?.backgroundColor || "#FFFFFF",
      }}
    >
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col items-center">
        {/* Header Area */}
        <div className="text-center max-w-3xl mb-16">
          {isEditing ? (
            <input
              className="text-3xl md:text-4xl font-semibold text-center text-gray-900 w-full outline-none border-b border-dashed border-[#fc0] bg-transparent pb-1 mb-3"
              value={heading}
              onChange={(e) => handleChange("heading", e.target.value)}
              placeholder="Benefits of Buying Reviews"
            />
          ) : (
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
              {heading}
            </h2>
          )}

          {isEditing ? (
            <textarea
              className="mt-4 text-gray-500 text-sm md:text-base leading-relaxed text-center w-full outline-none border-b border-dashed border-[#fc0] bg-transparent resize-none"
              rows={2}
              value={subheading}
              onChange={(e) => handleChange("subheading", e.target.value)}
              placeholder="Section subheading description..."
            />
          ) : (
            <p className="mt-4 text-gray-500 text-sm md:text-base leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        {/* 3-Column Content Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 items-stretch">
          
          {/* Left Column (Benefits 01 & 03) */}
          <div className="flex flex-col justify-between gap-8">
            {leftBenefits.map((item, idx) => {
              // Map local index back to global index (0 or 2)
              const globalIdx = idx === 0 ? 0 : 2;
              return (
                <div
                  key={globalIdx}
                  className="flex-1 bg-[#FAFAF9] rounded-[24px] p-8 flex flex-col justify-start border border-gray-100/50 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md"
                >
                  {/* Badge Number */}
                  <div className="flex items-center justify-between">
                    {isEditing ? (
                      <input
                        className="w-12 h-10 bg-[#2A2A2D] text-white rounded-xl text-center text-sm font-bold outline-none"
                        value={item.badge}
                        onChange={(e) => handleBenefitChange(globalIdx, "badge", e.target.value)}
                        placeholder="01"
                      />
                    ) : (
                      <span className="w-12 h-10 bg-[#2A2A2D] text-white rounded-xl flex items-center justify-center text-sm font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  {isEditing ? (
                    <input
                      className="font-bold text-sm tracking-wider text-gray-800 uppercase mt-6 mb-3 w-full bg-transparent outline-none border-b border-dashed border-[#fc0] pb-0.5"
                      value={item.title}
                      onChange={(e) => handleBenefitChange(globalIdx, "title", e.target.value)}
                      placeholder="Benefit Title"
                    />
                  ) : (
                    <h3 className="font-bold text-sm tracking-wider text-gray-800 uppercase mt-6 mb-3">
                      {item.title}
                    </h3>
                  )}

                  {/* Description */}
                  {isEditing ? (
                    <textarea
                      className="text-[13px] leading-relaxed text-gray-600 w-full bg-transparent outline-none border-b border-dashed border-[#fc0] resize-none flex-1 mt-1 min-h-[80px]"
                      rows={3}
                      value={item.description}
                      onChange={(e) => handleBenefitChange(globalIdx, "description", e.target.value)}
                      placeholder="Benefit description..."
                    />
                  ) : (
                    <p className="text-[13px] leading-relaxed text-gray-600 flex-1">
                      {item.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Center Column (Visual Image Card) */}
          <div className="flex items-center justify-center rounded-[32px] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm relative group min-h-[350px] lg:min-h-auto">
            {isEditing ? (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs font-semibold mb-2">Center Image URL</span>
                <input
                  className="w-full px-3 py-2 bg-white text-gray-800 rounded-md text-xs outline-none focus:ring-2 focus:ring-[#fc0]"
                  value={centerImage}
                  onChange={(e) => handleChange("centerImage", e.target.value)}
                  placeholder="Image URL..."
                />
              </div>
            ) : null}
            <img
              src={centerImage}
              alt="Section Showcase Visual"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Right Column (Benefits 02 & 04) */}
          <div className="flex flex-col justify-between gap-8">
            {rightBenefits.map((item, idx) => {
              // Map local index back to global index (1 or 3)
              const globalIdx = idx === 0 ? 1 : 3;
              return (
                <div
                  key={globalIdx}
                  className="flex-1 bg-[#FAFAF9] rounded-[24px] p-8 flex flex-col justify-start border border-gray-100/50 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md"
                >
                  {/* Badge Number */}
                  <div className="flex items-center justify-between">
                    {isEditing ? (
                      <input
                        className="w-12 h-10 bg-[#2A2A2D] text-white rounded-xl text-center text-sm font-bold outline-none"
                        value={item.badge}
                        onChange={(e) => handleBenefitChange(globalIdx, "badge", e.target.value)}
                        placeholder="02"
                      />
                    ) : (
                      <span className="w-12 h-10 bg-[#2A2A2D] text-white rounded-xl flex items-center justify-center text-sm font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  {isEditing ? (
                    <input
                      className="font-bold text-sm tracking-wider text-gray-800 uppercase mt-6 mb-3 w-full bg-transparent outline-none border-b border-dashed border-[#fc0] pb-0.5"
                      value={item.title}
                      onChange={(e) => handleBenefitChange(globalIdx, "title", e.target.value)}
                      placeholder="Benefit Title"
                    />
                  ) : (
                    <h3 className="font-bold text-sm tracking-wider text-gray-800 uppercase mt-6 mb-3">
                      {item.title}
                    </h3>
                  )}

                  {/* Description */}
                  {isEditing ? (
                    <textarea
                      className="text-[13px] leading-relaxed text-gray-600 w-full bg-transparent outline-none border-b border-dashed border-[#fc0] resize-none flex-1 mt-1 min-h-[80px]"
                      rows={3}
                      value={item.description}
                      onChange={(e) => handleBenefitChange(globalIdx, "description", e.target.value)}
                      placeholder="Benefit description..."
                    />
                  ) : (
                    <p className="text-[13px] leading-relaxed text-gray-600 flex-1">
                      {item.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
