"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import HomeNavbar from "@/components/HomeNavbar";
// import HeroBanner from "@/components/HeroBanner";
import PremiumHeroSection from "@/components/PremiumHeroSection";

const services = [
  {
    icon: "🌟",
    platform: "Google Reviews",
    desc: "Boost your Google Business rating with real, verified 5-star reviews.",
    price: "$2.99",
    per: "per review",
    badge: "Most Popular",
    badgeColor: "bg-violet-600",
  },
  {
    icon: "👍",
    platform: "Facebook Reviews",
    desc: "Increase trust on your Facebook page with authentic positive reviews.",
    price: "$2.49",
    per: "per review",
    badge: "Best Value",
    badgeColor: "bg-emerald-600",
  },
  {
    icon: "🛒",
    platform: "Trustpilot Reviews",
    desc: "Strengthen your Trustpilot score and convert more visitors into buyers.",
    price: "$3.49",
    per: "per review",
    badge: null,
    badgeColor: "",
  },
  {
    icon: "📱",
    platform: "App Store Reviews",
    desc: "Improve your app ranking with genuine iOS & Android store reviews.",
    price: "$3.99",
    per: "per review",
    badge: null,
    badgeColor: "",
  },
  {
    icon: "🏪",
    platform: "Yelp Reviews",
    desc: "Dominate local search with high-quality Yelp reviews for your business.",
    price: "$2.99",
    per: "per review",
    badge: null,
    badgeColor: "",
  },
  {
    icon: "🛍️",
    platform: "Amazon Reviews",
    desc: "Increase product credibility and sales with verified Amazon reviews.",
    price: "$4.49",
    per: "per review",
    badge: "Premium",
    badgeColor: "bg-amber-500",
  },
];

