'use client';
import React from 'react';
import Wrapper from "@/components/ui/Wrapper";
import { SectionProps } from '@/types/section';
import { useAppDispatch } from '@/lib/redux/hooks';
import { updateSectionData } from '@/lib/redux/features/pageEditorSlice';

export default function IconGrid({ id, data, settings, isEditing }: SectionProps) {
  const {
    title = "Why Do Businesses Trust <strong class='font-semibold text-black'>Get Reviews Buzz?</strong>",
    subtitle = "As your reliable partner, we help your business strengthen their online reputation,<br /> build lasting customer trust, and drive consistent growth through effective review strategies.",
    features = [
      {
        icon: "/uploads/media/1778825935130-48c8352e-e042-4cd7-a93a-1edf9b56925e-experience.svg",
        title: "Experience and Expertise",
        description: "Our team brings hands-on experience in digital reputation management, helping businesses enhance visibility and build stronger customer trust."
      },
      {
        icon: "/uploads/media/1778825988863-d9a9e6f2-89e7-4dd2-8e7d-ef6e7de1e9f1-Idea.svg",
        title: "Tailored Solutions",
        description: "Every business is different. That's why we create customized strategies designed to match your specific goals, audience, and market needs."
      },
      {
        icon: "/uploads/media/1778826045227-4ae4cea7-3257-4de4-9a69-4448de9fed37-customer.svg",
        title: "Customer Satisfaction Focused",
        description: "We're committed to a seamless experience, ensuring every client sees real value and measurable improvement in their online presence."
      },
      {
        icon: "/uploads/media/1778826098531-5bdde388-99a5-4ff7-8b83-bae10893bb34-global.svg",
        title: "Global Reach, Local Understanding",
        description: "We help you connect with a wider audience while maintaining strong relevance in your local market, ensuring balanced and effective growth."
      },
      {
        icon: "/uploads/media/1778826144412-2da15b9d-d323-4e0f-8c92-1d27e31c7223-privacy.svg",
        title: "Privacy & Security",
        description: "Your data and business information are handled with the highest level of confidentiality and care at every stage, ensuring complete protection."
      },
      {
        icon: "/uploads/media/1778826198333-e457cef4-187e-4756-b91b-66e3b1561713-support.svg",
        title: "Dedicated Support & Guidance",
        description: "Our team is always available to support you. From strategy to execution, our experts are available to assist whenever you need it, with timely guidance."
      }
    ]
  } = data;

  const dispatch = useAppDispatch();

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const updated = features.map((f: any, i: number) =>
      i === index ? { ...f, [field]: value } : f
    );
    dispatch(updateSectionData({ id, data: { features: updated } }));
  };

  const titleStyles: React.CSSProperties = {
    color: settings.titleColor || 'inherit',
    fontSize: settings.titleSize || 'inherit',
    fontWeight: settings.titleWeight || 'inherit',
  };

  const contentStyles: React.CSSProperties = {
    color: settings.contentColor || 'inherit',
    fontSize: settings.contentSize || 'inherit',
    fontWeight: settings.contentWeight || 'inherit',
  };

  const sectionStyles: React.CSSProperties = {
    padding: settings.padding || '4rem 0',
    margin: settings.margin || '0',
    backgroundColor: settings.backgroundColor || '#f9fafb',
    borderRadius: settings.borderRadius || '0',
  };

  return (
    <section style={sectionStyles}>
      <Wrapper>
        <div className="container mx-auto px-4 text-center">
          <p 
            className="text-[40px] md:text-[40px] lg:text-[38px] mb-8"
            style={titleStyles}
            dangerouslySetInnerHTML={{ __html: title }} 
          />
          
          <p 
            className="text-[18px] mx-auto mb-12"
            style={contentStyles}
            dangerouslySetInnerHTML={{ __html: subtitle }} 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature: any, index: number) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl border border-gray-100 text-left transition-transform duration-300 hover:-translate-y-2"
              >
                <img src={feature.icon} alt={feature.title} className="w-[78px] h-[98px] mb-4 object-contain" />
                {isEditing ? (
                  <>
                    <input
                      className="text-xl font-normal my-8 w-full outline-none border-b border-dashed border-[#fc0] bg-transparent"
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                    />
                    <textarea
                      className="text-gray-600 text-m leading-relaxed text-justify w-full outline-none border-b border-dashed border-[#fc0] bg-transparent resize-none"
                      value={feature.description}
                      rows={4}
                      onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-normal my-8">{feature.title}</h3>
                    <p className="text-gray-600 text-m leading-relaxed text-justify">{feature.description}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
