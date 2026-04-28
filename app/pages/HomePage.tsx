import StatsBar from "@/components/StatsBar";
import IconGrid from "@/components/IconGrid";
import CustomPlatform from "@/components/CustomPlatform";
import SectionWithLeftImage from "@/components/SectionWithLeftImage";
import SectionWithRightImage from "@/components/SectionWithRightImage";
import FaqSection from "@/components/FaqSection";
import { BuyReviewsSection } from "@/components/BuyReviewsSection";
import HeroBanner from "@/components/HeroBanner";

export default function HomePage() {
    return (
        <>
        <HeroBanner />
        <BuyReviewsSection />
        <CustomPlatform />
        
        <StatsBar />
        <IconGrid />
    
        <SectionWithRightImage />
        <SectionWithLeftImage />
        
        <FaqSection />
        </>
    );
}
