"use client";

/* eslint-disable @next/next/no-img-element */
import Wrapper from "@/components/Wrapper";

export default function StatsBar() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 relative w-full font-sans">
      <Wrapper>
        <div className="w-full">
          <div className="text-center mb-16 md:mb-[80px]">
            <h2 className="text-[28px] sm:text-[30px] lg:text-[44px] leading-[1.25] text-[#111]">
              <span className="font-normal text-[#222]">Why Businesses Keep Coming Back:</span>
              <strong className="font-bold text-black lg:mt-3 inline-block">Proven Results, Trusted Reviews, Consistent Growth</strong>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 sm:gap-y-16 lg:gap-y-0 lg:divide-x lg:divide-gray-200">
            <div className="flex flex-col text-left px-4 lg:px-8 xl:px-10">
              <div className="text-[48px] lg:text-[64px] leading-none text-black mb-4 lg:mb-6 font-normal tracking-[-1px]">12804+</div>
              <div className="text-[#FFC000] font-semibold text-[18px] mb-3">Orders Delivered</div>
              <div className="text-[#777] text-[15px] leading-[1.6] sm:max-w-[280px]">Focused on getting every delivery right with care and consistency.</div>
            </div>

            <div className="flex flex-col text-left px-4 lg:px-8 xl:px-10">
              <div className="text-[48px] lg:text-[64px] leading-none text-black mb-4 lg:mb-6 font-normal tracking-[-1px]">6090+</div>
              <div className="text-[#FFC000] font-semibold text-[18px] mb-3">Active Users</div>
              <div className="text-[#777] text-[15px] leading-[1.6] sm:max-w-[280px]">Partnering with businesses across industries to build a lasting reputation.</div>
            </div>

            <div className="flex flex-col text-left px-4 lg:px-8 xl:px-10">
              <div className="text-[48px] lg:text-[64px] leading-none text-black mb-4 lg:mb-6 font-normal tracking-[-1px]">95%</div>
              <div className="text-[#FFC000] font-semibold text-[18px] mb-3">Client Satisfaction</div>
              <div className="text-[#777] text-[15px] leading-[1.6] sm:max-w-[280px]">A reflection of our commitment to quality, trust, and measurable results.</div>
            </div>

            <div className="flex flex-col text-left px-4 lg:px-8 xl:px-10">
              <div className="text-[48px] lg:text-[64px] leading-none text-black mb-4 lg:mb-6 font-normal tracking-[-1px]">7+</div>
              <div className="text-[#FFC000] font-semibold text-[18px] mb-3">Years Of Proven Growth</div>
              <div className="text-[#777] text-[15px] leading-[1.6] sm:max-w-[280px]">Determined to adapt experienced strategies in reputation management.</div>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
