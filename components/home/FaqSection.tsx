"use client";

import { useState } from "react";
import Wrapper from "@/components/ui/Wrapper";

const faqs = [
  { q: "What Services Does Get Reviews Buzz Provide?", a: "We help businesses strengthen their online reputation through review growth strategies, reputation management, and digital marketing solutions across leading platforms." },
  { q: "How Long Does It Take To See Results?", a: "Most businesses begin to see noticeable improvements within 7 to 14 days, depending on the platform, industry, and strategy in place." },
  { q: "Are The Reviews From Real People?", a: "We focus on promoting genuine customer feedback and building a credible review presence through ethical and effective strategies." },
  { q: "What Platforms Do You Support?", a: "We support major platforms, including Google, Trustpilot, Yelp, Facebook, and others, based on your business requirements." },
  { q: "Is My Business Information Kept Confidential?", a: "Definitely. We maintain strict confidentiality and ensure that all client information is handled securely and responsibly." },
  { q: "Do You Offer a Refund Policy?", a: "We're really committed to making sure our clients are happy. If we fall short of your expectations, our team will work to identify the issue and resolve it." },
  { q: "Can I Choose a Monthly Subscription Plan?", a: "Yes, we offer both one-time and flexible monthly plans to suit different business goals and budgets." },
  { q: "Is this safe for my business?", a: "Certainly! Our strategy is all about building a strong review presence that keeps you out of trouble with the platforms and helps your brand grow in the long run." },
  { q: "How do I get started?", a: "Getting started is really simple. Share your requirements with us, and our team will create a customized strategy based on your business goals, needs, and targeted platforms." },
  { q: "Can I customize my review strategy?", a: "Every strategy is tailored to your business needs. With this, you can reach the right target audience, drive growth, and help your business become more visible." },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#faf8f7] py-[50px] lg:py-[90px] font-['Poppins',sans-serif]">
      <Wrapper>
        <div className="w-full px-4 sm:px-5 lg:px-[30px]">
          <div className="grid grid-cols-1 lg:grid-cols-[490px_1fr] gap-[28px] lg:gap-[150px] items-start">

            <div className="lg:sticky lg:top-[100px] flex flex-col md:flex-row lg:flex-col flex-wrap lg:flex-nowrap items-start gap-[16px] md:gap-[24px] lg:gap-[40px]">
              <div className="flex-1 min-w-[280px]">
                <h2 className="text-[21px] md:text-[30px] lg:text-[36px] font-normal text-[#111] leading-[1.3] lg:leading-[1.25] mb-[14px]">
                  Frequently <strong className="font-semibold">Asked<br />Questions</strong>
                </h2>
                <p className="text-[13px] md:text-[14px] lg:text-[18px] text-[#323232] leading-[1.5] m-0">
                  Find clear answers to common questions about our services, process, and delivery timelines, and how we support your online reputation.
                </p>
              </div>

              <div className="flex-1 min-w-[220px] flex flex-col gap-[8px] max-md:p-4 max-md:border max-md:border-[#eee] max-md:rounded-[10px]">
                <p className="text-[16px] lg:text-[20px] font-semibold text-[#111] m-0">Still have a doubts?</p>
                <p className="text-[14px] lg:text-[18px] text-[#666] leading-[1.6] m-0">
                  Everything is explained in a clear and simple way to help you make the right decision.
                </p>
                <a
                  href="/contact-us"
                  className="inline-flex items-center gap-[6px] mt-[16px] py-[10px] px-[16px] lg:px-[22px] border-[1.5px] border-[#111] rounded-[8px] lg:rounded-[10px] text-[14px] lg:text-[16px] font-normal text-[#111] w-fit hover:bg-[#111] hover:text-white transition-colors duration-200"
                >
                  Reach out today
                  <span className="shrink-0">
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-[10px]">
              {faqs.map((faq, index) => {
                const isActive = openIndex === index;
                return (
                  <div
                    key={index}
                    className={`border border-[#e8e8e8] rounded-[12px] bg-white overflow-hidden transition-shadow duration-200 ${isActive ? "shadow-[0_4px_20px_rgba(0,0,0,0.07)]" : ""}`}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className={`w-full text-left py-[14px] pr-[50px] pl-[14px] lg:py-[18px] lg:pr-[64px] lg:pl-[20px] text-[13px] md:text-[14px] lg:text-[18px] text-[#111] relative leading-[1.5] transition-all duration-300 ${isActive ? "font-semibold" : "font-normal"}`}
                    >
                      {faq.q}
                      <div className={`absolute right-[12px] lg:right-[16px] top-1/2 -translate-y-1/2 w-[28px] h-[28px] lg:w-[36px] lg:h-[36px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all duration-300 ${isActive ? "border-black bg-[#fff3b0] rotate-180" : "border-black bg-transparent"}`}>
                        {isActive ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" className="w-[18px] h-[18px] lg:w-[24px] lg:h-[24px]">
                            <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" className="w-[18px] h-[18px] lg:w-[24px] lg:h-[24px]">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        )}
                      </div>
                    </button>
                    <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <p className="m-0 text-[13px] md:text-[14px] lg:text-[16px] text-[#555] leading-[1.6] lg:leading-[1.7] pt-[10px] pb-[14px] lg:pt-[14px] lg:pb-[18px] px-[14px] lg:px-[20px]">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