const packages = [
  {
    name: "Starter",
    price: "$19",
    reviews: "10 Reviews",
    features: ["Google or Facebook", "Delivered in 3–5 days", "Real accounts", "24/7 support"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$49",
    reviews: "30 Reviews",
    features: ["Any platform", "Delivered in 5–7 days", "Real accounts", "Priority support", "Drip delivery"],
    cta: "Most Popular",
    highlight: true,
  },
  {
    name: "Pro",
    price: "$99",
    reviews: "75 Reviews",
    features: ["Multi-platform", "Delivered in 7–10 days", "Real accounts", "Dedicated manager", "Drip delivery", "Refill guarantee"],
    cta: "Go Pro",
    highlight: false,
  },
];

const steps = [
  { step: "01", title: "Choose Your Package", desc: "Select the platform and number of reviews that fit your business goals." },
  { step: "02", title: "Provide Your Details", desc: "Share your business URL or profile link — no passwords needed, ever." },
  { step: "03", title: "Secure Checkout", desc: "Pay safely with credit card, PayPal, or crypto. 100% encrypted." },
  { step: "04", title: "Watch Reviews Roll In", desc: "Reviews are delivered gradually to look natural and stay permanent." },
];

const testimonials = [
  {
    name: "James R.",
    role: "Restaurant Owner",
    avatar: "JR",
    text: "My Google rating went from 3.8 to 4.7 in just two weeks. Bookings are up 40%. Absolutely worth every penny.",
    stars: 5,
  },
  {
    name: "Sarah M.",
    role: "E-commerce Seller",
    avatar: "SM",
    text: "The Amazon reviews were delivered exactly as promised. My product went from page 4 to page 1. Incredible results.",
    stars: 5,
  },
  {
    name: "David K.",
    role: "App Developer",
    avatar: "DK",
    text: "App Store reviews boosted my app's visibility massively. Downloads tripled within a month. Highly recommend!",
    stars: 5,
  },
];

const faqs = [
    {
      q: "What Services Does Get Reviews Buzz Provide?",
      a: "We help businesses strengthen their online reputation through review growth strategies, reputation management, and digital marketing solutions across leading platforms.",
    },
    {
      q: "How Long Does It Take To See Results?",
      a: "Most businesses begin to see noticeable improvements within 7 to 14 days, depending on the platform, industry, and strategy in place.",
    },
    {
      q: "Are The Reviews From Real People?",
      a: "We focus on promoting genuine customer feedback and building a credible review presence through ethical and effective strategies.",
    },
    {
      q: "What Platforms Do You Support?",
      a: "We support major platforms, including Google, Trustpilot, Yelp, Facebook, and others, based on your business requirements. Visit our website to check the platforms we provide genuine reviews for!",
    },
    {
      q: "Is My Business Information Kept Confidential?",
      a: "Definitely. We maintain strict confidentiality and ensure that all client information is handled securely and responsibly.",
    },
    {
      q: "Do You Offer a Refund Policy?",
      a: "We're really committed to making sure our clients are happy. If we fall short of your expectations, our team will work to identify the issue and resolve it. We'll do our best to work out a refund or come up with a solution that works for you.",
    },
    {
      q: "Can I Choose a Monthly Subscription Plan?",
      a: "Yes, we offer both one-time and flexible monthly plans to suit different business goals and budgets.",
    },
    {
      q: "Is this safe for my business?",
      a: "Certainly! You've got nothing to worry about. Our strategy is all about building a strong review presence that not only gets you good results but also keeps you out of trouble with the platforms and helps your brand grow in the long run.",
    },
    {
      q: "How do I get started?",
      a: "Getting started with us is really simple. Share your requirements with us, and our team will create a customized strategy based on your business goals, needs, and targeted platforms.",
    },
    {
      q: "Can I customize my review strategy?",
      a: "Every strategy is tailored to your business needs. With this, you can reach the right target audience, drive growth, and help your business become more visible.",
    },
  ];
const stats = [
  { value: "50,000+", label: "Reviews Delivered" },
  { value: "12,000+", label: "Happy Clients" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Customer Support" },
];

// --- Internal FAQ Component to handle Accordion State ---
function FaqSection({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-[50px] lg:py-[90px] font-['Poppins',sans-serif]">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-5 lg:px-[20px]">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[490px_1fr] gap-[28px] lg:gap-[150px] items-start">
          
          {/* ── LEFT COLUMN ── */}
          <div className="lg:sticky lg:top-[100px] flex flex-col md:flex-row lg:flex-col flex-wrap lg:flex-nowrap items-start gap-[16px] md:gap-[24px] lg:gap-[40px]">
            
            {/* Main Heading */}
            <div className="flex-1 min-w-[280px]">
              <h2 className="text-[21px] md:text-[30px] lg:text-[36px] font-normal text-[#111] leading-[1.3] lg:leading-[1.25] mb-[14px]">
                Frequently <strong className="font-bold">Asked<br />Questions</strong>
              </h2>
              <p className="text-[13px] md:text-[14px] lg:text-[18px] text-[#323232] leading-[1.5] m-0">
                Find clear answers to common questions about our services, process, and delivery timelines, and how we support your online reputation.
              </p>
            </div>

            {/* CTA Box */}
            <div className="flex-1 min-w-[220px] flex flex-col gap-[8px] max-md:p-4 max-md:border max-md:border-[#eee] max-md:rounded-[10px]">
              <p className="text-[16px] lg:text-[20px] font-semibold text-[#111] m-0">
                Still have a doubts?
              </p>
              <p className="text-[14px] lg:text-[18px] text-[#666] leading-[1.6] m-0">
                Everything is explained in a clear and simple way to help you make the right decision.
              </p>
              <a
                href="/contact-us"
                className="inline-flex items-center gap-[6px] mt-[16px] py-[10px] px-[16px] lg:px-[22px] border-[1.5px] border-[#111] rounded-[8px] lg:rounded-[10px] text-[14px] lg:text-[16px] font-normal text-[#111] w-fit hover:bg-[#111] hover:text-white transition-colors duration-200"
              >
                Reach out today
                <span className="shrink-0">
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          {/* ── RIGHT COLUMN (Accordion) ── */}
          <div className="flex flex-col gap-[10px]">
            {faqs.map((faq, index) => {
              const isActive = openIndex === index;
              return (
                <div
                  key={index}
                  className={`border border-[#e8e8e8] rounded-[12px] bg-white overflow-hidden transition-shadow duration-200 ${
                    isActive ? "shadow-[0_4px_20px_rgba(0,0,0,0.07)]" : ""
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className={`w-full text-left py-[14px] pr-[50px] pl-[14px] lg:py-[18px] lg:pr-[64px] lg:pl-[20px] text-[13px] md:text-[14px] lg:text-[18px] text-[#111] relative leading-[1.5] transition-all duration-300 ${
                      isActive ? "font-semibold" : "font-normal"
                    }`}
                  >
                    {faq.q}

                    {/* Plus / Cross Icon */}
                    <div
                      className={`absolute right-[12px] lg:right-[16px] top-1/2 -translate-y-1/2 w-[28px] h-[28px] lg:w-[36px] lg:h-[36px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isActive
                          ? "border-black bg-[#fff3b0] rotate-180"
                          : "border-black bg-transparent"
                      }`}
                    >
                      {isActive ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" className="w-[18px] h-[18px] lg:w-[24px] lg:h-[24px]">
                          <line x1="6" y1="6" x2="18" y2="18" />
                          <line x1="18" y1="6" x2="6" y2="18" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" className="w-[18px] h-[18px] lg:w-[24px] lg:h-[24px]">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      )}
                    </div>
                  </button>

                  {/* Expandable Panel (Using CSS Grid transition for smooth height animation) */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                      isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
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
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">

      {/* ── Navbar ── */}
      <HomeNavbar />

      {/* ── New Premium Hero ── */}
      <PremiumHeroSection />

      {/* ── Hero ── */}
      {/* <HeroBanner /> */}

      {/* ── Stats Bar ── */}

      <section className="bg-white py-16 px-4 sm:px-6 relative w-full font-sans">
        <div className="max-w-[1300px] mx-auto">
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
      </section>

      {/* icon grid */}

      <section className="py-16 bg-gray-50">
  <div className="max-w-350 container mx-auto px-4 text-center">
<h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Why Do Businesses Trust Get Reviews Buzz?</h2>
    <p className="text-gray-600 max-w-2xl mx-auto mb-12">As your reliable partner, we help your business strengthen their online reputation, build lasting customer trust, and drive consistent growth through effective review strategies.</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-left transition-all hover:shadow-md">
      <img src="https://getreviews.buzz/storage/app/blog/0809068001728298556_experience.svg" alt="Experience" className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Experience and Expertise</h3>
        <p className="text-gray-600 text-sm leading-relaxed">Our team brings hands-on experience in digital reputation management, helping businesses enhance visibility and build stronger customer trust.</p>
      </div>
      
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-left transition-all hover:shadow-md">
        <img src="https://getreviews.buzz/storage/app/blog/0744774001728298333_Idea.svg" alt="Solutions" className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Tailored Solutions</h3>
        <p className="text-gray-600 text-sm leading-relaxed">Every business is different. That's why we create customized strategies designed to match your specific goals, audience, and market needs.</p>
      </div>
      
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-left transition-all hover:shadow-md">
        <img src="https://getreviews.buzz/storage/app/blog/0746809001728298333_customer.svg" alt="Satisfaction" className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Customer Satisfaction Focused</h3>
        <p className="text-gray-600 text-sm leading-relaxed">We're committed to a seamless experience, ensuring every client sees real value and measurable improvement in their online presence.</p>
      </div>
      
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-left transition-all hover:shadow-md">
        <img src="https://getreviews.buzz/storage/app/blog/0503869001728298428_global.svg" alt="Global Reach" className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Global Reach, Local Understanding</h3>
        <p className="text-gray-600 text-sm leading-relaxed">We help you connect with a wider audience while maintaining strong relevance in your local market, ensuring balanced and effective growth.</p>
      </div>
      
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-left transition-all hover:shadow-md">
        <img src="https://getreviews.buzz/storage/app/blog/0751261001728298333_privacy.svg" alt="Privacy" className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Privacy & Security</h3>
        <p className="text-gray-600 text-sm leading-relaxed">Your data and business information are handled with the highest level of confidentiality and care at every stage, ensuring complete protection.</p>
      </div>
      
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-left transition-all hover:shadow-md">
        <img src="https://getreviews.buzz/storage/app/blog/0748952001728298333_support.svg" alt="Support" className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Dedicated Support & Guidance</h3>
        <p className="text-gray-600 text-sm leading-relaxed">Our team is always available to support you. From strategy to execution, our experts are available to assist whenever you need it, with timely guidance.</p>
      </div>
    </div>
  </div>
</section>

      {/* ── Services ── */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="mx-auto max-w-350 px-5">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-600 mb-3">Our Services</p>
            <h2 className="text-4xl font-extrabold text-slate-900">Reviews for Every Platform</h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto">
              We cover all major review platforms so you can build trust wherever your customers are looking.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.platform} className="relative rounded-2xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                {s.badge && (
                  <span className={`absolute top-4 right-4 rounded-full ${s.badgeColor} px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white`}>
                    {s.badge}
                  </span>
                )}
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="text-lg font-bold text-slate-900">{s.platform}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-extrabold text-violet-600">{s.price}</span>
                    <span className="ml-1 text-xs text-slate-400">{s.per}</span>
                  </div>
                  <Link href="/register" className="rounded-xl bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700 hover:bg-violet-100 transition">
                    Order Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Star */}

      <section
        id="custom-platform"
        className="relative w-full py-24 md:py-32 overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: "#FFFEF9" }}
      >
        <img
          src="https://beta.getreviews.buzz/storage/app/blog/0339272001776325180_golden-star-icon-transparent-background-2.png"
          alt=""
          className="absolute z-0 pointer-events-none hidden md:block"
          style={{
            width: "280px",
            top: "50%",
            left: "5%",
            transform: "translateY(-50%) rotate(15deg)",
            opacity: 0.35,
          }}
        />
        <img
          src="https://beta.getreviews.buzz/storage/app/blog/0339272001776325180_golden-star-icon-transparent-background-2.png"
          alt=""
          className="absolute z-0 pointer-events-none hidden md:block"
          style={{
            width: "280px",
            top: "50%",
            right: "5%",
            transform: "translateY(-50%) rotate(-15deg)",
            opacity: 0.35,
          }}
        />

        <div className="relative z-10 max-w-350 mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-[42px] leading-tight text-black mb-5" style={{ fontWeight: 400 }}>
            Can’t Find Your <strong style={{ fontWeight: 700 }}>Platform</strong>
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
            style={{
              backgroundColor: "#FCD12A",
              padding: "14px 40px",
              fontSize: "16px",
              gap: "8px",
            }}
          >
            Contact Us <span style={{ fontSize: "18px", lineHeight: 1 }}>&rarr;</span>
          </a>
        </div>
      </section>

      {/* Section With Right Image */}

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-350 mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Turn Reviews into Brand Visibility and Growth
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Customer reviews shape how people see your business. They often decide whether someone chooses you or looks elsewhere. Most customers rely on reviews to judge quality and trust, and they look for real experiences. But here’s the thing. A small number of reviews rarely creates a strong impact.
                Regular feedback builds credibility over time. It shows that your business consistently delivers value. Recent reviews matter just as much, since they reflect how your business performs today. Strong and consistent reviews improve your visibility across search and local platforms. They help your business appear when customers are actively looking and ready to take action. With a clear and consistent approach, reviews become a valuable asset that builds trust, strengthens visibility, and supports steady growth.
              </p>
            </div>

            <div className="relative">
              <div className="relative">
                <img src="https://getreviews.buzz/storage/app/blog/0547241001776770835_0936012001776065359_right-img.png" alt="Review and growth illustration" className=" w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section With Left Image */}

      <section className="py-16 lg:py-24">
        <div className="max-w-350 mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div>
                <img src="https://getreviews.buzz/storage/app/blog/0539654001776770835_0702272001776065346_left-img.png" alt="illustration of floating review boxes" className="rounded-lg w-full" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl lg:text-5xl font-bold text-black leading-tight mb-6">
                Where Reputation Meets <span className="text-[#FCD12A] font-bold">Real Business Growth</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                A strong online presence boosts visibility. But to turn that visibility into growth, you need the right approach. This is where a solid review strategy matters.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                At Get Reviews Buzz, we help businesses build and enhance their reputation. Our structured and goal-focused approach improves how your brand is perceived. We ensure it connects with your target audience and stands out in the market.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our process supports long-term results. We help you encourage repeat customers and build a lasting reputation that benefits your business over time. When your reputation matches your growth goals, it builds customer trust. This leads to better conversions and lasting success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-linear-to-r from-violet-600 to-indigo-700 py-20 text-center text-white">
        <div className="mx-auto max-w-350 px-5">
          <h2 className="text-4xl font-extrabold">Ready to Boost Your Reputation?</h2>
          <p className="mt-4 text-violet-200 text-lg">
            Join 12,000+ businesses that trust us to grow their online presence.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="rounded-2xl bg-white px-8 py-4 text-base font-bold text-violet-700 shadow-xl hover:bg-violet-50 transition">
              Start Today — It&apos;s Easy →
            </Link>
            <Link href="#pricing" className="rounded-2xl border border-white/30 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── Updated FAQ Component ── */}
      <FaqSection faqs={faqs} />

      {/* ── Footer ── */}
      <footer className="bg-slate-950 text-slate-400 py-14">
        <div className="mx-auto max-w-350 px-5">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <div>
              <div className="mb-4">
                <img
                  src="https://getreviews.buzz/storage/app/blog/kSoP1QwwRTAIZ7Z8G8KOwstnQCGKrnP0e2ludxw7.png"
                  alt="GetReviews.Buzz"
                  width={160}
                  height={40}
                  style={{ width: "160px", height: "auto" }}
                />
              </div>
              <p className="text-sm leading-relaxed">The #1 platform for buying real, authentic reviews to grow your business reputation online.</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Services</p>
              <ul className="space-y-2 text-sm">
                {["Google Reviews", "Facebook Reviews", "Trustpilot Reviews", "Amazon Reviews", "App Store Reviews"].map((s) => (
                  <li key={s}><Link href="/register" className="hover:text-white transition">{s}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Company</p>
              <ul className="space-y-2 text-sm">
                {["About Us", "How It Works", "Pricing", "Blog", "Contact"].map((s) => (
                  <li key={s}><Link href="#" className="hover:text-white transition">{s}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Legal</p>
              <ul className="space-y-2 text-sm">
                {["Privacy Policy", "Terms of Service", "Refund Policy", "Cookie Policy"].map((s) => (
                  <li key={s}><Link href="#" className="hover:text-white transition">{s}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© {new Date().getFullYear()} grb-mern-gilt.vercel.app — All rights reserved.</p>
            <div className="flex items-center gap-4">
              {["🔒 SSL Secured", "💳 Safe Payments", "⭐ Trusted Service"].map((b) => (
                <span key={b}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}