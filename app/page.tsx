"use client";

import HomeNavbar from "@/components/HomeNavbar";
import HeroBanner from "@/components/HeroBanner";
import {
  StatsBar,
  IconGrid,
  ServicesSection,
  CustomPlatform,
  SectionWithRightImage,
  SectionWithLeftImage,
  CTABanner,
  FaqSection,
  HomeFooter
} from "@/components/HomeComponents";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <HomeNavbar />
      <HeroBanner />
      <StatsBar />
      <IconGrid />
      <ServicesSection />
      <CustomPlatform />
      <SectionWithRightImage />
      <SectionWithLeftImage />
      <CTABanner />
      <FaqSection />
      <HomeFooter />
    </div>
  );
}