"use client";

/* eslint-disable @next/next/no-img-element */
import Wrapper from "@/components/Wrapper";

export default function CustomPlatform() {
  return (
    <section
      id="custom-platform"
      className="relative w-full py-5 md:py-10 overflow-hidden flex items-center justify-center bg-[#FFFEF9]"
    >
      <Wrapper>
        <img
          src="https://beta.getreviews.buzz/storage/app/blog/0339272001776325180_golden-star-icon-transparent-background-2.png"
          alt=""
          className="absolute z-0 pointer-events-none hidden md:block w-[220px] top-1/2 left-[3%] -translate-y-1/2 rotate-[15deg] opacity-50"
        />
        <img
          src="https://beta.getreviews.buzz/storage/app/blog/0339272001776325180_golden-star-icon-transparent-background-2.png"
          alt=""
          className="absolute z-0 pointer-events-none hidden md:block w-[280px] top-1/2 right-[3%] -translate-y-1/2 -rotate-[-15deg] opacity-50"
        />

        <div className="relative z-10 w-full mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-[40px] leading-tight text-black mb-5 font-normal">
            Can&apos;t Find Your <strong className="font-semibold">Platform</strong>
            <br />
            Listed Above?
          </h2>

          <p className="text-base md:text-[16px] text-[#4b5563] max-w-[800px] mx-auto mb-10 leading-relaxed">
            Share your preferred platform with us, and our team will design a customized approach
            <br />
            to help you build a credible review presence where it matters the most.
          </p>

          <a
            href="/contact-us"
            className="inline-flex items-center justify-center text-black font-medium rounded-lg transition-transform hover:-translate-y-1 shadow-sm hover:shadow bg-gradient-to-r from-[#FFE26E] to-[#FFCD05] px-[60px] py-[10px] text-[14px] gap-[8px]"
          >
            Contact Us <span className="text-[18px] leading-none">&rarr;</span>
          </a>
        </div>
      </Wrapper>
    </section>
  );
}
