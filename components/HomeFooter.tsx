"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Wrapper from "@/components/Wrapper"; // Assuming this is your standard wrapper, if not replace with a standard div

export default function HomeFooter() {
  return (
    <footer className="relative text-[#a0a4b0] font-sans bg-[#2c303a]"
      style={{ backgroundImage: `url('https://getreviews.buzz/storage/app/blog/0555537001734005932_Footer-Image.webp')`,
               backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} >
      <Wrapper>
        <div className="mx-auto w-full px-5 py-16">
          <div className="flex flex-wrap lg:flex-nowrap justify-between gap-10">
            {/* Column 1: Logo & Info */}
            <div className="w-full lg:w-[20%] pr-[25px]">
              <div className="mb-6">
                <img
                  src="https://getreviews.buzz/storage/app/blog/QyrcYCNZhxKJsN5lOpoiVonzJ21Uk1N1iXAkCkQk.png"
                  alt="GetReviews.Buzz"
                  className="w-[200px] h-auto object-contain"
                />
              </div>
              <p className="text-sm text-[#b3b3b2] leading-relaxed mb-8">
                We are a team of Internet Marketing and Online Reputation Management experts
                who can uplift your local business and help you climb the ladder of business
                success.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#b3b3b2] hover:text-[#fc0] transition-colors cursor-pointer">
                  <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-sm">marketing@getreviews.buzz</span>
                </div>

                <div className="flex items-center gap-3 text-[#b3b3b2] hover:text-[#fc0] transition-colors cursor-pointer">
                  <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span className="text-sm">+1 430-233-5402</span>
                </div>

                <div className="flex items-center gap-3 text-[#b3b3b2] hover:text-[#fc0] transition-colors cursor-pointer">
                <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.52 3.48A11.8 11.8 0 0012.05 0C5.5 0 .17 5.33.17 11.89c0 2.1.55 4.14 1.6 5.94L0 24l6.35-1.66a11.9 11.9 0 005.7 1.45h.01c6.55 0 11.88-5.33 11.89-11.89a11.8 11.8 0 00-3.43-8.42zM12.06 21.6h-.01a9.9 9.9 0 01-5.05-1.38l-.36-.21-3.77.98 1-3.68-.24-.38a9.88 9.88 0 01-1.51-5.27C2.12 6.5 6.5 2.12 12.06 2.12c2.64 0 5.13 1.03 7 2.9a9.8 9.8 0 012.9 7c0 5.56-4.38 9.94-9.9 9.94zm5.47-7.39c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35z"/>
              </svg>
                  <span className="text-sm">@WhatsApp</span>
                </div>
              </div>
            </div>

            {/* Column 2: Company */}
            <div className="w-full sm:w-[25%] lg:w-[12%]">
              <h3 className="text-white text-lg font-bold mb-5">Company</h3>
              <ul className="space-y-3 text-sm">
                {["Home", "About Us", "Blog"].map((link) => (
                  <li key={link}>
                    <Link href="#" className="hover:text-[#fc0] transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Services */}
            <div className="w-full sm:w-[25%] lg:w-[16%]">
              <h3 className="text-[white] text-lg font-bold mb-5">Services</h3>
              <ul className="space-y-3 text-sm text-[#b3b3b2]">
                {[
                  "Buy Google Reviews",
                  "Buy Facebook Reviews",
                  "Buy Glassdoor Reviews",
                  "Buy Google GPS Reviews",
                  "Buy TrustPilot Reviews"
                ].map((link) => (
                  <li key={link}>
                    <Link href="#" className="hover:text-[#fc0] transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Customer Care */}
            <div className="w-full sm:w-[25%] lg:w-[16%]">
              <h3 className="text-white text-lg font-bold mb-5">Customer Care</h3>
              <ul className="space-y-3 text-sm text-[#b3b3b2]">
                {[
                  "Help",
                  "Login / Signup",
                  "Contact",
                  "Privacy Policy",
                  "Terms & Conditions"
                ].map((link) => (
                  <li key={link}>
                    <Link href="#" className="hover:text-[#fc0] transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: Newsletter */}
            <div className="w-full lg:w-[28%]">
              <h3 className="text-white text-lg font-bold mb-3">Newsletter</h3>
              <p className="text-sm mb-5 leading-relaxed text-[#b3b3b2]">
                Subscribe to our weekly newsletter and receive updates via email.
              </p>
              
              <form className="flex w-full mb-4">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className=" w-full px-4 py-3 bg-white text-gray-900 text-sm focus:outline-none rounded-[5px] placeholder:text-gray-500"
                  required
                />
               <button
                  type="submit"
                  className="px-6 py-3 ml-2 bg-gradient-to-r from-yellow-400 to-yellow-200 text-black text-sm font-semibold transition-colors whitespace-nowrap rounded-[5px]"
                >
                  Subscribe
                </button>
              </form>

              {/* Cloudflare Mock Widget */}
              
              {/* Payment Icons (Text Mocks based on screenshot) */}
              <div className="flex gap-3 items-center mb-6">
                <img src="https://getreviews.buzz/storage/app/blog/PChHQtiucEdaqTAPJyXwHt71ceVP1qzyS5uu5jK9.png" alt="Payment Methods" className="h-8 object-contain" />
              </div>

               {/* Social Icons */}
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/getreviews.buzz"
                  className="w-[38px] h-[38px] rounded-full border border-[#7a7d85] flex items-center justify-center text-[#b3b3b2] hover:text-[#fc0] hover:border-[#fc0] transition-all duration-200"
                >
                  <svg className="w-[20px] h-[20px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/getreviews.buzz/"
                  className="w-[38px] h-[38px] rounded-full border border-[#7a7d85] flex items-center justify-center text-[#b3b3b2] hover:text-[#fc0] hover:border-[#fc0] transition-all duration-200"
                >
                  <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>

                {/* X / Twitter */}
                <a
                  href="https://x.com/GetReviewsBuzz"
                  className="w-[38px] h-[38px] rounded-full border border-[#7a7d85] flex items-center justify-center text-[#b3b3b2] hover:text-[#fc0] hover:border-[#fc0] transition-all duration-200"
                >
                  <svg className="w-[20px] h-[20px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/getreviewsbuzz/"
                  className="w-[38px] h-[38px] rounded-full border border-[#7a7d85] flex items-center justify-center text-[#b3b3b2] hover:text-[#fc0] hover:border-[#fc0] transition-all duration-200"
                >
                  <svg className="w-[20px] h-[20px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>

      {/* Bottom Bar */}
      <div className="bg-[#242730] border-t border-[#3a3e49]">
        <Wrapper>
          <div className="mx-auto w-full px-5 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-gray-400">
            <p>Copyright © 2026 Get Reviews Buzz All rights reserved.</p>
            <div className="flex items-center gap-1">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span>|</span>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <span>|</span>
              <Link href="#" className="hover:text-white transition-colors">Site Map</Link>
            </div>
          </div>
        </Wrapper>
      </div>
    </footer>
  );
}