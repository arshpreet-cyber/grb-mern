"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";
import Wrapper from "@/components/ui/Wrapper";
import { Check } from "lucide-react";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    website: "",
    message: "",
  });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) {
      setError("Please fill in all required fields.");
      return;
    }
    // if (!turnstileToken) {
    //   setError("Please complete the captcha verification.");
    //   return;
    // }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, turnstileToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      // Success! Trigger flip animation
      setIsFlipped(true);
      
      // Scroll to the card so user sees the success message
      const card = document.getElementById('contact-flip-card');
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-poppins bg-[#fdfdfd] min-h-screen pb-[100px]">
      {/* Hero Header Area */}
      <div className="bg-[#F4F4F4] pt-20 pb-40 px-4 text-center h-[37.5rem] relative overflow-hidden">
        <Image
          src="https://getreviews.buzz/storage/app/blog/0237619001771243730_Doodles-(1).png"
          alt="doodle left"
          width={510}
          height={785}
          className="absolute left-0 top-0 z-0 select-none pointer-events-none"
        />
        <Image
          src="https://getreviews.buzz/storage/app/blog/0229991001771243825_Doodles-(2).png"
          alt="doodle right"
          width={510}
          height={785}
          className="absolute right-0 bottom-0 z-0 select-none pointer-events-none hidden md:block"
        />
      </div>

      {/* Main Content Area */}
      <div className="px-4 relative z-10 mt-[-550px] mb-[50px]">
        <Wrapper>
          <div className="max-w-[1000px] mx-auto">
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-xl mb-6 text-sm border border-red-200 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Flip Card Section */}
            <div 
              id="contact-flip-card"
              className="relative transition-all duration-700 [transform-style:preserve-3d] mb-[50px]"
              style={{ 
                perspective: "1200px",
                transformStyle: "preserve-3d"
              }}
            >
              <div 
                className={`relative transition-all duration-750 ease-[cubic-bezier(0.4,0.2,0.2,1)] [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
                style={{ 
                   transformStyle: "preserve-3d",
                   transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                   minHeight: "650px"
                }}
              >
                {/* FRONT: Form */}
                <div 
                  className={`bg-gradient-to-b from-white to-[#FFF6D0] rounded-[36px] p-8 md:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] [backface-visibility:hidden] h-full ${isFlipped ? "pointer-events-none opacity-0" : "opacity-100"}`}
                >
                  <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Let&apos;s Talk Business</h2>
                    <p className="text-gray-400 text-sm max-w-md mx-auto">
                      Fill in your details and we&apos;ll get back to you to discuss your needs and share a customized service package with you.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-[16px] text-gray-800 ml-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                          className="w-full bg-white border border-[#FFCB0030] p-4 rounded-[10px] text-sm text-[#1a1a1a] outline-none focus:border-[#FFCB00] transition"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[16px] text-gray-800 ml-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          className="w-full bg-white border border-[#FFCB0030] p-4 rounded-[10px] text-sm text-[#1a1a1a] outline-none focus:border-[#FFCB00] transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[16px] text-gray-800 ml-1">
                        Website URL
                      </label>
                      <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="Enter your website url"
                        className="w-full bg-white border border-[#FFCB0030] p-4 rounded-[10px] text-sm text-[#1a1a1a] outline-none focus:border-[#FFCB00] transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[16px] text-gray-800 ml-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Type your message here..."
                        className="w-full bg-white border border-[#FFCB0030] p-4 rounded-[10px] text-sm text-[#1a1a1a] outline-none focus:border-[#FFCB00] transition resize-none"
                      />
                    </div>

                    {/* Turnstile */}
                    {/* <div className="mb-3">
                      <Turnstile
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAA9m-V26A66_Jm6r"}
                        onSuccess={(token) => setTurnstileToken(token)}
                      />
                    </div> */}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-black text-white font-bold py-5 rounded-2xl hover:bg-zinc-800 transition-all text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending..." : "Submit"}
                    </button>
                  </form>
                </div>

                {/* BACK: Success Message */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-b from-white to-[#FFF6D0] rounded-[36px] p-8 md:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center text-center ${!isFlipped ? "pointer-events-none opacity-0" : "opacity-100"}`}
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <div className="bg-black w-20 h-20 rounded-full flex items-center justify-center mb-7 shadow-lg shadow-black/15">
                    <Check className="text-[#FDE047] w-10 h-10" strokeWidth={3} />
                  </div>

                  <h3 className="text-[28px] font-bold text-[#1a1a1a] mb-4">Message Received!</h3>

                  <p className="text-[16px] text-gray-600 max-w-[360px] leading-[1.8] mb-9">
                    Thanks for reaching out. Our team will review your request and get back to you.
                  </p>

                  <Link
                    href="/"
                    className="bg-black text-[#FDE047] font-bold text-[13px] tracking-[2px] uppercase py-4 px-10 rounded-2xl transition hover:opacity-85"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="mailto:marketing@getreviews.buzz" className="group">
                <div className="bg-[#FDE047] p-10 rounded-[32px] text-center flex flex-col items-center border-2 border-black h-full transition hover:-translate-y-1">
                  <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mb-4 border-2 border-black">
                    <Image 
                      src="https://getreviews.buzz/storage/app/blog/0240249001771243677_email-1.png" 
                      alt="email icon" 
                      width={24} height={24} 
                    />
                  </div>
                  <span className="font-bold text-[18px] leading-[26px]">Email</span>
                  <p className="text-[16px] leading-[26px] text-black mt-1">marketing@getreviews.buzz</p>
                </div>
              </a>

              <a href="tel:+14302335402" className="group">
                <div className="bg-[#FDE047] p-10 rounded-[32px] text-center flex flex-col items-center border-2 border-black h-full transition hover:-translate-y-1">
                  <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mb-4 border-2 border-black">
                    <Image 
                      src="https://getreviews.buzz/storage/app/blog/0900747001771243694_phone.png" 
                      alt="phone icon" 
                      width={24} height={24} 
                    />
                  </div>
                  <span className="font-bold text-[18px] leading-[26px]">Phone</span>
                  <p className="text-[16px] leading-[26px] text-black mt-1">+1 430-233-5402</p>
                </div>
              </a>

              <a href="https://wa.me/13068025402" target="_blank" rel="noopener noreferrer" className="group">
                <div className="bg-[#FDE047] p-10 rounded-[32px] text-center flex flex-col items-center border-2 border-black h-full transition hover:-translate-y-1">
                  <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mb-4 border-2 border-black">
                    <Image 
                      src="https://getreviews.buzz/storage/app/blog/0767674001771243715_whatsapp.png" 
                      alt="whatsapp icon" 
                      width={24} height={24} 
                    />
                  </div>
                  <span className="font-bold text-[18px] leading-[26px]">WhatsApp</span>
                  <p className="text-[16px] leading-[26px] text-black mt-1">+1 306-802-5402</p>
                </div>
              </a>
            </div>
          </div>
        </Wrapper>
      </div>

    </div>
  );
}
