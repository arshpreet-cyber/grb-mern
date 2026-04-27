"use client";

import HomeNavbar from "@/components/HomeNavbar";
import Wrapper from "@/components/Wrapper";
import HeroBanner from "@/components/HeroBanner";
import { BuyReviewsSection } from "@/components/BuyReviewsSection";

export default function BuyReviewsPage() {
  return (
    <Wrapper>
      <div className="min-h-screen bg-slate-50 font-sans">
        <HomeNavbar />
        <HeroBanner />
        <BuyReviewsSection />
      </div>
    </Wrapper>
  );
}
