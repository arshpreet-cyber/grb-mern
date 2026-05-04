"use client";

import React from "react";
import { SectionProps } from "@/types/section";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";

const defaultSteps = [
  { title: "Pick A Review", desc: "Choose The Type And Number Of Google Reviews You Want To Improve Your Company's Profile.", color: "bg-yellow-100", icon: "⭐" },
  { title: "Select Your Package", desc: "Pick The Number Of Reviews Or The Service Package That Fits Your Needs.", color: "bg-blue-100", icon: "📝" },
  { title: "Configure & Order", desc: "Buy Google Reviews With A Secure, One-Step Checkout And Your Preferred Payment Method.", color: "bg-green-100", icon: "🛒" },
  { title: "Fill Business Details", desc: "Include Your Google Business Profile (GBP) Link And Any Customization Instructions.", color: "bg-indigo-100", icon: "📄" },
];

const transforms = [
  "group-hover:-translate-y-6 group-hover:-translate-x-6 group-hover:-rotate-3",
  "group-hover:-translate-y-12 group-hover:rotate-1",
  "group-hover:-translate-y-8 group-hover:translate-x-6 group-hover:rotate-3",
  "group-hover:-translate-y-4 group-hover:translate-x-10 group-hover:rotate-6",
];

export default function HowItWorks({ id, data = {}, settings, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();
  const {
    heading = "How It Works in <strong>4 Simple Steps</strong>",
    subheading = "Our process is quick, simple, and designed to help you improve your online reputation effortlessly.",
    steps = defaultSteps,
  } = data;

  const handleStepChange = (index: number, field: string, value: string) => {
    const updated = steps.map((s: any, i: number) =>
      i === index ? { ...s, [field]: value } : s
    );
    dispatch(updateSectionData({ id, data: { steps: updated } }));
  };

  const handleChange = (field: string, value: string) => {
    dispatch(updateSectionData({ id, data: { [field]: value } }));
  };

  return (
    <section className="bg-[#f7f7f7] py-24 px-6">
      <div className="max-w-[1500] mx-auto text-center">

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

        {/* Cards */}
        <div className="group flex flex-wrap justify-center gap-6 mt-16">
          {steps.map((step: any, i: number) => (
            <div
              key={i}
              className={`w-[260px] bg-white rounded-2xl p-6 text-left border border-gray-200 shadow-sm transition-all duration-500 ease-out transform-gpu ${transforms[i]} group-hover:shadow-xl`}
              style={{
                transform: `rotate(${i % 2 === 0 ? "-2deg" : "2deg"})`,
                transitionDelay: `${i * 100}ms`,
              }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 flex items-center justify-center rounded-xl ${step.color}`}>
                {isEditing ? (
                  <input
                    className="text-2xl w-12 text-center outline-none bg-transparent"
                    value={step.icon}
                    onChange={(e) => handleStepChange(i, "icon", e.target.value)}
                    title="Enter emoji or text"
                  />
                ) : (
                  <span className="text-2xl">{step.icon}</span>
                )}
              </div>

              {/* Color picker */}
              {isEditing && (
                <select
                  className="mt-2 text-xs border border-dashed border-[#fc0] rounded px-1 py-0.5 bg-white w-full"
                  value={step.color}
                  onChange={(e) => handleStepChange(i, "color", e.target.value)}
                >
                  <option value="bg-yellow-100">Yellow</option>
                  <option value="bg-blue-100">Blue</option>
                  <option value="bg-green-100">Green</option>
                  <option value="bg-indigo-100">Indigo</option>
                  <option value="bg-red-100">Red</option>
                  <option value="bg-pink-100">Pink</option>
                  <option value="bg-purple-100">Purple</option>
                  <option value="bg-orange-100">Orange</option>
                </select>
              )}

              {/* Title */}
              {isEditing ? (
                <input
                  className="mt-6 font-semibold text-lg text-gray-900 w-full outline-none border-b border-dashed border-[#fc0] bg-transparent"
                  value={step.title}
                  onChange={(e) => handleStepChange(i, "title", e.target.value)}
                />
              ) : (
                <h3 className="mt-6 font-semibold text-lg text-gray-900">{step.title}</h3>
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
          ))}
        </div>

      </div>
    </section>
  );
}
