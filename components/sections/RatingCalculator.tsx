'use client';
import React, { useState, useEffect, useRef } from 'react';
import Wrapper from "@/components/ui/Wrapper";
import { SectionProps } from '@/types/section';
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";

const platforms = [
  { name: "Google Reviews", max: 5 }, { name: "Trustpilot", max: 5 }, { name: "Yelp", max: 5 },
  { name: "Facebook", max: 5 }, { name: "BBB", max: 5 }, { name: "Booking.com", max: 10 },
  { name: "Google GPS Reviews", max: 5 }, { name: "Google Local Guide", max: 5 }, { name: "Google LSA Reviews", max: 5 },
  { name: "Google Playstore", max: 5 }, { name: "Chrome Extension", max: 5 }, { name: "Free Google Reviews", max: 5 },
  { name: "Expedia", max: 10 }, { name: "Hotels.com", max: 10 }, { name: "HomeToGo", max: 5 },
  { name: "Houzz", max: 5 }, { name: "Home Advisor", max: 5 }, { name: "Angi", max: 5 },
  { name: "Thumbtack", max: 5 }, { name: "Bark", max: 5 }, { name: "Home Star", max: 5 },
  { name: "Networx", max: 5 }, { name: "Trustedpros", max: 5 }, { name: "BuildZoom", max: 5 },
  { name: "Zillow", max: 5 }, { name: "Realtor", max: 5 }, { name: "Homelight", max: 5 },
  { name: "RealEstateAgents", max: 5 }, { name: "REW", max: 5 }, { name: "wyl.co", max: 5 },
  { name: "Healthgrades", max: 5 }, { name: "WebMD", max: 5 }, { name: "Ratemds", max: 5 },
  { name: "Realself", max: 5 }, { name: "Vitals", max: 5 }, { name: "Rehab.com", max: 5 },
  { name: "Dealerrater", max: 5 }, { name: "Autotrader", max: 5 }, { name: "CarGurus", max: 5 },
  { name: "Transport Reviews", max: 5 }, { name: "Source Forge", max: 5 }, { name: "SaaSHub", max: 5 },
  { name: "QuickBooks", max: 5 }, { name: "Sortlist", max: 5 }, { name: "Glassdoor", max: 5 },
  { name: "Indeed", max: 5 }, { name: "JobStreet", max: 5 }, { name: "Ambition Box", max: 5 },
  { name: "Seek.com", max: 5 }, { name: "Avvo", max: 5 }, { name: "Findlaw", max: 5 },
  { name: "YellowPages", max: 5 }, { name: "Birdeye", max: 5 }, { name: "Reviews.io", max: 5 },
  { name: "Sitejabber", max: 5 }, { name: "Review Centre", max: 5 }, { name: "CustomerLobby", max: 5 },
  { name: "UpCity", max: 5 }, { name: "Consumeraffairs.com", max: 5 }, { name: "Chamberofcommerce", max: 5 },
  { name: "HelloPeter.com", max: 5 }, { name: "ReportTotal", max: 5 }, { name: "Scamvoid", max: 5 },
  { name: "Trustpilot Verified", max: 5 }, { name: "IMDb", max: 5 }, { name: "BookMyShow", max: 5 },
  { name: "Spotify", max: 5 }, { name: "WeddingWire", max: 5 }, { name: "Makeupalley", max: 5 },
  { name: "FoodDrop", max: 5 }, { name: "Energysage", max: 5 }, { name: "Solar Reviews", max: 5 },
  { name: "Solar Choice", max: 5 }, { name: "Web Retailer", max: 5 }, { name: "Apartment Reviews", max: 5 },
  { name: "Magikpet", max: 5 }, { name: "Niche.com", max: 5 }, { name: "Mortgage Matchup", max: 5 },
  { name: "DesignRush", max: 5 }, { name: "TOPSEOs", max: 5 }, { name: "Amazon", max: 5 }, { name: "TripAdvisor", max: 5 }
];

