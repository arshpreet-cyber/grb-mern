"use client";

import HeroBanner from "@/components/home/HeroBanner";
import { BuyReviewsSection } from "@/components/home/BuyReviewsSection";
import CustomPlatform from "@/components/home/CustomPlatform";
import StatsBar from "@/components/home/StatsBar";
import IconGrid from "@/components/home/IconGrid";
import SectionWithRightImage from "@/components/home/SectionWithRightImage";
import SectionWithLeftImage from "@/components/home/SectionWithLeftImage";
import HomeBlogSection from "@/components/home/HomeBlogSection";
import FaqSection from "@/components/home/FaqSection";
import { HOME_PAGE_DATA } from "@/lib/constants/pageData";

export default function HomePage() {
  const { visibilitySection } = HOME_PAGE_DATA;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <HeroBanner />
      <BuyReviewsSection />
      <CustomPlatform />
      <StatsBar />
      <IconGrid />
      <SectionWithRightImage 
        title={visibilitySection.title}
        content={visibilitySection.content}
      />
      <SectionWithLeftImage />
      <HomeBlogSection />
      <FaqSection />
    </div>
  );
}