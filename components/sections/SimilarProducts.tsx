"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import products from "@/lib/constants/products";
import { ProductCard } from "@/components/home/BuyReviewsSection";
import { SectionProps } from "@/types/section";

const castedProducts = products as any[];

const GOOGLE_REGEX = /(google|gmb|maps|gps|play[\s\-]?store|local[\s\-]?guide|lsa)/i;
const GOOGLE_REVIEWS_REGEX = /google[\s\-]?reviews?/i;
const GOOGLE_IDS = new Set([
  "buy-google-reviews",
  "buy-google-gps-reviews",
  "buy-google-local-guide-reviews",
  "buy-google-lsa-reviews",
  "buy-google-playstore-reviews",
]);

function isGoogleRelated(item: any): boolean {
  if (!item) return false;
  const id = String(item.id || "").trim().toLowerCase();
  return (
    GOOGLE_IDS.has(id) ||
    GOOGLE_REGEX.test(item.platform || "") ||
    GOOGLE_REVIEWS_REGEX.test(item.platform || "") ||
    GOOGLE_REGEX.test(item.slug || "") ||
    GOOGLE_REGEX.test(item.name || "")
  );
}

function getStyleId(item: any): number {
  const base = String(item.slug || item.id || item.name || "");
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash * 33) ^ base.charCodeAt(i);
  }
  return Math.abs(hash) % 12;
}

export default function YouMayAlsoLike({ data = {} }: SectionProps) {
  const { excludeIds = [] } = data as { excludeIds?: (string | number)[] };
  const pathname = usePathname();
  const [selection, setSelection] = useState<Record<string, "onetime" | "monthly">>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const exclusionSet = useMemo(() => {
    return new Set(
      excludeIds.map((id: string | number) => String(id).trim().toLowerCase())
    );
  }, [excludeIds]);

  const finalProducts = useMemo(() => {
    if (!mounted || !pathname) return [];

    // Detect if current page is a Google ecosystem page
    const isGoogleCategory =
      GOOGLE_REGEX.test(pathname.toLowerCase()) ||
      GOOGLE_REVIEWS_REGEX.test(pathname.toLowerCase()) ||
      excludeIds.some((id: string | number) =>
        GOOGLE_IDS.has(String(id).trim().toLowerCase())
      );

    const filteredPool = castedProducts.filter((item: any) => {
      const pId = String(item.id || "").trim().toLowerCase();

      // Rule A: Drop if explicitly passed in excludeIds from the page
      if (exclusionSet.has(pId)) {
        return false;
      }

      // Rule B: Drop if product id appears in the current URL path
      // e.g. pathname = "/buy-google-reviews" will match id = "buy-google-reviews"
      if (pathname.toLowerCase().includes(pId)) {
        return false;
      }

      return true;
    });

    const googleItems    = filteredPool.filter(isGoogleRelated);
    const nonGoogleItems = filteredPool.filter((item: any) => !isGoogleRelated(item));

    let selectionPool = isGoogleCategory ? googleItems : nonGoogleItems;
    if (selectionPool.length === 0) selectionPool = isGoogleCategory ? nonGoogleItems : googleItems;
    if (selectionPool.length === 0) selectionPool = filteredPool;

    return [...selectionPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
      .map((item: any) => ({
        ...item,
        styleId: getStyleId(item),
      }));

  }, [mounted, pathname, exclusionSet, excludeIds]);

  if (!mounted || finalProducts.length === 0) return null;

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="max-w-[1500px] mx-auto px-6">
        <h2 className="text-2xl lg:text-3xl font-semibold mb-8 text-[#333]">
          You May Also Like...
        </h2>
        <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0 m-0 items-stretch">
          {finalProducts.map((product: any, index: number) => (
            <ProductCard
              key={`${pathname}-${product.slug}-${index}`}
              product={product}
              selectedMode={selection[product.slug] || null}
              onSelect={(mode) =>
                setSelection((prev) => ({
                  ...prev,
                  [product.slug]: mode,
                }))
              }
            />
          ))}
        </ul>
      </div>
    </section>
  );
}