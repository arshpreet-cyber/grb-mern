'use client';
import Wrapper from "@/components/ui/Wrapper";

const SECTIONS = [
  {
    icon: "📌",
    title: "Acceptance of Terms",
    body: "By accessing or using Get Reviews Buzz ('we', 'us', 'our'), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services. We reserve the right to update these terms at any time, and your continued use of the platform constitutes acceptance of any changes.",
  },
  {
    icon: "🛒",
    title: "Services",
    body: "Get Reviews Buzz provides online reputation management services including review generation and management across various third-party platforms. Our services are provided 'as is' and we reserve the right to modify, suspend, or discontinue any service at any time without prior notice.",
  },
  {
    icon: "👤",
    title: "Accounts & Registration",
    body: "To place an order, you must create an account and provide accurate, complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorised use of your account. We reserve the right to suspend or terminate accounts that violate these terms.",
  },
  {
    icon: "💳",
    title: "Payments & Billing",
    body: "All prices are listed in USD unless stated otherwise. Payment is required in full before service delivery begins. For subscription services, recurring charges will be billed automatically on your billing cycle. You authorise us to charge your payment method for all fees incurred. All transactions are processed securely through our payment partners.",
  },
  {
    icon: "🚚",
    title: "Service Delivery",
    body: "Delivery timelines are estimates and may vary depending on the nature of the service and client responsiveness. We will make every reasonable effort to meet agreed timelines. Delays caused by incomplete information provided by the client, platform downtime, or external factors beyond our control do not constitute a breach of these terms.",
  },
  {
    icon: "🔒",
    title: "Intellectual Property",
    body: "All content, trademarks, logos, and materials on the Get Reviews Buzz website are the exclusive property of Get Reviews Buzz or its content suppliers and are protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from any of our content without express written permission.",
  },
  {
    icon: "🚫",
    title: "Prohibited Uses",
    body: "You agree not to: (a) use our services for any unlawful purpose; (b) attempt to gain unauthorised access to any part of our platform; (c) use our services to violate any third-party platform's terms of service; (d) engage in any activity that could damage, overload, or impair our platform; (e) resell or sublicense our services without our written consent.",
  },
  {
    icon: "🌐",
    title: "Third-Party Platforms",
    body: "Our services interact with third-party platforms such as Google, Trustpilot, Yelp, and others. We are not affiliated with these platforms and are not responsible for their terms, policies, or actions. Platform decisions regarding account bans, review removal, or other actions are outside our control and do not entitle you to a refund.",
  },
  {
    icon: "📋",
    title: "Subscriptions & Cancellations",
    body: "Subscription services renew automatically on a monthly basis unless cancelled. You may cancel your subscription at any time via your account dashboard or by contacting support. Cancellations take effect at the end of the current billing cycle. No refunds are issued for partial months or unused portions of a subscription period.",
  },
  {
    icon: "⚖️",
    title: "Limitation of Liability",
    body: "To the maximum extent permitted by law, Get Reviews Buzz shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of our services. Our total liability for any claim arising out of or in connection with these terms shall not exceed the total amount paid by you in the 3 months preceding the claim.",
  },
  {
    icon: "🛡️",
    title: "Indemnification",
    body: "You agree to indemnify, defend, and hold harmless Get Reviews Buzz and its officers, directors, employees, and agents from and against any claims, damages, losses, liabilities, and expenses (including legal fees) arising from: (a) your use of our services; (b) your violation of these terms; or (c) your violation of any third-party rights.",
  },
  {
    icon: "📧",
    title: "Communication",
    body: "By creating an account, you consent to receiving transactional and service-related emails from us. You may opt out of marketing emails at any time. Important account and service notifications cannot be opted out of while your account is active as they are necessary for service delivery.",
  },
  {
    icon: "🔄",
    title: "Changes to Terms",
    body: "We reserve the right to revise these Terms and Conditions at any time. Material changes will be communicated via email or a prominent notice on our website. Your continued use of our services following notification of changes constitutes your acceptance of the revised terms.",
  },
  {
    icon: "📍",
    title: "Governing Law",
    body: "These Terms and Conditions shall be governed by and construed in accordance with applicable laws. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts. If any provision of these terms is found to be unenforceable, the remaining provisions shall remain in full effect.",
  },
];

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      {/* Hero */}
      <div className="bg-[#f7f7f7] py-16 border-b border-[#ebebeb]">
        <Wrapper>
          <div className="max-w-3xl">
            <p className="text-[13px] font-semibold text-[#FFCE2E] uppercase tracking-widest mb-3">Legal</p>
            <h1 className="text-[36px] md:text-[44px] font-bold text-[#1a1a1a] leading-tight mb-4">Terms &amp; Conditions</h1>
            <p className="text-[16px] text-[#666] leading-relaxed">
              Please read these terms carefully before using Get Reviews Buzz. By using our services, you agree to be bound by the following terms and conditions.
            </p>
            <p className="text-[13px] text-[#999] mt-4">Last updated: June 2025</p>
          </div>
        </Wrapper>
      </div>

      <div className="py-14">
        <Wrapper>
          <div className="max-w-3xl space-y-8">
            {SECTIONS.map((s, i) => (
              <div key={s.title} className="flex gap-5 p-6 border border-[#f0f0f0] rounded-xl hover:border-[#FFCE2E] transition-colors">
                <div className="shrink-0">
                  <span className="text-[28px]">{s.icon}</span>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#FFCE2E] uppercase tracking-widest mb-1">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="text-[16px] font-bold text-[#1a1a1a] mb-2">{s.title}</h2>
                  <p className="text-[14px] text-[#555] leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}

            {/* Contact */}
            <div className="bg-[#fffcf0] border border-[#ffeaa7] rounded-xl p-6">
              <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-2">Questions About These Terms?</h3>
              <p className="text-[14px] text-[#555]">
                If you have any questions about our Terms and Conditions, please contact us at{" "}
                <a href="mailto:support@getreviews.buzz" className="text-[#FFCE2E] font-semibold underline">support@getreviews.buzz</a>
              </p>
            </div>
          </div>
        </Wrapper>
      </div>
    </div>
  );
}
