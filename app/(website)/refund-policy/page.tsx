'use client';
import Wrapper from "@/components/ui/Wrapper";

const WHEN_REFUNDS = [
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

const NOT_ELIGIBLE = [
  "Service delivery has already been completed.",
  "Order processing has already started successfully.",
  "Incorrect information was submitted during checkout.",
  "Platform-related moderation or visibility changes occur outside our direct control.",
  "Eligible replacement support has already been provided.",
  "Requests are submitted beyond the supported review period.",
];

const STEPS = [
  { step: "Step 1", title: "Contact Support", desc: "Send an email to support@getreviews.buzz from your registered email address, through which you processed your order request with us." },
  { step: "Step 2", title: "Mention Order Details", desc: "Clearly include the order number along with a short explanation of the issue you experienced with your order." },
  { step: "Step 3", title: "Add Refund Reason in Subject Line", desc: "To help us identify and review your request faster, mention the reason for your refund and order number clearly in the email subject line." },
  { step: "Step 4", title: "Internal Review & Verification", desc: "Once you've sent the email, our team will start reviewing your refund request. We'll check the order status, fulfillment progress, and refund eligibility conditions as outlined in the policy." },
  { step: "Step 5", title: "Refund Processing & Updates", desc: "If you're eligible for the refund, our support team will process your refund within 5–7 business days. All updates regarding the resolution and refund will be communicated through email." },
];

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      {/* Hero */}
      <div className="bg-[#f7f7f7] py-16 border-b border-[#ebebeb]">
        <Wrapper>
          <p className="text-[13px] font-semibold text-[#FFCE2E] uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-[36px] md:text-[44px] font-bold text-[#1a1a1a] leading-tight mb-4">Something Went Wrong? Let&apos;s Sort It Out!</h1>
          <p className="text-[16px] text-[#666] leading-relaxed max-w-3xl">
            We&apos;ve kept this policy simple and clear. No runaround. No fancy traps. If we fall short of what you paid for, this policy clearly explains what you&apos;re entitled to and how to claim it effortlessly. We&apos;re right here to make it right, with a clear process and a team that responds promptly!
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 mt-5">
            {["One-time replacement delivery", "Timely Response", "Transparent Eligibility"].map(t => (
              <span key={t} className="text-[14px] text-[#333] font-medium flex items-center gap-2">
                <span className="text-[#4caf50] font-bold">✔</span> {t}
              </span>
            ))}
          </div>
          <p className="text-[13px] text-[#999] mt-5">Last updated: June 2025</p>
        </Wrapper>
      </div>

      <div className="py-14">
        <Wrapper>
          <div className="space-y-14">

            {/* Before We Talk */}
            <div>
              <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-4">Before We Talk Refunds</h2>
              <p className="text-[15px] text-[#555] leading-relaxed mb-4">
                Our services are digitally fulfilled and customized based on the order you place. Because fulfillment may depend on platform-specific algorithms, moderation processes, and automated reviews monitoring, certain outcomes may vary.
              </p>
              <p className="text-[15px] text-[#555] leading-relaxed mb-5">
                We&apos;re committed to handling concerns fairly, communicating clearly, and resolving eligible issues through our replacement and refund procedures outlined in this policy.
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {["Customized Digital Services", "Platform-Dependent Processing", "Fair Resolution Review", "Responsive Customer Support", "Secure Transactions"].map(t => (
                  <span key={t} className="text-[14px] text-[#333] font-medium flex items-center gap-2">
                    <span className="text-[#4caf50] font-bold">✔</span> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-[#fffcf0] border border-[#ffeaa7] rounded-xl p-6">
              <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-2">Important Note</h3>
              <p className="text-[14px] text-[#555] leading-relaxed">
                All refund and replacement requests are reviewed individually based on order status, fulfillment progress, platform conditions, and eligibility guidelines outlined in this policy.
              </p>
            </div>

            {/* When Refunds May Apply */}
            <div>
              <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-3">When Refunds May Apply</h2>
              <p className="text-[15px] text-[#555] leading-relaxed mb-8">
                While not every situation qualifies for a refund, eligible cases are carefully reviewed based on the order status, fulfillment progress, and the nature of the reported issue.
              </p>
              <div className="space-y-6">
                {WHEN_REFUNDS.map((item) => (
                  <div key={item.title} className="pl-5 border-l-[3px] border-[#FFCE2E]">
                    <p className="text-[16px] font-bold text-[#1a1a1a] mb-2">{item.title}</p>
                    <p className="text-[14px] text-[#555] leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* One-Time Replacement */}
            <div>
              <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-4">One-Time Replacement Support</h2>
              <p className="text-[15px] text-[#555] leading-relaxed mb-3">
                In eligible situations, replacement support may be offered before a monetary refund is approved. Our focus is to resolve genuine service issues fairly while maintaining a smooth experience for both parties.
              </p>
              <p className="text-[15px] text-[#555] leading-relaxed">
                Orders affected by temporary review removals, delivery inconsistencies, or platform-related moderation within the eligible support period may qualify for one-time replacement assistance based on the status of the order and the issue reported.
              </p>
            </div>

            {/* Not Eligible */}
            <div>
              <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-4">Situations Where Refunds May Not Apply</h2>
              <p className="text-[15px] text-[#555] leading-relaxed mb-5">
                While we always aim to handle concerns fairly, some situations may fall outside our refund eligibility guidelines due to the nature of digitally fulfilled and platform-dependent services.
              </p>
              <p className="text-[15px] text-[#555] font-medium mb-4">Refund requests may not qualify when:</p>
              <ul className="space-y-3">
                {NOT_ELIGIBLE.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[14px] text-[#555]">
                    <span className="text-[#ef5350] mt-0.5 shrink-0 font-bold">✕</span> {item}
                  </li>
                ))}
              </ul>
              <p className="text-[14px] text-[#555] mt-4 italic">
                Replacement eligibility is reviewed individually and may require verification from our support team before approval.
              </p>
            </div>

            {/* Acceptable Use */}
            <div>
              <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-4">Acceptable Use &amp; Platform Compliance</h2>
              <p className="text-[15px] text-[#555] leading-relaxed mb-4">
                Customers are responsible for ensuring that their use of our services complies with applicable laws, business practices, and third-party platform guidelines. We do not support or encourage the misuse of review systems, deceptive activity, or violations of platform-specific policies.
              </p>
              <p className="text-[15px] text-[#555] leading-relaxed mb-4">Refund or replacement eligibility may become void in situations involving:</p>
              <ul className="space-y-2">
                {["Fraudulent activity", "Abuse of services", "Submission of inaccurate business information", "Unauthorized usage", "Violations of third-party platform policies or terms"].map(item => (
                  <li key={item} className="flex items-start gap-3 text-[14px] text-[#555]">
                    <span className="text-[#ef5350] mt-0.5 shrink-0 font-bold">✕</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* How to Request */}
            <div>
              <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-4">How to Request a Refund</h2>
              <p className="text-[15px] text-[#555] leading-relaxed mb-8">
                If you believe your order qualifies for a refund review, please follow the steps below to help our team process your request efficiently.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {STEPS.map((s) => (
                  <div key={s.step} className="bg-[#f7f7f7] rounded-xl p-6">
                    <p className="text-[12px] font-bold text-[#FFCE2E] uppercase tracking-widest mb-1">{s.step}</p>
                    <p className="text-[15px] font-bold text-[#1a1a1a] mb-2">{s.title}</p>
                    <p className="text-[13px] text-[#666] leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-[#fffcf0] border border-[#ffeaa7] rounded-xl p-6">
              <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-3">Need Further Assistance?</h3>
              <p className="text-[14px] text-[#555] mb-4">If you still have any questions regarding refunds, replacements, or any order-related concerns, get in touch with our support team right away! Our team is here to help you through it all.</p>
              <p className="text-[14px] text-[#555]">Email: <a href="mailto:support@getreviews.buzz" className="text-[#FFCE2E] font-semibold underline">support@getreviews.buzz</a></p>
              <p className="text-[14px] text-[#555]">Average Response Time: 24–48 Hours</p>
            </div>
          </div>
        </Wrapper>
      </div>
    </div>
  );
}
