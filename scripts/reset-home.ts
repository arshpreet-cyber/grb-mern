import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function resetHome() {
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
        settings: { visibility: true, padding: '0' }
      },
      // REMOVED: search-text-1 (This was the "new" section that shouldn't be there)
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
        id: 'icon-grid-1',
        type: 'icon-grid',
        data: {
          title: "Why Do Businesses Trust <strong class='font-semibold text-black'>Get Reviews Buzz?</strong>",
          subtitle: "As your reliable partner, we help your business strengthen their online reputation,<br /> build lasting customer trust, and drive consistent growth through effective review strategies.",
          features: [
            { icon: "https://getreviews.buzz/storage/app/blog/0809068001728298556_experience.svg", title: "Experience and Expertise", description: "Our team brings hands-on experience in digital reputation management, helping businesses enhance visibility and build stronger customer trust." },
            { icon: "https://getreviews.buzz/storage/app/blog/0744774001728298333_Idea.svg", title: "Tailored Solutions", description: "Every business is different. That's why we create customized strategies designed to match your specific goals, audience, and market needs." },
            { icon: "https://getreviews.buzz/storage/app/blog/0746809001728298333_customer.svg", title: "Customer Satisfaction Focused", description: "We're committed to a seamless experience, ensuring every client sees real value and measurable improvement in their online presence." },
            { icon: "https://getreviews.buzz/storage/app/blog/0503869001728298428_global.svg", title: "Global Reach, Local Understanding", description: "We help you connect with a wider audience while maintaining strong relevance in your local market, ensuring balanced and effective growth." },
            { icon: "https://getreviews.buzz/storage/app/blog/0751261001728298333_privacy.svg", title: "Privacy & Security", description: "Your data and business information are handled with the highest level of confidentiality and care at every stage, ensuring complete protection." },
            { icon: "https://getreviews.buzz/storage/app/blog/0748952001728298333_support.svg", title: "Dedicated Support & Guidance", description: "Our team is always available to support you. From strategy to execution, our experts are available to assist whenever you need it, with timely guidance." }
          ]
        },
        settings: { visibility: true, backgroundColor: '#f9fafb', padding: '64px 0' }
      },
      {
        id: 'image-text-right',
        type: 'image-text',
        data: {
          title: "Turn Reviews into Brand<br/><span class='font-semibold'>Visibility and Growth</span>",
          content: "<p>Customer reviews shape how people see your business. They often decide whether someone chooses you or looks elsewhere. Most customers rely on reviews to judge quality and trust, and they look for real experiences.</p><p>Regular feedback builds credibility over time. It shows that your business consistently delivers value. Recent reviews matter just as much, since they reflect how your business performs today.</p>",
          image: "https://getreviews.buzz/storage/app/blog/0547241001776770835_0936012001776065359_right-img.png",
          buttonText: "Read More",
          imagePosition: "right"
        },
        settings: { visibility: true, padding: '80px 24px' }
      },
      {
        id: 'image-text-left',
        type: 'image-text',
        data: {
          title: "Where Reputation Meets <span class='font-semibold text-[#000]'>Real Business Growth</span>",
          content: "<p>A strong online presence boosts visibility. But to turn that visibility into growth, you need the right approach. This is where a solid review strategy matters.</p><p>At Get Reviews Buzz, we help businesses build and enhance their reputation. Our structured and goal-focused approach improves how your brand is perceived. We ensure it connects with your target audience and stands out in the market.</p><p>Our process supports long-term results. We help you encourage repeat customers and build a lasting reputation that benefits your business over time.</p>",
          image: "https://getreviews.buzz/storage/app/blog/0539654001776770835_0702272001776065346_left-img.png",
          buttonText: "Explore More",
          imagePosition: "left"
        },
        settings: { visibility: true, padding: '80px 24px' }
      },
      {
        id: 'blog-section-1',
        type: 'blog-section',
        data: {
          title: "Insights & Perspectives",
          description: "A collection of ideas and perspectives designed to help you understand, shape, and grow your brand reputation with clarity. Stay informed with expert tips & blogs on online reputation and growth.",
          limit: 3,
          buttonText: "View All Blogs",
          buttonLink: "/blog"
        },
        settings: { visibility: true, padding: '80px 0', backgroundColor: '#ffffff' }
      },
      {
        id: 'faq-section-1',
        type: 'faq-section',
        data: {
          title: "Frequently <strong class='font-semibold'>Asked<br />Questions</strong>",
          description: "Find clear answers to common questions about our services, process, and delivery timelines, and how we support your online reputation.",
          faqs: [
            { q: "What Services Does Get Reviews Buzz Provide?", a: "We help businesses strengthen their online reputation through review growth strategies, reputation management, and digital marketing solutions across leading platforms." },
            { q: "How Long Does It Take To See Results?", a: "Most businesses begin to see noticeable improvements within 7 to 14 days, depending on the platform, industry, and strategy in place." },
            { q: "Are The Reviews From Real People?", a: "We focus on promoting genuine customer feedback and building a credible review presence through ethical and effective strategies." },
            { q: "What Platforms Do You Support?", a: "We support major platforms, including Google, Trustpilot, Yelp, Facebook, and others, based on your business requirements." },
            { q: "Is My Business Information Kept Confidential?", a: "Definitely. We maintain strict confidentiality and ensure that all client information is handled securely and responsibly." },
            { q: "Do You Offer a Refund Policy?", a: "We're really committed to making sure our clients are happy. If we fall short of your expectations, our team will work to identify the issue and resolve it." },
            { q: "Can I Choose a Monthly Subscription Plan?", a: "Yes, we offer both one-time and flexible monthly plans to suit different business goals and budgets." },
            { q: "Is this safe for my business?", a: "Certainly! Our strategy is all about building a strong review presence that keeps you out of trouble with the platforms and helps your brand grow in the long run." },
            { q: "How do I get started?", a: "Getting started is really simple. Share your requirements with us, and our team will create a customized strategy based on your business goals, needs, and targeted platforms." },
            { q: "Can I customize my review strategy?", a: "Every strategy is tailored to your business needs. With this, you can reach the right target audience, drive growth, and help your business become more visible." }
          ]
        },
        settings: { visibility: true, backgroundColor: '#faf8f7', padding: '80px 0' }
      }
    ];

    await prisma.page.upsert({
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

    console.log('Clean Home page reset successfully');
  } catch (error) {
    console.error('Error resetting home page:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

resetHome();
