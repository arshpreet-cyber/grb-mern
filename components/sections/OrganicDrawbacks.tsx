"use client";

import React, { useState, useEffect } from "react";
import { SectionProps } from "@/types/section";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";
import MediaPickerModal from "../editor/MediaPickerModal";

export default function OrganicDrawbacks({ id, data = {}, settings, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();
  const platform = data.platform || "Google";

  const defaultCards = [
    {
      title: "Slow and Unpredictable Growth",
      iconType: "chart",
      paragraphs: [
        `Obtaining organic reviews necessitates that customers take the initiative to provide feedback, which can be a slow and inconsistent process.`,
        `Since many happy consumers just don't write reviews, it can be challenging to build a strong online reputation fast.`,
      ],
    },
    {
      title: "Vulnerable to Negative Feedback",
      iconType: "warning",
      paragraphs: [
        `A single disgruntled customer or malicious competitor can easily damage your score. Without a steady stream of positive feedback, your rating suffers disproportionately.`,
        `Relying on organic reviews means you have no control over the frequency and timing of reviews to balance negative feedback.`,
      ],
    },
    {
      title: "Outpaced by Competitors",
      iconType: "competition",
      paragraphs: [
        `Competitors who actively acquire reviews will quickly outrank you in search visibility and local map pack rankings.`,
        `If you rely solely on natural review growth, it could take years to reach the rating volume that your competitors achieve in weeks.`,
      ],
    },
  ];

  interface DrawbackCard {
    title: string;
    iconType: string;
    iconImage?: string;
    paragraphs: string[];
  }

  const heading = data.heading || `The Drawbacks Of Relying Solely On Organic ${platform} Reviews`;
  const subheading = data.subheading || `While organic ${platform} reviews are useful for establishing credibility, relying solely on them can present several challenges that may slow your company's growth. Here are some major drawbacks:`;
  const cards = (data.cards || defaultCards) as DrawbackCard[];

  // Clones configuration for infinite loop
  const cloneCount = Math.min(3, cards.length);
  const clonedCards = cards.length > 0
    ? [...cards.slice(-cloneCount), ...cards, ...cards.slice(0, cloneCount)]
    : [];

  const [currentIdx, setCurrentIdx] = useState(cloneCount);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  // Compute activeDotIdx to highlight correct indicator dot
  const activeDotIdx = cards.length > 0 ? (currentIdx - cloneCount + cards.length) % cards.length : 0;

  const [mediaPicker, setMediaPicker] = useState<{
    isOpen: boolean;
    onSelect: (url: string) => void;
  } | null>(null);

  const openMediaPicker = (onSelect: (url: string) => void) => {
    setMediaPicker({ isOpen: true, onSelect });
  };

  // Sync / Reset index if cards length changes in editing mode
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIdx(cloneCount);
      setTransitionEnabled(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [cards.length, cloneCount]);

  // Handle clone boundary jumps after transitions complete
  useEffect(() => {
    if (cards.length === 0) return;
    if (currentIdx >= cards.length + cloneCount) {
      const timer = setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentIdx(currentIdx - cards.length);
      }, 500);
      return () => clearTimeout(timer);
    }
    if (currentIdx < cloneCount) {
      const timer = setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentIdx(currentIdx + cards.length);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIdx, cards.length, cloneCount]);

  // Re-enable transition immediately in the next animation frame
  useEffect(() => {
    if (!transitionEnabled) {
      const raf = requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [transitionEnabled]);

  // Swipe controls for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Auto-play effect: changes cards every 6 seconds, disabled in editing mode
  useEffect(() => {
    if (isEditing) return;
    if (cards.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, [cards.length, isEditing]);

  const handleDataChange = (field: string, value: unknown) => {
    dispatch(updateSectionData({ id, data: { ...data, [field]: value } }));
  };

  const handleCardChange = (cardIndex: number, field: string, value: unknown) => {
    const updated = cards.map((c: DrawbackCard, idx: number) =>
      idx === cardIndex ? { ...c, [field]: value } : c
    );
    handleDataChange("cards", updated);
  };

  const handleParagraphChange = (cardIndex: number, pIndex: number, value: string) => {
    const card = cards[cardIndex];
    if (!card) return;
    const updatedParagraphs = (card.paragraphs || []).map((p: string, idx: number) =>
      idx === pIndex ? value : p
    );
    handleCardChange(cardIndex, "paragraphs", updatedParagraphs);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentIdx((prev) => prev + 1);
    }
    if (isRightSwipe) {
      setCurrentIdx((prev) => prev - 1);
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const renderIcon = (type: string, customUrl?: string) => {
    if (type === "custom" && customUrl) {
      return (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={customUrl}
          alt="Custom Icon"
          className="w-12 h-12 object-contain"
        />
      );
    }
    switch (type) {
      case "chart":
        return (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="28" width="6" height="12" rx="1.5" fill="#FCD535" />
            <rect x="18" y="20" width="6" height="20" rx="1.5" fill="#4ade80" />
            <rect x="28" y="12" width="6" height="28" rx="1.5" fill="#2563eb" />
            <path d="M6 34C16 30 22 16 38 10" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
            <path d="M30 10H38V18" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "warning":
        return (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4L6 12V24C6 34.5 13.5 41.5 24 44C34.5 41.5 42 34.5 42 24V12L24 4Z" fill="#FFF2F2" stroke="#EF4444" strokeWidth="3" strokeLinejoin="round"/>
            <path d="M24 16V28" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="24" cy="34" r="2.5" fill="#EF4444"/>
          </svg>
        );
      case "competition":
        return (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="26" y="8" width="10" height="32" rx="2" fill="#2563eb" />
            <rect x="12" y="24" width="10" height="16" rx="2" fill="#FCD535" />
            <path d="M38 12L42 16L38 20" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="26" y1="20" x2="38" y2="20" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section
      className="w-full font-sans antialiased text-[#1A1A1A] select-none overflow-hidden relative"
      style={{
        padding: settings?.padding || "80px 0",
        margin: settings?.margin,
        backgroundColor: settings?.backgroundColor || "#FFFFFF",
      }}
    >
      {/* Scope dynamic CSS custom variables for layout sizing */}
      <style dangerouslySetInnerHTML={{__html: `
        .slider-track-${id} {
          --slide-width: 82vw;
          --slide-gap: 16px;
        }
        @media (min-width: 768px) {
          .slider-track-${id} {
            --slide-width: 580px;
            --slide-gap: 32px;
          }
        }
      `}} />

      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16 text-center">
        {/* Header Block */}
        <div className="max-w-4xl mx-auto mb-16">
          {isEditing ? (
            <>
              <input
                className="text-3xl md:text-4xl lg:text-[40px] font-semibold text-gray-900 w-full outline-none border-b border-dashed border-[#fc0] bg-transparent pb-1 mb-4 text-center"
                value={heading}
                onChange={(e) => handleDataChange("heading", e.target.value)}
                placeholder="Section Heading"
              />
              <textarea
                className="text-gray-600 text-sm leading-relaxed w-full outline-none border-b border-dashed border-[#fc0] bg-transparent resize-none text-center"
                rows={2}
                value={subheading}
                onChange={(e) => handleDataChange("subheading", e.target.value)}
                placeholder="Section Subheading..."
              />
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl lg:text-[40px] font-semibold text-gray-900 leading-tight mb-4">
                {heading.split(platform).map((part: string, index: number, arr: string[]) => (
                  <React.Fragment key={index}>
                    {part}
                    {index < arr.length - 1 && <span className="font-bold">{platform}</span>}
                  </React.Fragment>
                ))}
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
                {subheading}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Slider Viewport Container */}
      <div className={`slider-track-${id} relative w-full overflow-visible flex flex-col items-center`}>
        {/* Track wrapper */}
        <div
          className={`flex items-stretch w-full ${
            transitionEnabled ? "transition-transform duration-500 ease-in-out" : ""
          }`}
          style={{
            transform: clonedCards.length > 0
              ? `translateX(calc(50% - (var(--slide-width) / 2) - ${currentIdx} * (var(--slide-width) + var(--slide-gap))))`
              : 'none',
            gap: "var(--slide-gap)",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {clonedCards.length === 0 ? (
            <div className="text-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-[28px] w-full max-w-lg mx-auto shrink-0 select-none">
              <p className="text-sm font-bold text-slate-700">No drawback cards added yet</p>
              <p className="text-xs text-slate-400 mt-1">Use the properties sidebar on the right to add card slides.</p>
            </div>
          ) : (
            clonedCards.map((card: DrawbackCard, cardIdx: number) => {
              const isActive = cardIdx === currentIdx;
              const originalIdx = cards.length > 0 ? (cardIdx - cloneCount + cards.length) % cards.length : 0;
            return (
              <div
                key={cardIdx}
                onClick={() => {
                  if (!isActive) setCurrentIdx(cardIdx);
                }}
                style={{ width: "var(--slide-width)" }}
                className={`shrink-0 bg-[#FFFDF6]/40 border rounded-[28px] p-8 md:p-12 flex flex-col text-left transition-all duration-500 shadow-sm hover:shadow-md ${
                  isActive
                    ? "opacity-100 scale-100 border-[#FFE799] bg-[#FFFDF6] cursor-default"
                    : "opacity-40 scale-90 border-gray-150 bg-white/70 cursor-pointer hover:opacity-60"
                }`}
              >
                {/* Icon Container */}
                <div
                  className={`mb-6 flex justify-start items-center h-12 relative group/icon ${
                    isEditing ? "cursor-pointer hover:opacity-80" : ""
                  }`}
                  onClick={(e) => {
                    if (isEditing) {
                      e.stopPropagation();
                      openMediaPicker((url) => {
                        handleCardChange(originalIdx, "iconType", "custom");
                        handleCardChange(originalIdx, "iconImage", url);
                      });
                    }
                  }}
                >
                  {renderIcon(card.iconType, card.iconImage)}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center opacity-0 group-hover/icon:opacity-100 transition-opacity">
                      <span className="text-[10px] text-white font-bold px-1.5 py-0.5 bg-black/60 rounded">
                        Edit Icon
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Title */}
                {isEditing ? (
                  <input
                    className="text-xl md:text-2xl font-bold text-gray-800 w-full outline-none border-b border-dashed border-[#fc0] bg-transparent pb-1 mb-4"
                    value={card.title || ""}
                    onChange={(e) => handleCardChange(originalIdx, "title", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Card Title"
                  />
                ) : (
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">{card.title}</h3>
                )}

                {/* Card Paragraphs */}
                <div className="space-y-4 flex-1">
                  {(card.paragraphs || []).map((p: string, pIdx: number) => (
                    <div key={pIdx}>
                      {isEditing ? (
                        <textarea
                          className="text-xs md:text-sm leading-relaxed text-gray-600 w-full outline-none border-b border-dashed border-[#fc0] bg-transparent resize-none min-h-[60px]"
                          rows={3}
                          value={p || ""}
                          onChange={(e) => handleParagraphChange(originalIdx, pIdx, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Card Paragraph..."
                        />
                      ) : (
                        <p className="text-xs md:text-sm leading-relaxed text-gray-600">{p}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center items-center gap-2.5 mt-10">
          {cards.map((_: DrawbackCard, idx: number) => {
            const isActive = idx === activeDotIdx;
            return (
              <button
                key={idx}
                onClick={() => {
                  setTransitionEnabled(true);
                  setCurrentIdx(idx + cloneCount);
                }}
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