export default function RatingCalculator({ id, data, settings, isEditing }: SectionProps) {
  const dispatch = useAppDispatch();
  const {
    title = "Your Path to a <strong>5-Star</strong> Rating",
    description = "See exactly what it takes to move your rating up. Enter your current rating, total count, and dream score to get the exact number of 5-star reviews needed to pull ahead.",
    pills = [
      { num: "98%", text: "of customers read online reviews before deciding on a local business" },
      { num: "50%", text: "more engagement for businesses with four-star ratings" },
      { num: "3/4", text: "customers avoid businesses with numerous negative reviews" }
    ],
    calculatorTitle = "Rating Calculator:"
  } = data;

  // State for Calculator
  const [platformSearch, setPlatformSearch] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<{ name: string, max: number } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentAvg, setCurrentAvg] = useState('');
  const [currentCount, setCurrentCount] = useState('');
  const [targetAvg, setTargetAvg] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ needed: number, target: number, max: number } | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // State for Pill Cycling
  const [activePillIndex, setActivePillIndex] = useState(0);
  const [pillStatus, setPillStatus] = useState<'visible' | 'out'>('visible');

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPillStatus('out');
      setTimeout(() => {
        setActivePillIndex((prev) => (prev + 1) % pills.length);
        setPillStatus('visible');
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, [pills.length]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPlatforms = platformSearch.trim() 
    ? platforms.filter(p => p.name.toLowerCase().includes(platformSearch.toLowerCase())).slice(0, 10)
    : [];

  const handleCalculate = () => {
    if (!selectedPlatform) return;
    const maxRating = selectedPlatform.max;
    const avg = parseFloat(currentAvg);
    const count = parseInt(currentCount);
    const target = parseFloat(targetAvg);

    const needed = Math.max(0, Math.ceil((target * count - avg * count) / (maxRating - target)));
    setResult({ needed, target, max: maxRating });
  };

  const isFormValid = selectedPlatform && currentAvg && currentCount && targetAvg && Object.keys(errors).length === 0;

  const sectionStyle: React.CSSProperties = {
    padding: settings.padding || '60px 0',
    margin: settings.margin || '0',
    backgroundColor: settings.backgroundColor || 'transparent',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: settings.titleSize || '40px',
    color: settings.titleColor || '#0a0e1a',
    fontWeight: settings.titleWeight || '350',
    lineHeight: '1.1',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: settings.contentSize || '16px',
    color: settings.contentColor || 'black',
    fontWeight: settings.contentWeight || 'normal',
    lineHeight: '1.5',
  };

  return (
    <section style={sectionStyle} className="relative overflow-hidden bg-gradient-to-b from-[#FDFCF200] to-[#FDFCF2FF] font-[Poppins]">
      {/* Decorative Stars */}
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className="absolute text-[#ffcd05] opacity-40 animate-star-float pointer-events-none drop-shadow-[0_4px_12px_rgba(255,205,5,0.4)]"
          style={{
            top: `${[18, 30, 65, 55, 72][i]}%`,
            left: i % 2 === 0 ? `${[8, 12, 10, 15, 8][i]}%` : 'auto',
            right: i % 2 !== 0 ? `${[10, 15, 8, 12, 10][i]}%` : 'auto',
            fontSize: `${[28, 36, 22, 18, 30][i]}px`,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          ★
        </div>
      ))}

      <Wrapper>
        <div className="relative z-10 text-center max-w-[720px] mx-auto mb-10 px-4">
          <h1 
            className="mb-5"
            style={titleStyle}
            dangerouslySetInnerHTML={{ __html: title }}
          />

          <p className="mb-10" style={descriptionStyle}>
            {description}
          </p>

          {/* Pill Cycling */}
          <div className="h-[52px] relative flex justify-center items-center mb-10">
            {pills.map((pill: any, i: number) => (
              <div 
                key={i}
                className={`absolute flex items-center gap-[10px] bg-gradient-to-br from-[#fffef8] to-[#fff4c2] border border-[#e2e8f0] rounded-[50px] px-[22px] py-[10px] text-[13px] font-medium text-[#4a4f5e] shadow-[0_2px_8px_rgba(0,0,0,0.05),0_0_18px_rgba(255,215,80,0.25)] whitespace-nowrap transition-all duration-400 ease-[cubic-bezier(.22,1,.36,1)] ${
                  i === activePillIndex 
                    ? (pillStatus === 'visible' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-[10px]') 
                    : 'opacity-0 translate-y-[10px] pointer-events-none'
                }`}
              >
                <span className="font-bold text-[#0a0e1a] text-sm">{pill.num}</span> {pill.text}
              </div>
            ))}
          </div>
        </div>

        {/* Calculator Card */}
        <div className="max-w-[800px] mx-auto relative z-10 px-4">
          <div className="bg-white rounded-[20px] p-9 shadow-[0_20px_60px_rgba(0,0,0,0.10),0_0_0_1px_#eef2f5] text-left">
            <h2 className="text-[30px] font-bold text-[#0a0e1a] mb-[6px] tracking-[-0.02em]">{calculatorTitle}</h2>
            <div className="w-[14%] h-[3px] bg-[#ffcd05] rounded-[2px] mb-7"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-7">
              <div className="md:col-span-2 relative" ref={dropdownRef}>
                <label className="block font-medium text-sm text-[#0a0e1a] mb-2">Choose Platform:</label>
                <input 
                  type="text" 
                  className="w-full h-[50px] border-[1.5px] border-[#e2e8f0] rounded-[10px] px-3.5 text-[15px] font-normal bg-white focus:border-[#ffcd05] focus:outline-none focus:ring-4 focus:ring-[#ffcd05]/20 transition-all"
                  placeholder="Type platform..."
                  value={platformSearch}
                  onChange={(e) => {
                    setPlatformSearch(e.target.value);
                    setSelectedPlatform(null);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                />
                {isDropdownOpen && filteredPlatforms.length > 0 && (
                  <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border-[1.5px] border-[#e2e8f0] rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] max-h-[220px] overflow-y-auto z-[100]">
                    {filteredPlatforms.map((p, i) => (
                      <div 
                        key={p.name}
                        className={`px-4 py-2.5 text-sm font-normal text-[#0a0e1a] cursor-pointer flex justify-between items-center transition-colors hover:bg-[#fff8e0] ${highlightedIndex === i ? 'bg-[#fff8e0]' : ''}`}
                        onClick={() => {
                          setSelectedPlatform(p);
                          setPlatformSearch(p.name);
                          setIsDropdownOpen(false);
                          setResult(null);
                        }}
                      >
                        {p.name}
                        <span className="text-[11px] font-semibold text-[#7a7f8e] bg-[#eef2f5] px-2 py-0.5 rounded-[20px]">{p.max}-star</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className={`text-xs text-[#d1452e] mt-1.5 h-[18px] leading-[1.4] transition-opacity ${errors.platform ? 'opacity-100' : 'opacity-0'}`}>
                  {errors.platform}
                </div>
              </div>

              <div>
                <label className="block font-medium text-sm text-[#0a0e1a] mb-2">What Is The Current Average Review Rating?</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="w-full h-[50px] border-[1.5px] border-[#e2e8f0] rounded-[10px] px-3.5 text-[15px] font-normal bg-white focus:border-[#ffcd05] focus:outline-none focus:ring-4 focus:ring-[#ffcd05]/20 transition-all"
                  placeholder="0"
                  value={currentAvg}
                  onChange={(e) => { setCurrentAvg(e.target.value); setResult(null); }}
                />
                <div className={`text-xs text-[#d1452e] mt-1.5 h-[18px] leading-[1.4] transition-opacity ${errors.avg ? 'opacity-100' : 'opacity-0'}`}>
                  {errors.avg}
                </div>
              </div>

              <div>
                <label className="block font-medium text-sm text-[#0a0e1a] mb-2">How Many Reviews Do You Currently Have?</label>
                <input 
                  type="number" 
                  className="w-full h-[50px] border-[1.5px] border-[#e2e8f0] rounded-[10px] px-3.5 text-[15px] font-normal bg-white focus:border-[#ffcd05] focus:outline-none focus:ring-4 focus:ring-[#ffcd05]/20 transition-all"
                  placeholder="0"
                  value={currentCount}
                  onChange={(e) => { setCurrentCount(e.target.value); setResult(null); }}
                />
                <div className={`text-xs text-[#d1452e] mt-1.5 h-[18px] leading-[1.4] transition-opacity ${errors.count ? 'opacity-100' : 'opacity-0'}`}>
                  {errors.count}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium text-sm text-[#0a0e1a] mb-2">What Average Rating Do You Want to Achieve?</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="w-full h-[50px] border-[1.5px] border-[#e2e8f0] rounded-[10px] px-3.5 text-[15px] font-normal bg-white focus:border-[#ffcd05] focus:outline-none focus:ring-4 focus:ring-[#ffcd05]/20 transition-all"
                  placeholder="0"
                  value={targetAvg}
                  onChange={(e) => { setTargetAvg(e.target.value); setResult(null); }}
                />
                <div className={`text-xs text-[#d1452e] mt-1.5 h-[18px] leading-[1.4] transition-opacity ${errors.target ? 'opacity-100' : 'opacity-0'}`}>
                  {errors.target}
                </div>
              </div>
            </div>

            <button 
              className="w-full md:w-fit md:px-10 h-[52px] bg-[#0a0e1a] text-white border-none rounded-[10px] font-semibold text-[15px] cursor-pointer transition-all hover:bg-[#2a2a2a] hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(10,14,26,0.25)] disabled:opacity-45 disabled:cursor-not-allowed mx-auto flex items-center justify-center gap-2"
              disabled={!isFormValid}
              onClick={handleCalculate}
            >
              Calculate
            </button>

            {result && (
              <div className="mt-5 p-4 md:p-5 bg-gradient-to-br from-[#fff8e0] to-[#fffdf5] border border-[#f5e6b0] rounded-xl text-[15px] font-medium text-[#4a4f5e] animate-fade-slide leading-[1.6]">
                You'll need <span className="text-[28px] md:text-[36px] font-bold text-[#0a0e1a] tracking-[-0.03em] leading-none inline">{result.needed.toLocaleString()}</span> more <strong className="text-[#0a0e1a] font-bold">{result.max}</strong>-star reviews for a <strong className="text-[#0a0e1a] font-bold">{result.target.toFixed(1)}</strong> <strong className="text-[#0a0e1a] font-bold">{result.max === 10 ? 'point' : 'star'}</strong> rating.
              </div>
            )}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
