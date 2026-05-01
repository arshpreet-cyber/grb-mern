"use client";

import Link from "next/link";
import Wrapper from "@/components/ui/Wrapper";

export default function CTABanner() {
  return (
    <section className="w-full bg-[#ffcc00] font-sans py-12 px-6">
      <Wrapper>
      <div className="max-w-[1500] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="text-center md:text-left">
          <p className="text-lg md:text-[32px] font-normal text-black mb-1">
            Want To Know How We Can Help You Get
          </p>
          <h2 className="text-2xl md:text-[46px] font-bold text-black tracking-tight mt-1">
            Business Leads And Positive Reviews?
          </h2>
        </div>

        <a href="#" className="shrink-0 bg-gradient-to-r from-black to-[#333333] text-white text-[13px] font-bold tracking-wider px-8 py-4 rounded shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all uppercase">
          Contact With Us
        </a>

      </div>
      </Wrapper>
    </section>
  );
}
