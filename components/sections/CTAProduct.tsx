"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import { SectionProps } from "@/types/section";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";

const defaultIcons = [
  { src: "/uploads/media/1777957032643-47e55815-249d-49f2-bdd8-b0b0cfb22ca7-Group-926.svg", className: "top-20 left-10" },
  { src: "/icons/shop.png", className: "top-16 left-1/4" },
  { src: "/icons/trust.png", className: "top-12 right-1/4" },
  { src: "/icons/facebook.png", className: "top-10 right-10" },
  { src: "http://localhost:3000/uploads/media/1777957627129-d57e7019-a38b-452b-b43d-fe9b0949ebfc-Group-912.svg", className: "top-100 left-10" },
  { src: "/icons/google.png", className: "bottom-16 left-1/4" },
  { src: "/icons/star.png", className: "bottom-16 right-1/4" },
  { src: "/icons/info.png", className: "bottom-10 right-10" },
];

export default function HeroSection({ id, data = {}, settings, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();
  const {
    heading = "Get More Positive Reviews\nFor Your Business",
    subheading = "Grow Your Business With Targeted Strategies That Attract Quality Leads And Encourage Genuine Customer Reviews.",
    buttonText = "Connect With Us Today →",
    buttonLink = "#",
    icons = defaultIcons,
  } = data;

  const handleChange = (field: string, value: string) => {
    dispatch(updateSectionData({ id, data: { [field]: value } }));
  };

  const handleIconChange = (index: number, field: string, value: string) => {
    const updated = icons.map((ic: any, i: number) =>
      i === index ? { ...ic, [field]: value } : ic
    );
    dispatch(updateSectionData({ id, data: { icons: updated } }));
  };

  return (
    <section className="relative bg-[#F8F5D5]/40 py-24 overflow-hidden">

      {/* Center Content */}
      <div className="max-w-[1500] mx-auto text-center relative z-10 px-6">

        {isEditing ? (
          <textarea
            className="text-4xl md:text-5xl font-semibold leading-tight w-full text-center outline-none border-b border-dashed border-[#fc0] bg-transparent resize-none"
            rows={2}
            value={heading}
            onChange={(e) => handleChange("heading", e.target.value)}
          />
        ) : (
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight whitespace-pre-line">
            {heading}
          </h1>
        )}

        <div className="flex items-center justify-center my-6">
          <div className="h-[1px] w-24 bg-blue-400"></div>
          <span className="mx-3 text-blue-400 text-xl">✦</span>
          <div className="h-[1px] w-24 bg-blue-400"></div>
        </div>

        {isEditing ? (
          <textarea
            className="text-gray-600 text-sm max-w-xl mx-auto leading-relaxed w-full text-center outline-none border-b border-dashed border-[#fc0] bg-transparent resize-none"
            rows={3}
            value={subheading}
            onChange={(e) => handleChange("subheading", e.target.value)}
          />
        ) : (
          <p className="text-gray-600 text-sm max-w-xl mx-auto leading-relaxed">{subheading}</p>
        )}

        {isEditing ? (
          <input
            className="mt-6 inline-block bg-yellow-400 px-6 py-3 rounded-lg text-sm font-medium text-center outline-none border-b border-dashed border-black"
            value={buttonText}
            onChange={(e) => handleChange("buttonText", e.target.value)}
          />
        ) : (
          <a href={buttonLink} className="mt-6 inline-block bg-yellow-400 hover:bg-yellow-500 transition px-6 py-3 rounded-lg text-sm font-medium shadow">
            {buttonText}
          </a>
        )}
      </div>

      {/* Floating Image Icons */}
      {icons.map((icon: any, i: number) => (
        <div key={i} className={`absolute ${icon.className} icon-circle`}>
          {isEditing ? (
            <input
              className="text-[10px] w-24 outline-none border border-dashed border-[#fc0] bg-white/80 rounded px-1"
              value={icon.src}
              onChange={(e) => handleIconChange(i, "src", e.target.value)}
              title="Icon URL"
            />
          ) : (
            icon.src && !icon.src.includes("/icons/") && (
              <img src={icon.src} alt="icon" className="w-15 h-15 object-contain" />
            )
          )}
        </div>
      ))}
    </section>
  );
}
