"use client";

import { useState, useEffect, useMemo } from "react";
import products from "@/lib/constants/products";
import { ProductCard } from "@/components/home/BuyReviewsSection";
import { SectionProps } from "@/types/section";

export default function YouMayAlsoLike({ data = {} }: SectionProps) {
  const { excludeIds = [] } = data;
  const [finalProducts, setFinalProducts] = useState<any[]>([]);
  const [selection, setSelection] = useState<Record<string, "onetime" | "monthly">>({});

  const serializedExcludeIds = excludeIds.join(",");

  const isGoogleCategory = useMemo(() => {
    return excludeIds.some((id: string | number) => 
      String(id).toLowerCase().includes('google') || Number(id) === 2
    );
  }, [serializedExcludeIds]);

  useEffect(() => {
    const structuralExclusions = excludeIds.map((id: string | number) => String(id).trim().toLowerCase());

    const applyColorStyleBypass = (item: any) => {
      let assignedId = Number(item.id);

      if (isNaN(assignedId)) {
        // FIX: We now hash the completely unique 'name' or 'title' (e.g., "5 Google Reviews") 
        // instead of the 'platform' ("google") so each variant calculates a distinct ID number.
        const uniqueStringIdentifier = String(item.name || item.title || item.id || "").toLowerCase();
        
        let hash = 0;
        for (let i = 0; i < uniqueStringIdentifier.length; i++) {
          hash = uniqueStringIdentifier.charCodeAt(i) + ((hash << 5) - hash);
        }
        // Maps the unique hash cleanly into your style dictionary indexes
        assignedId = Math.abs(hash) % 30; 
      }

      return {
        ...item,
        id: assignedId 
      };
    };

    const isMatch = (item: any) => {
      const itemPlatform = String(item.platform || "").toLowerCase();
      const itemId = String(item.id).toLowerCase();
      return structuralExclusions.includes(itemId) || structuralExclusions.includes(itemPlatform);
    };

    if (isGoogleCategory) {
      const googleAlternatives = products
        .filter((item) => {
          const platformName = String(item.platform || "").toLowerCase();
          const idName = String(item.id).toLowerCase();
          const isGoogle = platformName.includes("google") || idName.includes("google") || String(item.id) === "2";
          return isGoogle && !isMatch(item);
        })
        .map(applyColorStyleBypass);
      
      if (googleAlternatives.length > 0) {
        setFinalProducts(googleAlternatives.slice(0, 4));
        return;
      }
    }

    const basicFiltered = products
      .filter((item) => !isMatch(item))
      .map(applyColorStyleBypass);

    const randomizedFallback = [...basicFiltered]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    setFinalProducts(randomizedFallback);
    
  }, [serializedExcludeIds, isGoogleCategory]);

  if (finalProducts.length === 0) return null;

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="max-w-[1500px] mx-auto px-6">
        <h2 className="text-2xl lg:text-3xl font-semibold mb-8 text-[#333]">
          You May Also Like...
        </h2>
        <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0 m-0 items-stretch">
          {finalProducts.map((product, index) => (
            <ProductCard
              key={`${product.id}-${index}`} 
              product={product}
              selectedMode={selection[product.id] || null}
              onSelect={(mode) => setSelection(prev => ({ ...prev, [product.id]: mode }))}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}