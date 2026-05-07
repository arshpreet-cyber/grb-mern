"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Wrapper from "@/components/ui/Wrapper";

import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaGoogle,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

export default function HomeFooter() {
  return (
    <footer className="bg-black text-white">
      <Wrapper>
        <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-4">

          {/* TOP NEWSLETTER */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 pb-16 border-b border-[#232323]">

            {/* Left */}
            <div className="max-w-[580px]">
              <h2 className="text-[42px] leading-[1.15] font-light tracking-[-1px]">
                Subscribe To Our Weekly
                <br />
                Newsletter To Receive The
                <br />
                Latest Updates.
              </h2>
            </div>

            {/* Right */}
            <div className="w-full lg:max-w-[520px]">
              <form className="flex items-center border-b border-[#555] pb-3">
                <input
                  type="email"
                  placeholder="Enter Your Email..."
                  className="bg-transparent w-full text-white placeholder:text-[#888] outline-none text-[15px]"
                />

                <button
                  type="submit"
                  className="w-[42px] h-[42px] bg-[#f5c518] text-black rounded-[8px] flex items-center justify-center hover:opacity-90 transition"
                >
                  →
                </button>
              </form>
            </div>
          </div>

          {/* MAIN FOOTER */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 py-16">

            {/* COLUMN 1 */}
            <div>
              <img
                src="https://getreviews.buzz/storage/app/blog/QyrcYCNZhxKJsN5lOpoiVonzJ21Uk1N1iXAkCkQk.png"
                alt="logo"
                className="w-[180px] mb-6"
              />

              <p className="text-[#9ca3af] text-[14px] leading-[26px] mb-8">
                We are a team of Internet Marketing and Online Reputation
                Management experts who can uplift your local business and help
                you climb the ladder of business success.
              </p>

              {/* SOCIAL ICONS */}
              <div className="flex items-center gap-3">

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/getreviews.buzz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[38px] h-[38px] rounded-full bg-white text-black flex items-center justify-center hover:bg-[#f5c518] transition"
                >
                  <FaInstagram size={18} />
                </a>

                {/* X / Twitter */}
                <a
                  href="https://x.com/GetReviewsBuzz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[38px] h-[38px] rounded-full bg-white text-black flex items-center justify-center hover:bg-[#f5c518] transition"
                >
                  <FaXTwitter size={18} />
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/getreviews.buzz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[38px] h-[38px] rounded-full bg-white text-black flex items-center justify-center hover:bg-[#f5c518] transition"
                >
                  <FaFacebookF size={18} />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/getreviewsbuzz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[38px] h-[38px] rounded-full bg-white text-black flex items-center justify-center hover:bg-[#f5c518] transition"
                >
                  <FaLinkedinIn size={18} />
                </a>

                {/* Google */}
                {/* <a
                  href="#"
                  className="w-[38px] h-[38px] rounded-full bg-white text-black flex items-center justify-center hover:bg-[#f5c518] transition"
                >
                  <FaGoogle size={18} />
                </a> */}

              </div>
            </div>

            {/* COLUMN 2 */}
            <div>
              <h3 className="text-white font-semibold text-[18px] mb-6">
                Our Products
              </h3>

              <ul className="space-y-4 text-[#bdbdbd] text-[14px]">
                {[
                  "Google-reviews",
                  "Google Local Guide",
                  "TrustPilot",
                  "Glassdoor Reviews",
                  "Facebook Reviews",
                  "Thumbtack Reviews",
                  "BBB Reviews",
                  "Indeed Reviews",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="hover:text-[#f5c518] transition"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 3 */}
            <div>
              <h3 className="text-white font-semibold text-[18px] mb-6">
                Customer Care
              </h3>

              <ul className="space-y-4 text-[#bdbdbd] text-[14px]">
                {[
                  "Help",
                  "Login / signup",
                  "Contact",
                  "Privacy Policy",
                  "Terms & Conditions",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="hover:text-[#f5c518] transition"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 4 */}
            <div>
              <h3 className="text-white font-semibold text-[18px] mb-6">
                Contact Us
              </h3>

              <div className="space-y-6 text-[14px]">

                <div>
                  <p className="text-[#f5c518] mb-1">Email</p>
                  <a
                    href="mailto:marketing@getreviews.buzz"
                    className="text-[#bdbdbd] hover:text-[#f5c518]"
                  >
                    marketing@getreviews.buzz
                  </a>
                </div>

                <div>
                  <p className="text-[#f5c518] mb-1">Phone</p>
                  <a
                    href="tel:+14302335402"
                    className="text-[#bdbdbd] hover:text-[#f5c518]"
                  >
                    +1 430-233-5402
                  </a>
                </div>

                <div>
                  <p className="text-[#f5c518] mb-1">WhatsApp</p>
                  <a
                    href="https://api.whatsapp.com/send?phone=13068025402"
                    className="text-[#bdbdbd] hover:text-[#f5c518]"
                  >
                    +1 306 802 5402
                  </a>
                </div>

              </div>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="border-t border-[#232323] pt-4 flex flex-col md:flex-row justify-between items-center gap-6">

            <p className="text-[#8d8d8d] text-[13px]">
              Copyright © 2026 Get Reviews Buzz All rights reserved.
            </p>

            <img
              src="https://getreviews.buzz/storage/app/blog/PChHQtiucEdaqTAPJyXwHt71ceVP1qzyS5uu5jK9.png"
              alt="payments"
            />
          </div>
        </div>
      </Wrapper>
    </footer>
  );
}