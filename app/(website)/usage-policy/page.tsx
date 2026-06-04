'use client';
import React from 'react';
import Wrapper from "@/components/ui/Wrapper";

// ─── DATA ──────────────────────────────────────────────────────────────────────
const PROCESS_STEPS = [
  { step: "01", desc: "We provide review management support for businesses." },
  { step: "02", desc: "We do not guarantee results such as ratings, rankings, or sales." },
  { step: "03", desc: "All third-party platforms operate independently." },
  { step: "04", desc: "Clients are responsible for providing accurate information." },
  { step: "05", desc: "Outcomes depend on external platform policies and user behavior." },
];

const SERVICE_LIMITATIONS = [
  { title: "Review Visibility Is Not Permanent",          desc: "We cannot guarantee that any review will stay permanently visible. Third-party platforms may remove or filter content at any time based on their own policies." },
  { title: "Ratings May Fluctuate Naturally",             desc: "We do not guarantee improvements in star ratings or overall score, as ongoing user feedback and platform systems influence these." },
  { title: "No Assured Traffic, Leads, or Sales",         desc: "We do not promise an increase in traffic, inquiries, leads, or sales. Business growth depends on multiple markets and external conditions." },
  { title: "Platform Approvals Are Not Guaranteed",       desc: "We do not control or guarantee approval of listings, accounts, or profiles. Approval decisions are made solely by the respective platforms." },
  { title: "Content Visibility is Platform-Dependent",    desc: "We cannot guarantee that any review or content will be published or remain visible, as moderation is fully controlled by third-party platforms." },
  { title: "Search Rankings Are Not Fixed or Guaranteed", desc: "We do not guarantee improved rankings or visibility in search results, as algorithms are continuously updated and controlled by external factors." },
];

const CLIENT_RESPONSIBILITIES = [
  { title: "Accurate Information Sharing",        desc: "Clients must provide complete and accurate business details, including any relevant information needed for review strategy and content creation. We are not responsible for issues arising from incorrect or incomplete information provided by the client." },
  { title: "Review and Approval of Strategy",     desc: "All strategies, content, and plans must be reviewed and approved by the client before implementation. Once approved, the client is responsible for the final decision to proceed." },
  { title: "Timely Communication & Feedback",     desc: "Clients are expected to respond to queries, provide feedback, and approve content or strategies within a reasonable timeframe to avoid delays in service delivery." },
  { title: "Responsible Use of Services",         desc: "Clients agree to use our services in a responsible manner and in compliance with applicable laws and third-party platform policies. Any misuse of services is solely the client's responsibility." },
  { title: "Platform Compliance Responsibility",  desc: "While we assist in review management, clients acknowledge that all third-party platforms operate independently. Any actions taken by these platforms are outside our control, and compliance with their policies remains the client's responsibility." },
  { title: "Final Accountability",                desc: "The client remains fully responsible for the decisions made regarding the use of our services, including approval of strategies and implementation outcomes." },
];

const NON_GUARANTEED = [
  "Permanent review visibility",
  "Ratings improvement",
  "Listing approval",
  "Traffic, leads, or sales",
  "Search ranking results",
];

const LIABILITY_ITEMS = [
  "Account Suspension",
  "Review Removal",
  "Revenue Loss",
  "Platform Actions",
];

// ─── SHARED PRIMITIVES ────────────────────────────────────────────────────────

function StarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#FFC107" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
    </svg>
  );
}

function Divider({ className = "" }: { className?: string }) {
  return <hr className={`w-full border-t border-gray-200/60 ${className}`} />;
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="w-full max-w-[1200px] mb-8 md:mb-12">
      <h2 className="text-[26px] md:text-[34px] font-[400] text-[#111] mb-3 md:mb-4 tracking-tight">{title}</h2>
      {subtitle && (
        <p className="text-[14px] md:text-[15px] leading-[1.6] text-gray-500 font-normal max-w-[1100px]">{subtitle}</p>
      )}
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[24px] md:text-[32px] font-[400] text-[#111] mb-4 md:mb-6 tracking-tight">{children}</h2>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 md:gap-5 text-[14px] md:text-[15px] leading-[1.7] md:text-justify-none text-[#444] font-normal max-w-[1380px]">
      {children}
    </div>
  );
}

