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

async function seedFunctionalPages() {
  try {
    // 1. How It Works
    const howItWorksSections = [
      {
        id: 'hiw-hero',
        type: 'image-text',
        data: {
          title: "Climb The Ladder Of Business <br /><span class='text-[#fcd535]'>Growth With Every Positive Step</span>",
          content: "<p>Understanding how reviews impact your business is the first step toward long-term success. Our platform helps you bridge the gap between customer feedback and brand reputation.</p>",
          buttonText: "Get Started",
          image: "/uploads/media/1778826400702-ec789a7f-39cf-46ed-9147-9a31828ad03f-left-img-home.webp",
          imagePosition: "right"
        },
        settings: { visibility: true, padding: '80px 0' }
      }
    ];

    await prisma.page.upsert({
      where: { slug: 'how-it-works' },
      update: { sections: howItWorksSections, draftSections: howItWorksSections, title: 'How It Works' },
      create: { title: 'How It Works', slug: 'how-it-works', sections: howItWorksSections, draftSections: howItWorksSections }
    });

    // 2. Buy Reviews Page
    const buyReviewsSections = [
      {
        id: 'br-hero',
        type: 'hero',
        data: {
          staticTitle1: 'Premium',
          staticTitleBold: 'Review',
          staticTitle2: 'Services',
          typingServices: ['Google Reviews', 'Trustpilot Reviews', 'Yelp Reviews'],
          description: 'The highest quality reviews for your business growth.'
        },
        settings: { visibility: true }
      },
      {
        id: 'br-grid',
        type: 'buy-reviews',
        data: {},
        settings: { visibility: true }
      }
    ];

    await prisma.page.upsert({
      where: { slug: 'buy-reviews' },
      update: { sections: buyReviewsSections, draftSections: buyReviewsSections, title: 'Buy Reviews' },
      create: { title: 'Buy Reviews', slug: 'buy-reviews', sections: buyReviewsSections, draftSections: buyReviewsSections }
    });

    // 3. Refund Policy Page
    const refundPolicySections = [
      {
        id: 'rp-sec',
        type: 'refund-policy-section',
        data: {
          whenRefunds: [
            {
              title: "Reviews Not Yet Delivered – Order Still in Queue",
              body: "If your order has been placed and payment confirmed, but reviews have not gone live within 7 days from the date of order processing, you are eligible for a full refund if you choose to cancel before delivery begins. We understand that pending orders can sometimes feel uncertain. A pending status simply means your order is queued and awaiting processing. If you choose to cancel before delivery begins, our team will review and process your request accordingly.",
            },
            {
              title: "Google Review Conditions",
              body: "For Google review orders, refund eligibility depends on the plan selected at the time of purchase. We offer 7-days, 15-days, and 30-days plans, during which eligible review removals may first qualify for one-time replacement. Once the selected plan duration has passed from the order processing date, the order will no longer be eligible for refund requests.",
            },
            {
              title: "Unable to Execute the Order",
              body: "If, for any reason, we are unable to execute your order — whether due to a platform issue, a technical issue, or a gap in our delivery — you may qualify for a refund. No partial credits, no runaround.",
            },
            {
              title: "Delayed Order",
              body: "Once an order is placed, our team typically begins processing within 2–5 business days. If no work has been initiated and no communication has been sent to you within this window, you are fully entitled to request a refund. We hold ourselves accountable to this timeline.",
            },
            {
              title: "Review Retention Issues Within 30 Days",
              body: "If the reviews we delivered are removed from the platform within 30 days of your processing date, this falls within our coverage window. In this case, we will first attempt a one-time replacement. If we are unable to replace them, a refund will be considered for the affected portion of your order.",
            },
            {
              title: "Orders Marked \"Processing\"",
              body: "For orders currently in \"Processing\" status, refund requests can be submitted within 30 days of the original purchase date. If our team has initiated no work or review delivery during this window, you will qualify for a hassle-free refund.",
            },
            {
              title: "Business Profile Removal",
              body: "If the business profile associated with your order is deleted, suspended, or permanently removed during an active order, monetary refunds may not apply. We understand this puts you in a difficult position. In this case, we offer a full-service exchange. Your order value can be transferred to another business profile of your choice. You'll receive the same number of reviews for a different listing — no money lost, no order wasted.",
            },
          ],
          notEligible: [
            "Service delivery has already been completed.",
            "Order processing has already started successfully.",
            "Incorrect information was submitted during checkout.",
            "Platform-related moderation or visibility changes occur outside our direct control.",
            "Eligible replacement support has already been provided.",
            "Requests are submitted beyond the supported review period.",
          ],
          compliance: [
            "Fraudulent activity",
            "Abuse of services",
            "Submission of inaccurate business information",
            "Unauthorized usage",
            "Violations of third-party platform policies or terms"
          ],
          steps: [
            { step: "Step 1", title: "Contact Support", desc: "Send an email to support@getreviews.buzz from your registered email address, through which you processed your order request with us." },
            { step: "Step 2", title: "Mention Order Details", desc: "Clearly include the order number along with a short explanation of the issue you experienced with your order." },
            { step: "Step 3", title: "Add Refund Reason in Subject Line", desc: "To help us identify and review your request faster, mention the reason for your refund and order number clearly in the email subject line." },
            { step: "Step 4", title: "Internal Review & Verification", desc: "Once you've sent the email, our team will start reviewing your refund request. We'll check the order status, fulfillment progress, and refund eligibility conditions as outlined in the policy." },
            { step: "Step 5", title: "Refund Processing & Updates", desc: "If you're eligible for the refund, our support team will process your refund within 5–7 business days. All updates regarding the resolution and refund will be communicated through email." },
          ],
          contactEmail: "support@getreviews.buzz",
          contactTime: "Average Response Time: 24-48 Hours",
          contactPhone: "+1 430-233-5403",
          contactImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800&h=600",
          footerDate: "Last Updated: May 2026",
        },
        settings: { visibility: true }
      }
    ];

    await prisma.page.upsert({
      where: { slug: 'refund-policy' },
      update: { sections: refundPolicySections, draftSections: refundPolicySections, title: 'Refund Policy' },
      create: { title: 'Refund Policy', slug: 'refund-policy', sections: refundPolicySections, draftSections: refundPolicySections }
    });

    console.log('Functional pages seeded successfully');
  } catch (error) {
    console.error('Error seeding functional pages:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

seedFunctionalPages();
