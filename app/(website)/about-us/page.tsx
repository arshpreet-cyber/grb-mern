'use client';
import { useState } from "react";
import Wrapper from "@/components/ui/Wrapper";

// ─── IMAGE CONSTANTS ───────────────────────────────────────────────────────────
const IMGS = {
  hero: "https://beta.getreviews.buzz/storage/app/blog/0438974001779955185_Group-1000006774.webp",
  whoWeAre: "https://beta.getreviews.buzz/storage/app/blog/0470557001779956136_Rectangle-10048.webp",
  journey: "https://beta.getreviews.buzz/storage/app/blog/0540134001779962686_Rectangle-10202.webp",
  checkIcon: "https://beta.getreviews.buzz/storage/app/blog/0280225001779423808_Vector.svg",
  step1: "https://beta.getreviews.buzz/storage/app/blog/0450574001779966320_Group-1000006827.svg",
  step2: "https://beta.getreviews.buzz/storage/app/blog/0901246001779966329_Group-1000006839.svg",
  step3: "https://beta.getreviews.buzz/storage/app/blog/0835612001779966338_Group-1000006841.svg",
  commitment: "https://beta.getreviews.buzz/storage/app/blog/0521250001779968416_Group-1000008309.webp",
  strategy1: "https://beta.getreviews.buzz/storage/app/blog/0227050001779970212_Rectangle-10206.webp",
  strategy2: "https://beta.getreviews.buzz/storage/app/blog/0662120001779970220_Rectangle-10207.webp",
  stars: "https://beta.getreviews.buzz/storage/app/blog/0939832001780030318_Group-1000006809.svg",
  repIcon2: "https://beta.getreviews.buzz/storage/app/blog/0469065001780030502_Awful-Review.svg",
  repIcon3: "https://beta.getreviews.buzz/storage/app/blog/0733721001780030574_Group-1000006810.svg",
  repIcon4: "https://beta.getreviews.buzz/storage/app/blog/0908509001780030587_Group-1000006811.svg",
  comparison: "https://beta.getreviews.buzz/storage/app/blog/0301140001780030844_Group-1000006797.svg",
  ctaImage: "https://beta.getreviews.buzz/storage/app/blog/0707270001780033172_Group-1000008234.webp",

};

const TIMELINE_YEARS = ["2017-2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"];

const TIMELINE_CONTENT = [
  {
    title: "The Foundation",
    img: "https://beta.getreviews.buzz/storage/app/blog/0540134001779962686_Rectangle-10202.webp",
    description: "Before Get Reviews Buzz officially launched, we spent years working in the digital industry, gaining hands-on experience, industry knowledge, and long-term expertise in reputation management, customer trust, and business growth."
  },
  {
    title: "The Beginning",
    img: "https://beta.getreviews.buzz/storage/app/blog/0905781001780289444_2.webp",
    description: "Over time, more businesses started reaching out to help with managing their online reputation. With growing demand and encouragement from clients and colleagues, we officially began our journey through Black Hat World Forum."
  },
  {
    title: "Building Momentum",
    img: "https://beta.getreviews.buzz/storage/app/blog/0316217001780289676_3.webp",
    description: "As demand increased, we expanded our operations and began developing a dedicated customer portal. During this stage, we also managed orders directly through email while steadily growing within the community."
  },
  {
    title: "Expanding Our Reach",
    img: "https://beta.getreviews.buzz/storage/app/blog/0277675001780289761_4.webp",
    description: "We officially launched our platform and quickly gained momentum, processing 1,000+ orders. More businesses began trusting us for reliable service, consistent support, and long-term reputation growth."
  },
  {
    title: "Strengthening Trust",
    img: "https://beta.getreviews.buzz/storage/app/blog/0801983001780289780_5.svg",
    description: "This marked an important stage in our growth. We partnered with larger brands and businesses across multiple industries while continuing to improve our platform and customer experience."
  },
  {
    title: "Scaling Growth",
    img: "https://beta.getreviews.buzz/storage/app/blog/0012101001780289864_6.webp",
    description: "Our focus shifted towards refining internal processes, strengthening our team, and introducing more advanced tools and systems to improve efficiency and service quality."
  },
  {
    title: "Growing Our Impact",
    img: "https://beta.getreviews.buzz/storage/app/blog/0330518001780289912_7.webp",
    description: "We revamped our platform, introduced a dedicated ticket support system, and focused heavily on faster processing along with more responsive 24/7 customer assistance."
  },
  {
    title: "Building Stronger Brands",
    img: "https://beta.getreviews.buzz/storage/app/blog/0507832001780289975_8.webp",
    description: "As our platform gained stronger organic visibility online, more businesses and industries connected with us. We continued improving our systems, strategies, and overall service experience."
  },
  {
    title: "Leading With Trust",
    img: "https://beta.getreviews.buzz/storage/app/blog/0357361001780290153_9.webp",
    description: "Our journey continues as we continue helping businesses build credibility online, strengthen customer confidence, and create a reputation that supports long-term growth."
  }
];

