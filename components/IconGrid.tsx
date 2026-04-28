"use client";

/* eslint-disable @next/next/no-img-element */
import Wrapper from "@/components/Wrapper";

const features = [
  {
    icon: "https://getreviews.buzz/storage/app/blog/0809068001728298556_experience.svg",
    title: "Experience and Expertise",
    description: "Our team brings hands-on experience in digital reputation management, helping businesses enhance visibility and build stronger customer trust."
  },
  {
    icon: "https://getreviews.buzz/storage/app/blog/0744774001728298333_Idea.svg",
    title: "Tailored Solutions",
    description: "Every business is different. That's why we create customized strategies designed to match your specific goals, audience, and market needs."
  },
  {
    icon: "https://getreviews.buzz/storage/app/blog/0746809001728298333_customer.svg",
    title: "Customer Satisfaction Focused",
    description: "We're committed to a seamless experience, ensuring every client sees real value and measurable improvement in their online presence."
  },
  {
    icon: "https://getreviews.buzz/storage/app/blog/0503869001728298428_global.svg",
    title: "Global Reach, Local Understanding",
    description: "We help you connect with a wider audience while maintaining strong relevance in your local market, ensuring balanced and effective growth."
  },
  {
    icon: "https://getreviews.buzz/storage/app/blog/0751261001728298333_privacy.svg",
    title: "Privacy & Security",
    description: "Your data and business information are handled with the highest level of confidentiality and care at every stage, ensuring complete protection."
  },
  {
    icon: "https://getreviews.buzz/storage/app/blog/0748952001728298333_support.svg",
    title: "Dedicated Support & Guidance",
    description: "Our team is always available to support you. From strategy to execution, our experts are available to assist whenever you need it, with timely guidance."
  }
];

export default function IconGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <Wrapper>
        <div className="container mx-auto px-4 text-center">
          <p className="text-[40px] md:text-[40px] lg:text-[38px] font-normal mb-8 text-[#000]">
            Why Do Businesses Trust <strong className="font-semibold text-black">Get Reviews Buzz?</strong>
          </p>
          <p className="text-gray-600 text-[18px] mx-auto mb-12">
            As your reliable partner, we help your business strengthen their online reputation,<br /> build lasting customer trust, and drive consistent growth through effective review strategies.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-left transition-all hover:shadow-md"
              >
                <img src={feature.icon} alt={feature.title} className="w-[78px] h-[98px] mb-4 object-contain" />
                <h3 className="text-xl font-normal my-8">{feature.title}</h3>
                <p className="text-gray-600 text-m leading-relaxed text-justify">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
