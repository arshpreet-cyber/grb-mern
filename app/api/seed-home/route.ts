import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const homeSections = [
      {
        id: 'hero-1',
        type: 'hero',
        data: {
          staticTitle1: 'Turn Reputation into',
          staticTitleBold: 'Revenue',
          staticTitle2: 'with',
          typingServices: [
            'Hotel Reviews',
            'Health Services Reviews',
            'Plumbing Services Reviews',
            'Real Estate Reviews',
            'Legal Services Reviews',
            'Authentic Reviews',
          ],
          description: 'Elevate your brand with reviews that actually convert.'
        },
        settings: { visibility: true, padding: '20px 16px' }
      },
      {
        id: 'buy-reviews-1',
        type: 'buy-reviews',
        data: {},
        settings: { visibility: true, padding: '2rem 0' }
      },
      {
        id: 'search-text-1',
        type: 'text',
        data: {
          content: '<h2 style="text-align: center; font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem; color: #1a1a1a;">Search review Platforms</h2><p style="text-align: center; color: #64748b;">(e.g. Google, Trustpilot...)</p>',
        },
        settings: { visibility: true, padding: '40px 0' }
      },
      {
        id: 'custom-platform-1',
        type: 'custom-platform',
        data: {
          title: "Can't Find Your <strong class='font-semibold'>Platform</strong><br/>Listed Above?",
          description: "Share your preferred platform with us, and our team will design a customized approach<br/>to help you build a credible review presence where it matters the most.",
          buttonText: "Contact Us",
          buttonLink: "/contact-us"
        },
        settings: { visibility: true, backgroundColor: '#FFFEF9', padding: '60px 0' }
      },
      {
        id: 'stats-bar-1',
        type: 'stats-bar',
        data: {
          title: "Why Businesses Keep Coming Back:",
          subtitle: "Proven Results, Trusted Reviews, Consistent Growth",
          stats: [
            { target: 12804, suffix: "+", label: "Orders Delivered", description: "Focused on getting every delivery right with care and consistency." },
            { target: 6090, suffix: "+", label: "Active Users", description: "Partnering with businesses across industries to build a lasting reputation." },
            { target: 95, suffix: "%", label: "Client Satisfaction", description: "A reflection of our commitment to quality, trust, and measurable results." },
            { target: 7, suffix: "+", label: "Years Of Proven Growth", description: "Determined to adapt experienced strategies in reputation management." },
          ]
        },
        settings: { visibility: true, padding: '64px 16px' }
      },
      {
        id: 'image-text-1',
        type: 'image-text',
        data: {
          title: "Turn Reviews into Brand<br/><span class='font-semibold'>Visibility and Growth</span>",
          content: "<p>Customer reviews shape how people see your business. They often decide whether someone chooses you or looks elsewhere. Most customers rely on reviews to judge quality and trust, and they look for real experiences.</p><p>Regular feedback builds credibility over time. It shows that your business consistently delivers value. Recent reviews matter just as much, since they reflect how your business performs today.</p>",
          image: "/uploads/media/1778826313456-ab2b57c2-e8a2-4c20-9e20-c0e6c0f1806e-right-img-home.webp",
          buttonText: "Read More",
          imagePosition: "right"
        },
        settings: { visibility: true, padding: '80px 24px' }
      }
    ];

    const homePage = await prisma.page.upsert({
      where: { slug: 'home' },
      update: {
        sections: homeSections,
        draftSections: homeSections,
      },
      create: {
        title: 'Home Page',
        slug: 'home',
        sections: homeSections,
        draftSections: homeSections,
      }
    });

    return NextResponse.json({ success: true, page: homePage });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