const STEPS = [
  {
    img: IMGS.step1, label: "STEP 1", active: true, title: "AUDIT EVERYTHING",
    paras: [
      "We dig into your online presence across review platforms, business listings, and social channels to identify what may be affecting customer trust.",
      "From negative reviews to incomplete profiles and weak visibility, we uncover gaps that could be costing you potential customers.",
    ],
  },
  {
    img: IMGS.step2, label: "STEP 2", active: false, title: "BUILD YOUR DEFENSE",
    paras: [
      "Our experts provide a custom strategy, focused on generating authentic positive reviews, strengthening your online presence,",
      "and creating a consistent brand reputation that positions your business as an obvious and safe choice.",
    ],
  },
  {
    img: IMGS.step3, label: "STEP 3", active: false, title: "PROTECT WHAT YOU EARN",
    paras: [
      "We help you maintain a strong online reputation through consistent review growth and stronger customer trust.",
      "As your ratings climb, your visibility grows, and your customer confidence compounds over time, making your business a trusted choice.",
    ],
  },
];

const IconContracts = () => (
  <img
    src="/uploads/media/1780466564675-1f2c2fc5-57d1-45ad-bc47-a3cb63949326-Group-1000009006.svg"
    alt="Icon"
    width={70}
    height={70}
  />
);

const IconDashboard = () => (
  <img
    src="/uploads/media/1780466729258-e5459164-db0f-439f-bb5a-b1e7db3e582f-Group-1000009012.svg"
    alt="Icon"
    width={70}
    height={70}
  />
);

const IconPractices = () => (
  <img
    src="/uploads/media/1780466738929-5e30ea01-5072-42e1-b0f9-5052cb94d10b-well-founded-16469108-1.svg"
    alt="Icon"
    width={70}
    height={70}
  />
);

const IconCommitment = () => (
  <img
    src="/uploads/media/1780466761331-8bb9ce0b-8342-4694-9cce-1e2b50f576a6-business-report-18415027-1-1.svg"
    alt="Icon"
    width={70}
    height={70}
  />
);

const COMMITMENT_CARDS_DATA = [
  {
    icon: <IconContracts />,
    title: "No Long-Term Contracts",
    desc: "Cancel anytime. Month-to-month engagement only. We earn your business every single month—or you walk away—with no penalties and no pressure.",
  },
  {
    icon: <IconDashboard />,
    title: "Full Transparency Dashboard",
    desc: "Track your campaign progress in real time, including review activity, rating improvements, and campaign updates. You’ll never wonder what we’re doing or why.",
  },
  {
    icon: <IconPractices />,
    title: "Platform-Safe Practices",
    desc: "Every review we generate is authentic and compliant with platform guidelines. Your profiles stay safe. Your reputation stays protected. No shortcuts. No risks.",
  },
  {
    icon: <IconCommitment />,
    title: "Results-Backed Commitment",
    desc: "Our strategies are built around measurable growth, structured delivery, and transparent progress tracking, designed to support long-term reputation management.",
  },
];

