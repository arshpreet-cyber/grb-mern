"use client";

import Link from "next/link";
import SectionWithRightImage from "@/components/home/SectionWithRightImage";
import SectionWithLeftImage from "@/components/home/SectionWithLeftImage";
import { HOW_IT_WORKS_DATA } from "@/lib/constants/pageData";

export default function HowItWorksPage() {
  const { hero } = HOW_IT_WORKS_DATA;
  const { sectionwithleftimage } = HOW_IT_WORKS_DATA;

  return (
    <div className="bg-white">
      <SectionWithRightImage 
        title={
          <>
            Climb The Ladder Of Business <br />
            <span className="text-[#fcd535]">{hero.highlightedText}</span>
          </>
        }
        content={hero.content}
        buttonText={hero.buttonText}
        image={hero.image}
      />
      <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl md:text-5xl text-center ">
          Enhancing Brand Reputation With Trust And <span className="text-[#FFC400]">Advocacy</span>
      </h1>

      <SectionWithLeftImage 
      title={
          <>
            Get Positive Reviews <br />
            <span className="text-[#fcd535]">{sectionwithleftimage.highlightedText}</span>
          </>
        }
        content={sectionwithleftimage.content}
        image={sectionwithleftimage.image}
      />

      <SectionWithRightImage
      title={
          <>
            Reviews For Any Type Of <br /> 
            <span className="text-[#fcd535]">Business</span>
          </>
        }
        content="No matter what kind of business you run, we assist you in obtaining reviews for it. We offer reviews for every kind of business, from auto detailing shops to roofing companies, locksmiths, financing companies, and more. As a reliable review provider, we prioritize the confidentiality of our client’s names."
        buttonText="Get a Quote"
        image="https://getreviews.buzz/storage/app/blog/0180148001731483557_Reviews-For-Any-Type-Of-Business.webp"
      />

      <SectionWithLeftImage
      title={
          <>
            Will Our Reviews Affect Your <br />
            <span className="text-[#fcd535]">Business Profile?</span>
          </>     
        }
        content="Absolutely! Our positive reviews can have a significant impact on your business profile by making it appear more credible and trustworthy. We understand that there is a misconception that fake reviews can harm a business’s reputation, but that’s not the case with our services. We only provide genuine reviews from real accounts to ensure that you receive authentic recommendations. With our services, you can be confident that your business profile will only benefit from positive reviews."
        image="https://getreviews.buzz/storage/app/blog/0182312001731483557_Would-Our-Reviews-Affect-Your-Business-Profile.webp"
      />  

      <SectionWithRightImage
      title={
          <>
            Rank Your GBP In SERPs With <br />
            <span className="text-[#fcd535]">Positive Reviews</span>
          </>   
        }
        content="Positive reviews can be a game-changer if you want to improve your Google Business Profile (GBP) listings’ ranking on Search Engine Results Pages (SERPs). These reviews provide social proof that your business is trustworthy and well-liked by customers. It ultimately influences Google’s perception of your business. We’ve got you covered if you also want to rank your GBP on SERP. Choose our review services to give your business the competitive edge it needs to stand out in the online marketplace."
        buttonText="Get a Quote"
        image="https://getreviews.buzz/storage/app/blog/0184599001731483557_Rank-Your-GMB-In-SERPs-With-Positive-Reviews.webp"
      />

      <section className="bg-white py-12">

        <div className="mx-auto w-full max-w-[1400] bg-[#F8F8F8] px-6 py-16 text-center">
          
          <h2 className="text-2xl font-extrabold tracking-tight text-black sm:text-3xl md:text-4xl">
            Interested To Elevate Your Business&apos;s Online Presence?
          </h2>
          
          <p className="mt-3 text-sm text-gray-500 sm:mt-4 sm:text-base">
            Connect With Our Team Today And We&apos;ll Take Care Of The Rest!
          </p>
          
          <div className="mt-8 flex justify-center">
            <Link
              href="/quote"
              className="rounded-sm bg-gradient-to-r from-[#FFD93D] to-[#FFC400] px-8 py-3 text-sm font-bold text-black shadow-sm transition-opacity hover:opacity-90"
            >
              Get A Quote
            </Link>
          </div>

        </div>
      
    </section>

    </div>
  );
}