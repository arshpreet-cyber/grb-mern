'use client';
import Wrapper from "@/components/ui/Wrapper";

const SECTIONS = [
  {
    title: "Information We Collect",
    icon: "📋",
    items: [
      { heading: "Personal Information", body: "When you register or place an order, we collect your name, email address, phone number, and billing details to process your order and communicate with you." },
      { heading: "Usage Data", body: "We automatically collect information about how you interact with our website, including pages visited, time spent, browser type, IP address, and referring URLs." },
      { heading: "Payment Information", body: "Payment details are processed securely through our payment partners (Razorpay, PayPal). We do not store full card numbers or CVV details on our servers." },
      { heading: "Communications", body: "If you contact us via email or support tickets, we retain those communications to help resolve your queries and improve our service." },
    ],
  },
  {
    title: "How We Use Your Information",
    icon: "⚙️",
    items: [
      { heading: "Order Processing", body: "We use your personal information to process and fulfill your orders, send order confirmations, and provide updates on your service status." },
      { heading: "Customer Support", body: "Your information helps us respond to your queries, troubleshoot issues, and provide personalised assistance." },
      { heading: "Service Improvement", body: "We analyse usage data to understand how our platform is used and to improve our products, features, and user experience." },
      { heading: "Marketing Communications", body: "With your consent, we may send you promotional emails about new services, offers, or updates. You can unsubscribe at any time." },
    ],
  },
  {
    title: "Data Sharing & Third Parties",
    icon: "🤝",
    items: [
      { heading: "Payment Processors", body: "We share necessary transaction data with Razorpay and PayPal to process payments securely. These parties have their own privacy policies." },
      { heading: "Service Providers", body: "We may share data with trusted third-party vendors (email services, analytics, hosting) who assist in operating our platform under strict confidentiality agreements." },
      { heading: "Legal Requirements", body: "We may disclose your information if required by law, court order, or to protect our rights, property, or the safety of our users." },
      { heading: "No Selling of Data", body: "We do not sell, rent, or trade your personal information to any third parties for their marketing purposes." },
    ],
  },
  {
    title: "Data Security",
    icon: "🔒",
    items: [
      { heading: "Encryption", body: "All data transmitted between your browser and our servers is encrypted using SSL/TLS technology to prevent unauthorised interception." },
      { heading: "Access Controls", body: "Access to personal data is restricted to authorised staff only and is protected by strong authentication measures." },
      { heading: "Data Retention", body: "We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your data at any time." },
    ],
  },
  {
    title: "Your Rights",
    icon: "✅",
    items: [
      { heading: "Access & Correction", body: "You have the right to access the personal information we hold about you and to request corrections if any data is inaccurate." },
      { heading: "Data Deletion", body: "You may request that we delete your personal data. We will comply unless we are required to retain it for legal or business purposes." },
      { heading: "Opt-Out", body: "You may opt out of marketing communications at any time by clicking 'unsubscribe' in any email or by contacting us directly." },
      { heading: "Data Portability", body: "You may request a copy of your personal data in a structured, commonly used format." },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      {/* Hero */}
      <div className="bg-[#f7f7f7] py-16 border-b border-[#ebebeb]">
        <Wrapper>
          <div className="max-w-3xl">
            <p className="text-[13px] font-semibold text-[#FFCE2E] uppercase tracking-widest mb-3">Legal</p>
            <h1 className="text-[36px] md:text-[44px] font-bold text-[#1a1a1a] leading-tight mb-4">Privacy Policy</h1>
            <p className="text-[16px] text-[#666] leading-relaxed">
              Your privacy matters to us. This policy explains how Get Reviews Buzz collects, uses, and protects your personal information.
            </p>
            <p className="text-[13px] text-[#999] mt-4">Last updated: June 2025</p>
          </div>
        </Wrapper>
      </div>

      {/* Content */}
      <div className="py-14">
        <Wrapper>
          <div className="max-w-3xl space-y-12">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="text-[22px] font-bold text-[#1a1a1a] mb-6 flex items-center gap-3">
                  <span className="text-[26px]">{section.icon}</span> {section.title}
                </h2>
                <div className="space-y-5">
                  {section.items.map((item) => (
                    <div key={item.heading} className="pl-5 border-l-[3px] border-[#FFCE2E]">
                      <p className="text-[15px] font-semibold text-[#1a1a1a] mb-1">{item.heading}</p>
                      <p className="text-[14px] text-[#555] leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Contact */}
            <div className="bg-[#fffcf0] border border-[#ffeaa7] rounded-xl p-6">
              <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-2">Questions About This Policy?</h3>
              <p className="text-[14px] text-[#555]">
                If you have any questions or concerns about our privacy practices, please contact us at{" "}
                <a href="mailto:support@getreviews.buzz" className="text-[#FFCE2E] font-semibold underline">support@getreviews.buzz</a>
              </p>
            </div>
          </div>
        </Wrapper>
      </div>
    </div>
  );
}
