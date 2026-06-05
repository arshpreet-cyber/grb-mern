'use client';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { 
  setPage, 
  setEditMode, 
  reorderSections, 
  addSection,
  setIsSaving
} from '@/lib/redux/features/pageEditorSlice';
import PageSettingsPanel from './PageSettingsPanel';
import Sidebar from './Sidebar';
import PageRenderer from '../sections/PageRenderer';
import EditableSection from './EditableSection';
import SectionSelector from './SectionSelector';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Save, Loader2, ExternalLink, Smartphone, Monitor, Laptop, PanelRightClose, PanelRight, Settings } from 'lucide-react';

interface EditorWrapperProps {
  initialPage: any;
}

export default function EditorWrapper({ initialPage }: EditorWrapperProps) {
  const dispatch = useAppDispatch();
  const { sections, editMode, isSaving, title, slug, id, meta } = useAppSelector((state) => state.pageEditor);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (initialPage) {
      const editorSections = (initialPage.draftSections && initialPage.draftSections.length > 0)
        ? initialPage.draftSections
        : initialPage.sections;

      const pagePayload = {
        id: initialPage.id,
        title: initialPage.title,
        slug: initialPage.slug,
        sections: editorSections || [],
        meta: {
          metaTitle: initialPage.metaTitle || '',
          metaDescription: initialPage.metaDescription || '',
          keywords: initialPage.keywords || '',
          canonicalLink: initialPage.canonicalLink || '',
          robotsText: initialPage.robotsText || 'index, follow',
          inSitemap: initialPage.inSitemap ?? true,
          titleImage: initialPage.titleImage || '',
          opengraphImage: initialPage.opengraphImage || '',
          schemaCode: initialPage.schemaCode || '',
          headerScript: initialPage.headerScript || '',
          bodyScript: initialPage.bodyScript || '',
          footerScript: initialPage.footerScript || '',
          status: initialPage.status || 'Draft',
        },
      };

      // Check for local storage autosave
      const localKey = `grb_page_autosave_${initialPage.id}`;
      const savedData = localStorage.getItem(localKey);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (window.confirm("We found unsaved changes for this page from a previous session. Would you like to restore them?")) {
            pagePayload.sections = parsed.sections || pagePayload.sections;
            pagePayload.title = parsed.title || pagePayload.title;
            pagePayload.slug = parsed.slug || pagePayload.slug;
            if (parsed.meta) pagePayload.meta = { ...pagePayload.meta, ...parsed.meta };
          } else {
            localStorage.removeItem(localKey);
          }
        } catch(e) {}
      }

      dispatch(setPage(pagePayload));
    }
  }, [initialPage, dispatch]);

  // Autosave to localStorage on changes
  useEffect(() => {
    if (!id || sections.length === 0) return;
    const localKey = `grb_page_autosave_${id}`;
    const saveData = {
      title,
      slug,
      sections,
      meta,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(localKey, JSON.stringify(saveData));
  }, [id, title, slug, sections, meta]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      dispatch(reorderSections(arrayMove(sections, oldIndex, newIndex)));
    }
  };

  const serializeData = (data: any) => {
    return JSON.parse(JSON.stringify(data, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
  };

  const savePage = async (publish = false) => {
    dispatch(setIsSaving(true));
    try {
      const pageSlug = slug || initialPage.slug;
      const pageId = id || initialPage.id;
      const response = await fetch(`/api/page/${encodeURIComponent(pageSlug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, sections: serializeData(sections), title, publish, meta, slug }),
      });
      if (!response.ok) {
        let errorMessage = 'Failed to save';
        let responseText = '';
        try {
          responseText = await response.text();
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.code 
            ? `Database Error [${errorData.code}]: ${errorData.details || errorMessage}`
            : (errorData.details || errorData.error || errorMessage);
          

        } catch (e) {
          errorMessage = `Server Error: ${response.status} ${response.statusText} for slug '${pageSlug}' id '${pageId}'. Response: ${responseText.substring(0, 100)}`;
        }
        throw new Error(errorMessage);
      }
      alert(publish ? 'Page published to live site!' : 'Draft saved successfully!');
      if (id) {
        localStorage.removeItem(`grb_page_autosave_${id}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      dispatch(setIsSaving(false));
    }
  };

  const onAddSection = (type: string, initialData?: any) => {
    let data = initialData || {};
    if (!initialData) {
      if (type === 'hero') data = { title: 'New Hero Section', subtitle: 'Subtitle goes here' };
      if (type === 'text') data = { content: '<h2>New Text Section</h2><p>Start typing...</p>' };
      if (type === 'image') data = { imageUrl: '', alt: 'Image description' };
      if (type === 'sitemap') {
        data = {
          title: 'Site Map',
          description: 'A complete overview of all pages on our website.',
          mainPages: [
            { label: 'Home', url: '/' },
            { label: 'About Us', url: '/about-us/' },
            { label: 'How It Works', url: '/how-it-works/' },
            { label: 'Contact Us', url: '/contact-us/' },
            { label: 'Schedule Appointment', url: '/schedule-appointment/' },
            { label: 'Blog', url: '/blog/' },
            { label: 'Privacy Policy', url: '/privacy-policy/' },
            { label: 'Terms & Conditions', url: '/terms-conditions/' },
          ],
          caseStudies: [
            { label: 'All Case Studies', url: '/case-study/' },
            { label: 'HVAC', url: '/case-study/hvac/' },
            { label: 'Zenison Spa Therapy', url: '/case-study/zenison-spa-therapy/' },
            { label: 'Investigation Hotline', url: '/case-study/investigation-hotline/' },
            { label: 'Locks and Door', url: '/case-study/locks-and-door/' },
            { label: 'Locksmith', url: '/case-study/locksmith/' },
            { label: 'Home Decor', url: '/case-study/home-decor/' },
            { label: 'Blogging Website', url: '/case-study/blogging-website/' },
            { label: 'Automotive', url: '/case-study/automotive/' },
            { label: 'Finance', url: '/case-study/finance/' },
            { label: 'Auto Parts', url: '/case-study/auto-parts/' },
            { label: 'Universal Pest Control', url: '/case-study/universal-pest-control/' },
            { label: 'Auto Protect', url: '/case-study/auto-protect/' },
            { label: 'iRetex Premier', url: '/case-study/iretex-premier/' },
            { label: 'Water WorkzTX', url: '/case-study/water-workztx/' },
            { label: 'She Lives Beauty', url: '/case-study/she-lives-beauty/' },
            { label: 'GK Blinds', url: '/case-study/gkblinds/' },
            { label: '911 Garage Door Pros', url: '/case-study/911-garage-door-pros/' },
            { label: 'Just Voda', url: '/case-study/just-voda/' },
            { label: 'Rehvive', url: '/case-study/rehvive/' },
            { label: 'Lifecore Flooring', url: '/case-study/lifecore-flooring/' },
            { label: 'Dollar General', url: '/case-study/dollar-general/' },
          ],
          reviewProducts: [
            { label: 'Buy Reviews Online', url: '/services/buy-reviews-online/' },
            { label: 'Ambition Box Reviews', url: '/products/ambition-box-reviews/' },
            { label: 'Apartment Reviews', url: '/products/buy-apartment-reviews/' },
            { label: 'AutoTrader Reviews', url: '/products/autotrader-reviews/' },
            { label: 'Avvo Reviews', url: '/products/avvo-reviews/' },
            { label: 'Bark Reviews', url: '/products/bark-reviews/' },
            { label: 'BBB Reviews', url: '/products/buy-bbb-reviews/' },
            { label: 'Birdeye Reviews', url: '/products/birdeye-reviews/' },
            { label: 'Booking Reviews', url: '/products/booking-com-reviews/' },
            { label: 'BookMyShow Reviews', url: '/products/bookmyshow-reviews/' },
            { label: 'BuildZoom Reviews', url: '/products/buildzoom-reviews/' },
            { label: 'CarGurus Reviews', url: '/products/cargurus-reviews/' },
            { label: 'ChamberofCommerce Reviews', url: '/products/chamberofcommerce/' },
            { label: 'Chrome Extension Reviews', url: '/products/buy-chrome-extension-reviews/' },
            { label: 'Consumeraffairs.com Reviews', url: '/products/consumeraffairs-com-reviews/' },
            { label: 'CustomerLobby Reviews', url: '/products/customerlobby-reviews/' },
            { label: 'Dealerrater Reviews', url: '/products/dealerrater-reviews/' },
            { label: 'Designrush Reviews', url: '/products/designrush-reviews/' },
            { label: 'Energysage Reviews', url: '/products/energysage-reviews/' },
            { label: 'Expedia Reviews', url: '/products/expedia-reviews/' },
            { label: 'Facebook Reviews', url: '/products/facebook-reviews/' },
            { label: 'Findlaw Reviews', url: '/products/findlaw-reviews/' },
            { label: 'FoodDrop Reviews', url: '/products/fooddrop-reviews/' },
            { label: 'Free Google Reviews', url: '/grb/product/get-free-google-reviews/' },
            { label: 'Glassdoor Reviews', url: '/products/buy-glassdoor-reviews/' },
            { label: 'Google GPS Reviews', url: '/products/google-gps-reviews/' },
            { label: 'Google Local Guide Reviews', url: '/products/buy-google-local-guide-reviews/' },
            { label: 'Google LSA Reviews', url: '/products/google-lsa-reviews/' },
            { label: 'Google Playstore Reviews', url: '/products/buy-google-playstore-reviews/' },
            { label: 'Google Reviews', url: '/products/buy-google-review/' },
            { label: 'Healthgrades Reviews', url: '/products/healthgrades-reviews/' },
            { label: 'HelloPeter.com Reviews', url: '/products/hellopeter-reviews/' },
            { label: 'Home Advisor Reviews', url: '/products/buy-home-advisor-reviews/' },
            { label: 'Home Star Reviews', url: '/products/buy-home-star-reviews/' },
            { label: 'HomeToGo Reviews', url: '/products/hometogo-reviews/' },
            { label: 'Homelight Reviews', url: '/products/buy-homelight-reviews/' },
            { label: 'Hotels Reviews', url: '/products/hotels-com-reviews/' },
            { label: 'Houzz Reviews', url: '/products/buy-houzz-reviews/' },
            { label: 'IMDb Reviews', url: '/products/imdb-reviews/' },
            { label: 'Indeed Reviews', url: '/products/indeed-reviews/' },
            { label: 'JobStreet Reviews', url: '/products/jobstreet-reviews/' },
            { label: 'Magikpet Reviews', url: '/products/magikpet-reviews/' },
            { label: 'Makeupalley Reviews', url: '/products/makeupalley-reviews/' },
            { label: 'Mortgage Matchup Reviews', url: '/products/mortgage-matchupreviews/' },
            { label: 'Networx Reviews', url: '/products/networx-reviews/' },
            { label: 'Niche.com Reviews', url: '/products/niche-reviews/' },
            { label: 'Product Reviews', url: '/products/product-reviews/' },
            { label: 'QuickBooks Review', url: '/products/quickbooks-review/' },
            { label: 'RateMds Reviews', url: '/products/ratemds-reviews/' },
            { label: 'RealEstateAgents Reviews', url: '/products/realestateagents-reviews/' },
            { label: 'RealSelf Reviews', url: '/products/realself-reviews/' },
            { label: 'Realtor Reviews', url: '/products/buy-realtor-reviews/' },
            { label: 'Rehab.com Reviews', url: '/products/rehab-reviews/' },
            { label: 'ReportTotal Reviews', url: '/products/reporttotal-reviews/' },
            { label: 'Review Centre Reviews', url: '/products/review-centre-reviews/' },
            { label: 'Reviews.io Reviews', url: '/products/reviews-io-reviews/' },
            { label: 'REW Reviews', url: '/products/rew-reviews/' },
            { label: 'SaaSHub Reviews', url: '/products/saashub-reviews/' },
            { label: 'Scamvoid Reviews', url: '/products/scamvoid-reviews/' },
            { label: 'Seek.com Reviews', url: '/products/seek-com/' },
            { label: 'Sitejabber Reviews', url: '/products/sitejabber-reviews/' },
            { label: 'Solar Choice', url: '/products/solar-choice/' },
            { label: 'Solar Reviews', url: '/products/solarreviews/' },
            { label: 'Sortlist Reviews', url: '/products/sortlist-reviews/' },
            { label: 'Source Forge Reviews', url: '/products/source-forge-reviews/' },
            { label: 'Spotify', url: '/products/spotify/' },
            { label: 'Thumbtack Reviews', url: '/products/thumbtack-reviews/' },
            { label: 'TopSEOs Reviews', url: '/products/topseos-reviews/' },
            { label: 'Transport Reviews', url: '/products/transport-reviews/' },
            { label: 'TrustPilot Reviews', url: '/products/buy-trustpilot-reviews/' },
            { label: 'Trustpilot Verified Reviews', url: '/products/trustpilot-verified-reviews/' },
            { label: 'Trustedpros Reviews', url: '/products/trustedpros/' },
            { label: 'UpCity Reviews', url: '/products/upcity-reviews/' },
            { label: 'Vitals Reviews', url: '/products/vitals-com-reviews/' },
            { label: 'Web Retailer Reviews', url: '/products/web-retailer-reviews/' },
            { label: 'WebMD Reviews', url: '/products/webmd-reviews/' },
            { label: 'WeddingWire Reviews', url: '/products/weddingwire-reviews/' },
            { label: 'WYL.co Reviews', url: '/products/wyl-page-reviews/' },
            { label: 'YellowPages Reviews', url: '/products/buy-yellowpages-reviews/' },
            { label: 'Yelp Reviews', url: '/products/buy-5-star-positive-yelp-reviews/' },
            { label: 'Zillow Reviews', url: '/products/buy-zillow-reviews/' },
          ],
        };
      }
      if (type === 'benefits-section') {
        data = {
          heading: 'Benefits of Buying Google Reviews',
          subheading: 'Below are the advantages of buying Google reviews online, demonstrating how it improves your business profile:',
          centerImage: '/uploads/media/benefits_center_image.png',
          benefits: [
            {
              badge: "01",
              title: "LOCAL SEO RANKINGS",
              description: "Google uses reviews as a ranking factor for local searches. A higher Google Business Profile ranking will put you in the top results when prospective clients look for businesses similar to yours."
            },
            {
              badge: "02",
              title: "IMPROVE ONLINE VISIBILITY",
              description: "A well reviewed business will appear higher in Google search results, making it easier for potential customers to find. More reviews boost your company's reliability and local-global reach."
            },
            {
              badge: "03",
              title: "BUILD TRUST",
              description: "People read reviews before they buy or visit a business. Paid Google reviews reassure potential customers about your quality and dependability, leading them to choose you over competitors."
            },
            {
              badge: "04",
              title: "INCREASE CONVERSIONS",
              description: "Reviews are social proof and influence buying decisions. Businesses that receive more Google 5 star reviews have higher conversion rates because customers feel more confident in their choices."
            }
          ]
        };
      }
      if (type === 'safe-reviews-carousel') {
        data = {
          slides: [
            {
              heading: "How We Provide Safe<br/>And <strong>Authentic Google Reviews</strong>",
              subheading: "We take a strategic, secure approach to Google reputation management that improves your profile while keeping reviews authentic.",
              listTitle: "Here's how we keep Google reviews safe and authentic:",
              layout: "checklist",
              features: [
                {
                  title: "Accounts That Are Both Legitimate and Active",
                  desc: "Our reviews are provided by genuine, geographically relevant profiles with established activity, ensuring that they complement organic customer feedback."
                },
                {
                  title: "Customized Reviews",
                  desc: "Our customized reviews accurately reflect customer experiences, boosting credibility and trustworthiness."
                },
                {
                  title: "Delivery Occurs Gradually and Naturally",
                  desc: "To maintain authenticity, reviews are posted in a consistent pattern over time, avoiding sudden spikes that may raise suspicion."
                }
              ],
              image: "/uploads/media/safe_reviews_graphic.png"
            },
            {
              heading: "Achieve Business Growth<br/>When <strong>You Manage Google Reviews</strong>",
              layout: "paragraphs",
              features: [
                {
                  desc: "Buying Google reviews online is not only a good way to improve your brand's image, but it also helps to attract more customers to your store, both online and offline. Our Google review management services help your brand stand out in the crowded digital landscape."
                },
                {
                  desc: "By using our buy Google reviews service, you can get genuine feedback from local profiles at a low cost to help your business succeed."
                },
                {
                  desc: "We help professional service providers rank higher in local searches by buying Google 5-star reviews for their Google Business Profiles. High-quality Google reviews ensure customer satisfaction and maximize your brand's influence in the target market."
                }
              ],
              button: {
                text: "Get a Quote",
                link: "/contact-us"
              },
              image: "/uploads/media/safe_reviews_graphic.png"
            },
            {
              heading: "Should You Proactively Get Reviews<br/>or <strong>Rely on Organic Google Reviews?</strong>",
              layout: "paragraphs",
              features: [
                {
                  desc: "Are you unsure whether to pay for Google reviews or wait for them to appear organically? Organic reviews are valuable but slow, while a structured plan to generate Google reviews delivers consistent results."
                },
                {
                  desc: "This delay can have an impact on your company's growth, particularly if you're in a competitive market. Buying Google reviews instantly boosts your business's credibility, improves search rankings, and attracts more customers to your GMB profile."
                },
                {
                  desc: "Unlike organic reviews, buying reviews guarantees consistent and strategic positive feedback, higher ratings, and a strong online presence."
                },
                {
                  desc: "Many businesses choose to buy Google 5-star reviews to increase brand trust and stay ahead of competitors. When done correctly with high-quality, real-looking reviews, this approach improves your reputation and reinforces customer confidence."
                }
              ],
              image: "/uploads/media/safe_reviews_graphic.png"
            }
          ]
        };
      }
      if (type === 'organic-drawbacks') {
        data = {
          heading: "",
          subheading: "",
          cards: [
            {
              title: "Slow and Unpredictable Growth",
              iconType: "chart",
              paragraphs: [
                "Obtaining organic reviews necessitates that customers take the initiative to provide feedback, which can be a slow and inconsistent process.",
                "Since many happy consumers just don't write reviews, it can be challenging to build a strong online reputation fast."
              ]
            },
            {
              title: "Vulnerable to Negative Feedback",
              iconType: "warning",
              paragraphs: [
                "A single disgruntled customer or malicious competitor can easily damage your score. Without a steady stream of positive feedback, your rating suffers disproportionately.",
                "Relying on organic reviews means you have no control over the frequency and timing of reviews to balance negative feedback."
              ]
            },
            {
              title: "Outpaced by Competitors",
              iconType: "competition",
              paragraphs: [
                "Competitors who actively acquire reviews will quickly outrank you in search visibility and local map pack rankings.",
                "If you rely solely on natural review growth, it could take years to reach the rating volume that your competitors achieve in weeks."
              ]
            }
          ]
        };
      }
    }

    dispatch(addSection({ type, data }));
    setIsSelectorOpen(false);
  };

  const currentSections = sections.length > 0 ? sections : (
    (initialPage.draftSections && initialPage.draftSections.length > 0)
      ? initialPage.draftSections
      : initialPage.sections
  ) || [];

  return (
    <div className="flex h-screen bg-[#F4F4F4] overflow-hidden font-[Poppins]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor Toolbar - Premium Light Theme */}
        <header className="h-20 bg-white text-[#1a1a1a] px-8 flex items-center justify-between z-[110] shadow-md border-b border-black/5">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#fc0] rounded-2xl flex items-center justify-center shadow-lg shadow-[#fc0]/20">
                <span className="text-[#1a1a1a] font-black text-xl">G</span>
              </div>
              <div className="flex flex-col">
                <h1 className="font-black text-base tracking-tight text-[#1a1a1a]">{title || initialPage.title}</h1>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-black/30 font-bold uppercase tracking-[0.15em]">
                    {slug === 'home' ? 'Main Site' : slug}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-black/10" />
                  <span className="text-[10px] text-[#fc0] font-black uppercase tracking-[0.15em] bg-[#fc0]/10 px-2 py-0.5 rounded-full">
                    {editMode ? 'Design Mode' : 'Preview Mode'}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-10 w-px bg-black/5 mx-2" />

            {/* Device Switcher */}
            <div className="flex bg-black/5 p-1 rounded-2xl border border-black/5">
              <button 
                onClick={() => setViewMode('mobile')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'mobile' ? 'bg-white text-[#fc0] shadow-sm' : 'text-black/30 hover:text-black/60'}`}
                title="Mobile View"
              >
                <Smartphone size={18} />
              </button>
              <button 
                onClick={() => setViewMode('tablet')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'tablet' ? 'bg-white text-[#fc0] shadow-sm' : 'text-black/30 hover:text-black/60'}`}
                title="Tablet View"
              >
                <Laptop size={18} />
              </button>
              <button 
                onClick={() => setViewMode('desktop')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'desktop' ? 'bg-white text-[#fc0] shadow-sm' : 'text-black/30 hover:text-black/60'}`}
                title="Desktop View"
              >
                <Monitor size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex bg-black/5 p-1 rounded-2xl border border-black/5">
              <button 
                onClick={() => dispatch(setEditMode(true))}
                className={`px-6 py-2 text-xs font-black rounded-xl transition-all ${editMode ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-black/30 hover:text-black/60'}`}
              >
                BUILD
              </button>
              <button 
                onClick={() => dispatch(setEditMode(false))}
                className={`px-6 py-2 text-xs font-black rounded-xl transition-all ${!editMode ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-black/30 hover:text-black/60'}`}
              >
                PREVIEW
              </button>
            </div>

            <div className="h-10 w-px bg-black/5 mx-1" />

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 text-black/30 hover:text-[#fc0] hover:bg-black/5 rounded-2xl transition-all"
              title="Page Settings & SEO"
            >
              <Settings size={20} />
            </button>

            <button 
              onClick={() => window.open(`/${slug === 'home' ? '' : slug}`, '_blank')}
              className="p-3 text-black/30 hover:text-[#fc0] hover:bg-black/5 rounded-2xl transition-all"
              title="Open Live Site"
            >
              <ExternalLink size={20} />
            </button>

            <button 
              onClick={() => savePage(false)}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-black/60 hover:text-black hover:bg-black/5 rounded-2xl transition-all border border-black/5 disabled:opacity-30"
            >
              <Save size={16} />
              SAVE DRAFT
            </button>

            <button 
              onClick={() => savePage(true)}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-black bg-[#fc0] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#fc0] rounded-2xl transition-all shadow-[0_10px_25px_rgba(255,204,0,0.3)] disabled:opacity-30"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              PUBLISH LIVE
            </button>

            <button 
              onClick={() => setIsSidebarVisible(!isSidebarVisible)}
              className={`p-3 rounded-2xl transition-all ${isSidebarVisible ? 'text-[#fc0] bg-[#fc0]/5' : 'text-black/30 hover:text-black/60 hover:bg-black/5'}`}
            >
              {isSidebarVisible ? <PanelRightClose size={22} /> : <PanelRight size={22} />}
            </button>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#F4F4F4] scrollbar-hide">
          <style dangerouslySetInnerHTML={{ __html: `
            .editor-mobile-view .grid { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
            .editor-mobile-view .md\\:grid-cols-2 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
            .editor-mobile-view .lg\\:grid-cols-3 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
            .editor-mobile-view .xl\\:grid-cols-4 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
            .editor-mobile-view .flex-row { flex-direction: column !important; }
            
            .editor-tablet-view .grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .editor-tablet-view .lg\\:grid-cols-3 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .editor-tablet-view .xl\\:grid-cols-4 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          `}} />
          <div 
            className={`bg-[#FFFEF9] shadow-[0_20px_50px_rgba(0,0,0,0.1)] min-h-full transition-all duration-500 ease-in-out border border-black/5 origin-top
              ${viewMode === 'mobile' ? 'w-[375px] editor-mobile-view' : viewMode === 'tablet' ? 'w-[768px] editor-tablet-view' : 'w-full'}
              ${editMode ? 'ring-1 ring-[#fc0]/30' : ''}`}
          >
            {editMode ? (
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={currentSections.map((s: any) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <PageRenderer 
                    sections={currentSections} 
                    isEditing={true}
                    renderWrapper={(section: any, children: any) => (
                      <EditableSection key={section.id} section={section}>
                        {children}
                      </EditableSection>
                    )}
                  />
                </SortableContext>
              </DndContext>
            ) : (
              <PageRenderer sections={currentSections.filter((s: any) => s.settings?.visibility !== false)} />
            )}

            {editMode && (
              <div className="p-16 flex justify-center">
                <button 
                  onClick={() => setIsSelectorOpen(true)}
                  className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-dashed border-[#1a1a1a]/10 text-[#1a1a1a]/40 hover:border-[#fc0] hover:text-[#1a1a1a] hover:shadow-xl rounded-2xl transition-all font-bold group"
                >
                  <Plus size={24} className="group-hover:rotate-90 transition-transform text-[#fc0]" />
                  ADD NEW SECTION
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {isSelectorOpen && (
        <SectionSelector 
          onSelect={onAddSection} 
          onClose={() => setIsSelectorOpen(false)} 
        />
      )}

      {isSettingsOpen && (
        <PageSettingsPanel onClose={() => setIsSettingsOpen(false)} />
      )}

      {/* Right Sidebar - Always accessible for Page Settings */}
      {isSidebarVisible && (
        <div className="w-[450px] shrink-0 h-full border-l border-[#1a1a1a]/5 bg-white shadow-2xl z-[100] animate-in slide-in-from-right duration-300">
          <Sidebar />
        </div>
      )}
    </div>
  );
}
