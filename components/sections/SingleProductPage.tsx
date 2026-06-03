"use client";

/**
 * SingleProductPage — Static fallback component for product pages.
 * 
 * Works exactly like the homepage's static fallback: renders section components
 * directly with props, instead of going through the PageRenderer JSON system.
 * 
 * Used when a product exists in the DB Product table but doesn't yet have
 * a Page record with editable sections.
 */

import ProductBanner from "@/components/sections/ProductBanner";
import BenefitsSection from "@/components/sections/BenefitsSection";
import CustomerReviews from "@/components/sections/CustomerReviews";
import FaqSection from "@/components/sections/FaqSection";
import SimilarProducts from "@/components/sections/SimilarProducts";
import CTAProduct from "@/components/sections/CTAProduct";
import SafeReviewsCarousel from "@/components/sections/SafeReviewsCarousel";
import OrganicDrawbacks from "@/components/sections/OrganicDrawbacks";
import ImageTextSection from "@/components/sections/ImageTextSection";
import StepsSection from "@/components/sections/steps";

interface ProductData {
  id: number | string;
  slug: string;
  platform: string;
  image: string;
  desc?: string;
  oneTimePrice: number;
  subscribePrice: number;
  minimumQuantity: number;
}

export default function SingleProductPage({ product }: { product: ProductData }) {
  const productIdStr = String(product.slug || product.id);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">

      {/* ── 1. Product Banner / Hero ─────────────────────────── */}
      <ProductBanner
        id={`pb-${productIdStr}`}
        data={{
          productId: productIdStr,
          title: product.platform,
          description: product.desc || `Boost your online reputation with authentic ${product.platform} from real, verified accounts.`,
          image: product.image,
          pricePerReview: product.oneTimePrice,
          ratingText: "4.9 · 2,847+ Reviews",
          checklist: [
            "Real, verified accounts — no bots or fakes",
            "Gradual drip-feed for natural-looking growth",
            "Custom written content tailored to your brand",
            "Free replacements within 30 days",
          ],
          stats: [
            {
              img: "https://beta.getreviews.buzz/storage/app/blog/0000064001779424671_costumer-1.svg",
              val: "10K+",
              lbl: "Happy Clients",
            },
            {
              img: "https://beta.getreviews.buzz/storage/app/blog/0768381001779424865_Group-1000006417.svg",
              val: "99%",
              lbl: "Retention",
            },
            {
              img: "https://beta.getreviews.buzz/storage/app/blog/0686695001779424894_Group-1000006418.svg",
              val: "100%",
              lbl: "Safe & secure",
            },
          ],
        }}
        settings={{ padding: "60px 0 100px", visibility: true }}
      />

      {/* ── 2. Similar Products ──────────────────────────────── */}
      <SimilarProducts
        id={`sp-${productIdStr}`}
        data={{ excludeIds: [productIdStr] }}
        settings={{ padding: "60px 0", backgroundColor: "#FFFFFF", visibility: true }}
      />

      {/* ── 3. Image Text Section (1st instance) ─────────────────── */}
      <ImageTextSection
        id={`imgtext-1-${productIdStr}`}
        data={{
          title: `How We Help You Manage <br/> <span class='font-semibold'>${product.platform} Reviews</span>`,
          content: `<p>We take a strategic, secure approach to ${product.platform} reputation management that improves your profile while keeping reviews authentic.</p><p>Our custom reviews accurately reflect customer experiences, boosting credibility and trustworthiness.</p>`,
          image: "/uploads/media/safe_reviews_graphic.png",
          imagePosition: "left",
          showButton: false,
        }}
        settings={{ padding: "80px 0", backgroundColor: "#FFFFFF", visibility: true }}
      />

      {/* ── 4. Steps Section ─────────────────────────────────── */}
      <StepsSection
        id={`steps-${productIdStr}`}
        data={{
          heading: `Why Get Reviews Buzz\nis a Trusted Platform\nFor ${product.platform}`,
          subheading: `At Get Reviews Buzz, we offer a dependable and efficient solution for businesses looking to boost their ${product.platform} Profile with genuine, high-quality reviews.`,
        }}
        settings={{ padding: "80px 0", backgroundColor: "#FFFFFF", visibility: true }}
      />

      {/* ── 5. Benefits Section ─────────────────────────────── */}
      <BenefitsSection
        id={`benefits-${productIdStr}`}
        data={{ platform: product.platform }}
        settings={{ padding: "80px 0", backgroundColor: "#FFFFFF", visibility: true }}
      />

      {/* ── 6. Organic Drawbacks Section ────────────────────────── */}
      <OrganicDrawbacks
        id={`drawbacks-${productIdStr}`}
        data={{ platform: product.platform }}
        settings={{ padding: "80px 0", backgroundColor: "#FFFFFF", visibility: true }}
      />

      {/* ── 7. Safe Reviews Carousel ───────────────────────────── */}
      <SafeReviewsCarousel
        id={`safe-reviews-${productIdStr}`}
        data={{ platform: product.platform }}
        settings={{ padding: "80px 0", visibility: true }}
      />

      {/* ── 8. Image Text Section (2nd instance) ─────────────────── */}
      <ImageTextSection
        id={`imgtext-2-${productIdStr}`}
        data={{
          title: `We Focus on Building <br/> <span class='font-semibold'>a Reputation for Your Business</span>`,
          content: `<p>A well-reviewed business will appear higher in search results, making it easier for potential customers to find.</p><p>More reviews boost your company's reliability and local-global reach. People read reviews before they buy or visit a business.</p>`,
          image: "https://getreviews.buzz/storage/app/blog/0547241001776770835_0936012001776065359_right-img.png",
          imagePosition: "left",
          buttonText: "Read More",
          buttonLink: "/",
          showButton: true,
        }}
        settings={{ padding: "80px 0", backgroundColor: "#FFFFFF", visibility: true }}
      />

      {/* ── 9. CTA Product ───────────────────────────────────── */}
      <CTAProduct
        id={`cta-${productIdStr}`}
        data={{}}
        settings={{ padding: "80px 0", visibility: true }}
      />

      {/* ── 10. Customer Reviews ─────────────────────────────── */}
      <CustomerReviews
        id={`cr-${productIdStr}`}
        data={{}}
        settings={{ padding: "80px 0", backgroundColor: "#FAFAF5", visibility: true }}
      />

      {/* ── 11. FAQ Section ──────────────────────────────────── */}
      <FaqSection
        id={`faq-${productIdStr}`}
        data={{}}
        settings={{ padding: "50px 0", backgroundColor: "#faf8f7", visibility: true }}
      />
    </div>
  );
}
