'use client';
import Wrapper from "@/components/ui/Wrapper";

const DISCLAIMERS = [
  {
    icon: "⚠️",
    title: "No Guarantee of Results",
    body: "While we make every effort to deliver high-quality review management services, Get Reviews Buzz does not guarantee specific outcomes such as improved star ratings, increased traffic, higher search rankings, or increased sales. Results depend on many external factors including third-party platform algorithms, user behaviour, and market conditions beyond our control.",
  },
  {
    icon: "🌐",
    title: "Third-Party Platform Independence",
    body: "We provide services that interact with third-party platforms such as Google, Trustpilot, Facebook, Yelp, and others. These platforms operate independently and may change their policies, algorithms, or review systems at any time. Get Reviews Buzz is not affiliated with, endorsed by, or officially connected to any third-party platform mentioned on this website.",
  },
  {
    icon: "📋",
    title: "Review Visibility Not Guaranteed",
    body: "Reviews delivered as part of our service may be filtered, removed, or rejected by third-party platforms at their sole discretion. We are not liable for any content that is removed or made invisible by platform moderation systems after delivery. Our obligation is limited to delivery, not permanent visibility.",
  },
  {
    icon: "⚖️",
    title: "Compliance Responsibility",
    body: "Clients are solely responsible for ensuring that their use of our services complies with the terms of service of the respective third-party platforms and any applicable laws or regulations in their jurisdiction. Get Reviews Buzz does not accept liability for account suspensions, penalties, or legal consequences arising from misuse of our services.",
  },
  {
    icon: "💡",
    title: "Accuracy of Information",
    body: "The information provided on this website is for general informational purposes only. While we strive to keep it accurate and up to date, we make no representations or warranties of any kind regarding its completeness, accuracy, or reliability. Any reliance you place on such information is strictly at your own risk.",
  },
  {
    icon: "💰",
    title: "Limitation of Liability",
    body: "To the fullest extent permitted by applicable law, Get Reviews Buzz shall not be liable for any indirect, incidental, special, consequential, or punitive damages including but not limited to loss of profits, revenue, data, or business opportunities, even if we have been advised of the possibility of such damages. Our total liability for any claim shall not exceed the amount paid by you for the specific service in question.",
  },
  {
    icon: "🔗",
    title: "External Links",
    body: "Our website may contain links to external websites. These links are provided for your convenience and informational purposes only. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.",
  },
  {
    icon: "📝",
    title: "Changes to This Disclaimer",
    body: "Get Reviews Buzz reserves the right to update or modify this disclaimer at any time without prior notice. Changes will be effective immediately upon posting to our website. Your continued use of our services following any changes constitutes your acceptance of the revised disclaimer.",
  },
];

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      {/* Hero */}
      <div className="bg-[#f7f7f7] py-16 border-b border-[#ebebeb]">
        <Wrapper>
          <div className="max-w-3xl">
            <p className="text-[13px] font-semibold text-[#FFCE2E] uppercase tracking-widest mb-3">Legal</p>
            <h1 className="text-[36px] md:text-[44px] font-bold text-[#1a1a1a] leading-tight mb-4">Disclaimer</h1>
            <p className="text-[16px] text-[#666] leading-relaxed">
              Please read this disclaimer carefully before using Get Reviews Buzz services. By using our website and services, you agree to the terms outlined below.
            </p>
            <p className="text-[13px] text-[#999] mt-4">Last updated: June 2025</p>
          </div>
        </Wrapper>
      </div>

      <div className="py-14">
        <Wrapper>
          <div className="max-w-3xl space-y-8">
            {DISCLAIMERS.map((d) => (
              <div key={d.title} className="flex gap-5 p-6 border border-[#f0f0f0] rounded-xl hover:border-[#FFCE2E] transition-colors">
                <span className="text-[28px] shrink-0 mt-0.5">{d.icon}</span>
                <div>
                  <h2 className="text-[16px] font-bold text-[#1a1a1a] mb-2">{d.title}</h2>
                  <p className="text-[14px] text-[#555] leading-relaxed">{d.body}</p>
                </div>
              </div>
            ))}

            {/* Contact */}
            <div className="bg-[#fffcf0] border border-[#ffeaa7] rounded-xl p-6">
              <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-2">Questions?</h3>
              <p className="text-[14px] text-[#555]">
                If you have any questions about this disclaimer, please contact us at{" "}
                <a href="mailto:support@getreviews.buzz" className="text-[#FFCE2E] font-semibold underline">support@getreviews.buzz</a>
              </p>
            </div>
          </div>
        </Wrapper>
      </div>
    </div>
  );
}
