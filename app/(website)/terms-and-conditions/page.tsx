'use client';
import Wrapper from "@/components/ui/Wrapper";

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      {/* Hero */}
      <div className="bg-[#f7f7f7] py-16 border-b border-[#ebebeb]">
        <Wrapper>
          <p className="text-[13px] font-semibold text-[#FFCE2E] uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-[36px] md:text-[44px] font-bold text-[#1a1a1a] leading-tight mb-4">Terms &amp; Conditions</h1>
          <p className="text-[16px] text-[#666] leading-relaxed max-w-3xl">
            Welcome to GetReviews.buzz! By accessing or utilizing this website, you signify your agreement to comply with the following Terms and Conditions.
          </p>
          <p className="text-[13px] text-[#999] mt-4">Last updated: June 2025</p>
        </Wrapper>
      </div>

      <div className="py-14">
        <Wrapper>
          <div className="space-y-12">

            <p className="text-[15px] text-[#555] leading-relaxed">
              By accessing or utilizing the website located at <a href="https://getreviews.buzz" className="text-[#FFCE2E] underline font-semibold">https://getreviews.buzz</a>, its associated mobile website, and/or the web-based application (collectively, the &quot;Website&quot;), you signify your agreement to comply with the following Terms and Conditions (this &quot;Agreement&quot;). A thorough review of this Agreement is required prior to your use of the Services provided by GetReviews.buzz (&quot;Services&quot;). GetReviews.buzz reserves the right to modify this Agreement at any time. Such modifications shall become effective immediately upon posting on the relevant website.
            </p>

            <div>
              <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-4">Our Services</h2>
              <p className="text-[15px] text-[#555] leading-relaxed">
                Get Reviews Buzz provides a comprehensive range of digital marketing services, including online reputation management services.
              </p>
            </div>

            <div>
              <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-4">Enrollment For Free And Paid Services</h2>
              <p className="text-[15px] text-[#555] leading-relaxed">
                By signing up to use our free services or creating user accounts to purchase our paid services, you agree to the specific terms and conditions associated with each service you choose.
              </p>
            </div>

            <div>
              <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-5">Review Posting Policy</h2>
              <div className="space-y-5">
                <div className="pl-5 border-l-[3px] border-[#FFCE2E]">
                  <p className="text-[16px] font-bold text-[#1a1a1a] mb-2">Rating of Reviews</p>
                  <p className="text-[14px] text-[#555] leading-relaxed">You acknowledge that we provide a natural mix of reviews and ratings, specifically about 70% 5-star and 30% 4-star.</p>
                </div>
                <div className="pl-5 border-l-[3px] border-[#FFCE2E]">
                  <p className="text-[16px] font-bold text-[#1a1a1a] mb-2">Pace of Posting</p>
                  <p className="text-[14px] text-[#555] leading-relaxed">Based on our experience, reviews should follow a discreet posting pattern to avoid triggering platform filters.</p>
                </div>
                <div className="pl-5 border-l-[3px] border-[#FFCE2E]">
                  <p className="text-[16px] font-bold text-[#1a1a1a] mb-2">Limited Reviews Refill Warranty</p>
                  <p className="text-[14px] text-[#555] leading-relaxed">As a third-party review supplier, we acknowledge that we have no control over the actions of any review aggregator regarding the content published on your business profile. All services marked with a 30-day warranty on our site are covered under this policy.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-5">Disclaimer</h2>
              <p className="text-[15px] text-[#555] leading-relaxed mb-5">
                The Company maintains a policy of providing timely updates to Clients regarding the status of reviews.
              </p>
              <div className="pl-5 border-l-[3px] border-[#FFCE2E]">
                <p className="text-[16px] font-bold text-[#1a1a1a] mb-2">Review Visibility</p>
                <ul className="space-y-2">
                  <li className="text-[14px] text-[#555] flex items-start gap-2"><span className="text-[#FFCE2E] font-bold mt-0.5">•</span>The visibility of reviews is subject to change in accordance with periodic updates to the Review Aggregator&apos;s algorithms.</li>
                  <li className="text-[14px] text-[#555] flex items-start gap-2"><span className="text-[#FFCE2E] font-bold mt-0.5">•</span>The publication of reviews on newly created Business Profiles shall be subject to potential delays.</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-4">Refund Policy</h2>
              <p className="text-[15px] text-[#555] leading-relaxed">
                If we are unable to initiate your order due to unforeseen circumstances on our end, you will receive a full refund for the purchase amount.
              </p>
            </div>

            <div className="bg-[#fffcf0] border border-[#ffeaa7] rounded-xl p-6">
              <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-3">How To Contact Us</h3>
              <p className="text-[14px] text-[#555]">Email: <a href="mailto:marketing@getreviews.buzz" className="text-[#FFCE2E] font-semibold underline">marketing@getreviews.buzz</a></p>
              <p className="text-[14px] text-[#555] mt-1">Telegram: @Getreviews</p>
              <p className="text-[14px] text-[#555] mt-1">WhatsApp: <a href="https://wa.me/13068025402" className="text-[#FFCE2E] font-semibold underline">+1 (306) 802-5402</a></p>
            </div>
          </div>
        </Wrapper>
      </div>
    </div>
  );
}
