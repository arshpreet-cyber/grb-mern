"use client";

/* eslint-disable @next/next/no-img-element */
import Wrapper from "@/components/Wrapper";

export default function CustomPlatform() {
  return (
    <section
      id="custom-platform"
      className="relative w-full py-5 md:py-10 overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: "#FFFEF9" }}
    >
      <Wrapper>
        <img
          src="https://beta.getreviews.buzz/storage/app/blog/0339272001776325180_golden-star-icon-transparent-background-2.png"
          alt=""
          className="absolute z-0 pointer-events-none hidden md:block"
          style={{ width: "280px", top: "50%", left: "5%", transform: "translateY(-50%) rotate(15deg)", opacity: 0.35 }}
        />
        <img
          src="https://beta.getreviews.buzz/storage/app/blog/0339272001776325180_golden-star-icon-transparent-background-2.png"
          alt=""
          className="absolute z-0 pointer-events-none hidden md:block"
          style={{ width: "280px", top: "50%", right: "5%", transform: "translateY(-50%) rotate(-15deg)", opacity: 0.35 }}
        />

        <div className="relative z-10 w-full mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-[42px] leading-tight text-black mb-5" style={{ fontWeight: 400 }}>
            Can&apos;t Find Your <strong style={{ fontWeight: 700 }}>Platform</strong>
            <br />
            Listed Above?
          </h2>

          <p className="text-base md:text-[18px] text-[#4b5563] max-w-[800px] mx-auto mb-10 leading-relaxed">
            Share your preferred platform with us, and our team will design a customized approach
            <br />
            to help you build a credible review presence where it matters the most.
          </p>

          <a
            href="/contact-us"
            className="inline-flex items-center justify-center text-black font-medium rounded-lg transition-transform hover:-translate-y-1 shadow-sm hover:shadow"
            style={{ backgroundColor: "#FCD12A", padding: "14px 40px", fontSize: "16px", gap: "8px" }}
          >
            Contact Us <span style={{ fontSize: "18px", lineHeight: 1 }}>&rarr;</span>
          </a>
        </div>
      </Wrapper>
    </section>
  );
}