function StarGrid({ items }: { items: string[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-[1200px] mt-2">
      {items.map((text) => (
        <div key={text} className="flex items-center gap-2.5">
          <StarIcon size={14} />
          <span className="text-[14px] font-[400] italic text-[#111]">{text}</span>
        </div>
      ))}
    </div>
  );
}

function StarList({ items }: { items: { title: string; desc: string }[] }) {
  return (
    <div className="w-full flex flex-col gap-6 md:gap-8 max-w-[1380px]">
      {items.map((item) => (
        <div key={item.title} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <StarIcon />
            <h3 className="text-[15px] md:text-[16px] font-[500] italic text-[#111] tracking-tight">{item.title}</h3>
          </div>
          <p className="text-[14px] md:text-[15px] leading-[1.6] text-[#555] font-normal pl-7">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

function SubSection({
  title,
  children,
  divider = true,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  divider?: boolean;
  className?: string;
}) {
  return (
    <>
      <div className={`w-full ${className}`}>
        <SubHeading>{title}</SubHeading>
        {children}
      </div>
      {divider && <Divider className="my-8 md:my-16" />}
    </>
  );
}

// ─── PAGE SECTIONS ────────────────────────────────────────────────────────────

function DisclaimerContent() {
  return (
    <section className="w-full bg-gradient-to-b from-[#FEFEFC] to-[#FCFBF3] pt-12 pb-6 md:pt-20 md:pb-10 px-4">
      <Wrapper>
        <div className="overflow-visible">
          <h1 className="text-[28px] sm:text-[34px] md:text-[44px] font-[500] italic leading-tight tracking-tight text-[#111]">
            Disclaimer &{" "}
            <span
              className="inline-block bg-clip-text text-transparent font-[500] pr-2 pb-1"
              style={{ backgroundImage: "linear-gradient(180deg,#FFC107,#E49D56)" }}
            >
              Platform Usage Policy
            </span>
          </h1>
        </div>
      </Wrapper>
    </section>
  );
}

function ProcessStepsSection() {
  return (
    <section className="w-full bg-white py-10 md:py-16 px-4">
      <Wrapper>
        <div className="w-full max-w-[1500px] mx-auto">
          <h2 className="text-[24px] md:text-[32px] font-[400] text-[#111] mb-8 md:mb-12 tracking-tight">Key Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {PROCESS_STEPS.map((item) => (
              <div key={item.step} className="bg-[#0000000a] border border-gray-200/40 rounded-[15px] p-5 md:p-6 min-h-[200px] md:min-h-[232px] flex flex-col justify-start">
                <div className="text-[34px] md:text-[40px] font-[400] text-black tracking-tight leading-none mb-4">{item.step}</div>
                <p className="text-[14px] md:text-[15px] leading-[1.6] text-[#333] font-[400]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}

function DetailedTermsSection() {
  return (
    <section className="w-full bg-gradient-to-b from-white to-[#FCFBF3] pb-10 md:pb-20 px-4">
      <Wrapper>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-[1500px] mx-auto pt-6">
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            <h2 className="text-[24px] sm:text-[30px] md:text-[36px] lg:text-[40px] font-[400] text-[#111] leading-[1.25] tracking-tight mb-4 md:mb-6">
              Detailed Terms And Conditions Are Outlined Below
            </h2>
            <BodyText>
              <p>Please read this disclaimer carefully before engaging with Get Reviews Buzz services, tools, or website features. This page outlines important platform limitations, user responsibilities, and compliance guidelines associated with our services.</p>
              <p className="font-[500] text-[#222]">We support ethical and transparent review management practices.</p>
            </BodyText>
          </div>
          <div className="lg:col-span-7 w-full flex justify-center lg:justify-end">
            <img
              src="/uploads/media/1780484411549-4346c974-223d-40a4-8c2f-016d0bbafd9b-Group-1000008633.svg"
              alt="Usage Policy Illustration"
              className="w-full max-w-[680px] h-auto rounded-[20px] object-cover"
            />
          </div>
        </div>
      </Wrapper>
    </section>
  );
}

function ServiceScopeAndDisclaimerSection() {
  return (
    <section className="w-full bg-white py-10 md:py-16 px-4">
      <Wrapper>
        <div className="w-full max-w-[1500px] mx-auto flex flex-col">
          <SubSection title="Scope of Services" divider={false}>
            <BodyText>
              <p>Get Reviews Buzz provides review management and reputation support services for businesses. Our services are limited to strategy-based reputation support, review communication guidance, and related coordination activities as agreed with the client.</p>
              <p>All work is carried out based on client instructions and prior approval. No action is taken without explicit consent, and all deliverables are provided strictly within the agreed scope of work.</p>
              <p>Our services are intended to support a business's online presence and reputation management efforts. Services are provided on a support and strategy basis only.</p>
            </BodyText>
          </SubSection>

          <Divider className="my-8 md:my-12" />

          <SubSection title="Third-Party Platform Disclaimer" divider={false}>
            <BodyText>
              <p>Get Reviews Buzz is not affiliated, associated, authorized, endorsed by, or officially connected with Google, Meta (Facebook, Instagram), Yelp, or any other third-party review platforms.</p>
              <p>All platform names, logos, and trademarks belong to their respective owners and are used only for identification purposes.</p>
              <p>Third-party platforms operate independently and may update their policies, algorithms, or visibility standards at any time. Any platform-level actions, including review removal, content filtering, visibility changes, or account restrictions, remain solely under their control.</p>
            </BodyText>
          </SubSection>
        </div>
      </Wrapper>
    </section>
  );
}

function ServiceLimitationsSection() {
  return (
    <section className="w-full bg-white py-10 md:py-16 px-4">
      <Wrapper>
        <div className="w-full max-w-[1500px] mx-auto flex flex-col">
          <SectionHeading
            title="Understanding Our Service Limitations"
            subtitle="The following points explain important limitations of our services and what results cannot be guaranteed. Please read them carefully to understand how third-party platforms and external factors may affect outcomes."
          />

          <StarList items={SERVICE_LIMITATIONS} />

          <div className="w-full max-w-[1380px] mt-8 md:mt-12 flex flex-col gap-3 text-[13px] md:text-[14px] leading-[1.65] text-gray-500 border-t border-gray-100 pt-6">
            <p>Results depend on multiple external factors, including but not limited to platform algorithms, policy changes, competition, industry type, and user behavior. These factors are outside our control.</p>
            <p>Our services are designed to support and improve online reputation efforts, but all outcomes are variable and cannot be assured.</p>
          </div>

          <Divider className="mt-12 md:mt-16" />
        </div>
      </Wrapper>
    </section>
  );
}

function ClientResponsibilitiesSection() {
  return (
    <section className="w-full bg-white pb-10 md:pb-16 px-4">
      <Wrapper>
        <div className="w-full max-w-[1500px] mx-auto flex flex-col">
          <SectionHeading
            title="Your Responsibilities as a Client"
            subtitle="To ensure smooth and effective delivery of services, clients are expected to provide accurate information, approvals, and timely cooperation. Our services rely on clear communication and mutual understanding."
          />
          <StarList items={CLIENT_RESPONSIBILITIES} />
          <Divider className="mt-12 md:mt-16" />
        </div>
      </Wrapper>
    </section>
  );
}

function ContentAndLiabilitySection() {
  return (
    <section className="w-full bg-white py-4 md:py-8 px-4">
      <Wrapper>
        <div className="w-full max-w-[1500px] mx-auto flex flex-col">

          <SubSection title="Review Content & Authenticity Policy" divider={false}>
            <BodyText>
              <p>All review content is created based on information shared and approved by the client (if applicable). The client is responsible for ensuring all information provided is accurate and truthful.</p>
              <p>We do not verify or validate claims independently.</p>
            </BodyText>
          </SubSection>

          <Divider className="my-8 md:my-12" />

          <SubSection title="Service Limitation & Non-Guaranteed Outcomes" divider={false}>
            <div className="flex flex-col gap-4 text-[14px] md:text-[15px] leading-[1.7] text-[#444]">
              <p>Our services support online reputation efforts, but certain outcomes cannot be guaranteed.</p>
              <p className="font-medium text-[#111] -mb-1">We do not guarantee:</p>
              <StarGrid items={NON_GUARANTEED} />
              <p className="text-gray-500 mt-2">While our services are designed to improve online reputation, all outcomes are variable and not guaranteed.</p>
            </div>
          </SubSection>

          <Divider className="my-8 md:my-12" />

          <SubSection title="Limitation of Liability" divider={false}>
            <div className="flex flex-col gap-4 text-[14px] md:text-[15px] leading-[1.7] text-[#444]">
              <p className="font-medium text-[#111] -mb-1">We are not responsible for:</p>
              <StarGrid items={LIABILITY_ITEMS} />
            </div>
          </SubSection>

        </div>
      </Wrapper>
    </section>
  );
}

function AcknowledgementAndCommitmentSection() {
  return (
    <section className="w-full bg-white py-10 md:py-16 px-4">
      <Wrapper>
        <div className="w-full max-w-[1500px] mx-auto flex flex-col">

          <SubSection title="Acknowledgement of Terms" divider={false}>
            <BodyText>
              <p>Clients acknowledge that by using Get Reviews Buzz services, they have read, understood, and agreed to all terms outlined in the disclaimer.</p>
              <p>All decisions made regarding the use of services are at the client's discretion.</p>
            </BodyText>
          </SubSection>

          <Divider className="my-8 md:my-12" />

          <SubSection title="Our Commitment" divider={false}>
            <BodyText>
              <p>We operate with transparency, compliance, and ethical review management practices.</p>
            </BodyText>
          </SubSection>

        </div>
      </Wrapper>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function UsagePolicy() {
  return (
    <div className="bg-white min-h-screen antialiased">
      <DisclaimerContent />
      <ProcessStepsSection />
      <DetailedTermsSection />
      <ServiceScopeAndDisclaimerSection />
      <ServiceLimitationsSection />
      <ClientResponsibilitiesSection />
      <ContentAndLiabilitySection />
      <AcknowledgementAndCommitmentSection />
    </div>
  );
}