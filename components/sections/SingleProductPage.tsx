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
import HowItWorkCard from "@/components/sections/HowItWorkCard";
import CustomerReviews from "@/components/sections/CustomerReviews";
import FaqSection from "@/components/sections/FaqSection";
import SimilarProducts from "@/components/sections/SimilarProducts";
import CTAProduct from "@/components/sections/CTAProduct";

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

      {/* ── 2. Benefits Section ─────────────────────────────── */}
      <BenefitsSection
        id={`benefits-${productIdStr}`}
        data={{ platform: product.platform }}
        settings={{ padding: "80px 0", backgroundColor: "#FFFFFF", visibility: true }}
      />

      {/* ── 3. How It Works (uses Google Reviews defaults) ──── */}
      <HowItWorkCard
        id={`hiw-${productIdStr}`}
        data={{}}
        settings={{ padding: "80px 0", backgroundColor: "#FFFFFF", visibility: true }}
      />

      {/* ── 4. Customer Reviews (uses Google Reviews defaults) ── */}
      <CustomerReviews
        id={`cr-${productIdStr}`}
        data={{}}
        settings={{ padding: "80px 0", backgroundColor: "#FAFAF5", visibility: true }}
      />

      {/* ── 5. FAQ Section (uses Google Reviews defaults) ────── */}
      <FaqSection
        id={`faq-${productIdStr}`}
        data={{}}
        settings={{ padding: "50px 0", backgroundColor: "#faf8f7", visibility: true }}
      />

      {/* ── 6. Similar Products ──────────────────────────────── */}
      <SimilarProducts
        id={`sp-${productIdStr}`}
        data={{ excludeIds: [productIdStr] }}
        settings={{ padding: "60px 0", backgroundColor: "#FFFFFF", visibility: true }}
      />

      {/* ── 7. CTA Product (uses Google Reviews defaults) ───── */}
      <CTAProduct
        id={`cta-${productIdStr}`}
        data={{}}
        settings={{ padding: "80px 0", visibility: true }}
      />
    </div>
  );
}
