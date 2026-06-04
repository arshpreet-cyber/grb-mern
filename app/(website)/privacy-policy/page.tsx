'use client';
import Wrapper from "@/components/ui/Wrapper";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      {/* Hero */}
      <div className="bg-[#f7f7f7] py-16 border-b border-[#ebebeb]">
        <Wrapper>
          <p className="text-[13px] font-semibold text-[#FFCE2E] uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-[36px] md:text-[44px] font-bold text-[#1a1a1a] leading-tight mb-4">Privacy Policy</h1>
          <p className="text-[16px] text-[#666] leading-relaxed max-w-3xl">
            Get Reviews Buzz is committed to protecting the privacy of individuals visiting the Company&apos;s Website as well as persons and businesses purchasing and using our products and services.
          </p>
          <p className="text-[13px] text-[#999] mt-4">Last updated: June 2025</p>
        </Wrapper>
      </div>

      <div className="py-14">
        <Wrapper>
          <div className="space-y-12">

            <div>
              <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-4">Privacy Policy in a Nutshell</h2>
              <p className="text-[15px] text-[#555] leading-relaxed mb-3">
                Get Reviews Buzz&apos;s privacy policy defines the use of the company&apos;s website and associated applications and services. This policy also outlines how Get Reviews Buzz gathers, uses and protects your information, including your personally identifiable data. The policy also states how your business information can be viewed by others, changed or removed.
              </p>
              <p className="text-[15px] text-[#555] leading-relaxed mb-3">
                Whatever updates we make to our website, the same will be found in our privacy policy. We will keep you informed of the important updates being a user of our service. We will email you the same or provide notification via the app.
              </p>
              <p className="text-[15px] text-[#555] leading-relaxed">
                You are requested to read this policy document prior to using our services as we want our relationship to be fully clear. You can send us an email at <a href="mailto:marketing@getreviews.buzz" className="text-[#FFCE2E] underline font-semibold">marketing@getreviews.buzz</a> if you have questions.
              </p>
            </div>

            <div>
              <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-5">Information We Collect</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-3">Cookies</h3>
                  <p className="text-[15px] text-[#555] leading-relaxed mb-4">
                    We may use cookies, tags, HTML5 local shared objects or flash cookies and advertising identifiers from third parties in reference to your use of the Service, third-party websites, and mobile applications. The cookies can reside on your personal computer local storage, mobile devices and emails which are exchanged between you and our company. Cookies may transmit information about you and your use of the Service, like your browser type, search preferences, IP address, and the date and time of your use. Cookies could also be persistent or stored only during a private session.
                  </p>
                  <p className="text-[15px] font-semibold text-[#1a1a1a] mb-3">The purposes that we use Cookies within the Service include:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "Processes", desc: "Intended to make the Service work the way you expect. For example, we use a Cookie that tells us whether you've already signed up for an account." },
                      { title: "Authentication, Security, and Compliance", desc: "Intended to prevent fraud, protect your data from unauthorized parties, and comply with legal requirements. For example, we use cookies to determine if you're logged in." },
                      { title: "Preferences", desc: "Intended to remember information about how you prefer the Service to behave and appear, including your phone's geolocation settings." },
                      { title: "Notifications", desc: "Intended to permit or prevent notices of data or options that we think could improve your use of the Service." },
                      { title: "Analytics", desc: "Intended to help us understand how visitors use the Service. With the help of cookies, we can easily tally search suggestions based on your interactions." },
                    ].map(c => (
                      <div key={c.title} className="pl-5 border-l-[3px] border-[#FFCE2E]">
                        <p className="text-[14px] font-bold text-[#1a1a1a] mb-1">{c.title}</p>
                        <p className="text-[13px] text-[#555] leading-relaxed">{c.desc}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[14px] text-[#555] mt-4 italic">
                    Managing Cookies: It will be possible to disable some (but not all) Cookies through your device or browser settings, but doing so may affect the functionality of the Service.
                  </p>
                </div>

                <div>
                  <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-4">Third Parties</h3>
                  <p className="text-[15px] text-[#555] leading-relaxed mb-4">Third parties are able to receive your information based on the following:</p>
                  <div className="space-y-5">
                    {[
                      { title: "Service Providers", desc: "We may believe third-party providers to support or provide some of the services available through the Service. We may share information from or about you with these third-party providers so that they will perform their services or complete your requests. These third-party providers may share information with us that they obtain from or about you in reference to providing their services or completing your requests." },
                      { title: "Aggregate Information", desc: "We may share user information in the aggregate with third parties." },
                      { title: "Business Transfers", desc: "We may share information from or about you with our parent companies, subsidiaries, joint ventures, or other companies under common control, in which case we'll require them to honor this Privacy Policy." },
                      { title: "Businesses on Get Reviews", desc: "Information like age, gender along with the devices you have used for our services, etc. is fetched from your activities and shared on Get Reviews Buzz." },
                      { title: "Investigations", desc: "We may investigate and disclose information from or about you if we have a good faith belief that such investigation or disclosure is reasonably necessary to comply with legal process, prevent possible wrongdoing, or protect our rights, reputation, property, or that of our users, affiliates, or the general public." },
                      { title: "Links", desc: "Third-party service links can get linked to the service. We do not share your personal information with them and aren't liable for their privacy practices. We suggest you read the privacy policies on all such third-party services." },
                      { title: "Facebook and Twitter", desc: "If you sign up for Get Reviews Buzz using your Facebook account or link your account to a third-party service like Facebook or Twitter, we will be able to get your information from these third parties to help you create your account and connect with friends and followers." },
                    ].map(t => (
                      <div key={t.title} className="pl-5 border-l-[3px] border-[#FFCE2E]">
                        <p className="text-[14px] font-bold text-[#1a1a1a] mb-1">{t.title}</p>
                        <p className="text-[13px] text-[#555] leading-relaxed">{t.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-4">Data Retention and Account Termination</h2>
              <p className="text-[15px] text-[#555] leading-relaxed">
                You can close your account at any time. By doing so, we will remove all the public posts which can be viewed and also remove them from your account. We will just keep the necessary information about you that is needed for authorization purposes under this Privacy Policy unless prohibited by law. This information can be helpful in stopping or investigating activity that is wrong with reference to the service or legal obligations.
              </p>
            </div>

            <div>
              <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-4">Children</h2>
              <p className="text-[15px] text-[#555] leading-relaxed">
                The Service is meant for general audiences and is not directed to children under the age of 13. If you become aware that a child has provided us with personal information without parental consent, please contact us. If we come to know that a child under the age of 13 has provided us with any kind of personal information without the consent of a parent or guardian, we will instantly take steps to terminate the child&apos;s account.
              </p>
            </div>

            <div>
              <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-4">Security</h2>
              <p className="text-[15px] text-[#555] leading-relaxed">
                We follow industry standards that are generally accepted to safeguard the private information submitted to us. However, we do not guarantee as there is no method of transmission of data that is 100% secure. So we make use of commercially acceptable means to safeguard your personal information.
              </p>
            </div>

            <div>
              <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-4">Privacy Policy Changes</h2>
              <p className="text-[15px] text-[#555] leading-relaxed">
                Although most changes are likely to be minor, Get Reviews Buzz may change its Privacy Policy from time to time, and at the sole discretion of the company. Get Reviews Buzz encourages visitors to frequently check this page for any changes done to the Privacy Policy. We will accept that you have kept yourself updated with your continued usage of the website.
              </p>
            </div>

            <div className="bg-[#fffcf0] border border-[#ffeaa7] rounded-xl p-6">
              <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-3">Contacting Us</h3>
              <p className="text-[14px] text-[#555] mb-3">If you have any questions on this privacy policy, please contact us:</p>
              <p className="text-[14px] text-[#555]">Attn: Privacy — Get Reviews Buzz</p>
              <p className="text-[14px] text-[#555] mt-1">Email: <a href="mailto:marketing@getreviews.buzz" className="text-[#FFCE2E] font-semibold underline">marketing@getreviews.buzz</a></p>
              <p className="text-[14px] text-[#555] mt-1">Telegram: @Getreviews</p>
            </div>
          </div>
        </Wrapper>
      </div>
    </div>
  );
}