const COMMITMENTS_LIST = [
  { title: "1. No Guesswork, Only Research", desc: "We analyze your brand, customers, and competitors before making recommendations, so every strategy is backed by evidence, not assumptions." },
  { title: "2. No Templates, Only Custom Plans", desc: "Your business is unique. We design custom solutions for every campaign around your specific goals and market realities." },
  { title: "3. No Secrets, Only Transparency", desc: "You'll always know what we're doing, why we're doing it, and what results it's producing. We report progress, not just promises." },
  { title: "4. No Short-Term Fixes, Only Growth", desc: "We play the long game. Our strategies compound over time, building sustainable trust, visibility, and revenue for your business." },
];

const STRATEGIES = [
  {
    reverse: false,
    title: "Authentic, High-Quality Reviews.",
    desc: "Our expert team provides reviews that read as if real customers wrote them because they are human-written. Every review is crafted to reflect genuine experiences, highlight your strengths, and pass platform guidelines.",
    tagline: "No Bots. No Generic Spam. No Shortcuts. Just Real Content. Real Results.",
    bullets: ["Platform-compliant content", "Industry-specific language", "Natural tone and sentiment", "Highlights your unique strengths", "Consistently high-quality content"],
    img: IMGS.strategy1,
  },
  {
    reverse: true,
    title: "Strategic Delivery and Consistency.",
    desc: "We measure what matters most: star rating improvement, review volume growth, profile visibility increases, and lead generation impact.",
    desc2: "You get clear reporting that connects our work directly to your business outcomes.",
    tagline: null,
    bullets: ["Real-time dashboard access", "Monthly performance reports", "Before/after comparisons", "Revenue impact tracking"],
    img: IMGS.strategy2,
  },
];

const COMMITMENT_CARDS = [
  { title: "No Long-Term Contracts", desc: "Cancel anytime. Month-to-month engagement only. We earn your business every single month—or you walk away—with no penalties and no pressure." },
  { title: "Full Transparency Dashboard", desc: "Track your campaign progress in real time, including review activity, rating improvements, and campaign updates. You'll never wonder what we're doing or why." },
  { title: "Platform-Safe Practices", desc: "Every review we generate is authentic and compliant with platform guidelines. Your profiles stay safe. Your reputation stays protected. No shortcuts. No risks." },
  { title: "Results-Backed Commitment", desc: "Our strategies are built around measurable growth, structured delivery, and transparent progress tracking, designed to support long-term reputation management." },
];

const REPUTATION_CARDS = [
  { icon: IMGS.stars, iconStyle: "w-[212px] h-[35px]", title: "Low Star Ratings", desc: "A rating like 3 or 3.5 can instantly reduce customer trust and push buyers toward competitors." },
  { icon: IMGS.repIcon2, iconStyle: "w-[60px] h-[60px]", title: "Negative Reviews", desc: "Unmanaged negative reviews can damage your brand image and influence buying decisions." },
  { icon: IMGS.repIcon3, iconStyle: "w-[60px] h-[60px]", title: "Low Visibility & Poor Presence", desc: "Poor review presence makes it harder for customers to find and trust your business." },
  { icon: IMGS.repIcon4, iconStyle: "w-[60px] h-[60px]", title: "Lack of Social Proof", desc: "Without consistent reviews and engagement, customers may question your credibility." },
];

