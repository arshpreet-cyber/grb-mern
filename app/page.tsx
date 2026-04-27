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

import Wrapper from "@/components/Wrapper";

import { BuyReviewsSection } from "@/components/BuyReviewsSection";

export default function HomePage() {
  return (
    // <Wrapper>
      <div className="min-h-screen bg-white text-slate-900 font-sans">
        <HomeNavbar />
        <HeroBanner />
        <BuyReviewsSection />
        <StatsBar />
        <IconGrid />
        {/* <ServicesSection /> */}
        <CustomPlatform />
        <SectionWithRightImage />
        <SectionWithLeftImage />
        {/* <CTABanner /> */}
        <FaqSection />
        <HomeFooter />
      </div>
    // </Wrapper>
  );
}