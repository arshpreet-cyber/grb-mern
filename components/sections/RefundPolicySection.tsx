'use client';
import React from 'react';
import Wrapper from "@/components/ui/Wrapper";
import Link from "next/link";
import { SectionProps } from '@/types/section';

const StarBullet = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFCD05" xmlns="http://www.w3.org/2000/svg" className="mt-[3px] shrink-0">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFCD05"/>
  </svg>
);

export default function RefundPolicySection({ data = {}, settings = {} as any }: SectionProps) {
  // Use data from props, fallback to hardcoded defaults
  const whenRefunds = data.whenRefunds || [
    {
      title: "Reviews Not Yet Delivered – Order Still in Queue",
      body: "If your order has been placed and payment confirmed, but reviews have not gone live within 7 days from the date of order processing, you are eligible for a full refund if you choose to cancel before delivery begins. We understand that pending orders can sometimes feel uncertain. A pending status simply means your order is queued and awaiting processing. If you choose to cancel before delivery begins, our team will review and process your request accordingly.",
    },
    {
      title: "Google Review Conditions",
      body: "For Google review orders, refund eligibility depends on the plan selected at the time of purchase. We offer 7-days, 15-days, and 30-days plans, during which eligible review removals may first qualify for one-time replacement. Once the selected plan duration has passed from the order processing date, the order will no longer be eligible for refund requests.",
    },
    {
      title: "Unable to Execute the Order",
      body: "If, for any reason, we are unable to execute your order — whether due to a platform issue, a technical issue, or a gap in our delivery — you may qualify for a refund. No partial credits, no runaround.",
    },
    {
      title: "Delayed Order",
      body: "Once an order is placed, our team typically begins processing within 2–5 business days. If no work has been initiated and no communication has been sent to you within this window, you are fully entitled to request a refund. We hold ourselves accountable to this timeline.",
    },
    {
      title: "Review Retention Issues Within 30 Days",
      body: "If the reviews we delivered are removed from the platform within 30 days of your processing date, this falls within our coverage window. In this case, we will first attempt a one-time replacement. If we are unable to replace them, a refund will be considered for the affected portion of your order.",
    },
    {
      title: "Orders Marked \"Processing\"",
      body: "For orders currently in \"Processing\" status, refund requests can be submitted within 30 days of the original purchase date. If our team has initiated no work or review delivery during this window, you will qualify for a hassle-free refund.",
    },
    {
      title: "Business Profile Removal",
      body: "If the business profile associated with your order is deleted, suspended, or permanently removed during an active order, monetary refunds may not apply. We understand this puts you in a difficult position. In this case, we offer a full-service exchange. Your order value can be transferred to another business profile of your choice. You'll receive the same number of reviews for a different listing — no money lost, no order wasted.",
    },
  ];

  const notEligible = data.notEligible || [
    "Service delivery has already been completed.",
    "Order processing has already started successfully.",
    "Incorrect information was submitted during checkout.",
    "Platform-related moderation or visibility changes occur outside our direct control.",
    "Eligible replacement support has already been provided.",
    "Requests are submitted beyond the supported review period.",
  ];

  const compliance = data.compliance || [
    "Fraudulent activity",
    "Abuse of services",
    "Submission of inaccurate business information",
    "Unauthorized usage",
    "Violations of third-party platform policies or terms"
  ];

  const steps = data.steps || [
    { step: "Step 1", title: "Contact Support", desc: "Send an email to support@getreviews.buzz from your registered email address, through which you processed your order request with us." },
    { step: "Step 2", title: "Mention Order Details", desc: "Clearly include the order number along with a short explanation of the issue you experienced with your order." },
    { step: "Step 3", title: "Add Refund Reason in Subject Line", desc: "To help us identify and review your request faster, mention the reason for your refund and order number clearly in the email subject line." },
    { step: "Step 4", title: "Internal Review & Verification", desc: "Once you've sent the email, our team will start reviewing your refund request. We'll check the order status, fulfillment progress, and refund eligibility conditions as outlined in the policy." },
    { step: "Step 5", title: "Refund Processing & Updates", desc: "If you're eligible for the refund, our support team will process your refund within 5–7 business days. All updates regarding the resolution and refund will be communicated through email." },
  ];

  const contactEmail = data.contactEmail || "support@getreviews.buzz";
  const contactTime = data.contactTime || "Average Response Time: 24-48 Hours";
  const contactPhone = data.contactPhone || "+1 430-233-5403";
  const contactImage = data.contactImage || "";
  const footerDate = data.footerDate || "Last Updated: May 2026";

  return (
    <div className="bg-white font-['Poppins']">
      {/* Header */}
      <div className="bg-[#FCFBF7] py-14 border-b border-[#f0f0f0]">
        <Wrapper>
          <h1 className="text-[32px] md:text-[40px] font-bold italic text-[#1a1a1a]">Refund Policy</h1>
        </Wrapper>
      </div>

      <div className="py-16">
        <Wrapper>
          <div className="space-y-16">

            {/* Something Went Wrong */}
            <div>
              <h2 className="text-[32px] md:text-[40px] font-medium text-[#1a1a1a] mb-4">Something Went Wrong? Let's Sort It Out!</h2>
              <p className="text-[16px] text-[#444] leading-relaxed mb-6">
                We've kept this policy simple and clear. No runaround. No fancy traps. If we fall short of what you paid for, this policy clearly explains what you're entitled to and how to claim it effortlessly. We're right here to make it right, with a clear process and a team that responds promptly!
              </p>
              <div className="flex flex-wrap gap-x-10 gap-y-3">
                {["One-time replacement delivery", "Timely Response", "Transparent Eligibility"].map(t => (
                  <span key={t} className="text-[16px] text-[#444] font-medium italic flex items-start gap-2.5">
                    <StarBullet /> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Before We Talk */}
            <div>
              <h2 className="text-[32px] md:text-[40px] font-medium text-[#1a1a1a] mb-4">Before We Talk Refunds</h2>
              <p className="text-[16px] text-[#444] leading-relaxed mb-4">
                Our services are digitally fulfilled and customized based on the order you place. Because fulfillment may depend on platform-specific algorithms, moderation processes, and automated reviews monitoring, certain outcomes may vary.
              </p>
              <p className="text-[16px] text-[#444] leading-relaxed mb-6">
                We're committed to handling concerns fairly, communicating clearly, and resolving eligible issues through our replacement and refund procedures outlined in this policy.
              </p>
              <div className="flex flex-wrap gap-x-10 gap-y-3">
                {["Customized Digital Services", "Platform-Dependent Processing", "Fair Resolution Review", "Secure Transactions", "Responsive Customer Support"].map(t => (
                  <span key={t} className="text-[16px] text-[#444] font-medium italic flex items-start gap-2.5">
                    <StarBullet /> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* When Refunds May Apply */}
            <div>
              <h2 className="text-[32px] md:text-[40px] font-medium text-[#1a1a1a] mb-4">When Refunds May Apply</h2>
              <p className="text-[16px] text-[#444] leading-relaxed mb-8">
                While not every situation qualifies for a refund, eligible cases are carefully reviewed based on the order status, fulfillment progress, and the nature of the reported issue.
              </p>
              <div className="space-y-6">
                {whenRefunds.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <StarBullet />
                    <div>
                      <p className="text-[16px] font-medium italic text-[#1a1a1a] mb-1">{item.title}</p>
                      <p className="text-[16px] text-[#555] leading-[1.8]">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-[#FFFDF4] rounded-[16px] py-8 px-10 ">
              <h3 className="text-[32px] md:text-[40px] font-bold italic text-[#1a1a1a] mb-2 text-center">Important Note</h3>
              <p className="text-[16px] font-bold italic text-[#1a1a1a] leading-relaxed text-center">
                All refund and replacement requests are reviewed individually based on order status, fulfillment progress,<br />
                platform conditions, and eligibility guidelines outlined in this policy.
              </p>
            </div>

            {/* One-Time Replacement */}
            <div>
              <h2 className="text-[32px] md:text-[40px] font-medium text-[#1a1a1a] mb-4">One-Time Replacement Support</h2>
              <p className="text-[16px] text-[#444] leading-relaxed mb-4">
                In eligible situations, replacement support may be offered before a monetary refund is approved. Our focus is to resolve genuine service issues fairly while maintaining a smooth experience for both parties.
              </p>
              <p className="text-[16px] text-[#444] leading-relaxed">
                Orders affected by temporary review removals, delivery inconsistencies, or platform-related moderation within the eligible support period may qualify for one-time replacement assistance based on the status of the order and the issue reported.
              </p>
              <p className="text-[16px] text-[#555] mt-6 italic">
                Replacement eligibility is reviewed individually and may require verification from our support team before approval.
              </p>
            </div>
            
            <hr className="border-[#e5e5e5]" />

            {/* Not Eligible */}
            <div>
              <h2 className="text-[32px] md:text-[40px] font-medium text-[#1a1a1a] mb-4">Situations Where Refunds May Not Apply</h2>
              <p className="text-[16px] text-[#444] leading-relaxed mb-4">
                While we always aim to handle concerns fairly, some situations may fall outside our refund eligibility guidelines due to the nature of digitally fulfilled and platform-dependent services.
              </p>
              <p className="text-[16px] text-[#444] font-medium mb-6">Refund requests may not qualify when:</p>
              <ul className="space-y-4">
                {notEligible.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-[16px] text-[#444] italic">
                    <StarBullet /> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <hr className="border-[#e5e5e5]" />

            {/* Acceptable Use */}
            <div>
              <h2 className="text-[32px] md:text-[40px] font-medium text-[#1a1a1a] mb-4">Acceptable Use &amp; Platform Compliance</h2>
              <p className="text-[16px] text-[#444] leading-relaxed mb-4">
                Customers are responsible for ensuring that their use of our services complies with applicable laws, business practices, and third-party platform guidelines. We do not support or encourage the misuse of review systems, deceptive activity, or violations of platform-specific policies.
              </p>
              <p className="text-[16px] text-[#444] leading-relaxed mb-6">Refund or replacement eligibility may become void in situations involving:</p>
              <ul className="space-y-4">
                {compliance.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-[16px] text-[#444] italic">
                    <StarBullet /> {item}
                  </li>
                ))}
              </ul>
              <p className="text-[16px] text-[#555] mt-6">
                To maintain service quality and operational integrity, we reserve the right to review, restrict, or refuse requests that may conflict with these standards.
              </p>
            </div>
            
            <hr className="border-[#e5e5e5]" />

            {/* How to Request */}
            <div>
              <h2 className="text-[32px] md:text-[40px] font-medium text-[#1a1a1a] mb-4">How to Request a Refund</h2>
              <p className="text-[16px] text-[#444] leading-relaxed mb-8">
                If you believe your order qualifies for a refund review, please follow the steps below to help our team process your request efficiently.
              </p>
              <div className="space-y-6">
                {steps.map((s: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <StarBullet />
                    <div>
                      <p className="text-[16px] font-medium italic text-[#1a1a1a] mb-1">{s.step}: {s.title}</p>
                      <p className="text-[16px] text-[#555] leading-[1.8]">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <hr className="border-[#e5e5e5]" />

            {/* Contact */}
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <h3 className="text-[40px] font-medium text-[#1a1a1a] mb-4">Need Further Assistance?</h3>
                <p className="text-[16px] text-[#444] leading-relaxed mb-8 max-w-[500px]">
                  If you still have any questions regarding refunds, replacements, or any order-related concerns, get in touch with our support team right away! Our team is here to help you through it all.
                </p>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-[16px] font-medium transition hover:bg-[#333] mb-8"
                >
                  Fix The Issue Now →
                </Link>
                <div className="space-y-3">
                  <p className="text-[16px] text-[#444]">Email - {contactEmail}</p>
                  <p className="text-[16px] text-[#444]">Time - {contactTime}</p>
                  <p className="text-[16px] text-[#444]">Phone No - {contactPhone}</p>
                </div>
              </div>
              <div className="w-full md:w-[540px]">
                <img 
                  src={contactImage} 
                  alt="Customer Support" 
                  className="w-full h-[420px] object-cover rounded-3xl"
                />
              </div>
            </div>

            {/* Bottom Footer Note */}
            <div className="pt-16 pb-8 mt-16 relative">
              {/* Divider with central shield */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="flex-1 h-[2px] bg-[#FFCE2E] relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#FFCE2E]"></div>
                </div>
                
                <div className="w-16 h-16 rounded-full bg-[#FFF9E6] border-2 border-[#FFEAA7] flex items-center justify-center shrink-0">
                  <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0L0 5V13.8C0 20.3 5.1 26.2 12 28C18.9 26.2 24 20.3 24 13.8V5L12 0Z" fill="#FFC107"/>
                    <path d="M10.5 19L5 13.5L7.1 11.4L10.5 14.8L17.9 7.4L20 9.5L10.5 19Z" fill="white"/>
                  </svg>
                </div>

                <div className="flex-1 h-[2px] bg-[#FFCE2E] relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#FFCE2E]"></div>
                </div>
              </div>
              
              <p className="text-[16px] text-[#444] italic leading-relaxed text-center font-medium max-w-[800px] mx-auto mb-3">
                By placing an order, you acknowledge and agree to the refund, replacement, and eligibility conditions outlined within this policy.
              </p>
              <p className="text-[16px] text-[#666] font-bold text-center">
                - {footerDate}
              </p>
            </div>

          </div>
        </Wrapper>
      </div>
    </div>
  );
}
