'use client';
import Wrapper from "@/components/ui/Wrapper";

const HIGHLIGHTS = [
  "We provide review management support for businesses.",
  "We do not guarantee results such as ratings, rankings, or sales.",
  "All third-party platforms operate independently.",
  "Clients are responsible for providing accurate information.",
  "Outcomes depend on external platform policies and user behavior.",
];

const LIMITATIONS = [
  { title: "Review Visibility Is Not Permanent", desc: "We cannot guarantee that any review will stay permanently visible. Third-party platforms may remove or filter content at any time based on their own policies." },
  { title: "Ratings May Fluctuate Naturally", desc: "We do not guarantee improvements in star ratings or overall score, as ongoing user feedback and platform systems influence these." },
  { title: "No Assured Traffic, Leads, or Sales", desc: "We do not promise an increase in traffic, inquiries, leads, or sales. Business growth depends on multiple markets and external conditions." },
  { title: "Platform Approvals Are Not Guaranteed", desc: "We do not control or guarantee approval of listings, accounts, or profiles. Approval decisions are made solely by the respective platforms." },
  { title: "Content Visibility is Platform-Dependent", desc: "We cannot guarantee that any review or content will be published or remain visible, as moderation is fully controlled by third-party platforms." },
  { title: "Search Rankings Are Not Fixed or Guaranteed", desc: "We do not guarantee improved rankings or visibility in search results, as algorithms are continuously updated and controlled by external factors." },
];

const RESPONSIBILITIES = [
  { title: "Accurate Information Sharing", desc: "Clients must provide complete and accurate business details, including any relevant information needed for review strategy and content creation. We are not responsible for issues arising from incorrect or incomplete information provided by the client." },
  { title: "Review and Approval of Strategy", desc: "All strategies, content, and plans must be reviewed and approved by the client before implementation. Once approved, the client is responsible for the final decision to proceed." },
  { title: "Timely Communication & Feedback", desc: "Clients are expected to respond to queries, provide feedback, and approve content or strategies within a reasonable timeframe to avoid delays in service delivery." },
  { title: "Responsible Use of Services", desc: "Clients agree to use our services in a responsible manner and in compliance with applicable laws and third-party platform policies. Any misuse of services is solely the client's responsibility." },
  { title: "Platform Compliance Responsibility", desc: "While we assist in review management, clients acknowledge that all third-party platforms operate independently. Any actions taken by these platforms are outside our control, and compliance with their policies remains the client's responsibility." },
  { title: "Final Accountability", desc: "The client remains fully responsible for the decisions made regarding the use of our services, including approval of strategies and implementation outcomes." },
];

