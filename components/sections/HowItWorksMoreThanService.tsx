"use client";

import React, { useState } from "react";
import { SectionProps } from "@/types/section";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";
import Wrapper from "@/components/ui/Wrapper";
import MediaPickerModal from "../editor/MediaPickerModal";
import { Check } from "lucide-react";

const legacyHeading = 'More Than Just a "<strong>GET REVIEWS BUZZ</strong>" Service';

const defaultFeatures = [
  { title: "Human-Written Content", desc: "No bots or auto-generated review content.", iconUrl: "" },
  { title: "Fast-Activation Timeline", desc: "Your Order begins within 48 hours to 2 business days.", iconUrl: "" },
  { title: "Local Profile Usage", desc: "Business-relevant and localized profiles.", iconUrl: "" },
  { title: "Dripfeed Method Delivery", desc: "Reviews are delivered gradually and consistently.", iconUrl: "" },
  { title: "Controlled Content Pace", desc: "Structured Delivery based on the selected product plan.", iconUrl: "" },
  { title: "Approval Before Delivery", desc: "Content samples are sent for approval before delivery, if requested.", iconUrl: "" },
  { title: "Weekly Progress Updates", desc: "Track reports and check status from the dashboard.", iconUrl: "" },
  { title: "Safe and Secure Process", desc: "Privacy-focused and organized handling of your order.", iconUrl: "" },
  { title: "Trusted by Thousands", desc: "Chosen by businesses across multiple industries.", iconUrl: "" },
  { title: "No Fake Engagement", desc: "Focused on natural and business-relevant activity.", iconUrl: "" },
];

