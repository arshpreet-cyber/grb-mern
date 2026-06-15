import Hero from './Hero';
import TextSection from './TextSection';
import ImageSection from './ImageSection';
import BuyReviewsSectionBuilder from './BuyReviewsSection';
import CustomPlatform from './CustomPlatform';
import StatsBar from './StatsBar';
import ImageTextSection from './ImageTextSection';
import IconGrid from './IconGrid';
import FaqSection from './FaqSection';
import BlogSection from './BlogSection';
import PartnerLogosSection from './PartnerLogosSection';
import VisionMissionSectionBuilder from './VisionMissionSectionBuilder';
import CTABannerSection from './CTABannerSection';
import ProductBanner from './ProductBanner';
import SimilarProducts from './SimilarProducts';
import HowItWorkCard from './HowItWorkCard';
import CustomerReviews from './CustomerReviews';
import steps from './steps';
import CTAProduct from './CTAProduct';
import RatingCalculator from './RatingCalculator';
import RatingStatsBar from './RatingStatsBar';
import RatingCTA from './RatingCTA';
import SitemapSection from './SitemapSection';
import BenefitsSection from './BenefitsSection';
import SafeReviewsCarousel from './SafeReviewsCarousel';
import OrganicDrawbacks from './OrganicDrawbacks';
import RefundPolicySection from './RefundPolicySection';
import HowItWorksHero from './HowItWorksHero';
import HowItWorksProcess from './HowItWorksProcess';
import HowItWorksMoreThanService from './HowItWorksMoreThanService';
import HowItWorksBeforeAfter from './HowItWorksBeforeAfter';
import HowItWorksStandards from './HowItWorksStandards';
import HowItWorksWhyTrust from './HowItWorksWhyTrust';
import HowItWorksSolutions from './HowItWorksSolutions';
import HowItWorksCTA from './HowItWorksCTA';
import { Section } from '@/lib/redux/features/pageEditorSlice';

const sectionMap: Record<string, React.FC<any>> = {
  hero: Hero,
  text: TextSection,
  image: ImageSection,
  'buy-reviews': BuyReviewsSectionBuilder,
  'custom-platform': CustomPlatform,
  'stats-bar': StatsBar,
  'image-text': ImageTextSection,
  'icon-grid': IconGrid,
  'faq-section': FaqSection,
  'blog-section': BlogSection,
  'partner-logos': PartnerLogosSection,
  'vision-mission': VisionMissionSectionBuilder,
  'cta-banner': CTABannerSection,
  'productbanner': ProductBanner,
  'similar-products': SimilarProducts,
  'how-it-work-card': HowItWorkCard,
  'customer-reviews': CustomerReviews,
  'steps': steps,
  'cta-product': CTAProduct,
  'rating-calculator': RatingCalculator,
  'rating-stats-bar': RatingStatsBar,
  'rating-cta': RatingCTA,
  sitemap: SitemapSection,
  'benefits-section': BenefitsSection,
  'safe-reviews-carousel': SafeReviewsCarousel,
  'organic-drawbacks': OrganicDrawbacks,
  'refund-policy-section': RefundPolicySection,
  'how-it-works-hero': HowItWorksHero,
  'how-it-works-process': HowItWorksProcess,
  'how-it-works-more-than-service': HowItWorksMoreThanService,
  'how-it-works-before-after': HowItWorksBeforeAfter,
  'how-it-works-standards': HowItWorksStandards,
  'how-it-works-why-trust': HowItWorksWhyTrust,
  'how-it-works-solutions': HowItWorksSolutions,
  'how-it-works-cta': HowItWorksCTA,
};

interface PageRendererProps {
  sections: Section[];
  isEditing?: boolean;
  renderWrapper?: (section: Section, children: React.ReactNode) => React.ReactNode;
}

export default function PageRenderer({ sections, isEditing = false, renderWrapper }: PageRendererProps) {
  return (
    <div className="w-full">
      {sections.map((section) => {
        const SectionComponent = sectionMap[section.type];
        
        if (!SectionComponent) {
          return (
            <div key={section.id} className="p-10 border border-red-200 bg-red-50 text-red-500">
              Unknown section type: {section.type}
            </div>
          );
        }

        const children = (
          <SectionComponent 
            key={section.id} 
            id={section.id} 
            data={section.type === 'similar-products'
              ? { ...section.data, excludeIds: sections.filter((s) => s.type === 'productbanner').map((s) => s.data?.productId).filter(Boolean) }
              : section.data
            }
            settings={section.settings} 
            isEditing={isEditing} 
          />
        );

        return renderWrapper ? renderWrapper(section, children) : children;
      })}
    </div>
  );
}
