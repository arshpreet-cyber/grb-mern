"use client";

import Wrapper from "@/components/ui/Wrapper";
import HeroBanner from "@/components/home/HeroBanner";
import { BuyReviewsSection } from "@/components/home/BuyReviewsSection";

export default function BuyReviewsPage() {
  return (
    <Wrapper>
      <div className="min-h-screen bg-slate-50 font-sans pb-20">
        <HeroBanner />
        <BuyReviewsSection />
      </div>
    </Wrapper>
  );
}