export default function HowItWorksMoreThanService({ id, data = {}, settings, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();
  const [mediaPicker, setMediaPicker] = useState<{
    isOpen: boolean;
    onSelect: (url: string) => void;
  } | null>(null);

  const openMediaPicker = (onSelect: (url: string) => void) => {
    setMediaPicker({ isOpen: true, onSelect });
  };

  const {
    heading = 'How The Team "GET REVIEWS BUZZ" Works',
    features = defaultFeatures,
    ctaTitle = "Don't Let <strong>Negative <br/>Perception Define Your Brand</strong>",
    ctaDescription = "Build a trusted online presence with consistent, business-relevant review growth.",
    ctaButtonText = "Start Growing Reviews!",
    ctaButtonLink = "/contact-us",
  } = data;

  const resolvedHeading = heading === legacyHeading ? 'How The Team "GET REVIEWS BUZZ" Works' : heading;

  const handleChange = (field: string, value: any) => {
    dispatch(updateSectionData({ id, data: { [field]: value } }));
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const updated = features.map((feature: any, idx: number) => (
      idx === index ? { ...feature, [field]: value } : feature
    ));
    handleChange("features", updated);
  };

  const containerStyle: React.CSSProperties = {
    padding: settings?.padding || "80px 0 56px",
    margin: settings?.margin || "0",
    backgroundColor: settings?.backgroundColor || "#ffffff",
  };

  return (
    <section style={containerStyle} className="w-full font-sans">
      <Wrapper className="max-w-[1240px] px-5">
        <div className="mx-auto mb-[48px] max-w-[850px] text-center">
          {isEditing ? (
            <div className="space-y-1">
              <label className="block text-left text-xs font-bold text-gray-400">Heading</label>
              <input
                className="w-full border-b border-dashed border-[#FFCD05] bg-transparent text-center text-[22px] font-normal leading-tight text-black outline-none md:text-[28px]"
                value={resolvedHeading}
                onChange={(event) => handleChange("heading", event.target.value)}
              />
            </div>
          ) : (
            <h2 
              className="text-[22px] font-normal leading-tight text-black md:text-[28px]"
              dangerouslySetInnerHTML={{ __html: resolvedHeading }}
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-[24px] lg:gap-y-[22px]">
          {features.map((feature: any, idx: number) => (
            <div
              key={idx}
              className="min-h-[153px] rounded-[16px] bg-[#F8F8F8] px-[22px] pb-[22px] pt-[18px] transition-colors duration-300 hover:bg-[#F4F4F4]"
            >
              {feature.iconUrl ? (
                <div className="mb-[26px] flex h-[31px] w-[31px] items-center justify-center">
                  <img
                    src={feature.iconUrl}
                    alt=""
                    className="h-[31px] w-[31px] object-contain"
                  />
                </div>
              ) : (
                <div className="mb-[26px] flex h-[31px] w-[31px] items-center justify-center rounded-full border-[3px] border-[#4A4A4A] bg-transparent">
                  <Check className="h-[26px] w-[26px] translate-x-[3px] translate-y-[-3px] text-[#F6A900] stroke-[3]" />
                </div>
              )}

              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      className="flex-1 border-b border-dashed border-slate-300 bg-transparent text-[10px] text-[#6E6E6E] outline-none"
                      placeholder="Icon URL"
                      value={feature.iconUrl || ""}
                      onChange={(event) => handleFeatureChange(idx, "iconUrl", event.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker((url) => handleFeatureChange(idx, "iconUrl", url))}
                      className="rounded bg-[#FFCD05] px-2 py-1 text-xs font-bold text-black hover:bg-[#FFE26E] cursor-pointer transition shrink-0"
                    >
                      Browse
                    </button>
                  </div>
                  <input
                    className="w-full border-b border-dashed border-slate-300 bg-transparent text-[13px] font-semibold text-[#151515] outline-none"
                    value={feature.title}
                    onChange={(event) => handleFeatureChange(idx, "title", event.target.value)}
                  />
                  <textarea
                    className="w-full resize-none border-b border-dashed border-slate-300 bg-transparent text-[12px] leading-[1.55] text-[#6E6E6E] outline-none"
                    rows={2}
                    value={feature.desc}
                    onChange={(event) => handleFeatureChange(idx, "desc", event.target.value)}
                  />
                </div>
              ) : (
                <>
                  <h3 
                    className="mb-[14px] text-[20px] font-semibold leading-tight text-[#151515]"
                    dangerouslySetInnerHTML={{ __html: feature.title }}
                  />
                  <p 
                    className="text-[18px] font-normal leading-[1.55] text-[#6E6E6E]"
                    dangerouslySetInnerHTML={{ __html: feature.desc }}
                  />
                </>
              )}
            </div>
          ))}

          <div className="rounded-[24px] bg-gradient-to-br from-[#FFE26E] to-[#FFCD05] px-6 py-6 sm:px-6 sm:py-6 sm:col-span-2 lg:col-span-2 lg:min-h-[153px] flex flex-col justify-between shadow-sm">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  className="w-full border-b border-dashed border-black/30 bg-transparent text-[22px] font-semibold leading-[1.2] text-black outline-none"
                  value={ctaTitle}
                  onChange={(event) => handleChange("ctaTitle", event.target.value)}
                />
                <textarea
                  className="w-full resize-none border-b border-dashed border-black/30 bg-transparent text-[16px] font-semibold leading-[1.45] text-black outline-none"
                  rows={2}
                  value={ctaDescription}
                  onChange={(event) => handleChange("ctaDescription", event.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="border-b border-dashed border-black/30 bg-transparent text-[13px] font-semibold outline-none"
                    value={ctaButtonText}
                    onChange={(event) => handleChange("ctaButtonText", event.target.value)}
                  />
                  <input
                    className="border-b border-dashed border-black/30 bg-transparent text-[11px] font-semibold outline-none"
                    value={ctaButtonLink}
                    onChange={(event) => handleChange("ctaButtonLink", event.target.value)}
                  />
                </div>
              </div>
            ) : (
              <>
                <h3 
                  className="max-w-[430px] text-[30px] md:text-[30px] font-normal leading-[1.18] text-black tracking-tight"
                  dangerouslySetInnerHTML={{ __html: ctaTitle }}
                />
                <p className="mt-[16px] text-[13px] md:text-[14px] font-medium leading-[1.5] text-black max-w-[440px]">
                  {ctaDescription}
                </p>
                <div className="mt-6">
                  <a
                    href={ctaButtonLink}
                    className="inline-flex rounded-[10px] bg-black px-[22px] py-[12px] text-[13px] font-semibold text-white transition-all duration-300 hover:bg-neutral-800 hover:-translate-y-0.5 cursor-pointer shadow-md"
                  >
                    {ctaButtonText}
                  </a>
                </div>
              </>
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
