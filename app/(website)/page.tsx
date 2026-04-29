"use client";

import HomeNavbar from "@/components/layout/HomeNavbar";
import HomeFooter from "@/components/layout/HomeFooter";
import HeroBanner from "@/components/home/HeroBanner";
import { BuyReviewsSection } from "@/components/home/BuyReviewsSection";
import CustomPlatform from "@/components/home/CustomPlatform";
import StatsBar from "@/components/home/StatsBar";
import IconGrid from "@/components/home/IconGrid";
import SectionWithRightImage from "@/components/home/SectionWithRightImage";
import SectionWithLeftImage from "@/components/home/SectionWithLeftImage";
import HomeBlogSection from "@/components/home/HomeBlogSection";
import FaqSection from "@/components/home/FaqSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <HomeNavbar />
      <HeroBanner />
      <BuyReviewsSection />
      <CustomPlatform />
      <StatsBar />
      <IconGrid />
      <SectionWithRightImage />
      <SectionWithLeftImage />
      <HomeBlogSection />
      <FaqSection />
      <HomeFooter />
    </div>
  );
}