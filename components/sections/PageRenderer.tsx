// Triggering HMR refresh for new sections
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
            data={section.data} 
            settings={section.settings} 
            isEditing={isEditing} 
          />
        );

        return renderWrapper ? renderWrapper(section, children) : children;
      })}
    </div>
  );
}