// ─── SECTION: HERO ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-[#FEFEFC] to-[#FDFCF2]">
      <Wrapper>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 px-4">
          {/* Left */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-[28px] md:text-[36px] lg:text-[40px] font-normal leading-[1.2] max-w-[500px]text-[#111]">
              Your Online Reputation<br />
              <span className="font-semibold text-[#FFCD05] ">
                <i>Shapes Every Customer Decision.</i>
              </span>
            </h1>
            <p className="mt-5 text-[16px] text-black max-w-[500px] leading-[25px] mx-auto lg:mx-0">
              From Generating More Genuine Reviews To Managing Your Online Reputation,
              Our Team Helps Businesses Build Trust Across Major Platforms.
            </p>
            <a
              href="/contact-us"
              className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-[#FFE26E] to-[#FFCD05] text-black font-normal rounded-lg transition hover:opacity-90"
            >
              Get Started Today →
            </a>
          </div>
          {/* Right — hidden on mobile */}
          <div className="hidden lg:block w-full lg:w-1/2">
            <img src={IMGS.hero} alt="Hero" className="w-full max-w-[820px] ml-auto" />
          </div>
        </div>
      </Wrapper>
    </section>
  );
}

// ─── SECTION: WHO WE ARE ───────────────────────────────────────────────────────
function WhoWeAreSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <Wrapper>
        <div className="flex flex-col lg:flex-row items-center justify-end gap-16 px-4">
          {/* Image */}
          <div className="w-full lg:w-[40%] min-w-[280px]">
            <img src={IMGS.whoWeAre} alt="Who We Are" className="w-full max-w-[600px] rounded-[20px] block" />
          </div>
          {/* Content */}
          <div className="w-full lg:flex-1 lg:max-w-[775px]">
            <span className="text-[16px] font-normal tracking-widest text-[#111]">
              <span
                className="mr-1 inline-block font-medium"
                style={{ background: "linear-gradient(180deg,#FFC107 0%,#E49D56 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                //
              </span>
              WHO WE ARE?
            </span>
            <h2 className="text-[26px] md:text-[30px] font-normal leading-[1.4] text-[#222] mt-3 mb-7">
              At Get Reviews Buzz, we help businesses strengthen their online
              reputation with tailored strategies focused on:
            </h2>
            <div className="flex gap-6 flex-wrap mb-6">
              {["Visibility", "Credibility", "Customer Trust"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-[15px] text-[#333] font-medium">
                  <img src={IMGS.checkIcon} alt={item} className="w-[22px] h-[22px] object-contain" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            {[
              "From improving your online presence to building powerful social proof, our team works to position your brand as a reliable and trusted choice across major online platforms and review aggregators, including Google Business Profile, Trustpilot, Yelp, Facebook, and many more.",
              "Low ratings, negative reviews, or inactive business profiles across review platforms can push potential customers straight to your competitors. In today's digital world, your online reputation plays a major role in how customers see your business and whether they choose to trust your products or services.",
              "By improving how your business appears online and building positive ratings and customer confidence, we help you attract the right audience, strengthen trust, and support long-term growth.",
            ].map((p, i) => (
              <p key={i} className="text-[#323232] text-[16px] leading-[1.8] mb-5">{p}</p>
            ))}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}

function JourneySection() {
  const [activeIdx, setActiveIdx] = useState(0);
  return (
    <section className="py-16 md:py-20 px-5 md:px-[70px] bg-gradient-to-b from-[#fffdfd] to-white overflow-hidden">
      <div className="w-full max-w-[1500px] mx-auto">
        <h2 className="text-[32px] md:text-[40px] font-bold text-[#111] mb-[50px] md:mb-[70px] leading-[1.1]">
          Our Journey So Far
        </h2>
        {/* Timeline */}
        <div className="relative mb-[60px] md:mb-[100px] w-full mx-auto px-4 md:px-0 select-none">
          {/* Base track (rail) */}
          <div className="absolute top-[36px] left-[5.55555%] w-[88.88888%] h-[2px] bg-[#f0f0f0]" />

          {/* Sliding yellow track (progress bar) */}
          <div
            className="absolute top-[36px] left-[5.55555%] h-[2px] bg-[#F4B000] transition-all duration-500 ease-out"
            style={{ width: `${activeIdx * 11.11111}%` }}
          />

          {/* Sliding handle (slider knob) */}
          <div
            className="absolute top-[26px] w-[22px] h-[22px] border border-[#F4B000] bg-white rounded-full transition-all duration-500 ease-out -translate-x-1/2 flex items-center justify-center cursor-pointer z-20"
            style={{ left: `${5.55555 + activeIdx * 11.11111}%` }}
          >
            {/* Inner core */}
            <span className="w-[10px] h-[10px] bg-[#F4B000] rounded-full" />
          </div>

          <div className="flex justify-between items-start relative w-full pb-4">
            {TIMELINE_YEARS.map((year, i) => (
              <div
                key={year}
                className="flex-grow flex-shrink-0 flex flex-col items-center cursor-pointer z-10"
                style={{ width: '11.11111%' }}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => setActiveIdx(i)}
              >
                <div className="h-12" />
                <h1 className={`text-[32px] md:text-[32px] transition-all duration-300 ${activeIdx === i ? "font-bold text-[#F4B000]" : "font-medium text-[#d5d5d5] hover:text-black/60"}`}>
                  {year}
                </h1>
              </div>
            ))}
          </div>
        </div>

        {/* Content with dynamic transition */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 min-h-[350px] mt-10">
          <div className="w-full lg:w-[45%]">
            <div className="w-full max-w-[500px] h-[330px] rounded-[18px] overflow-hidden shadow-lg border border-black/5 mx-auto lg:mx-0">
              <img
                src={TIMELINE_CONTENT[activeIdx].img}
                alt={TIMELINE_CONTENT[activeIdx].title}
                className="w-full h-full object-cover transition-all duration-500 ease-in-out transform hover:scale-105"
              />
            </div>
          </div>
          <div className="w-full lg:w-[50%] flex flex-col justify-center text-center lg:text-left">

            <h3 className="text-[28px] md:text-[36px] font-bold text-[#111] mb-6 leading-tight">
              {TIMELINE_CONTENT[activeIdx].title}
            </h3>
            <p className="text-[16px] md:text-[18px] leading-[1.7] text-black/70 max-w-[624px] mx-auto lg:mx-0">
              <i>{TIMELINE_CONTENT[activeIdx].description}</i>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION: 3 STEPS ──────────────────────────────────────────────────────────
function BrandReputationSection() {
  return (
    <section className="py-20 px-5 bg-white">
      <div className="w-full max-w-[1500px] mx-auto">
        <div className="text-center mb-[70px]">
          <h2 className="text-[32px] md:text-[40px] font-normal leading-[1.3] text-[#111]">
            Your Online Brand Reputation, <span className="font-semibold">Rebuilt<br />in Three Steps</span>
          </h2>
          <p className="mt-5 text-[#323232] text-[16px] max-w-[700px] mx-auto leading-[1.4]">
            We replace the guesswork with a proven process. From a damaged rating to a trusted online presence, here's exactly how we get it done.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-x border-[#e6e6e6]">
          {STEPS.map((step, i) => (
            <div
              key={step.label}
              // 1. Added 'group' class here to trigger hover state on children
              className={`group flex flex-col bg-white cursor-default transition-all duration-300 ${i < STEPS.length - 1 ? "border-b md:border-b-0 md:border-r border-[#e6e6e6]" : ""}`}
            >
              <div className="bg-[#fafafa] p-6 flex justify-center items-center min-h-[240px]">
                <img src={step.img} alt={step.title} className="w-full max-w-[180px] h-auto" />
              </div>
              <div className="p-8 md:p-10 flex-grow">
                {/* 2. Replaced conditional logic with group-hover classes and added base styling to match image_5ce3bb.png */}
                <span className="inline-block text-[11px] tracking-[1.5px] mb-5 px-2.5 py-1 rounded bg-[#f4f4f4] text-[#666] font-semibold transition-colors duration-300 group-hover:bg-[#f4c400] group-hover:text-[#111] group-hover:font-bold">
                  {step.label}
                </span>

                <h3 className="text-[20px] font-semibold text-[#111] mb-5 tracking-[0.5px]">{step.title}</h3>
                {step.paras.map((p, j) => (
                  <p key={j} className="text-gray-600 leading-[1.8] mb-4 text-[15px]">{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <a
            href="/contact-us"
            className="inline-block bg-gradient-to-r from-[#FFE26E] to-[#FFCD05] text-[#111] px-8 py-4 rounded-[10px] font-semibold text-[15px] transition hover:opacity-90"
          >
            Ready to improve your presence? Connect with us today! →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION: OUR COMMITMENT ───────────────────────────────────────────────────
function OurCommitmentSection() {
  return (
    <section className="py-20 px-5 bg-white">
      <div className="w-full max-w-[1500px] mx-auto relative">
        {/* Header */}
        <div className="border-b border-[#eaeaea] pb-9">
          <h2 className="text-[32px] md:text-[40px] font-normal leading-[1.2] text-[#111] mb-4 tracking-[-0.5px]">
            Our Commitment to <strong className="font-bold">Your <br />Business</strong>
          </h2>
          <p className="text-[#323232] text-[16px] max-w-[580px] leading-[1.6]">
            These aren't just values on a wall. They're the commitments that guide every client engagement, and the reasons our clients stay.
          </p>
        </div>
        {/* Items */}
        {COMMITMENTS_LIST.map((item) => (
          <div
            key={item.title}
            className="border-b border-[#eaeaea] py-8 lg:pr-[59%]"
          >
            <h3 className="text-[22px] md:text-[25px] font-medium italic text-[#111] mb-2 tracking-[-0.2px]">
              {item.title}
            </h3>
            <p className="text-[#323232] text-[15px] leading-[1.6]">{item.desc}</p>
          </div>
        ))}
        {/* Floating graphic — hidden on mobile */}
        <div className="hidden lg:block absolute right-10 top-[130px] w-[380px] h-[360px] z-10">
          <img src={IMGS.commitment} alt="Our team" className="w-full h-full mt-6 object-cover" />
        </div>
        {/* Mobile graphic */}
        <div className="block lg:hidden w-full max-w-[360px] mx-auto mt-10">
          <img src={IMGS.commitment} alt="Our team" className="w-full rounded-xl" />
        </div>
        <div className="text-center mt-14">
          <a
            href="/contact-us"
            className="inline-block bg-gradient-to-r from-[#FFE26E] to-[#FFCD05] text-[#111] px-9 py-4 rounded-[10px] font-medium text-[14px] transition hover:opacity-90"
          >
            Ready for a partner who keeps their promises? <strong className="font-bold">Let's get started! →</strong>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION: REPUTATION STRATEGIES ───────────────────────────────────────────
function ReputationStrategiesSection() {
  return (
    <section className="py-20 md:py-[120px] px-5 bg-gradient-to-b from-white to-[#FFFAED]">
      <div className="w-full max-w-[1500px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-[90px]">
          <h2 className="text-[32px] md:text-[40px] font-normal leading-[1.3] text-[#111] mb-6 tracking-[-0.5px]">
            Reputation Strategies{" "}
            <span className="font-semibold">Designed For <br />Real Business Growth</span>
            {/* <span className="text-[#f4c400] font-extrabold">.</span> */}
          </h2>
          <p className="text-[#555] text-[16px] max-w-[870px] mx-auto leading-[1.7] mb-2">
            Not all reviews are created equal. Not all strategies deliver the same results. It takes a specialized team like ours to make your business stand out from the competitors.
          </p>
          <p className="text-[16px] text-[#555] max-w-[870px] mx-auto">
            <strong>We follow a custom approach, targeting the right areas that need to be highlighted.</strong>
          </p>
        </div>
        {/* Strategy rows */}
        <div className="flex flex-col gap-16 md:gap-[100px]">
          {STRATEGIES.map((s, i) => (
            <div
              key={i}
              className={`flex flex-col-reverse ${s.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-10 md:gap-20`}
            >
              <div className="w-full lg:flex-1">
                <h3 className="text-[22px] md:text-[25px] font-medium italic text-[#111] mb-6 tracking-[-0.3px]">
                  {s.title}
                </h3>
                <p className="text-[#323232] text-[15px] leading-[1.7] mb-5">{s.desc}</p>
                {s.desc2 && <p className="text-[#323232] text-[15px] leading-[1.7] mb-5">{s.desc2}</p>}
                {s.tagline && <p className="text-[15px] font-semibold text-[#111] mb-6">{s.tagline}</p>}
                <ul className="list-none p-0 flex flex-col gap-3">
                  {s.bullets.map((b) => (
                    <li key={b} className="text-[17px] text-[#323232] flex items-center gap-2.5">
                      <span className="text-[#f4c400] text-[22px]">★</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full lg:flex-1">
                <div className="w-[90%] h-[280px] md:h-[400px] rounded-[32px] overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.05)]">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-16 md:mt-[90px]">
          <a
            href="/contact-us"
            className="inline-block bg-[#111] text-white px-10 py-4 rounded-[10px] text-[15px] font-normal tracking-[0.3px] transition hover:bg-[#333]"
          >
            Want content that converts browsers into buyers?{" "}
            <strong className="font-semibold ml-1">Let's build your review strategy →</strong>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION: 4 COMMITMENTS CARDS ─────────────────────────────────────────────
function CommitmentsGridSection() {
  return (
    <section className="w-full bg-gradient-to-b from-[#FFE26E] to-[#FFCD05]  py-16 md:py-24 px-5">
      <div className="w-full max-w-[1500px] mx-auto">
        <h2 className="w-full max-w-[732px] mx-auto text-center text-[28px] md:text-[40px] font-[400] leading-[1.3] tracking-[-0.5px] text-[#111] mb-12 md:mb-16">
          Four Risk-Reversal <span className="font-[600]">Commitments</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Left Column: Image wrapper with sticky positioning */}
          <div className="md:sticky md:top-24 lg:top-40 w-full flex justify-center lg:justify-start">
            <img
              src="/uploads/media/1780464814337-3faaff7e-c755-4f04-a4d9-12b452e1140f-Rectangle-10325.webp"
              alt="Illustration"
              className="w-full max-w-[676px] h-auto md:h-[500px] lg:h-[726px] rounded-[15px] object-cover"
            />
          </div>

          {/* Right Column: Vertical stack of four cards */}
          <div className="flex flex-col gap-6 md:gap-8">
            {COMMITMENT_CARDS_DATA.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-[20px] p-8 lg:p-10 flex flex-col items-start transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-14 w-12 h-12 flex items-center justify-center">
                  {card.icon}
                </div>
                <h3 className="text-[22px] md:text-[22px] font-500 mb-3 text-black">
                  {card.title}
                </h3>
                <p className="text-[15px] leading-[1.7] text-[#444]">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION: REPUTATION IMPACT ───────────────────────────────────────────────
function ReputationSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="w-full max-w-[1500px] mx-auto my-16 md:my-20 px-5">
      <h2 className="w-full max-w-[732px] mx-auto text-center text-[28px] md:text-[40px] font-normal leading-[1.3] tracking-[-0.5px] text-[#111] mb-12">
        Your Online Reputation{" "}
        {/* <span className="font-semibold">
          Impacts Every Decision<span className="text-[#fcd561] font-extrabold">.</span>
        </span> */}
      </h2>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {REPUTATION_CARDS.map((card, index) => (
          <div
            key={card.title}
            onMouseEnter={() => setHoveredIndex(index)}
            className={`rounded-[20px] p-8 min-h-[340px] flex flex-col justify-between transition-all duration-300 ${(hoveredIndex === null ? index === 0 : hoveredIndex === index)
              ? "bg-[#fcd561] -translate-y-1"
              : "bg-[rgba(245,245,245,0.6)]"
              }`}
          >
            <div className="flex items-center mb-4">
              <img src={card.icon} alt={card.title} className={card.iconStyle} />
            </div>
            <div>
              <h3 className="text-[20px] font-bold leading-[1.4] mb-3 text-black">{card.title}</h3>
              <p className="text-[15px] leading-[1.7] text-[#444]">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── SECTION: TRANSFORMATIONS ─────────────────────────────────────────────────
function TransformationsSection() {
  return (
    <section className="w-full max-w-[1500px] mx-auto my-16 md:my-20 px-5">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-12">
        <div className="w-full lg:max-w-[525px] text-center lg:text-left">
          <h2 className="text-[28px] md:text-[40px] font-normal leading-[1.25] mb-5 tracking-[-0.5px] text-[#111]">
            Real Businesses{" "}
            <span className="font-semibold">
              Real Transformations
            </span>
          </h2>
          <p className="text-[#323232] text-[16px] leading-[1.7] mb-8">
            Don't just take our word for it. Here's what happens when businesses trust us with their reputation.
          </p>
          <span className="text-[22px] md:text-[25px] font-semibold text-black italic">
            Which Business Would You Choose?
          </span>
        </div>
        <div className="w-full lg:flex-1 flex justify-center">
          <img src={IMGS.comparison} alt="Comparison" className="w-full max-w-[877px] h-auto" />
        </div>
      </div>
      <div className="bg-[#fffbeb] rounded-[30px] py-6 px-5 md:px-20">
        <p className="text-[16px] md:text-[22px] font-medium leading-[1.6] text-[#222] text-center italic">
          * Customers trust businesses that look credible online. And we help them achieve that efficiently!
          So, if you wish to see results that speak for themselves, get in touch with us right away!
        </p>
      </div>
    </section>
  );
}

// ─── SECTION: CTA YELLOW ──────────────────────────────────────────────────────
function CtaYellowSection() {
  return (
    <section className="bg-gradient-to-b from-[#FFE26E] to-[#FFCD05] py-16 md:py-20 px-5">
      <div className="w-full max-w-[1500px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="w-full lg:max-w-[685px] text-center lg:text-left flex flex-col items-center lg:items-start">
          <h2 className="text-[28px] md:text-[40px] font-normal leading-[1.25] mb-6 tracking-[-0.5px] text-[#111]">
            Your Future Customers Are Already Checking{" "}
            <span className="font-semibold">Your Reviews. Let's Get Started!</span>
          </h2>
          <p className="text-[15px] md:text-[16px] leading-[1.6] font-medium text-black mb-8">
            Every day, your rating sits neglected; competitors take your customers.
            You've seen our process, our principles, and our proof. Now it's time to act.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-black text-white px-7 py-4 rounded-[10px] font-medium text-[15px] transition hover:bg-[#222] hover:-translate-y-0.5"
          >
            Get Reviews Now <span className="text-[1.1rem]">→</span>
          </a>
        </div>
        <div className="hidden lg:flex flex-1 justify-center items-center">
          <img src={IMGS.ctaImage} alt="Customer checking reviews" className="w-full max-w-[712px] object-contain rounded-[24px]" />
        </div>
      </div>
    </section>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      <HeroSection />
      <WhoWeAreSection />
      <JourneySection />
      <BrandReputationSection />
      <OurCommitmentSection />
      <ReputationStrategiesSection />
      <CommitmentsGridSection />
      <ReputationSection />
      <TransformationsSection />
      <CtaYellowSection />
    </>
  );
}