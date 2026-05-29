"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Wrapper from "@/components/ui/Wrapper";

import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaGoogle,
  FaWhatsapp,
  FaPhoneAlt,
} from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

export default function HomeFooter() {
  return (
    <footer className="bg-black text-white">
      <Wrapper>
        <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-6">
          
          {/* TOP SECTION: Logo & Contact Info */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 pb-10">
            {/* Left: Logo & Description */}
            <div className="max-w-[320px]">
              <img
                src="/uploads/media/1778825516692-e449b40f-8cea-4a36-bfc7-28122f585ab2-logo-black-bg.png"
                alt="logo"
                className="w-[180px] mb-4"
              />
              <p className="text-[#9ca3af] text-[13px] leading-[22px]">
                We are a team of Internet Marketing and Online
                Reputation Management.
              </p>
            </div>

            {/* Right: Contact Info Blocks */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 lg:gap-12">
              
              {/* Contact Us */}
              <div className="flex items-center gap-4">
                <div className="w-[48px] h-[48px] rounded-full border border-white flex items-center justify-center text-white">
                  <FaPhoneAlt size={18} />
                </div>
                <div>
                  <p className="text-[#f5c518] text-[14px] mb-0.5">Contact Us</p>
                  <a href="tel:+14302335402" className="text-[#bdbdbd] text-[14px] hover:text-[#f5c518] transition">
                    +1 430-233-5402
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-4">
                <div className="w-[48px] h-[48px] rounded-full border border-white flex items-center justify-center text-white">
                  <FaWhatsapp size={22} />
                </div>
                <div>
                  <p className="text-[#f5c518] text-[14px] mb-0.5">WhatsApp</p>
                  <a href="https://api.whatsapp.com/send?phone=13068025402" target="_blank" rel="noopener noreferrer" className="text-[#bdbdbd] text-[14px] hover:text-[#f5c518] transition">
                    +1 306 802 5402
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-[48px] h-[48px] rounded-full border border-white flex items-center justify-center text-white">
                  <FaRegEnvelope size={20} />
                </div>
                <div>
                  <p className="text-[#f5c518] text-[14px] mb-0.5">Email</p>
                  <a href="mailto:marketing@getreviews.buzz" className="text-[#bdbdbd] text-[14px] hover:text-[#f5c518] transition">
                    marketing@getreviews.buzz
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* TOP DASHED DIVIDER */}
          <hr className="border-t border-dashed border-[#333] w-full" />

          {/* MIDDLE SECTION: Links & Newsletter */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-12 py-12">
            
            {/* COLUMN 1: Company */}
            <div>
              <h3 className="text-white font-semibold text-[16px] mb-6">Company</h3>
              <ul className="space-y-3.5 text-[#bdbdbd] text-[13px]">
                {[
                  { label: "Buy Reviews", href: "/buy-reviews" },
                  { label: "How it Works", href: "/how-it-works" },
                  { label: "About", href: "/about" },
                  { label: "Blog", href: "/blog" },
                  { label: "Tools", href: "/tools" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="hover:text-[#f5c518] transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 2: Our Products */}
            <div>
              <h3 className="text-white font-semibold text-[16px] mb-6">Our Products</h3>
              <ul className="space-y-3.5 text-[#bdbdbd] text-[13px]">
                {[
                  { label: "Google-reviews", href: "/buy-google-reviews" },
                  { label: "Google Local Guide", href: "/buy-google-local-guide" },
                  { label: "TrustPilot", href: "/buy-trustpilot-reviews" },
                  { label: "Glassdoor Reviews", href: "/buy-glassdoor-reviews" },
                  { label: "Facebook Reviews", href: "/buy-facebook-reviews" },
                  { label: "Thumbtack Reviews", href: "/buy-thumbtack-reviews" },
                  { label: "BBB Reviews", href: "/buy-bbb-reviews" },
                  { label: "Indeed Reviews", href: "/buy-indeed-reviews" },
                  { label: "View More", href: "/products" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="hover:text-[#f5c518] transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 3: Industries */}
            <div>
              <h3 className="text-white font-semibold text-[16px] mb-6">Industries</h3>
              <ul className="space-y-3.5 text-[#bdbdbd] text-[13px]">
                {[
                  { label: "Restaurants & Cafes", href: "/industries/restaurants" },
                  { label: "Healthcare Clinics", href: "/industries/healthcare" },
                  { label: "Real Estate", href: "/industries/real-estate" },
                  { label: "E-commerce Businesses", href: "/industries/ecommerce" },
                  { label: "Hotels & Hospitality", href: "/industries/hotels" },
                  { label: "Local Service Providers", href: "/industries/local-services" },
                  { label: "Education & Coaching", href: "/industries/education" },
                  { label: "Beauty & Wellness", href: "/industries/beauty" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="hover:text-[#f5c518] transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 4: Resources */}
            <div>
              <h3 className="text-white font-semibold text-[16px] mb-6">Resources</h3>
              <ul className="space-y-3.5 text-[#bdbdbd] text-[13px]">
                {[
                  { label: "Help Center", href: "/help-center" },
                  { label: "Privacy Policy", href: "/privacy-policy" },
                  { label: "Terms & Conditions", href: "/terms-and-conditions" },
                  { label: "Refund Policy", href: "/refund-policy" },
                  { label: "FAQ's", href: "/faqs" },
                  { label: "Login / Signup", href: "/login" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="hover:text-[#f5c518] transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 5: Newsletter & Socials (Takes up 2 columns on large screens) */}
            <div className="col-span-2 lg:col-span-2 lg:pl-6">
              <h3 className="text-white font-medium text-[18px] leading-[1.4] mb-8">
                Subscribe to our weekly<br />
                newsletter to receive the latest<br />
                updates.
              </h3>
              
              <form className="flex items-center border-b border-[#555] pb-3 mb-8">
                <input
                  type="email"
                  placeholder="Enter Your Email..."
                  className="bg-transparent w-full text-white placeholder:text-[#888] outline-none text-[13px]"
                />
                <button
                  type="submit"
                  className="w-[32px] h-[32px] bg-[#f5c518] text-black rounded flex items-center justify-center hover:opacity-90 transition"
                >
                  →
                </button>
              </form>

              {/* SOCIAL ICONS */}
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/getreviews.buzz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[36px] h-[36px] rounded-full border border-white text-white flex items-center justify-center hover:border-[#f5c518] hover:text-[#f5c518] transition"
                >
                  <FaInstagram size={16} />
                </a>
                <a
                  href="https://x.com/GetReviewsBuzz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[36px] h-[36px] rounded-full border border-white text-white flex items-center justify-center hover:border-[#f5c518] hover:text-[#f5c518] transition"
                >
                  <FaXTwitter size={16} />
                </a>
                <a
                  href="https://www.facebook.com/getreviews.buzz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[36px] h-[36px] rounded-full border border-white text-white flex items-center justify-center hover:border-[#f5c518] hover:text-[#f5c518] transition"
                >
                  <FaFacebookF size={16} />
                </a>
                <a
                  href="https://www.linkedin.com/company/getreviewsbuzz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[36px] h-[36px] rounded-full border border-white text-white flex items-center justify-center hover:border-[#f5c518] hover:text-[#f5c518] transition"
                >
                  <FaLinkedinIn size={16} />
                </a>
              </div>
            </div>

          </div>

          {/* BOTTOM DASHED DIVIDER */}
          <hr className="border-t border-dashed border-[#333] w-full" />

          {/* BOTTOM BAR */}
          <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[#8d8d8d] text-[12px]">
              Copyright © 2026 Get Reviews Buzz All rights reserved.
            </p>

            <img
              src="/uploads/media/1778825621435-4d459837-eaab-485a-b769-45734fa0b63f-payments.png"
              alt="payments"
              className="h-[24px] object-contain"
            />
          </div>

        </div>
      </Wrapper>
    </footer>
  );
}