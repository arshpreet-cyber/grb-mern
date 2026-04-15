export type SectionTemplate = {
  type: string;
  icon: string;
  label: string;
  description: string;
  defaultContent: string;
};

export const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    type: "hero",
    icon: "🖼️",
    label: "Hero Banner",
    description: "Full-width hero with heading, text and CTA button",
    defaultContent: `<section class="hero-banner" style="background:linear-gradient(135deg,#1e1b4b,#4c1d95);padding:80px 40px;text-align:center;color:#fff;">
  <h1 style="font-size:48px;font-weight:800;margin-bottom:16px;">Your Headline Here</h1>
  <p style="font-size:18px;opacity:0.85;max-width:600px;margin:0 auto 32px;">Supporting text that explains your value proposition clearly and concisely.</p>
  <a href="#" style="background:#FFCE2E;color:#000;padding:14px 32px;border-radius:8px;font-weight:700;text-decoration:none;font-size:16px;">Get Started →</a>
</section>`,
  },
{
    type: "image-right",
    icon: "🖼️➡️",
    label: "Section — Image Right",
    description: "Text on left, image on right with yellow offset background",
    defaultContent: `<section class="bg-[#f5f6f7] py-16 lg:py-24">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      
      <div>
        <h2 class="text-3xl lg:text-5xl font-bold text-black leading-tight mb-6">Propel Your Business To New Heights With Google Business Optimization</h2>
        <p class="text-gray-600 leading-relaxed mb-8">Create a robust Google presence for your business with Get Reviews Buzz. We offer a range of Google Business Optimization services to help you stand out in the crowded online marketplace. Our targeted optimization strategies can help you attract local customers and increase your reach.</p>
        <a href="#" class="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-md transition">GET A QUOTE</a>
      </div>

      <div class="relative">
        <div class="absolute top-3 left-3 w-full h-full bg-yellow-200 rounded-xl"></div>
        <div class="relative z-10 bg-white rounded-xl shadow-md p-4">
            <img src="https://placehold.co/800x600" alt="business" class="rounded-lg w-full" />
        </div>
      </div>
      
    </div>
  </div>
</section>`,
  },
{
    type: "image-left",
    icon: "⬅️🖼️",
    label: "Section — Image Left",
    description: "Image on left, text on right with features list",
    defaultContent: `<section class="bg-[#f5f6f7] py-16 lg:py-24">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div class="relative">
        <div class="absolute top-3 right-3 w-full h-full bg-yellow-200 rounded-xl"></div>
        <div class="relative bg-white rounded-xl p-4">
          <img src="https://placehold.co/800x600" alt="seo" class="rounded-lg w-full" />
        </div>
      </div>
      <div>
        <h2 class="text-3xl lg:text-5xl font-bold text-black leading-tight mb-6">SEO Services To Rank Your Website Across The Top Search Engines</h2>       
        <p class="text-gray-600 leading-relaxed mb-6">Looking to secure the top spot in search engine results? We have got you covered! With our SEO expertise and knowledge, we can help make it happen.</p>
        <a href="#" class="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-md transition">GET A QUOTE</a>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    type: "product-banner",
    icon: "🛍️",
    label: "Product Banner",
    description: "Product showcase with price and buy buttons",
    defaultContent: `<section class="w-full bg-[#fdfbf7] py-16 px-6 font-sans">
  <div class="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 md:gap-14 items-start">
    
    <div class="w-full md:w-[35%] shrink-0">
      <img 
        src=" " 
        alt="Glassdoor Reviews Graphic" 
        class="w-full aspect-square object-cover shadow-sm border border-gray-100" 
      />
    </div>

    <div class="w-full md:w-[65%] flex flex-col pt-2">
      
      <h2 class="text-3xl md:text-[42px] font-extrabold text-black tracking-tight mb-4 leading-none">
        Glassdoor Reviews
      </h2>

      <p class="text-[14px] md:text-[15px] text-gray-800 leading-relaxed mb-6">
        A team of good employees can make any company a huge success. For finding suitable employees, Glassdoor is a perfect platform. You can list your company and post the vacancies. Positive Glassdoor reviews about your company will attract employees who are not just skilled but also productive.
      </p>

      <div class="flex items-baseline gap-1.5 mb-6">
        <span class="text-[28px] md:text-[32px] font-extrabold text-black tracking-tight">Price: $20.00/</span>
        <span class="text-[13px] text-gray-800 font-medium">Per Review</span>
      </div>

      <div class="flex flex-wrap gap-4">
        <button type="button" class="bg-[#333333] hover:bg-black text-white font-bold text-[14px] md:text-[15px] px-8 py-3.5 rounded-md shadow-sm transition-all">
          One-Time Purchase
        </button>
        <button type="button" class="bg-[#FFCE2E] hover:bg-[#ebd523] text-black font-bold text-[14px] md:text-[15px] px-10 py-3.5 rounded-md shadow-sm transition-all">
          Subscribe
        </button>
      </div>

    </div>
  </div>
</section>`,
  },
  {
    type: "features-grid",
    icon: "⚡",
    label: "Features Grid",
    description: "3-column features/benefits grid",
    defaultContent: `<section style="padding:60px 40px;max-width:1200px;margin:0 auto;text-align:center;">
  <h2 style="font-size:36px;font-weight:700;color:#1e1b4b;margin-bottom:8px;">Why Choose Us</h2>
  <p style="color:#777;margin-bottom:48px;">Everything you need to grow your business</p>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;">
    <div style="background:#f8f9ff;padding:32px;border-radius:16px;">
      <div style="font-size:40px;margin-bottom:16px;">⭐</div>
      <h3 style="font-size:20px;font-weight:700;color:#1e1b4b;margin-bottom:8px;">Feature One</h3>
      <p style="color:#666;line-height:1.6;">Describe this feature and why it matters to your customers.</p>
    </div>
    <div style="background:#f8f9ff;padding:32px;border-radius:16px;">
      <div style="font-size:40px;margin-bottom:16px;">🚀</div>
      <h3 style="font-size:20px;font-weight:700;color:#1e1b4b;margin-bottom:8px;">Feature Two</h3>
      <p style="color:#666;line-height:1.6;">Describe this feature and why it matters to your customers.</p>
    </div>
    <div style="background:#f8f9ff;padding:32px;border-radius:16px;">
      <div style="font-size:40px;margin-bottom:16px;">🔒</div>
      <h3 style="font-size:20px;font-weight:700;color:#1e1b4b;margin-bottom:8px;">Feature Three</h3>
      <p style="color:#666;line-height:1.6;">Describe this feature and why it matters to your customers.</p>
    </div>
  </div>
</section>`,
  },
{
    type: "cta_banner",
    icon: "📢",
    label: "CTA Banner",
    description: "A bold, full-width call-to-action strip with a button",
    defaultContent: `<section class="w-full bg-gradient-to-r from-[#FFD12A] to-[#FFE066] font-sans py-12 px-6">
  <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
    
    <div class="text-center md:text-left">
      <p class="text-lg md:text-[22px] font-normal text-black mb-1">
        Want To Know How We Can Help You Get
      </p>
      <h2 class="text-2xl md:text-[36px] font-extrabold text-black tracking-tight mt-1">
        Business Leads And Positive Reviews?
      </h2>
    </div>

    <a href="#" class="shrink-0 bg-gradient-to-r from-black to-[#333333] text-white text-[13px] font-bold tracking-wider px-8 py-4 rounded shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all uppercase">
      Get A Quote
    </a>

  </div>
</section>`,
  },
  {
    type: "testimonials",
    icon: "💬",
    label: "Testimonials",
    description: "Customer reviews and testimonials",
    defaultContent: `<section style="padding:60px 40px;background:#f8f9ff;">
  <div style="max-width:1200px;margin:0 auto;text-align:center;">
    <h2 style="font-size:36px;font-weight:700;color:#1e1b4b;margin-bottom:48px;">What Our Customers Say</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
      <div style="background:#fff;padding:28px;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.06);text-align:left;">
        <div style="color:#FFCE2E;font-size:20px;margin-bottom:12px;">★★★★★</div>
        <p style="color:#444;line-height:1.7;margin-bottom:16px;">"Amazing service! Highly recommend to anyone looking to grow their business online."</p>
        <div style="font-weight:700;color:#1e1b4b;">John Smith</div>
        <div style="font-size:13px;color:#999;">CEO, Company Name</div>
      </div>
      <div style="background:#fff;padding:28px;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.06);text-align:left;">
        <div style="color:#FFCE2E;font-size:20px;margin-bottom:12px;">★★★★★</div>
        <p style="color:#444;line-height:1.7;margin-bottom:16px;">"The results were incredible. Our ratings improved significantly within weeks."</p>
        <div style="font-weight:700;color:#1e1b4b;">Sarah Johnson</div>
        <div style="font-size:13px;color:#999;">Marketing Director</div>
      </div>
      <div style="background:#fff;padding:28px;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.06);text-align:left;">
        <div style="color:#FFCE2E;font-size:20px;margin-bottom:12px;">★★★★★</div>
        <p style="color:#444;line-height:1.7;margin-bottom:16px;">"Best investment we made this year. Customer support is top notch."</p>
        <div style="font-weight:700;color:#1e1b4b;">Mike Davis</div>
        <div style="font-size:13px;color:#999;">Business Owner</div>
      </div>
    </div>
  </div>
</section>`,
  },
{
    type: "faq",
    icon: "❓",
    label: "FAQ",
    description: "Frequently asked questions in a 2-column grid",
    defaultContent: `<section class="w-full bg-[#f5f6f7] py-20 px-6 font-sans">
  <div class="max-w-6xl mx-auto">
    
    <h2 class="text-3xl md:text-5xl font-extrabold text-center mb-12 text-black">
      Frequently Asked <span class="text-[#FFCE2E]">Questions</span>
    </h2>
    
    <div class="grid md:grid-cols-2 gap-6">
      
      <details class="group bg-white rounded shadow-sm border border-gray-100">
        <summary class="flex justify-between items-center font-bold text-[#111] cursor-pointer p-6 list-none [&::-webkit-details-marker]:hidden">
          Why Are Reviews Important For Businesses?
          <span class="flex-shrink-0 ml-4 bg-[#444] text-white rounded-full w-6 h-6 flex items-center justify-center transition-transform duration-200 group-open:rotate-180">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
        </summary>
        <div class="px-6 pb-6 text-gray-600 leading-relaxed">
          Reviews build trust, improve local SEO rankings, and heavily influence purchasing decisions by providing social proof from real customers.
        </div>
      </details>

      <details class="group bg-white rounded shadow-sm border border-gray-100">
        <summary class="flex justify-between items-center font-bold text-[#111] cursor-pointer p-6 list-none [&::-webkit-details-marker]:hidden">
          How Can I Get Honest Product Reviews?
          <span class="flex-shrink-0 ml-4 bg-[#444] text-white rounded-full w-6 h-6 flex items-center justify-center transition-transform duration-200 group-open:rotate-180">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
        </summary>
        <div class="px-6 pb-6 text-gray-600 leading-relaxed">
          You can get honest product reviews by simply asking your customers post-purchase, offering incentives, and making the review process as easy as possible.
        </div>
      </details>

      <details class="group bg-white rounded shadow-sm border border-gray-100">
        <summary class="flex justify-between items-center font-bold text-[#111] cursor-pointer p-6 list-none [&::-webkit-details-marker]:hidden">
          What Is The Best Site To Collect Consumer Reviews?
          <span class="flex-shrink-0 ml-4 bg-[#444] text-white rounded-full w-6 h-6 flex items-center justify-center transition-transform duration-200 group-open:rotate-180">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
        </summary>
        <div class="px-6 pb-6 text-gray-600 leading-relaxed">
          Google is generally the most important for local businesses, but Trustpilot, Yelp, and industry-specific sites (like Zillow or TripAdvisor) are also highly valuable depending on your niche.
        </div>
      </details>

      <details class="group bg-white rounded shadow-sm border border-gray-100">
        <summary class="flex justify-between items-center font-bold text-[#111] cursor-pointer p-6 list-none [&::-webkit-details-marker]:hidden">
          How To Get More Online Reviews?
          <span class="flex-shrink-0 ml-4 bg-[#444] text-white rounded-full w-6 h-6 flex items-center justify-center transition-transform duration-200 group-open:rotate-180">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
        </summary>
        <div class="px-6 pb-6 text-gray-600 leading-relaxed">
          Automate your review requests via email or SMS, provide excellent customer service, and engage with the reviews you already have to encourage others to leave theirs.
        </div>
      </details>

    </div>
  </div>
</section>`,
  },
  {
    type: "text-block",
    icon: "📝",
    label: "Text Block",
    description: "Simple text content block",
    defaultContent: `<section style="padding:60px 40px;max-width:800px;margin:0 auto;">
  <h2 style="font-size:32px;font-weight:700;color:#1e1b4b;margin-bottom:16px;">Section Heading</h2>
  <p style="font-size:16px;color:#555;line-height:1.8;margin-bottom:16px;">Your content goes here. Write as much as you need. This is a simple text block for articles, descriptions, or any long-form content.</p>
  <p style="font-size:16px;color:#555;line-height:1.8;">Add more paragraphs as needed. You can also add <strong>bold text</strong>, <em>italic text</em>, or <a href="#">links</a>.</p>
</section>`,
  },
  {
    type: "custom-html",
    icon: "💻",
    label: "Custom HTML",
    description: "Write your own custom HTML",
    defaultContent: `<!-- Write your custom HTML here -->
<section style="padding:40px;">
  <p>Your custom content here...</p>
</section>`,
  },
];
