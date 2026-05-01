"use client";

import SectionWithRightImage from "@/components/home/SectionWithRightImage";
import { HOW_IT_WORKS_DATA } from "@/lib/constants/pageData";

export default function HowItWorksPage() {
  const { hero } = HOW_IT_WORKS_DATA;

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
    </div>
  );
}