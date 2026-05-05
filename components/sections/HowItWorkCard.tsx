"use client";

import React from "react";
import { SectionProps } from "@/types/section";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";

const defaultSteps = [
  { 
    title: "Pick A Review", 
    desc: "Choose The Type And Number Of Google Reviews You Want To Improve Your Company's Profile.", 
    color: "bg-yellow-100", 
    icon: { href: "/uploads/media/1777977982660-8109977b-4427-4a5e-955a-11ba0bb2ac91-rating-1.svg" } 
  },
  { 
    title: "Select Your Package", 
    desc: "Pick The Number Of Reviews Or The Service Package That Fits Your Needs.", 
    color: "bg-blue-100", 
    icon: { href: "/uploads/media/1777978008677-ecbb379c-db78-4858-84fe-1d5559314feb-XMLID-991-.svg" } 
  },
  { 
    title: "Configure & Order", 
    desc: "Buy Google Reviews With A Secure, One-Step Checkout And Your Preferred Payment Method.", 
    color: "bg-green-100", 
    icon: { href: "/uploads/media/1777978022187-e61c5a1a-4fe8-41d4-9e55-a6c5f33f2cb5-Group-844.svg" } 
  },
  { 
    title: "Fill Business Details", 
    desc: "Include Your Google Business Profile (GBP) Link And Any Customization Instructions.", 
    color: "bg-indigo-100", 
    icon: { href: "/uploads/media/1777978039825-2a6a3096-e833-42c5-8286-e4b1a7a10566-Group-846.svg" } 
  },
];

// Scattered default positions to match your image
const defaultPositions = [
  "-rotate-8 translate-y-4",
  "rotate-10 -translate-y-0",
  "-rotate-8 translate-y-4",
  "rotate-10 translate-y-4",
];

export default function HowItWorks({ id, data = {}, settings, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();
  const {
    heading = "How It Works in <strong>4 Simple Steps</strong>",
    subheading = "Our process is quick, simple, and designed to help you improve your online reputation effortlessly.",
    steps = defaultSteps,
  } = data;

  const handleStepChange = (index: number, field: string, value: string | { href: string }) => {
    const updated = steps.map((s: any, i: number) =>
      i === index ? { ...s, [field]: value } : s
    );
    dispatch(updateSectionData({ id, data: { steps: updated } }));
  };

  const handleChange = (field: string, value: string) => {
    dispatch(updateSectionData({ id, data: { [field]: value } }));
  };

  return (
<section className="bg-[#F9F9F9]/70 py-24 px-6">
      <div className="max-w-[1500px] mx-auto text-center">

        {/* Heading */}
        {isEditing ? (
          <input
            className="text-4xl font-semibold text-gray-900 w-full text-center outline-none border-b border-dashed border-[#fc0] bg-transparent mb-2"
            value={heading.replace(/<[^>]*>/g, "")}
            onChange={(e) => handleChange("heading", e.target.value)}
          />
        ) : (
          <h2
            className="text-4xl font-semibold text-gray-900"
            dangerouslySetInnerHTML={{ __html: heading }}
          />
        )}

        {isEditing ? (
          <textarea
            className="mt-4 text-gray-600 max-w-2xl mx-auto w-full text-center outline-none border-b border-dashed border-[#fc0] bg-transparent resize-none"
            rows={2}
            value={subheading}
            onChange={(e) => handleChange("subheading", e.target.value)}
          />
        ) : (
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">{subheading}</p>
        )}

        {/* Cards Container with 'group' class */}
        <div className="group flex flex-wrap justify-center gap-6 mt-16">
          {steps.map((step: any, i: number) => (
            <div
              key={i}
              // Added `flex flex-col` to the card classes
              className={`relative flex flex-col w-[317px] h-[336px] bg-white rounded-2xl p-6 text-left border border-gray-200 shadow-sm transition-all duration-500 ease-out transform-gpu ${defaultPositions[i]} group-hover:rotate-0 group-hover:translate-y-0 group-hover:shadow-lg hover:!scale-105 hover:z-10`}
            >
              {/* Icon */}
             <div>
                {isEditing ? (
                  <input
                    className="text-xs w-full text-center outline-none bg-transparent"
                    value={step.icon?.href || ""} 
                    onChange={(e) => handleStepChange(i, "icon", { href: e.target.value })}
                    title="Enter Image URL"
                    placeholder="Image URL..."
                  />
                ) : (
                  <img 
                    src={step.icon?.href} 
                    alt={step.title} 
                    className="w-[82px] h-[82px] object-contain" 
                  />
                )}
              </div>

              {/* Text Wrapper with mt-auto to push everything inside to the bottom */}
              <div className="mt-auto mb-[20px]">
                {/* Title */}
                {isEditing ? (
                  <input
                    className="font-semibold text-lg text-gray-900 w-full outline-none border-b border-dashed border-[#fc0] bg-transparent"
                    value={step.title}
                    onChange={(e) => handleStepChange(i, "title", e.target.value)}
                  />
                ) : (
                  <h3 className="font-semibold text-lg text-gray-900">{step.title}</h3>
                )}

                {/* Desc */}
                {isEditing ? (
                  <textarea
                    className="mt-3 text-gray-600 text-sm leading-relaxed w-full outline-none border-b border-dashed border-[#fc0] bg-transparent resize-none"
                    rows={4}
                    value={step.desc}
                    onChange={(e) => handleStepChange(i, "desc", e.target.value)}
                  />
                ) : (
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}