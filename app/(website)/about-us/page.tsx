"use client";

import SectionWithRightImage from "@/components/home/SectionWithRightImage";
import { ABOUT_US_DATA } from "@/lib/constants/pageData";
import PartnerLogos from "@/components/home/PartnerLogos";
import VisionMissionSection from "@/components/home/VisionMissionSection";
import CTABanner from "@/components/home/CTABanner";

export default function AboutUsPage() {
  const { hero } = ABOUT_US_DATA;

  return (
    <div className="bg-white">
      <SectionWithRightImage 
       title={
            <>
                Who We <span className="text-[#fcd535]">Are?</span>
            </>
            }
        content={hero.content}
        buttonText={hero.buttonText}
        image={hero.image}
      />
      <PartnerLogos />
      <VisionMissionSection />
      <CTABanner />
    </div>
  );
}