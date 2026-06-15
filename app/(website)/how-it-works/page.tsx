import { Metadata } from "next";
import prisma from "@/lib/prisma";
import EditorWrapper from "@/components/editor/EditorWrapper";
import PageRenderer from "@/components/sections/PageRenderer";
import PageScripts from "@/components/layout/PageScripts";

export const dynamic = 'force-dynamic';

const defaultHowItWorksSections = [
  {
    id: "how-it-works-hero-1",
    type: "how-it-works-hero",
    data: {
      title: "Get More Reviews & Build A Strong Brand Reputation",
      highlightText: "A Strong Brand Reputation",
      subtitle: "A simple and transparent review management process designed to support local reputation management, business reputation growth, and stronger customer confidence across major platforms.",
      primaryBtnText: "Get Reviews Now",
      primaryBtnLink: "/contact-us",
      secondaryBtnText: "Book a Call",
      secondaryBtnLink: "/schedule-appointment",
      badges: [
        "1000 + Businesses trust Get Reviews Buzz",
        "Supporting 80+ Platforms",
        "Flexible Review Packages",
        "Timely and Consistent Delivery"
      ]
    },
    settings: { visibility: true, padding: "80px 0 0 0", margin: "0", backgroundColor: "#FFFDF6" }
  },
  {
    id: "how-it-works-process-1",
    type: "how-it-works-process",
    data: {
      heading: 'How Our "GET REVIEWS BUZZ" Process Works?',
      subheading: "Our step-by-step onboarding process makes it easy to get started. With complete transparency and seamless support, we help your brand grow with confidence online."
    },
    settings: { visibility: true, padding: "80px 0", margin: "0", backgroundColor: "#ffffff" }
  },
  {
    id: "how-it-works-more-than-service-1",
    type: "how-it-works-more-than-service",
    data: {
      heading: 'More Than Just a "GET REVIEWS BUZZ" Service'
    },
    settings: { visibility: true, padding: "80px 0", margin: "0", backgroundColor: "#FAF9F6" }
  },
  {
    id: "how-it-works-before-after-1",
    type: "how-it-works-before-after",
    data: {
      heading: "Before Vs. After Online Reputation Growth",
      subheading: "Transform customer feedback into lasting business growth. A strong online reputation doesn't happen by chance. With a steady flow of genuine positive reviews, your business can strengthen credibility, improve search visibility, and stand out from competitors. As trust grows, customers are more likely to engage with your brand and choose your services with confidence."
    },
    settings: { visibility: true, padding: "80px 0", margin: "0", backgroundColor: "#FFFFFF" }
  },
  {
    id: "how-it-works-standards-1",
    type: "how-it-works-standards",
    data: {
      heading: "Our Service Standards That Put Customer First",
      image: "https://beta.getreviews.buzz/storage/app/blog/0540134001779962686_Rectangle-10202.webp"
    },
    settings: { visibility: true, padding: "80px 0", margin: "0", backgroundColor: "#FFFFFF" }
  },
  {
    id: "how-it-works-why-trust-1",
    type: "how-it-works-why-trust",
    data: {
      heading: "Why Do Customers Trust Our Process?",
      image: "https://beta.getreviews.buzz/storage/app/blog/0470557001779956136_Rectangle-10048.webp"
    },
    settings: { visibility: true, padding: "80px 0", margin: "0", backgroundColor: "#FFFFFF" }
  },
  {
    id: "how-it-works-solutions-1",
    type: "how-it-works-solutions",
    data: {
      heading: "Reputation Solutions for Every Business Type",
      desc1: "Every industry faces unique challenges when it comes to managing customer perception.",
      desc2: "Our reputation solutions are designed to support businesses across a wide range of sectors, helping them showcase customer satisfaction and maintain a strong presence across major review platforms."
    },
    settings: { visibility: true, padding: "80px 0", margin: "0", backgroundColor: "#FFFDF6" }
  },
  {
    id: "how-it-works-cta-1",
    type: "how-it-works-cta",
    data: {
      heading: "Your Future Customers Are Already Checking <span class='font-semibold'>Your Reviews. Let's Get Started!</span>",
      subheading: "Every day, your rating sits neglected; competitors take your customers. You've seen our process, our principles, and our proof. Now it's time to act.",
      btnText: "Get Reviews Now",
      btnLink: "/",
      image: "https://beta.getreviews.buzz/storage/app/blog/0707270001780033172_Group-1000008234.webp"
    },
    settings: { visibility: true, padding: "64px 0", margin: "0" }
  }
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findUnique({ where: { slug: 'how-it-works' } });
  if (!page) {
    return {
      title: "How It Works | GetReviews.buzz",
      description: "Learn how Get Reviews Buzz builds credibility and online presence for your business.",
    };
  }
  return {
    title: page.metaTitle || "How It Works | GetReviews.buzz",
    description: page.metaDescription || "Learn how Get Reviews Buzz builds credibility and online presence for your business.",
    keywords: page.keywords || undefined,
    robots: page.robotsText || "index, follow",
  };
}

async function getOrCreateHowItWorksPage() {
  try {
    let page = await prisma.page.findUnique({
      where: { slug: 'how-it-works' },
    });

    if (!page) {
      page = await prisma.page.create({
        data: {
          title: "How It Works",
          slug: "how-it-works",
          status: "Published",
          metaTitle: "How It Works | GetReviews.buzz",
          metaDescription: "Learn how Get Reviews Buzz builds credibility and online presence for your business.",
          sections: defaultHowItWorksSections,
          draftSections: defaultHowItWorksSections,
        },
      });
      console.log("🌱 Auto-created and seeded How It Works page in the database.");
    }
    return page;
  } catch (error) {
    console.error("Failed to load or initialize How It Works page", error);
    return null;
  }
}

export default async function HowItWorksPage({
  searchParams
}: {
  searchParams: Promise<{ edit?: string, preview?: string }>
}) {
  const { edit, preview } = await searchParams;
  const isEditMode = edit === 'true';
  const isPreviewMode = preview === 'true';
  
  const page = await getOrCreateHowItWorksPage();

  if (isEditMode && page) {
    const pageCopy = {
      ...page,
      sections: page.sections as any[],
      draftSections: page.draftSections && (page.draftSections as any[]).length > 0
        ? (page.draftSections as any[])
        : (page.sections as any[])
    };
    return <EditorWrapper initialPage={pageCopy} />;
  }

  const sectionsToRender = isPreviewMode
    ? (page && Array.isArray(page.draftSections) && (page.draftSections as any[]).length > 0 ? (page.draftSections as any[]) : (page?.sections as any[]))
    : (page && Array.isArray(page.sections) ? (page.sections as any[]) : defaultHowItWorksSections);

  return (
    <>
      {page && (
        <PageScripts
          headerScript={page.headerScript}
          bodyScript={page.bodyScript}
          footerScript={page.footerScript}
        />
      )}
      <div className="min-h-screen bg-white text-slate-900 font-sans">
        <PageRenderer sections={sectionsToRender.filter((s: any) => s.settings?.visibility !== false)} />
      </div>
    </>
  );
}
