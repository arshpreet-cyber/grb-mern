'use client';
import Wrapper from "@/components/ui/Wrapper";

const COOKIE_PURPOSES = [
  "Remember user preferences",
  "Analyse website traffic and performance",
  "Improve website speed and functionality",
  "Maintain website security",
  "Enhance overall user experience",
];

const COOKIE_TYPES = [
  {
    title: "Essential Cookies",
    desc: "These cookies are necessary for the core functionality of our website. They help support features such as page navigation, security, accessibility, and form submissions. Without these cookies, certain parts of the website may not function properly.",
  },
  {
    title: "Analytics & Performance Cookies",
    desc: "These cookies help us understand how visitors interact with our website by collecting information such as pages visited, time spent on the site, and overall website experience. This data helps us improve usability, optimize content, and enhance the overall user experience.",
  },
  {
    title: "Functionality Cookies",
    desc: "Functionality cookies allow the website to remember your preferences and settings, such as previously entered information or customized browsing preferences. These cookies help create a smoother and more personalized experience during future visits.",
  },
];

const BROWSER_CONTROLS = [
  "View stored cookies",
  "Block or disable cookies",
  "Delete existing cookies",
  "Receive alerts before cookies are stored",
  "Manage website-specific cookie preferences",
];

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      {/* Hero */}
      <div className="bg-[#f7f7f7] py-16 border-b border-[#ebebeb]">
        <Wrapper>
          <p className="text-[13px] font-semibold text-[#FFCE2E] uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-[36px] md:text-[44px] font-bold text-[#1a1a1a] leading-tight mb-4">How Get Reviews Buzz Uses Cookies Responsibly</h1>
          <p className="text-[16px] text-[#666] leading-relaxed max-w-3xl">
            At Get Reviews Buzz, transparency matters just as much as authenticity. This page explains how we use cookies and similar technologies to improve your browsing experience, website functionality, and overall experience.
          </p>
          <p className="text-[14px] text-[#999] mt-3">Safe &amp; Secure Browsing Experience &nbsp;|&nbsp; Applies to: getreviews.buzz</p>
          <p className="text-[13px] text-[#999] mt-2">Last updated: June 2025</p>
        </Wrapper>
      </div>

      <div className="py-14">
        <Wrapper>
          <div className="space-y-14">

            {/* What are Cookies */}
            <div>
              <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-4">What are Cookies?</h2>
              <p className="text-[15px] text-[#555] leading-relaxed">
                Cookies are small text files stored on your browser or device when you visit a website. They act like a digital memory, helping websites remember your preferences, keep you logged in, and deliver a smoother, more personalized experience each time you return. They do not contain personal data on their own, and they cannot run programs or deliver viruses. Think of them as tiny bookmarks that make your next visit smarter and faster.
              </p>
            </div>

            {/* Why We Use Cookies */}
            <div>
              <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-4">Why We Use Cookies</h2>
              <p className="text-[15px] text-[#555] leading-relaxed mb-5">
                We use cookies to make your experience on Get Reviews Buzz smoother, faster, and more personalized. These cookies help us remember preferences, improve website performance, and better understand how visitors interact with our content and services.
              </p>
              <p className="text-[15px] font-semibold text-[#1a1a1a] mb-3">Cookies may help us:</p>
              <ul className="space-y-2">
                {COOKIE_PURPOSES.map(p => (
                  <li key={p} className="flex items-center gap-3 text-[14px] text-[#555]">
                    <span className="text-[#4caf50] font-bold">✔</span> {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Types */}
            <div>
              <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-3">Types of Cookies We Use</h2>
              <p className="text-[15px] text-[#555] leading-relaxed mb-7">
                Different cookies serve different purposes on our website. Some help the website function properly, while others help us improve performance and enhance our user experience.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {COOKIE_TYPES.map(c => (
                  <div key={c.title} className="border border-[#f0f0f0] rounded-xl p-6">
                    <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-3">{c.title}</h3>
                    <p className="text-[14px] text-[#555] leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Managing Preferences */}
            <div>
              <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-4">Managing Your Cookie Preferences</h2>
              <p className="text-[15px] text-[#555] leading-relaxed mb-5">
                You can control or manage cookies through your browser settings at any time. Most browsers allow you to:
              </p>
              <ul className="space-y-2 mb-5">
                {BROWSER_CONTROLS.map(b => (
                  <li key={b} className="flex items-center gap-3 text-[14px] text-[#555]">
                    <span className="text-[#FFCE2E] font-bold">•</span> {b}
                  </li>
                ))}
              </ul>
              <p className="text-[14px] text-[#555] italic">
                Please note that disabling certain cookies may affect website functionality and limit access to some features or services available on our website. For additional guidance, we recommend visiting your browser&apos;s help or support section.
              </p>
            </div>

            {/* Updates */}
            <div>
              <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-4">Update to This Policy</h2>
              <p className="text-[15px] text-[#555] leading-relaxed">
                Get Reviews Buzz may revise this Cookie Policy periodically to reflect improvements to our website, services, or compliance practices. We encourage users to review this page occasionally to stay informed about how cookies are used on our website.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-[#fffcf0] border border-[#ffeaa7] rounded-xl p-6">
              <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-3">Need Assistance?</h3>
              <p className="text-[14px] text-[#555] mb-3">
                If you would like more information about how cookies are used on our website or need assistance regarding your privacy preferences, our team is here to help.
              </p>
              <p className="text-[14px] text-[#555]">Email: <a href="mailto:support@getreviews.buzz" className="text-[#FFCE2E] font-semibold underline">support@getreviews.buzz</a></p>
              <p className="text-[14px] text-[#555]">Website: <a href="https://getreviews.buzz" className="text-[#FFCE2E] font-semibold underline">https://getreviews.buzz</a></p>
            </div>
          </div>
        </Wrapper>
      </div>
    </div>
  );
}
