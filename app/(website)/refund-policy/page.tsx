'use client';
import Wrapper from "@/components/ui/Wrapper";

const ELIGIBLE = [
  { title: "Service Not Delivered", desc: "If we fail to deliver the agreed service within the specified timeframe and cannot provide a resolution within 7 business days." },
  { title: "Significant Technical Error", desc: "If a technical error on our end results in an incorrect or unfulfilled order and we are unable to correct it." },
  { title: "Duplicate Payment", desc: "If you are charged more than once for the same order due to a payment processing error." },
];

const NOT_ELIGIBLE = [
  { title: "Change of Mind", desc: "Refunds are not issued if you simply change your mind after the service has been initiated or completed." },
  { title: "Partial Completion", desc: "If service has been partially delivered, refunds will only be considered for the undelivered portion." },
  { title: "Third-Party Platform Actions", desc: "We are not responsible for reviews removed, filtered, or rejected by third-party platforms (Google, Trustpilot, etc.) after delivery. Platform policies are beyond our control." },
  { title: "Subscription Cancellations", desc: "Monthly subscription payments are non-refundable once processed. You may cancel future renewals at any time." },
  { title: "Delay Due to Client", desc: "If delays in service delivery are caused by the client failing to provide required information on time." },
];

const STEPS = [
  { step: "01", title: "Submit a Request", desc: "Email us at support@getreviews.buzz with your order number and reason for the refund request." },
  { step: "02", title: "Review Period", desc: "Our team will review your request within 3–5 business days and may ask for additional information." },
  { step: "03", title: "Decision", desc: "We will notify you of the decision via email. Approved refunds will be processed within 7–10 business days." },
  { step: "04", title: "Refund Issued", desc: "Approved refunds are returned to the original payment method used at checkout." },
];

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      {/* Hero */}
      <div className="bg-[#f7f7f7] py-16 border-b border-[#ebebeb]">
        <Wrapper>
          <div className="max-w-3xl">
            <p className="text-[13px] font-semibold text-[#FFCE2E] uppercase tracking-widest mb-3">Legal</p>
            <h1 className="text-[36px] md:text-[44px] font-bold text-[#1a1a1a] leading-tight mb-4">Refund Policy</h1>
            <p className="text-[16px] text-[#666] leading-relaxed">
              We strive to deliver quality services. Please read our refund policy carefully before placing your order.
            </p>
            <p className="text-[13px] text-[#999] mt-4">Last updated: June 2025</p>
          </div>
        </Wrapper>
      </div>

      <div className="py-14">
        <Wrapper>
          <div className="max-w-3xl space-y-12">

            {/* General Policy */}
            <div className="bg-[#fff8e1] border border-[#ffe082] rounded-xl p-6">
              <h2 className="text-[18px] font-bold text-[#1a1a1a] mb-2">General Policy</h2>
              <p className="text-[14px] text-[#555] leading-relaxed">
                All sales are generally final. Refunds are considered only under specific circumstances as outlined below. We encourage you to review all product details before purchasing and to contact our support team with any concerns before placing an order.
              </p>
            </div>

            {/* Eligible for Refund */}
            <div>
              <h2 className="text-[22px] font-bold text-[#1a1a1a] mb-6 flex items-center gap-3">
                <span className="text-[26px]">✅</span> Eligible for Refund
              </h2>
              <div className="space-y-4">
                {ELIGIBLE.map((item) => (
                  <div key={item.title} className="pl-5 border-l-[3px] border-[#4caf50]">
                    <p className="text-[15px] font-semibold text-[#1a1a1a] mb-1">{item.title}</p>
                    <p className="text-[14px] text-[#555] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Not Eligible */}
            <div>
              <h2 className="text-[22px] font-bold text-[#1a1a1a] mb-6 flex items-center gap-3">
                <span className="text-[26px]">❌</span> Not Eligible for Refund
              </h2>
              <div className="space-y-4">
                {NOT_ELIGIBLE.map((item) => (
                  <div key={item.title} className="pl-5 border-l-[3px] border-[#ef5350]">
                    <p className="text-[15px] font-semibold text-[#1a1a1a] mb-1">{item.title}</p>
                    <p className="text-[14px] text-[#555] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Refund Process */}
            <div>
              <h2 className="text-[22px] font-bold text-[#1a1a1a] mb-6 flex items-center gap-3">
                <span className="text-[26px]">🔄</span> Refund Process
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STEPS.map((s) => (
                  <div key={s.step} className="bg-[#f7f7f7] rounded-xl p-5">
                    <p className="text-[28px] font-black text-[#FFCE2E] mb-2">{s.step}</p>
                    <p className="text-[15px] font-bold text-[#1a1a1a] mb-1">{s.title}</p>
                    <p className="text-[13px] text-[#666]">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-[#fffcf0] border border-[#ffeaa7] rounded-xl p-6">
              <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-2">Need Help With a Refund?</h3>
              <p className="text-[14px] text-[#555]">
                Contact our support team at{" "}
                <a href="mailto:support@getreviews.buzz" className="text-[#FFCE2E] font-semibold underline">support@getreviews.buzz</a>{" "}
                with your order number and we&apos;ll get back to you within 3–5 business days.
              </p>
            </div>
          </div>
        </Wrapper>
      </div>
    </div>
  );
}
