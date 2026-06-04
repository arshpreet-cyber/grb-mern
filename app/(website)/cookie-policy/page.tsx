'use client';
import Wrapper from "@/components/ui/Wrapper";

const COOKIE_TYPES = [
  {
    type: "Strictly Necessary",
    color: "#4caf50",
    canDisable: false,
    desc: "These cookies are essential for the website to function and cannot be switched off. They are usually set in response to actions you take such as logging in, filling forms, or setting privacy preferences.",
    examples: ["Session cookies", "Authentication tokens", "Security cookies"],
  },
  {
    type: "Performance & Analytics",
    color: "#2196f3",
    canDisable: true,
    desc: "These cookies allow us to count visits and traffic sources so we can measure and improve site performance. They help us understand which pages are most and least popular.",
    examples: ["Google Analytics", "Page view tracking", "Error monitoring"],
  },
  {
    type: "Functional",
    color: "#ff9800",
    canDisable: true,
    desc: "These cookies enable enhanced functionality and personalisation such as remembering your preferences, language settings, and login status across sessions.",
    examples: ["Language preference", "Cart contents", "User preferences"],
  },
  {
    type: "Marketing & Targeting",
    color: "#e91e63",
    canDisable: true,
    desc: "These cookies may be set through our site by advertising partners to build a profile of your interests and show you relevant ads on other sites.",
    examples: ["Retargeting pixels", "Social media cookies", "Ad conversion tracking"],
  },
];

const MANAGE = [
  { title: "Browser Settings", desc: "Most browsers allow you to refuse or delete cookies through their settings. Refer to your browser's help section for instructions." },
  { title: "Opt-Out Tools", desc: "You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on available at tools.google.com/dlpage/gaoptout." },
  { title: "Cookie Banner", desc: "When you first visit our site, you can accept or decline non-essential cookies via our cookie consent banner." },
  { title: "Contact Us", desc: "If you have questions about specific cookies we use, contact us at support@getreviews.buzz and we'll provide full details." },
];

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      {/* Hero */}
      <div className="bg-[#f7f7f7] py-16 border-b border-[#ebebeb]">
        <Wrapper>
          <div className="max-w-3xl">
            <p className="text-[13px] font-semibold text-[#FFCE2E] uppercase tracking-widest mb-3">Legal</p>
            <h1 className="text-[36px] md:text-[44px] font-bold text-[#1a1a1a] leading-tight mb-4">Cookie Policy</h1>
            <p className="text-[16px] text-[#666] leading-relaxed">
              This policy explains what cookies are, how Get Reviews Buzz uses them, and how you can manage your cookie preferences.
            </p>
            <p className="text-[13px] text-[#999] mt-4">Last updated: June 2025</p>
          </div>
        </Wrapper>
      </div>

      <div className="py-14">
        <Wrapper>
          <div className="max-w-3xl space-y-12">

            {/* What are cookies */}
            <div>
              <h2 className="text-[22px] font-bold text-[#1a1a1a] mb-4 flex items-center gap-3">
                <span className="text-[26px]">🍪</span> What Are Cookies?
              </h2>
              <p className="text-[14px] text-[#555] leading-relaxed">
                Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, keep you logged in, and understand how you use the site. Cookies do not contain personally identifiable information unless you have provided it to us.
              </p>
            </div>

            {/* Cookie Types */}
            <div>
              <h2 className="text-[22px] font-bold text-[#1a1a1a] mb-6 flex items-center gap-3">
                <span className="text-[26px]">📂</span> Types of Cookies We Use
              </h2>
              <div className="space-y-5">
                {COOKIE_TYPES.map((c) => (
                  <div key={c.type} className="border border-[#f0f0f0] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[15px] font-bold text-[#1a1a1a]" style={{ color: c.color }}>{c.type}</p>
                      <span className={`text-[11px] px-3 py-1 rounded-full font-semibold ${c.canDisable ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"}`}>
                        {c.canDisable ? "Optional" : "Required"}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#555] mb-3">{c.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {c.examples.map((ex) => (
                        <span key={ex} className="text-[11px] bg-[#f5f5f5] text-[#666] px-3 py-1 rounded-full">{ex}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Third-party */}
            <div>
              <h2 className="text-[22px] font-bold text-[#1a1a1a] mb-4 flex items-center gap-3">
                <span className="text-[26px]">🌐</span> Third-Party Cookies
              </h2>
              <p className="text-[14px] text-[#555] leading-relaxed">
                Some cookies on our site are set by third-party services such as Google Analytics, payment processors, and social media platforms. These third parties have their own privacy and cookie policies, which we encourage you to review. We do not control these cookies.
              </p>
            </div>

            {/* How to manage */}
            <div>
              <h2 className="text-[22px] font-bold text-[#1a1a1a] mb-6 flex items-center gap-3">
                <span className="text-[26px]">⚙️</span> How to Manage Cookies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MANAGE.map((m) => (
                  <div key={m.title} className="bg-[#f7f7f7] rounded-xl p-5">
                    <p className="text-[14px] font-bold text-[#1a1a1a] mb-2">{m.title}</p>
                    <p className="text-[13px] text-[#666] leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-[#fffcf0] border border-[#ffeaa7] rounded-xl p-6">
              <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-2">Cookie Questions?</h3>
              <p className="text-[14px] text-[#555]">
                For questions about our cookie practices, email us at{" "}
                <a href="mailto:support@getreviews.buzz" className="text-[#FFCE2E] font-semibold underline">support@getreviews.buzz</a>
              </p>
            </div>
          </div>
        </Wrapper>
      </div>
    </div>
  );
}
