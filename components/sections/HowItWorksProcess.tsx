"use client";

import React, { useState } from "react";
import { SectionProps } from "@/types/section";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";
import Wrapper from "@/components/ui/Wrapper";
import MediaPickerModal from "../editor/MediaPickerModal";
import {
  Check,
  FileText,
  LayoutGrid,
  LineChart,
  MousePointer,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";

export const defaultHowItWorksProcessPhases = [
  {
    title: "How to place an order ?",
    image: "https://beta.getreviews.buzz/storage/app/blog/0470557001779956136_Rectangle-10048.webp",
    imagePosition: "right",
    steps: [
      {
        title: "Choose the right platform/service",
        desc: "Select the review platform that best aligns with your business goals and reputation strategy. Once you're ready, add your selected product to the cart to begin the onboarding process.",
        iconName: "click",
        iconUrl: "",
        active: true,
      },
      {
        title: "Proceed to Checkout and Place Order",
        desc: "Complete the payment securely using your preferred payment method. Once your order is confirmed, submit the required business information through our online form.",
        iconName: "cart",
        iconUrl: "",
        active: false,
      },
      {
        title: "Submit Your Business Information",
        desc: "To help us customize your order, simply share your Business name, Profile URL, target platform, and any specific instructions or keywords you'd like included. This helps in creating a more personalized order.",
        iconName: "check",
        iconUrl: "",
        active: false,
      },
    ],
  },
  {
    title: "Moving Forward After Order Confirmation",
    image: "https://beta.getreviews.buzz/storage/app/blog/0540134001779962686_Rectangle-10202.webp",
    imagePosition: "left",
    steps: [
      {
        title: "Team Verification and Preparation",
        desc: "Our team reviews your submitted information, verifies the campaign requirements, and begins preparing the order for activation based on your selected platform and goals.",
        iconName: "shield",
        iconUrl: "",
        active: true,
      },
      {
        title: "Access Your Dashboard",
        desc: "As soon as your order moves into processing after signing up, you'll get dashboard access to easily track all your one-time orders & subscriptions, manage support tickets, and monitor campaign progress anytime.",
        iconName: "dashboard",
        iconUrl: "",
        active: false,
      },
      {
        title: "Receive Consistent Updates",
        desc: "Our team provides weekly updates through the ticket system, so you can easily monitor progress and stay informed at every stage. We believe in maintaining a transparent and organized experience for every customer.",
        iconName: "refresh",
        iconUrl: "",
        active: false,
      },
    ],
  },
  {
    title: "Delivery Updates and Final Completion",
    image: "https://beta.getreviews.buzz/storage/app/blog/0227050001779970212_Rectangle-10206.webp",
    imagePosition: "right",
    steps: [
      {
        title: "Drip-Feed Review Delivery",
        desc: "We deliver reviews naturally using a safe drip-feed method, ensuring steady growth that looks completely organic and compliant.",
        iconName: "drip",
        iconUrl: "",
        active: true,
      },
      {
        title: "Monitor and Track Progress",
        desc: "Check your live updates on our dashboard as reviews begin appearing. We keep track of rating changes and platform activity.",
        iconName: "chart",
        iconUrl: "",
        active: false,
      },
      {
        title: "Report Delivery and Summary",
        desc: "Once all reviews are successfully completed, we send you a final delivery summary detailing URLs, ratings, and live links.",
        iconName: "report",
        iconUrl: "",
        active: false,
      },
    ],
  },
];

function getStepIcon(step: any, idx: number, active: boolean) {
  if (step?.iconUrl) {
    return (
      <img
        src={step.iconUrl}
        alt=""
        className={`h-[22px] w-[22px] object-contain transition duration-300 group-hover:brightness-0 group-hover:invert ${
          active ? "brightness-0 invert" : "grayscale"
        }`}
      />
    );
  }

  const size = 22;
  const color = "currentColor";

  switch (step?.iconName) {
    case "click":
      return <MousePointer size={size} color={color} />;
    case "cart":
      return <ShoppingCart size={size} color={color} />;
    case "check":
      return <Check size={size} color={color} />;
    case "shield":
      return <ShieldCheck size={size} color={color} />;
    case "dashboard":
      return <LayoutGrid size={size} color={color} />;
    case "refresh":
      return <RotateCcw size={size} color={color} />;
    case "drip":
      return <Truck size={size} color={color} />;
    case "chart":
      return <LineChart size={size} color={color} />;
    case "report":
      return <FileText size={size} color={color} />;
    default:
      if (idx === 0) return <MousePointer size={size} color={color} />;
      if (idx === 1) return <ShoppingCart size={size} color={color} />;
      return <Check size={size} color={color} />;
  }
}

export default function HowItWorksProcess({ id, data = {}, settings, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();
  const [hoveredSteps, setHoveredSteps] = useState<Record<number, number | null>>({});
  const [mediaPicker, setMediaPicker] = useState<{
    isOpen: boolean;
    onSelect: (url: string) => void;
  } | null>(null);

  const openMediaPicker = (onSelect: (url: string) => void) => {
    setMediaPicker({ isOpen: true, onSelect });
  };

  const {
    heading = 'How Our "GET REVIEWS BUZZ" Process Works?',
    subheading = "Our step-by-step onboarding process makes it easy to get started. With complete transparency and seamless support, we help your brand grow with confidence online.",
    phases = defaultHowItWorksProcessPhases,
    showIntro = false,
  } = data;

  const handleChange = (field: string, value: any) => {
    dispatch(updateSectionData({ id, data: { [field]: value } }));
  };

  const handlePhaseChange = (phaseIdx: number, field: string, value: any) => {
    const updatedPhases = phases.map((phase: any, pIdx: number) => (
      pIdx === phaseIdx ? { ...phase, [field]: value } : phase
    ));
    handleChange("phases", updatedPhases);
  };

  const handleStepChange = (phaseIdx: number, stepIdx: number, field: string, value: any) => {
    const updatedPhases = phases.map((phase: any, pIdx: number) => {
      if (pIdx !== phaseIdx) return phase;
      const updatedSteps = (phase.steps || []).map((step: any, sIdx: number) => (
        sIdx === stepIdx ? { ...step, [field]: value } : step
      ));
      return { ...phase, steps: updatedSteps };
    });
    handleChange("phases", updatedPhases);
  };

  const containerStyle: React.CSSProperties = {
    padding: settings?.padding || "76px 0 80px",
    margin: settings?.margin || "0",
    backgroundColor: settings?.backgroundColor || "#ffffff",
  };

  return (
    <section style={containerStyle} className="w-full overflow-hidden font-sans">
      <Wrapper className="max-w-[1580px] px-5 sm:px-8">
        {(showIntro || isEditing) && (
          <div className="mx-auto mb-16 max-w-[850px] px-4 text-center">
            {isEditing ? (
              <div className="space-y-3 rounded-2xl border border-dashed border-[#FFCD05] bg-[#FFFBEB] p-5">
                <label className="inline-flex items-center justify-center gap-2 text-xs font-bold text-gray-600">
                  <input
                    type="checkbox"
                    checked={showIntro}
                    onChange={(event) => handleChange("showIntro", event.target.checked)}
                  />
                  Show main heading on website
                </label>
                <label className="block text-left text-xs font-bold text-gray-400">Main Heading</label>
                <input
                  className="w-full border-b border-dashed border-[#FFCD05] bg-transparent text-center text-3xl font-semibold outline-none"
                  value={heading}
                  onChange={(event) => handleChange("heading", event.target.value)}
                />
                <label className="block text-left text-xs font-bold text-black">Main Subheading</label>
                <textarea
                  className="w-full resize-none border-b border-dashed border-[#FFCD05] bg-transparent text-center text-base text-gray-500 outline-none"
                  rows={2}
                  value={subheading}
                  onChange={(event) => handleChange("subheading", event.target.value)}
                />
              </div>
            ) : (
              <>
                <h2 
                  className="mb-4 text-3xl font-normal leading-tight text-gray-900 md:text-4xl"
                  dangerouslySetInnerHTML={{ __html: heading }}
                />
                <p 
                  className="mx-auto max-w-[720px] text-base leading-relaxed text-gray-600 md:text-lg"
                  dangerouslySetInnerHTML={{ __html: subheading }}
                />
              </>
            )}
          </div>
        )}

        <div className="flex flex-col gap-20 md:gap-[112px]">
          {phases.map((phase: any, phaseIdx: number) => {
            const isImageLeft = phase.imagePosition === "left";
            const steps = phase.steps || [];
            const defaultActiveStepIdx = Math.max(0, steps.findIndex((step: any) => step.active));
            const activeStepIdx = hoveredSteps[phaseIdx] ?? defaultActiveStepIdx;
            const activeLineHeight = steps.length > 0
              ? `${Math.min(100, ((activeStepIdx + 1) / steps.length) * 100)}%`
              : "0%";

            return (
              <div key={phaseIdx} className="px-0 sm:px-2">
                <div className="mx-auto mb-14 max-w-[1080px] text-center">
                  {isEditing ? (
                    <div className="mx-auto max-w-[820px]">
                      <label className="block text-xs font-bold text-gray-400">Phase Title</label>
                      <input
                        className="w-full border-b border-dashed border-[#FFCD05] bg-transparent text-center text-3xl font-normal leading-tight text-black outline-none md:text-[42px]"
                        value={phase.title}
                        onChange={(event) => handlePhaseChange(phaseIdx, "title", event.target.value)}
                      />
                    </div>
                  ) : (
                    <h3 className="text-[30px] font-normal leading-tight tracking-normal text-black md:text-[42px]">
                      {phase.title}
                    </h3>
                  )}
                </div>

                <div className={`flex flex-col ${isImageLeft ? "lg:flex-row-reverse" : "lg:flex-row"} items-center justify-between gap-12 lg:gap-[96px]`}>
                  <div className="w-full lg:w-[49%]">
                    <div className="relative flex flex-col gap-14 py-2 pl-[108px] md:gap-[70px] md:pl-[148px]">
                      <div className="absolute left-[18px] top-0 h-full w-[6px] overflow-hidden rounded-full bg-[#F2EBD5] md:left-[42px]">
                        <div
                          className="w-full rounded-full bg-[#F6B11A] transition-all duration-300 ease-out"
                          style={{ height: activeLineHeight }}
                        />
                      </div>

                      {steps.map((step: any, stepIdx: number) => {
                        const isCurrent = activeStepIdx === stepIdx;

                        return (
                        <div key={stepIdx} className="relative min-h-[116px]">
                          <div
                            className="group relative"
                            onMouseEnter={() => setHoveredSteps((current) => ({ ...current, [phaseIdx]: stepIdx }))}
                            onMouseLeave={() => setHoveredSteps((current) => ({ ...current, [phaseIdx]: null }))}
                          >
                          <div
                            className={`absolute left-[-60px] top-0 flex h-[60px] w-[60px] items-center justify-center rounded-full border transition-all duration-300 md:left-[-70px] ${
                              isCurrent
                                ? "border-[#F5AA24] bg-[#F5AA24] text-white"
                                : "border-[#E3E3E3] bg-[#FAFAFA] text-[#8F8F8F] group-hover:border-[#F5AA24] group-hover:bg-[#F5AA24] group-hover:text-white"
                            }`}
                          >
                            {getStepIcon(step, stepIdx, isCurrent)}
                          </div>

                          {isEditing ? (
                            <div className="space-y-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
                              <div className="flex flex-wrap gap-3">
                                <label className="flex items-center gap-1.5 text-xs text-slate-500">
                                  <input
                                    type="checkbox"
                                    checked={step.active}
                                    onChange={(event) => handleStepChange(phaseIdx, stepIdx, "active", event.target.checked)}
                                  />
                                  Active Status
                                </label>
                                <input
                                  className="w-36 border-b border-gray-300 bg-transparent text-xs outline-none"
                                  placeholder="Icon Name"
                                  value={step.iconName || ""}
                                  onChange={(event) => handleStepChange(phaseIdx, stepIdx, "iconName", event.target.value)}
                                />
                                <div className="flex flex-1 items-center gap-2">
                                  <input
                                    className="min-w-[160px] flex-1 border-b border-gray-300 bg-transparent text-xs outline-none"
                                    placeholder="Uploaded icon URL"
                                    value={step.iconUrl || ""}
                                    onChange={(event) => handleStepChange(phaseIdx, stepIdx, "iconUrl", event.target.value)}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => openMediaPicker((url) => handleStepChange(phaseIdx, stepIdx, "iconUrl", url))}
                                    className="rounded bg-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-300 cursor-pointer transition"
                                  >
                                    Browse
                                  </button>
                                </div>
                              </div>
                              <input
                                className="w-full border-b border-dashed border-slate-400 bg-transparent text-base font-semibold text-gray-800 outline-none"
                                value={step.title}
                                onChange={(event) => handleStepChange(phaseIdx, stepIdx, "title", event.target.value)}
                              />
                              <textarea
                                className="w-full resize-none border-b border-dashed border-slate-400 bg-transparent text-sm text-gray-600 outline-none"
                                rows={2}
                                value={step.desc}
                                onChange={(event) => handleStepChange(phaseIdx, stepIdx, "desc", event.target.value)}
                              />
                            </div>
                          ) : (
                            <>
                              <h4 className="mb-4 text-[18px] font-semibold leading-snug text-[#2F2F2F] md:text-[20px]">
                                {step.title}
                              </h4>
                              <p className="max-w-[610px] text-[16px] font-normal leading-[1.55] text-[#303030] md:text-[18px]">
                                {step.desc}
                              </p>
                            </>
                          )}
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex w-full flex-col items-center lg:w-[48%]">
                    <div className="group/img relative w-full max-w-[652px]">
                      <div className="absolute -right-[22px] -top-[20px] -z-10 h-[150px] w-[220px] bg-[radial-gradient(#F2B000_2px,transparent_2px)] opacity-95 [background-size:30px_30px]" />
                      <div className="absolute -bottom-[24px] -left-[20px] -z-10 h-[190px] w-[260px] bg-[radial-gradient(#F2B000_2px,transparent_2px)] opacity-95 [background-size:30px_30px]" />

                      <div className="aspect-[1.03/1] w-full overflow-hidden rounded-[16px] bg-slate-50">
                        <img
                          src={phase.image}
                          alt={phase.title}
                          className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover/img:scale-105"
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="mt-4 w-full max-w-[652px] space-y-1">
                        <label className="text-xs font-bold text-gray-400">Image URL</label>
                        <div className="flex gap-2">
                          <input
                            className="flex-1 border-b border-dashed border-slate-400 bg-transparent text-xs text-gray-500 outline-none"
                            value={phase.image}
                            onChange={(event) => handlePhaseChange(phaseIdx, "image", event.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => openMediaPicker((url) => handlePhaseChange(phaseIdx, "image", url))}
                            className="rounded bg-[#FFCD05] px-2 py-1 text-xs font-bold text-black hover:bg-[#FFE26E] cursor-pointer transition shrink-0"
                          >
                            Browse
                          </button>
                        </div>
                        <label className="mt-2 block text-xs font-bold text-gray-400">Image Position</label>
                        <select
                          className="rounded border border-gray-300 bg-white text-xs text-gray-500"
                          value={phase.imagePosition}
                          onChange={(event) => handlePhaseChange(phaseIdx, "imagePosition", event.target.value)}
                        >
                          <option value="right">Right</option>
                          <option value="left">Left</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
