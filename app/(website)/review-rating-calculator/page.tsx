import React from 'react';
import PageRenderer from "@/components/sections/PageRenderer";
import EditorWrapper from "@/components/editor/EditorWrapper";
import PageScripts from "@/components/layout/PageScripts";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";

const defaultSections = [
  {
    id: "calc-hero",
    type: "rating-calculator",
    data: {
      title: "Your Path to a <strong>5-Star</strong> Rating",
      description: "See exactly what it takes to move your rating up. Enter your current rating, total count, and dream score to get the exact number of 5-star reviews needed to pull ahead.",
      pills: [
        { num: "98%", text: "of customers read online reviews before deciding on a local business" },
        { num: "50%", text: "more engagement for businesses with four-star ratings" },
        { num: "3/4", text: "customers avoid businesses with numerous negative reviews" }
      ],
      calculatorTitle: "Rating Calculator:"
    },
    settings: {}
  },
  {
    id: "calc-stats",
    type: "rating-stats-bar",
    data: {
      title: "Numbers that decide<br> whether customers click or scroll past",
      stats: [
        { num: "98", suffix: "%", label: "Of consumers read reviews before making a purchase decision" },
        { num: "4.7", suffix: "★", label: "Is the sweet spot for ranking in Google's local 3-pack" },
        { num: "42", suffix: "%", label: "Conversion rate uplift for businesses rated above 4.5 stars" },
        { num: "24/7", suffix: "", label: "Real-time rating analytics and instant forecast recalculation" }
      ]
    },
    settings: {
      backgroundColor: "#fffdf0"
    }
  },
  {
    id: "calc-faq",
    type: "faq-section",
    data: {
      title: "Frequently <strong class='font-semibold'>Asked<br />Questions</strong>",
      description: "Find clear answers to common questions about our services, process, and delivery timelines, and how we support your online reputation.",
      ctaTitle: "Still have a doubts?",
      ctaDescription: "Everything is explained in a clear and simple way to help you make the right decision.",
      faqs: [
        { q: "Will my rating update instantly after new reviews are posted?", a: "No, not always. While new reviews may appear within 1-2 hours, the overall rating can take longer to update, as it goes through the platform’s recalculation process." },
        { q: "Why does it take so many reviews to increase my rating?", a: "Your overall rating is based on all existing reviews, so businesses with many reviews usually require more positive ratings to see measurable changes." },
        { q: "What is a good rating to aim for?", a: "Generally, a rating of 4.5 stars or higher is considered strong and trustworthy, and most of the businesses aim for this only." },
        { q: "Do more reviews make my rating more stable?", a: "Certainly, it does. A higher number of total reviews helps stabilize your rating and reduces the impact of individual reviews." },
        { q: "How do ratings affect customer decisions?", a: "Ratings heavily influence trust and buying decisions. Many customers compare the ratings before making decisions, especially when choosing similar businesses." },
        { q: "How is my average rating calculated?", a: "Your average rating is calculated by dividing the total sum of all ratings by the number of reviews received." },
        { q: "Does the calculator work with fractional ratings (e.g., 4.3)?", a: "Absolutely. The calculator fully supports decimal and fractional ratings for more accurate calculations." }
      ]
    },
    settings: {
      backgroundColor: "#fffdf0"
    }
  },
  {
    id: "calc-cta",
    type: "rating-cta",
    data: {
      title: "Ready to Build Your <em>5-Star</em> Reputation?",
      buttonText: "Get Reviews Now",
      buttonLink: "/"
    },
    settings: {}
  }
];

async function getPage() {
  try {
    return await prisma.page.findUnique({ where: { slug: "review-rating-calculator" } }) as any;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage();
  if (page) {
    return {
      title: page.metaTitle || page.title,
      description: page.metaDescription || undefined,
      alternates: page.canonicalLink ? { canonical: page.canonicalLink } : { canonical: "https://getreviews.buzz/review-rating-calculator/" },
      openGraph: page.opengraphImage ? { images: [page.opengraphImage] } : { images: ["https://getreviews.buzz/assets/starclimb-og-banner.jpg"] },
    };
  }

  return {
    title: "Review Rating Calculator | Boost Star Ratings on 80+ Platforms | StarClimb",
    description: "Free review rating calculator — find out exactly how many 5-star reviews you need to hit your target rating on Google, Trustpilot, Yelp, Booking.com, Amazon & 80+ review platforms. Instant forecast, no signup.",
    alternates: {
      canonical: "https://getreviews.buzz/review-rating-calculator/",
    },
    openGraph: {
      title: "Review Rating Calculator | Boost Star Ratings on 80+ Platforms",
      url: "https://getreviews.buzz/review-rating-calculator/",
      images: ["https://getreviews.buzz/assets/starclimb-og-banner.jpg"],
    }
  };
}

export default async function ReviewRatingCalculatorPage({
  searchParams
}: {
  searchParams: Promise<{ edit?: string, preview?: string }>
}) {
  const { edit, preview } = await searchParams;
  const page = await getPage();
  const isEditMode = edit === 'true';
  const isPreviewMode = preview === 'true';

  if (isEditMode) {
    // If page doesn't exist in DB, we'll need to create it first or handle it in the editor.
    // For now, if it doesn't exist, we pass the defaults as initial state.
    const initialPage = page || {
      title: "Review Rating Calculator",
      slug: "review-rating-calculator",
      sections: defaultSections,
      draftSections: defaultSections,
      status: 1
    };
    return <EditorWrapper initialPage={initialPage} />;
  }

  const sections = page 
    ? (isPreviewMode 
        ? (Array.isArray(page.draftSections) && (page.draftSections as any[]).length > 0 ? (page.draftSections as any[]) : (page.sections as any[]))
        : (Array.isArray(page.sections) ? (page.sections as any[]) : defaultSections))
    : defaultSections;

  return (
    <>
      <PageScripts headerScript={page?.headerScript} bodyScript={page?.bodyScript} footerScript={page?.footerScript} />
      <div className="min-h-screen bg-white text-slate-900">
        <PageRenderer sections={sections.filter((s: any) => s.settings?.visibility !== false)} />
      </div>
    </>
  );
}
