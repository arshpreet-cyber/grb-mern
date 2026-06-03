"use client";

import React, { useState, useEffect } from "react";
import { SectionProps } from "@/types/section";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";

export default function SafeReviewsCarousel({ id, data = {}, settings, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();
  const platform = data.platform || "Google";

  const defaultSlides = [
    {
      heading: `How We Provide Safe And Authentic ${platform} Reviews`,
      subheading: `We take a strategic, secure approach to ${platform} reputation management that improves your profile while keeping reviews authentic.`,
      listTitle: `Here's how we keep ${platform} reviews safe and authentic:`,
      features: [
        {
          title: "Accounts That Are Both Legitimate and Active",
          desc: "Our reviews are provided by genuine, geographically relevant profiles with established activity, ensuring that they complement organic customer feedback.",
        },
        {
          title: "Customized Reviews",
          desc: "Our customized reviews accurately reflect customer experiences, boosting credibility and trustworthiness.",
        },
        {
          title: "Delivery Occurs Gradually and Naturally",
          desc: "To maintain authenticity, reviews are posted in a consistent pattern over time, avoiding sudden spikes that may raise suspicion.",
        },
      ],
      image: "/uploads/media/safe_reviews_graphic.png",
    },
    {
      heading: "Targeted Geolocation Profiles",
      subheading: `We assign reviews to profiles that match the geographic location of your business for maximum local SEO impact.`,
      listTitle: "How we ensure localized profile matching:",
      features: [
        {
          title: "IP-Verified Routing",
          desc: `Reviews are posted using residential IPs matching your business's target cities and neighborhoods.`,
        },
        {
          title: "Realistic Activity Patterns",
          desc: "Reviewers have historical check-ins and reviews in your region, making their profiles fully organic and relevant.",
        },
        {
          title: "SEO-Optimized Content",
          desc: "Our custom reviews contain regional keywords to boost your local map pack search visibility ranking.",
        },
      ],
      image: "/uploads/media/safe_reviews_graphic.png",
    },
    {
      heading: "Active Anti-Drop Refill Guarantee",
      subheading: "We implement rigorous quality controls and follow up with a 30-day warranty to keep your rating intact.",
      listTitle: "Our reliability and safety features include:",
      features: [
        {
          title: "Strict Account Verification",
          desc: "All review profiles pass continuous checks to confirm active status on local directories.",
        },
        {
          title: "30-Day Free Replacements",
          desc: "If any reviews are filtered or dropped, our automated system replaces them free of charge within 24 hours.",
        },
        {
          title: "Safe, Compliant Billing",
          desc: "Billing info is completely separated and kept private from directory crawler bots to guarantee profile safety.",
        },
      ],
      image: "/uploads/media/safe_reviews_graphic.png",
    },
  ];

  const {
    slides = defaultSlides,
  } = data;

  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto-play effect: changes slides every 6 seconds, disabled in editing mode
  useEffect(() => {
    if (isEditing) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length, isEditing]);

  const handleSlideChange = (slideIndex: number, field: string, value: any) => {
    const updated = slides.map((s: any, idx: number) =>
      idx === slideIndex ? { ...s, [field]: value } : s
    );
    dispatch(updateSectionData({ id, data: { slides: updated } }));
  };

  const handleFeatureChange = (slideIndex: number, featureIndex: number, field: string, value: string) => {
    const slide = slides[slideIndex];
    if (!slide) return;
    const updatedFeatures = (slide.features || []).map((f: any, idx: number) =>
      idx === featureIndex ? { ...f, [field]: value } : f
    );
    handleSlideChange(slideIndex, "features", updatedFeatures);
  };

  return (
    <section
      className="w-full font-sans antialiased text-[#1A1A1A] select-none overflow-hidden"
      style={{
        padding: settings?.padding || "80px 0",
        margin: settings?.margin,
        backgroundColor: settings?.backgroundColor || "transparent",
      }}
    >
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col">
        {/* Active Slide Wrapper */}
        <div className="relative min-h-[600px] lg:min-h-[500px]">
          {slides.map((slide: any, slideIdx: number) => {
            const isActive = slideIdx === currentIdx;
            return (
              <div
                key={slideIdx}
                className={`w-full bg-[#FFFDF6] border border-[#FFE799] rounded-[32px] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12 transition-all duration-700 ease-in-out origin-center ${
                  isActive
                    ? "opacity-100 scale-100 translate-x-0 relative z-10"
                    : "opacity-0 scale-95 translate-x-12 absolute inset-0 pointer-events-none z-0"
                }`}
              >
                {/* Left Side: Description & Feature List */}
                <div className="flex-1 w-full flex flex-col text-left">
                  {/* Heading */}
                  {isEditing ? (
                    <input
                      className="text-3xl md:text-4xl font-semibold text-gray-900 w-full outline-none border-b border-dashed border-[#fc0] bg-transparent pb-1 mb-4"
                      value={slide.heading || ""}
                      onChange={(e) => handleSlideChange(slideIdx, "heading", e.target.value)}
                      placeholder="Slide Heading"
                    />
                  ) : (
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight mb-4">
                      {slide.heading}
                    </h2>
                  )}

                  {/* Subheading */}
                  {isEditing ? (
                    <textarea
                      className="text-gray-600 text-sm leading-relaxed w-full outline-none border-b border-dashed border-[#fc0] bg-transparent resize-none mb-4"
                      rows={2}
                      value={slide.subheading || ""}
                      onChange={(e) => handleSlideChange(slideIdx, "subheading", e.target.value)}
                      placeholder="Slide subheading..."
                    />
                  ) : (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {slide.subheading}
                    </p>
                  )}

                  {/* Feature Title */}
                  {isEditing ? (
                    <input
                      className="text-gray-800 text-sm font-semibold w-full outline-none border-b border-dashed border-[#fc0] bg-transparent pb-0.5 mb-6"
                      value={slide.listTitle || ""}
                      onChange={(e) => handleSlideChange(slideIdx, "listTitle", e.target.value)}
                      placeholder="List Title"
                    />
                  ) : (
                    <p className="text-gray-800 text-sm font-bold tracking-tight mb-6">
                      {slide.listTitle}
                    </p>
                  )}

                  {/* Features List */}
                  <div className="space-y-6">
                    {(slide.features || []).map((feature: any, featIdx: number) => (
                      <div key={featIdx} className="flex items-start gap-4">
                        {/* Golden/Yellow Checked Icon */}
                        <div className="shrink-0 w-5 h-5 rounded-full bg-[#FFF3CD] border border-[#FFE799] flex items-center justify-center text-[#A87E2C] mt-0.5 shadow-sm">
                          <svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="9 1 3.5 6.5 1 4" />
                          </svg>
                        </div>
                        {/* Text description */}
                        <div className="flex-1">
                          {isEditing ? (
                            <>
                              <input
                                className="font-semibold text-sm text-gray-800 w-full outline-none border-b border-dashed border-[#fc0] bg-transparent pb-0.5 mb-1"
                                value={feature.title || ""}
                                onChange={(e) => handleFeatureChange(slideIdx, featIdx, "title", e.target.value)}
                                placeholder="Feature Title"
                              />
                              <textarea
                                className="text-[13px] leading-relaxed text-gray-600 w-full outline-none border-b border-dashed border-[#fc0] bg-transparent resize-none min-h-[60px]"
                                rows={2}
                                value={feature.desc || ""}
                                onChange={(e) => handleFeatureChange(slideIdx, featIdx, "desc", e.target.value)}
                                placeholder="Feature description..."
                              />
                            </>
                          ) : (
                            <>
                              <h4 className="font-bold text-sm text-gray-800 mb-1">{feature.title}</h4>
                              <p className="text-[13px] leading-relaxed text-gray-600">{feature.desc}</p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Showcase Illustration Card */}
                <div className="w-full lg:w-[48%] flex items-center justify-center bg-white rounded-[24px] border border-gray-150 p-6 shadow-sm min-h-[300px] lg:min-h-[450px] relative group overflow-hidden shrink-0">
                  {isEditing ? (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-semibold mb-2">Showcase Image URL</span>
                      <input
                        className="w-full px-3 py-2 bg-white text-gray-800 rounded-md text-xs outline-none focus:ring-2 focus:ring-[#fc0]"
                        value={slide.image || ""}
                        onChange={(e) => handleSlideChange(slideIdx, "image", e.target.value)}
                        placeholder="Image URL..."
                      />
                    </div>
                  ) : null}
                  <img
                    src={slide.image}
                    alt="Safe Reviews Step Illustration"
                    className="max-w-full max-h-[400px] object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Indicators / Slide Switch Dots */}
        <div className="flex justify-center items-center gap-2.5 mt-8">
          {slides.map((_: any, idx: number) => {
            const isActive = idx === currentIdx;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 focus:outline-none ${
                  isActive
                    ? "w-8 h-2 bg-[#FCD535] rounded-full shadow-sm"
                    : "w-2.5 h-2.5 bg-gray-200 hover:bg-[#FCD535]/50 rounded-full cursor-pointer"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