const NOT_GUARANTEED = ["Permanent review visibility", "Ratings improvement", "Listing approval", "Traffic, leads, or sales", "Search ranking results"];
const NOT_LIABLE = ["Account Suspension", "Review Removal", "Revenue Loss", "Platform Actions"];

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      {/* Hero */}
      <div className="bg-[#f7f7f7] py-16 border-b border-[#ebebeb]">
        <Wrapper>
          <p className="text-[13px] font-semibold text-[#FFCE2E] uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-[36px] md:text-[44px] font-bold text-[#1a1a1a] leading-tight mb-4">Disclaimer &amp; Platform Usage Policy</h1>
          <p className="text-[16px] text-[#666] leading-relaxed max-w-3xl">
            Please read this disclaimer carefully before engaging with Get Reviews Buzz services, tools, or website features. This page outlines important platform limitations, user responsibilities, and compliance guidelines associated with our services.
          </p>
          <p className="text-[13px] text-[#999] mt-4">Last updated: June 2025</p>
        </Wrapper>
      </div>

      <div className="py-14">
        <Wrapper>
          <div className="space-y-14">

            {/* Key Highlights */}
            <div>
              <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-5">Key Highlights</h2>
              <ul className="space-y-3">
                {HIGHLIGHTS.map(h => (
                  <li key={h} className="flex items-start gap-3 text-[15px] text-[#555]">
                    <span className="text-[#FFCE2E] font-bold mt-0.5 shrink-0">•</span> {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Scope of Services */}
            <div>
              <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-4">Scope of Services</h2>
              <p className="text-[15px] text-[#555] leading-relaxed mb-3">
                Get Reviews Buzz provides review management and reputation support services for businesses. Our services are limited to strategy-based reputation support, review communication guidance, and related coordination activities as agreed with the client.
              </p>
              <p className="text-[15px] text-[#555] leading-relaxed mb-3">
                All work is carried out based on client instructions and prior approval. No action is taken without explicit consent, and all deliverables are provided strictly within the agreed scope of work.
              </p>
              <p className="text-[15px] text-[#555] leading-relaxed">
                Our services are intended to support a business&apos;s online presence and reputation management efforts. Services are provided on a support and strategy basis only.
              </p>
            </div>

            {/* Third-Party Disclaimer */}
            <div>
              <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-4">Third-Party Platform Disclaimer</h2>
              <p className="text-[15px] text-[#555] leading-relaxed mb-3">
                Get Reviews Buzz is not affiliated, associated, authorized, endorsed by, or officially connected with Google, Meta (Facebook, Instagram), Yelp, or any other third-party review platforms.
              </p>
              <p className="text-[15px] text-[#555] leading-relaxed mb-3">
                All platform names, logos, and trademarks belong to their respective owners and are used only for identification purposes.
              </p>
              <p className="text-[15px] text-[#555] leading-relaxed">
                Third-party platforms operate independently and may update their policies, algorithms, or visibility standards at any time. Any platform-level actions, including review removal, content filtering, visibility changes, or account restrictions, remain solely under their control.
              </p>
            </div>

            {/* Service Limitations */}
            <div>
              <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-3">Understanding Our Service Limitations</h2>
              <p className="text-[15px] text-[#555] leading-relaxed mb-7">
                The following points explain important limitations of our services and what results cannot be guaranteed. Please read them carefully to understand how third-party platforms and external factors may affect outcomes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {LIMITATIONS.map(l => (
                  <div key={l.title} className="pl-5 border-l-[3px] border-[#FFCE2E]">
                    <p className="text-[15px] font-bold text-[#1a1a1a] mb-1">{l.title}</p>
                    <p className="text-[14px] text-[#555] leading-relaxed">{l.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Responsibilities */}
            <div>
              <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-3">Your Responsibilities as a Client</h2>
              <p className="text-[15px] text-[#555] leading-relaxed mb-7">
                To ensure smooth and effective delivery of services, clients are expected to provide accurate information, approvals, and timely cooperation. Our services rely on clear communication and mutual understanding.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {RESPONSIBILITIES.map(r => (
                  <div key={r.title} className="bg-[#f7f7f7] rounded-xl p-5">
                    <p className="text-[15px] font-bold text-[#1a1a1a] mb-2">{r.title}</p>
                    <p className="text-[13px] text-[#666] leading-relaxed">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* User Responsibility */}
            <div>
              <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-4">User Responsibility &amp; Acceptable Use</h2>
              <p className="text-[15px] text-[#555] leading-relaxed mb-3">
                Clients agree to use Get Reviews Buzz services only for lawful and legitimate business purposes. Any misuse, including fraud, impersonation, fake business activity, or misleading information, is strictly prohibited.
              </p>
              <p className="text-[15px] text-[#555] leading-relaxed">
                We reserve the right to suspend or terminate services in case of misuse.
              </p>
            </div>

            {/* Review Content */}
            <div>
              <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-4">Review Content &amp; Authenticity Policy</h2>
              <p className="text-[15px] text-[#555] leading-relaxed mb-3">
                All review content is created based on information shared and approved by the client (if applicable). The client is responsible for ensuring all information provided is accurate and truthful.
              </p>
              <p className="text-[15px] text-[#555] leading-relaxed">We do not verify or validate claims independently.</p>
            </div>

            {/* Not Guaranteed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-4">Service Limitation &amp; Non-Guaranteed Outcomes</h2>
                <p className="text-[15px] text-[#555] mb-4">Our services support online reputation efforts, but certain outcomes cannot be guaranteed.</p>
                <p className="text-[15px] font-semibold text-[#1a1a1a] mb-3">We do not guarantee:</p>
                <ul className="space-y-2">
                  {NOT_GUARANTEED.map(i => (
                    <li key={i} className="flex items-center gap-3 text-[14px] text-[#555]">
                      <span className="text-[#ef5350] font-bold">✕</span> {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-4">Limitation of Liability</h2>
                <p className="text-[15px] text-[#555] mb-4">We are not responsible for:</p>
                <ul className="space-y-2">
                  {NOT_LIABLE.map(i => (
                    <li key={i} className="flex items-center gap-3 text-[14px] text-[#555]">
                      <span className="text-[#ef5350] font-bold">✕</span> {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Acknowledgement */}
            <div className="bg-[#f7f7f7] rounded-xl p-6">
              <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-2">Acknowledgement of Terms</h3>
              <p className="text-[14px] text-[#555] leading-relaxed mb-3">
                Clients acknowledge that by using Get Reviews Buzz services, they have read, understood, and agreed to all terms outlined in the disclaimer. All decisions made regarding the use of services are at the client&apos;s discretion.
              </p>
              <p className="text-[14px] font-semibold text-[#1a1a1a]">Our Commitment</p>
              <p className="text-[14px] text-[#555]">We operate with transparency, compliance, and ethical review management practices.</p>
            </div>
          </div>
        </Wrapper>
      </div>
    </div>
  );
}
