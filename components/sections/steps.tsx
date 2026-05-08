"use client";

import React from "react";
import { SectionProps } from "@/types/section";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";

const defaultSteps = [
  { step: "STEP 01", title: "Expand Your Reach, Locally And Globally", desc: "In today's environment, having a strong presence isn't only challenging but also necessary for success." },
  { step: "STEP 02", title: "Expand Your Reach, Locally And Globally", desc: "In today's environment, having a strong presence isn't only challenging but also necessary for success." },
  { step: "STEP 03", title: "Expand Your Reach, Locally And Globally", desc: "In today's environment, having a strong presence isn't only challenging but also necessary for success." },
  { step: "STEP 04", title: "Expand Your Reach, Locally And Globally", desc: "In today's environment, having a strong presence isn't only challenging but also necessary for success." },
];

export default function ReviewsSection({ id, data = {}, settings, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();
  const {
    heading = "Why Get Reviews Buzz\nis a Trusted Platform\nFor Reviews",
    subheading = "At Get Reviews Buzz, we offer a dependable and efficient solution for businesses looking to boost their Google Business Profile with genuine, high-quality reviews.",
    steps = defaultSteps,
  } = data;

  const handleChange = (field: string, value: string) => {
    dispatch(updateSectionData({ id, data: { [field]: value } }));
  };

  const handleStepChange = (index: number, field: string, value: string) => {
    const updated = steps.map((s: any, i: number) =>
      i === index ? { ...s, [field]: value } : s
    );
    dispatch(updateSectionData({ id, data: { steps: updated } }));
  };

  return (
    <section className="bg-[#fff] py-20 px-10">
      <div className="max-w-[1400] mx-auto">

        {/* Top Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-16 gap-8">
          {isEditing ? (
            <textarea
              className="text-4xl font-semibold leading-tight max-w-xl w-full outline-none border-b border-dashed border-[#fc0] bg-transparent resize-none"
              rows={3}
              value={heading}
              onChange={(e) => handleChange("heading", e.target.value)}
            />
          ) : (
            <h2 className="text-4xl font-semibold leading-tight max-w-xl whitespace-pre-line">
              {heading}
            </h2>
          )}

          {isEditing ? (
            <textarea
              className="max-w-md text-gray-600 text-sm leading-relaxed w-full outline-none border-b border-dashed border-[#fc0] bg-transparent resize-none"
              rows={4}
              value={subheading}
              onChange={(e) => handleChange("subheading", e.target.value)}
            />
          ) : (
            <p className="max-w-md text-gray-600 text-sm leading-relaxed">{subheading}</p>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200] mx-auto">
          {steps.map((item: any, index: number) => (
            <div
              key={index}
              className="group rounded-2xl p-6 h-[380] max-w-[298] flex flex-col justify-between bg-[#F5F5F5] transition-all duration-300 ease-in-out hover:-translate-y-4 hover:shadow-xl hover:bg-gradient-to-b hover:from-[#FCFBEE] hover:to-[#FFBF00]"
            >
              {isEditing ? (
                <input
                  className="text-[20px] text-gray-500 tracking-wider bg-transparent outline-none border-b border-dashed border-[#fc0] w-full"
                  value={item.step}
                  onChange={(e) => handleStepChange(index, "step", e.target.value)}
                />
              ) : (
                <span className="text-[20px] text-gray-500 tracking-wider group-hover:text-gray-700">
                  {item.step}
                </span>
              )}

              <div>
                {isEditing ? (
                  <>
                    <input
                      className="font-semibold text-lg mb-3 w-full bg-transparent outline-none border-b border-dashed border-[#fc0]"
                      value={item.title}
                      onChange={(e) => handleStepChange(index, "title", e.target.value)}
                    />
                    <textarea
                      className="text-sm text-gray-500 leading-relaxed w-full bg-transparent outline-none border-b border-dashed border-[#fc0] resize-none mt-2"
                      rows={3}
                      value={item.desc}
                      onChange={(e) => handleStepChange(index, "desc", e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg mb-3 group-hover:text-black">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-700">{item.desc}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
