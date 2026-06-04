"use client";

import React, { useState, useEffect } from "react";
import { SectionProps } from "@/types/section";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";
import MediaPickerModal from "../editor/MediaPickerModal";

export default function SafeReviewsCarousel({ id, data = {}, settings, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();
  const platform = data.platform || "Google";

  const [mediaPicker, setMediaPicker] = useState<{
    isOpen: boolean;
    onSelect: (url: string) => void;
  } | null>(null);

  const openMediaPicker = (onSelect: (url: string) => void) => {
    setMediaPicker({ isOpen: true, onSelect });
  };

  const defaultSlides = [
    {
      heading: `How We Provide Safe<br/>And <strong>Authentic ${platform} Reviews</strong>`,
      subheading: `We take a strategic, secure approach to ${platform} reputation management that improves your profile while keeping reviews authentic.`,
      listTitle: `Here's how we keep ${platform} reviews safe and authentic:`,
      layout: "checklist",
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
      heading: `Achieve Business Growth<br/>When <strong>You Manage ${platform} Reviews</strong>`,
      layout: "paragraphs",
      features: [
        {
          desc: `Buying ${platform} reviews online is not only a good way to improve your brand's image, but it also helps to attract more customers to your store, both online and offline. Our ${platform} review management services help your brand stand out in the crowded digital landscape.`,
        },
        {
          desc: `By using our buy ${platform} reviews service, you can get genuine feedback from local profiles at a low cost to help your business succeed.`,
        },
        {
          desc: `We help professional service providers rank higher in local searches by buying ${platform} 5-star reviews for their ${platform} Business Profiles. High-quality ${platform} reviews ensure customer satisfaction and maximize your brand's influence in the target market.`,
        },
      ],
      button: {
        text: "Get a Quote",
        link: "/contact-us",
      },
      image: "/uploads/media/safe_reviews_graphic.png",
    },
    {
      heading: `Should You Proactively Get Reviews<br/>or <strong>Rely on Organic ${platform} Reviews?</strong>`,
      layout: "paragraphs",
      features: [
        {
          desc: `Are you unsure whether to pay for ${platform} reviews or wait for them to appear organically? Organic reviews are valuable but slow, while a structured plan to generate ${platform} reviews delivers consistent results.`,
        },
        {
          desc: `This delay can have an impact on your company's growth, particularly if you're in a competitive market. Buying ${platform} reviews instantly boosts your business's credibility, improves search rankings, and attracts more customers to your GMB profile.`,
        },
        {
          desc: `Unlike organic reviews, buying reviews guarantees consistent and strategic positive feedback, higher ratings, and a strong online presence.`,
        },
        {
          desc: `Many businesses choose to buy ${platform} 5-star reviews to increase brand trust and stay ahead of competitors. When done correctly with high-quality, real-looking reviews, this approach improves your reputation and reinforces customer confidence.`,
        },
      ],
      image: "/uploads/media/safe_reviews_graphic.png",
    },
  ];

  interface CarouselFeature {
    title?: string;
    desc?: string;
  }

  interface CarouselSlide {
    heading: string;
    subheading?: string;
    listTitle?: string;
    layout: string;
    features: CarouselFeature[];
    image: string;
    button?: {
      text?: string;
      link?: string;
    };
  }

  const rawSlides = (data.slides || defaultSlides) as CarouselSlide[];

  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto-play effect: changes slides every 6 seconds, disabled in editing mode
  useEffect(() => {
    if (isEditing) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % rawSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [rawSlides.length, isEditing]);

  const handleSlideChange = (slideIndex: number, field: string, value: unknown) => {
    const updated = rawSlides.map((s: CarouselSlide, idx: number) =>
      idx === slideIndex ? { ...s, [field]: value } : s
    );
    dispatch(updateSectionData({ id, data: { slides: updated } }));
  };

  const handleFeatureChange = (slideIndex: number, featureIndex: number, field: string, value: string) => {
    const slide = rawSlides[slideIndex];
    if (!slide) return;
    const updatedFeatures = (slide.features || []).map((f: CarouselFeature, idx: number) =>
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
      <div className="max-w-[1500px] mx-auto px-8 md:px-16 lg:px-24 flex flex-col relative">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => setCurrentIdx((prev) => (prev - 1 + rawSlides.length) % rawSlides.length)}
          className="absolute left-2 md:-left-10 lg:-left-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-b from-[#FFC107] to-[#E49D56] hover:from-[#ffca28] hover:to-[#e08e3c] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95 focus:outline-none cursor-pointer"
          aria-label="Previous slide"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 md:w-6 md:h-6"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => setCurrentIdx((prev) => (prev + 1) % rawSlides.length)}
          className="absolute right-2 md:-right-10 lg:-right-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-b from-[#FFC107] to-[#E49D56] hover:from-[#ffca28] hover:to-[#e08e3c] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95 focus:outline-none cursor-pointer"
          aria-label="Next slide"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 md:w-6 md:h-6"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

        {/* Overflow-hidden container for slide track */}
        <div className="w-full overflow-hidden rounded-[32px]">
          <div 
            className="flex flex-row transition-transform duration-500 ease-in-out w-full"
            style={{ transform: `translateX(-${currentIdx * 100}%)` }}
          >
            {rawSlides.map((slide: CarouselSlide, slideIdx: number) => {
              return (
                <div
                  key={slideIdx}
                  className="w-full shrink-0"
                >
                  <div className="w-full bg-[#FFFDF6] border border-[#FFE799] rounded-[32px] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12">
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
                    <h2 
                      className="text-3xl md:text-4xl font-normal text-gray-900 leading-tight mb-4 animate-fade-in"
                      dangerouslySetInnerHTML={{ __html: slide.heading || "" }}
                    />
                  )}

                  {/* Subheading */}
                  {(slide.subheading || isEditing) && (
                    isEditing ? (
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
                    )
                  )}

                  {/* Feature Title */}
                  {(slide.listTitle || isEditing) && (
                    isEditing ? (
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
                    )
                  )}

                  {/* Features List */}
                  <div className="space-y-6">
                    {slide.layout === "paragraphs" ? (
                      (slide.features || []).map((feature: CarouselFeature, featIdx: number) => (
                        <div key={featIdx} className="text-gray-600 text-sm leading-relaxed">
                          {isEditing ? (
                            <textarea
                              className="text-gray-600 text-sm leading-relaxed w-full outline-none border-b border-dashed border-[#fc0] bg-transparent resize-none min-h-[60px]"
                              rows={3}
                              value={feature.desc || ""}
                              onChange={(e) => handleFeatureChange(slideIdx, featIdx, "desc", e.target.value)}
                              placeholder="Paragraph text..."
                            />
                          ) : (
                            <p>{feature.desc}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      (slide.features || []).map((feature: CarouselFeature, featIdx: number) => (
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
                      ))
                    )}
                  </div>

                  {/* Optional Button */}
                  {(slide.button?.text || isEditing) && slide.layout === "paragraphs" && (
                    <div className="mt-8">
                      {isEditing ? (
                        <div className="flex gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl max-w-sm">
                          <input
                            className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg flex-1"
                            value={slide.button?.text || ""}
                            onChange={(e) => {
                              handleSlideChange(slideIdx, "button", { ...(slide.button || {}), text: e.target.value });
                            }}
                            placeholder="Button Text"
                          />
                          <input
                            className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg flex-1"
                            value={slide.button?.link || ""}
                            onChange={(e) => {
                              handleSlideChange(slideIdx, "button", { ...(slide.button || {}), link: e.target.value });
                            }}
                            placeholder="Button Link"
                          />
                        </div>
                      ) : (
                        slide.button?.text && (
                          <a
                            href={slide.button.link || "#"}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#fc0] hover:bg-[#e6bb00] text-slate-900 font-bold rounded-xl text-sm transition shadow-sm"
                          >
                            {slide.button.text}
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          </a>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Right Side: Showcase Illustration Card */}
                <div className="w-full lg:w-[48%] flex items-center justify-center bg-white rounded-[24px] border border-gray-150 p-6 shadow-sm min-h-[300px] lg:min-h-[450px] relative group overflow-hidden shrink-0">
                  {isEditing ? (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2">
                      <span className="text-xs font-semibold">Showcase Image</span>
                      <div className="flex gap-2 w-full">
                        <input
                          className="flex-1 min-w-0 px-3 py-2 bg-white text-gray-800 rounded-md text-xs outline-none focus:ring-2 focus:ring-[#fc0]"
                          value={slide.image || ""}
                          onChange={(e) => handleSlideChange(slideIdx, "image", e.target.value)}
                          placeholder="Image URL..."
                        />
                        <button
                          type="button"
                          onClick={() => openMediaPicker((url) => handleSlideChange(slideIdx, "image", url))}
                          className="px-3 py-2 bg-[#fc0] hover:bg-[#e6bb00] text-slate-900 rounded-md font-bold text-xs transition shrink-0 cursor-pointer"
                        >
                          Browse
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.image}
                    alt="Safe Reviews Step Illustration"
                    className="max-w-full max-h-[400px] object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          );
        })}
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
