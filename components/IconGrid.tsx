"use client";

/* eslint-disable @next/next/no-img-element */
import Wrapper from "@/components/Wrapper";

export default function IconGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <Wrapper>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Why Do Businesses Trust Get Reviews Buzz?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">As your reliable partner, we help your business strengthen their online reputation, build lasting customer trust, and drive consistent growth through effective review strategies.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-left transition-all hover:shadow-md">
              <img src="https://getreviews.buzz/storage/app/blog/0809068001728298556_experience.svg" alt="Experience" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Experience and Expertise</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Our team brings hands-on experience in digital reputation management, helping businesses enhance visibility and build stronger customer trust.</p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-left transition-all hover:shadow-md">
              <img src="https://getreviews.buzz/storage/app/blog/0744774001728298333_Idea.svg" alt="Solutions" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tailored Solutions</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Every business is different. That&apos;s why we create customized strategies designed to match your specific goals, audience, and market needs.</p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-left transition-all hover:shadow-md">
              <img src="https://getreviews.buzz/storage/app/blog/0746809001728298333_customer.svg" alt="Satisfaction" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Customer Satisfaction Focused</h3>
              <p className="text-gray-600 text-sm leading-relaxed">We&apos;re committed to a seamless experience, ensuring every client sees real value and measurable improvement in their online presence.</p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-left transition-all hover:shadow-md">
              <img src="https://getreviews.buzz/storage/app/blog/0503869001728298428_global.svg" alt="Global Reach" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Reach, Local Understanding</h3>
              <p className="text-gray-600 text-sm leading-relaxed">We help you connect with a wider audience while maintaining strong relevance in your local market, ensuring balanced and effective growth.</p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-left transition-all hover:shadow-md">
              <img src="https://getreviews.buzz/storage/app/blog/0751261001728298333_privacy.svg" alt="Privacy" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Privacy &amp; Security</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Your data and business information are handled with the highest level of confidentiality and care at every stage, ensuring complete protection.</p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-left transition-all hover:shadow-md">
              <img src="https://getreviews.buzz/storage/app/blog/0748952001728298333_support.svg" alt="Support" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Dedicated Support &amp; Guidance</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Our team is always available to support you. From strategy to execution, our experts are available to assist whenever you need it, with timely guidance.</p>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
