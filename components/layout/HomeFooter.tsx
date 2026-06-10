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
import { FaRegEnvelope, FaXTwitter } from "react-icons/fa6";

export default function HomeFooter() {
  return (
    <footer className="bg-black text-white font-sans">
      <Wrapper>
        <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-6">

          {/* TOP SECTION: Logo, Socials & Contact Info */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 pb-10">
            {/* Left: Logo, Description & Social Icons */}
            <div className="max-w-[320px]">
              <img
                src="/uploads/media/1778825516692-e449b40f-8cea-4a36-bfc7-28122f585ab2-logo-black-bg.png"
                alt="logo"
                className="w-[180px] mb-4"
              />
              <p className="text-[#ffffff] text-[15px] font-[300] leading-[22px] mb-5">
                We are a team of Internet Marketing and Online
                Reputation Management.
              </p>

              {/* Social Icons positioned exactly under description */}
              <div className="flex items-center gap-3">
                {[
                  { icon: <FaInstagram size={16} />, href: "https://www.instagram.com/getreviews.buzz/" },
                  { icon: <FaXTwitter size={15} />, href: "https://x.com/GetReviewsBuzz" },
                  { icon: <FaFacebookF size={15} />, href: "https://www.facebook.com/getreviews.buzz" },
                  { icon: <FaLinkedinIn size={15} />, href: "https://www.linkedin.com/company/getreviewsbuzz/" },
                  // { icon: <FaGoogle size={14} />, href: "#" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[41px] h-[41px] rounded-full border border-[#ffffff] text-[#ffffff] flex items-center justify-center hover:border-[#f5c518] hover:text-[#f5c518] transition"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Contact Info Blocks */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 lg:gap-12 xl:pl-10">

              {/* Contact Us */}
              <div className="flex items-center gap-4">
                <div className="w-[48px] h-[48px] rounded-full border border-gray-700 flex items-center justify-center text-white">
                  <FaPhoneAlt size={16} />
                </div>
                <div>
                  <p className="text-[#f5c518] text-[13px] font-medium mb-0.5">Contact Us</p>
                  <a href="tel:+14302335402" className="text-white text-[14px] hover:text-[#f5c518] transition font-light">
                    +1 430-233-5402
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-4">
                <div className="w-[48px] h-[48px] rounded-full border border-gray-700 flex items-center justify-center text-white">
                  <FaWhatsapp size={20} />
                </div>
                <div>
                  <p className="text-[#f5c518] text-[13px] font-medium mb-0.5">WhatsApp</p>
                  <a href="https://api.whatsapp.com/send?phone=13068025402" target="_blank" rel="noopener noreferrer" className="text-white text-[14px] hover:text-[#f5c518] transition font-light">
                    +1 306 802 5402
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-[48px] h-[48px] rounded-full border border-gray-700 flex items-center justify-center text-white">
                  <FaRegEnvelope size={18} />
                </div>
                <div>
                  <p className="text-[#f5c518] text-[13px] font-medium mb-0.5">Email</p>
                  <a href="mailto:marketing@getreviews.buzz" className="text-white text-[14px] hover:text-[#f5c518] transition font-light">
                    marketing@getreviews.buzz
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* TOP DASHED DIVIDER */}
          <div
            className="w-full h-[1px]"
            style={{
              backgroundImage: 'linear-gradient(to right, #ffffff 50%, transparent 50%)',
              backgroundSize: '10px 100%',
            }}
          />

          {/* MIDDLE SECTION: 6-Column Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-10 py-14">

            {/* COLUMN 1: Company */}
            <div>
              <h3 className="text-white font-[500] text-[22px] mb-6">Company</h3>
              <ul className="space-y-3.5 text-[#bdbdbd] text-[16px] font-light">
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
              <h3 className="text-white font-[500] text-[22px] mb-6">Our Products</h3>
              <ul className="space-y-3.5 text-[#bdbdbd] text-[16px] font-light">
                {[
                  { label: "Google-reviews", href: "/products/buy-google-reviews" },
                  { label: "Google Local Guide", href: "/products/buy-google-local-guide" },
                  { label: "TrustPilot", href: "/products/buy-trustpilot-reviews" },
                  { label: "Glassdoor Reviews", href: "/products/buy-glassdoor-reviews" },
                  { label: "Facebook Reviews", href: "/products/buy-facebook-reviews" },
                  { label: "Thumbtack Reviews", href: "/products/buy-thumbtack-reviews" },
                  { label: "BBB Reviews", href: "/products/buy-bbb-reviews" },
                  { label: "Indeed Reviews", href: "/products/buy-indeed-reviews" },
                  { label: "View More", href: "/" },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.href} className="hover:text-[#f5c518] transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 3: Products Continued (No Header) */}
            <div>
              <ul className="space-y-3.5 text-[#bdbdbd] text-[16px] font-light lg:pt-0 pt-0">
                {[
                  { label: "Google-reviews", href: "/products/buy-google-reviews" },
                  { label: "Google Local Guide", href: "/products/buy-google-local-guide" },
                  { label: "TrustPilot", href: "/products/buy-trustpilot-reviews" },
                  { label: "Glassdoor Reviews", href: "/products/buy-glassdoor-reviews" },
                  { label: "Facebook Reviews", href: "/products/buy-facebook-reviews" },
                  { label: "Thumbtack Reviews", href: "/products/buy-thumbtack-reviews" },
                  { label: "BBB Reviews", href: "/products/buy-bbb-reviews" },
                  { label: "Indeed Reviews", href: "/products/buy-indeed-reviews" },
                  { label: "View More", href: "/" },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.href} className="hover:text-[#f5c518] transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 4: Products Continued 2 (No Header) */}
            <div>
              <ul className="space-y-3.5 text-[#bdbdbd] text-[16px] font-light lg:pt-0 pt-0">
                {[
                  { label: "Google-reviews", href: "/products/buy-google-reviews" },
                  { label: "Google Local Guide", href: "/products/buy-google-local-guide" },
                  { label: "TrustPilot", href: "/products/buy-trustpilot-reviews" },
                  { label: "Glassdoor Reviews", href: "/products/buy-glassdoor-reviews" },
                  { label: "Facebook Reviews", href: "/products/buy-facebook-reviews" },
                  { label: "Thumbtack Reviews", href: "/products/buy-thumbtack-reviews" },
                  { label: "BBB Reviews", href: "/products/buy-bbb-reviews" },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.href} className="hover:text-[#f5c518] transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 5: Industries */}
            <div>
              <h3 className="text-white font-semibold text-[22px] mb-6">Industries</h3> {/* Kept 'Industries' header styling */}
              {/* <span className="text-white font-semibold text-[16px] block mb-6 -mt-[44px]">Industries</span> */}
              <ul className="space-y-3.5 text-[#bdbdbd] text-[16px] font-light">
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

            {/* COLUMN 6: Resources */}
            <div>
              <h3 className="text-white font-semibold text-[22px] mb-6">Resources</h3>
              <ul className="space-y-3.5 text-[#bdbdbd] text-[16px] font-light">
                {[
                  { label: "Help Center", href: "/dashboard/support" },
                  { label: "Privacy Policy", href: "/privacy-policy" },
                  { label: "Terms & Conditions", href: "/terms-and-conditions" },
                  { label: "Refund Policy", href: "/refund-policy" },
                  { label: "FAQ's", href: "/faq" },
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

          </div>

          {/* BOTTOM DASHED DIVIDER */}
          <div
            className="w-full h-[1px]"
            style={{
              backgroundImage: 'linear-gradient(to right, #ffffff 50%, transparent 50%)',
              backgroundSize: '10px 100%',
            }}
          />
          {/* BOTTOM BAR */}
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-[#ffffff] text-[17px] font-[200]">
              Copyright © 2026 Get Reviews Buzz All rights reserved.
            </p>

            <img
              src="/uploads/media/1778825621435-4d459837-eaab-485a-b769-45734fa0b63f-payments.png"
              alt="payments"
              className="h-[38px] object-contain opacity-90"
            />
          </div>

        </div>
      </Wrapper>
    </footer>
  );
}