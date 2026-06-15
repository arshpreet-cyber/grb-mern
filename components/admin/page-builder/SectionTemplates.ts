export type SectionTemplate = {
  type: string;
  icon: string;
  label: string;
  description: string;
  defaultContent: string;
};

export const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    "type": "hero-typing",
    "icon": "Γî¿∩╕ÅΓ£¿",
    "label": "Hero ΓÇö Typing Animation",
    "description": "Centered hero section with animated typing text and highlight line",
    "defaultContent": `<style>
  .hero-section { background: linear-gradient(to bottom, #FDFCF200 0%, #FDFCF2FF 100%); text-align: center; padding: 45px 20px 45px; display: flex; align-items: center; justify-content: center; font-family: 'Poppins', sans-serif; }
  .hero-content { max-width: 350px; margin: 0 auto; }
  .hero-heading { font-size: 40px; font-weight: 350; color: #1a1a1a; line-height: 1.3; margin: 0 0 7px; letter-spacing: -0.02em; }
  .hero-heading strong { font-weight: 510; }
  .bar { width: 7px; height: 50px; flex-shrink: 0; }
  .highlight-line { display: inline-flex; align-items: center; gap: 10px; background-color: #FFE58233; min-height: 64px; vertical-align: middle; padding: 4px 8px; box-sizing: border-box; }
  
  #hero-typing-text { display: inline-block; min-width: 0px; text-align: left; line-height: 1.3; vertical-align: middle; }
  .hero-subtext { font-size: 16px; color: #000000; margin: 0; letter-spacing: 0.01em; }
  .hero-cursor { display: inline-block; width: 3px; height: 1em; background: #1a1a1a; margin-left: 3px; vertical-align: middle; animation: blink 0.75s step-end infinite; }
  
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  
  @media (max-width: 1470px) { .hero-heading { font-size: 32px; } .hero-subtext { font-size: 14px; } .hero-section { padding: 40px 16px 52px; } .highlight-line { min-height: 52px; } #hero-typing-text { min-width: 0px; } }
  @media (max-width: 768px) { .hero-section { padding: 40px 16px; } .hero-content { max-width: 100%; } .hero-heading { font-size: 26px; line-height: 1.3; letter-spacing: -0.01em; } .hero-subtext { font-size: 14px; margin-top: 8px; } .highlight-line { gap: 6px; padding: 2px 6px; flex-wrap: nowrap; justify-content: center; min-height: 44px; } .bar { width: 5px; height: 32px; } #hero-typing-text { font-size: 18px; line-height: 1.3; min-width: 0px; } }
  @media (max-width: 480px) { .hero-heading { font-size: 22px; } #hero-typing-text { font-size: 16px; min-width: 0px; } .hero-subtext { font-size: 13px; } .bar { height: 26px; } .highlight-line { min-height: 36px; } }
</style>

<section class="hero-section">
  <div class="hero-content">
    <h1 class="hero-heading">
      Turn Reputation into <strong>Revenue</strong> with<br>
      <span class="highlight-line">
        <img src="/uploads/media/1777870273070-17b045d2-3669-4f40-bb5e-58e958fadd38-line1.png" alt="|" class="bar">
        <strong>
          <span id="hero-typing-text">Hotel Reviews</span><span class="hero-cursor"></span>
        </strong>
        <img src="/uploads/media/1777870288356-8e751a85-6833-4eb7-9632-192f29dba53e-line2.png" alt="|" class="bar">
      </span>
    </h1>
    <p class="hero-subtext">
      Elevate your brand with reviews that actually convert.
    </p>
  </div>
</section>

<script>
  (function() {
    const services = [
      "Hotel Reviews",
      "Health Services Reviews",
      "Plumbing Services Reviews",
      "Real Estate Reviews",
      "Legal Services Reviews",
      "Authentic Reviews"
    ];

    const textEl = document.getElementById('hero-typing-text');
    if (!textEl) return;

    let current = 0;
    let charIdx = services[0].length; 
    let deleting = true; 
    const TYPE_SPEED = 80, DELETE_SPEED = 40, PAUSE = 1000;

    function loop() {
      const full = services[current];
      if (!deleting) {
        charIdx++;
        textEl.textContent = full.slice(0, charIdx);
        if (charIdx === full.length) {
          setTimeout(() => { deleting = true; loop(); }, PAUSE);
          return;
        }
        setTimeout(loop, TYPE_SPEED);
      } else {
        charIdx--;
        textEl.textContent = full.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          current = (current + 1) % services.length;
        }
        setTimeout(loop, DELETE_SPEED);
      }
    }
    
    setTimeout(loop, PAUSE);
  })();
</script>`
  },
  {
    type: "image-right",
    icon: "≡ƒû╝∩╕ÅΓ₧í∩╕Å",
    label: "Section ΓÇö Image Right",
    description: "Text on left, image on right with yellow offset background",
    defaultContent: `<section class="py-16 lg:py-24 bg-white">
  <div class="max-w-350 mx-auto px-6">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      
      <div>
        <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
          Turn Reviews into Brand Visibility and Growth
        </h2>
        <p class="text-gray-700 leading-relaxed mb-6">
          Customer reviews shape how people see your business. They often decide whether someone chooses you or looks elsewhere. Most customers rely on reviews to judge quality and trust, and they look for real experiences. But hereΓÇÖs the thing. A small number of reviews rarely creates a strong impact.
          Regular feedback builds credibility over time. It shows that your business consistently delivers value. Recent reviews matter just as much, since they reflect how your business performs today. Strong and consistent reviews improve your visibility across search and local platforms. They help your business appear when customers are actively looking and ready to take action. With a clear and consistent approach, reviews become a valuable asset that builds trust, strengthens visibility, and supports steady growth.
        </p>
      </div>

      <div class="relative">
        
        <div class="relative ">
          <img src="YOUR_IMAGE_URL" alt="Review and growth illustration" class=" w-full h-auto" />
        </div>
      
    </div>
  </div>
</section>`,
  },
  {
    type: "image-left",
    icon: "Γ¼à∩╕Å≡ƒû╝∩╕Å",
    label: "Section ΓÇö Image Left",
    description: "Image on left, text on right with features list",
    defaultContent: `<section class="py-16 lg:py-24">
  <div class="max-w-350 mx-auto px-6">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div class="relative">
        <div>
          <img src="https://placehold.co/800x600" alt="illustration of floating review boxes" class="rounded-lg w-full" />
        </div>
      </div>
      <div>
        <h2 class="text-3xl lg:text-5xl font-bold text-black leading-tight mb-6">
          Where Reputation Meets <span class="text-yellow-600 font-bold">Real Business Growth</span>
        </h2>
        <p class="text-gray-600 leading-relaxed mb-6">
          A strong online presence boosts visibility. But to turn that visibility into growth, you need the right approach. This is where a solid review strategy matters.
        </p>
        <p class="text-gray-600 leading-relaxed mb-6">
          At Get Reviews Buzz, we help businesses build and enhance their reputation. Our structured and goal-focused approach improves how your brand is perceived. We ensure it connects with your target audience and stands out in the market.
        </p>
        <p class="text-gray-600 leading-relaxed">
          Our process supports long-term results. We help you encourage repeat customers and build a lasting reputation that benefits your business over time. When your reputation matches your growth goals, it builds customer trust. This leads to better conversions and lasting success.
        </p>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    type: "product-banner",
    icon: "≡ƒ¢ì∩╕Å",
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
    icon: "ΓÜí",
    label: "Features Grid",
    description: "3-column features/benefits grid",
    defaultContent: `<section style="padding:60px 40px;max-width:1200px;margin:0 auto;text-align:center;">
  <h2 style="font-size:36px;font-weight:700;color:#1e1b4b;margin-bottom:8px;">Why Choose Us</h2>
  <p style="color:#777;margin-bottom:48px;">Everything you need to grow your business</p>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;">
    <div style="background:#f8f9ff;padding:32px;border-radius:16px;">
      <div style="font-size:40px;margin-bottom:16px;">Γ¡É</div>
      <h3 style="font-size:20px;font-weight:700;color:#1e1b4b;margin-bottom:8px;">Feature One</h3>
      <p style="color:#666;line-height:1.6;">Describe this feature and why it matters to your customers.</p>
    </div>
    <div style="background:#f8f9ff;padding:32px;border-radius:16px;">
      <div style="font-size:40px;margin-bottom:16px;">≡ƒÜÇ</div>
      <h3 style="font-size:20px;font-weight:700;color:#1e1b4b;margin-bottom:8px;">Feature Two</h3>
      <p style="color:#666;line-height:1.6;">Describe this feature and why it matters to your customers.</p>
    </div>
    <div style="background:#f8f9ff;padding:32px;border-radius:16px;">
      <div style="font-size:40px;margin-bottom:16px;">≡ƒöÆ</div>
      <h3 style="font-size:20px;font-weight:700;color:#1e1b4b;margin-bottom:8px;">Feature Three</h3>
      <p style="color:#666;line-height:1.6;">Describe this feature and why it matters to your customers.</p>
    </div>
  </div>
</section>`,
  },
  {
    type: "cta_banner",
    icon: "≡ƒôó",
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
    icon: "≡ƒÆ¼",
    label: "Testimonials",
    description: "Customer reviews and testimonials",
    defaultContent: `<section style="padding:60px 40px;background:#f8f9ff;">
  <div style="max-width:1200px;margin:0 auto;text-align:center;">
    <h2 style="font-size:36px;font-weight:700;color:#1e1b4b;margin-bottom:48px;">What Our Customers Say</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
      <div style="background:#fff;padding:28px;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.06);text-align:left;">
        <div style="color:#FFCE2E;font-size:20px;margin-bottom:12px;">ΓÿàΓÿàΓÿàΓÿàΓÿà</div>
        <p style="color:#444;line-height:1.7;margin-bottom:16px;">"Amazing service! Highly recommend to anyone looking to grow their business online."</p>
        <div style="font-weight:700;color:#1e1b4b;">John Smith</div>
        <div style="font-size:13px;color:#999;">CEO, Company Name</div>
      </div>
      <div style="background:#fff;padding:28px;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.06);text-align:left;">
        <div style="color:#FFCE2E;font-size:20px;margin-bottom:12px;">ΓÿàΓÿàΓÿàΓÿàΓÿà</div>
        <p style="color:#444;line-height:1.7;margin-bottom:16px;">"The results were incredible. Our ratings improved significantly within weeks."</p>
        <div style="font-weight:700;color:#1e1b4b;">Sarah Johnson</div>
        <div style="font-size:13px;color:#999;">Marketing Director</div>
      </div>
      <div style="background:#fff;padding:28px;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.06);text-align:left;">
        <div style="color:#FFCE2E;font-size:20px;margin-bottom:12px;">ΓÿàΓÿàΓÿàΓÿàΓÿà</div>
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
    icon: "Γ¥ô",
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
    icon: "≡ƒô¥",
    label: "Text Block",
    description: "Simple text content block",
    defaultContent: `<section style="padding:60px 40px;max-width:800px;margin:0 auto;">
  <h2 style="font-size:32px;font-weight:700;color:#1e1b4b;margin-bottom:16px;">Section Heading</h2>
  <p style="font-size:16px;color:#555;line-height:1.8;margin-bottom:16px;">Your content goes here. Write as much as you need. This is a simple text block for articles, descriptions, or any long-form content.</p>
  <p style="font-size:16px;color:#555;line-height:1.8;">Add more paragraphs as needed. You can also add <strong>bold text</strong>, <em>italic text</em>, or <a href="#">links</a>.</p>
</section>`,
  },
  {
    "type": "custom-platform-cta",
    "icon": "Γ¡É",
    "label": "CTA ΓÇö Custom Platform",
    "description": "Call to action section with floating stars and custom platform messaging using Tailwind",
    "defaultContent": `<section id="custom-platform" class="relative w-full py-24 md:py-32 overflow-hidden flex items-center justify-center" style="background-color: #FFFEF9;">
  
  <img src="/uploads/media/1777637321032-6760b4c1-ddd4-4463-9b26-d526f49730b2-star1.png" 
       alt="" 
       class="absolute z-0 pointer-events-none hidden md:block" 
       style="width: 280px; top: 50%; left: 5%; transform: translateY(-50%) rotate(15deg); opacity: 0.35;">
  
  <img src="/uploads/media/1777637480498-260de892-4757-4855-9381-d933d25485b5-star2.png" 
       alt="" 
       class="absolute z-0 pointer-events-none hidden md:block" 
       style="width: 280px; top: 50%; right: 5%; transform: translateY(-50%) rotate(-15deg); opacity: 0.35;">

  <div class="relative z-10 max-w-350 mx-auto px-4 text-center">
    <h2 class="text-3xl md:text-[42px] leading-tight text-black mb-5" style="font-weight: 400;">
      CanΓÇÖt Find Your <strong style="font-weight: 700;">Platform</strong><br>Listed Above?
    </h2>
    
    <p class="text-base md:text-[18px] text-[#4b5563] max-w-[800px] mx-auto mb-10 leading-relaxed">
      Share your preferred platform with us, and our team will design a customized approach <br> to help you build a credible review presence where it matters the most.
    </p>

    <a href="/contact-us" class="inline-flex items-center justify-center text-black font-medium rounded-lg transition-transform hover:-translate-y-1 shadow-sm hover:shadow" style="background-color: #FCD12A; padding: 14px 40px; font-size: 16px; gap: 8px;">
      Contact Us <span style="font-size: 18px; line-height: 1;">&rarr;</span>
    </a>
  </div>
</section>`
  },
  {
    "type": "why-trust-us",
    "icon": "≡ƒ¢í∩╕Å",
    "label": "Why Trust Us Grid",
    "description": "A 6-card grid layout using custom SVG icons for trust factors",
    "defaultContent": `<section class="py-16 bg-gray-50">
  <div class="container mx-auto px-4 text-center">
    <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Why Do Businesses Trust Get Reviews Buzz?</h2>
    <p class="text-gray-600 max-w-2xl mx-auto mb-12">As your reliable partner, we help your business strengthen their online reputation, build lasting customer trust, and drive consistent growth through effective review strategies.</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-left transition-all hover:shadow-md">
        <img src="/uploads/media/1778825935130-48c8352e-e042-4cd7-a93a-1edf9b56925e-experience.svg" alt="Experience" class="w-12 h-12 mb-4">
        <h3 class="text-xl font-semibold mb-2">Experience and Expertise</h3>
        <p class="text-gray-600 text-sm leading-relaxed">Our team brings hands-on experience in digital reputation management, helping businesses enhance visibility and build stronger customer trust.</p>
      </div>
      
      <div class="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-left transition-all hover:shadow-md">
        <img src="/uploads/media/1778825988863-d9a9e6f2-89e7-4dd2-8e7d-ef6e7de1e9f1-Idea.svg" alt="Solutions" class="w-12 h-12 mb-4">
        <h3 class="text-xl font-semibold mb-2">Tailored Solutions</h3>
        <p class="text-gray-600 text-sm leading-relaxed">Every business is different. That's why we create customized strategies designed to match your specific goals, audience, and market needs.</p>
      </div>
      
      <div class="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-left transition-all hover:shadow-md">
        <img src="/uploads/media/1778826045227-4ae4cea7-3257-4de4-9a69-4448de9fed37-customer.svg" alt="Satisfaction" class="w-12 h-12 mb-4">
        <h3 class="text-xl font-semibold mb-2">Customer Satisfaction Focused</h3>
        <p class="text-gray-600 text-sm leading-relaxed">We're committed to a seamless experience, ensuring every client sees real value and measurable improvement in their online presence.</p>
      </div>
      
      <div class="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-left transition-all hover:shadow-md">
        <img src="https://getreviews.buzz/storage/app/blog/0503869001728298428_global.svg" alt="Global Reach" class="w-12 h-12 mb-4">
        <h3 class="text-xl font-semibold mb-2">Global Reach, Local Understanding</h3>
        <p class="text-gray-600 text-sm leading-relaxed">We help you connect with a wider audience while maintaining strong relevance in your local market, ensuring balanced and effective growth.</p>
      </div>
      
      <div class="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-left transition-all hover:shadow-md">
        <img src="https://getreviews.buzz/storage/app/blog/0751261001728298333_privacy.svg" alt="Privacy" class="w-12 h-12 mb-4">
        <h3 class="text-xl font-semibold mb-2">Privacy & Security</h3>
        <p class="text-gray-600 text-sm leading-relaxed">Your data and business information are handled with the highest level of confidentiality and care at every stage, ensuring complete protection.</p>
      </div>
      
      <div class="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-left transition-all hover:shadow-md">
        <img src="https://getreviews.buzz/storage/app/blog/0748952001728298333_support.svg" alt="Support" class="w-12 h-12 mb-4">
        <h3 class="text-xl font-semibold mb-2">Dedicated Support & Guidance</h3>
        <p class="text-gray-600 text-sm leading-relaxed">Our team is always available to support you. From strategy to execution, our experts are available to assist whenever you need it, with timely guidance.</p>
      </div>
    </div>
  </div>
</section>`
  },
  {
    "type": "faq-section",
    "icon": "Γ¥ô",
    "label": "FAQ Accordion Section",
    "description": "A 2-column layout with heading and accordion-style FAQ list",
    "defaultContent": `<section class="bg-white py-16 lg:py-24 font-sans">
  <div class="max-w-[1500px] mx-auto px-4">
    <div class="grid grid-cols-1 lg:grid-cols-[490px_1fr] gap-12 lg:gap-24 items-start">
      
      <div class="lg:sticky lg:top-24">
        <h2 class="text-3xl md:text-4xl font-normal text-gray-900 leading-tight mb-6">
          Frequently <strong class="font-bold">Asked<br />Questions</strong>
        </h2>
        <p class="text-gray-600 text-lg mb-8">
          Find clear answers to common questions about our services, process, and delivery timelines.
        </p>
        <a href="/contact-us" class="inline-flex items-center gap-2 border-2 border-black px-6 py-3 rounded-lg font-medium hover:bg-black hover:text-white transition-all">
          Reach out today &rarr;
        </a>
      </div>

      <div class="flex flex-col gap-4">
        <div class="border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold text-lg mb-2">What Services Does Get Reviews Buzz Provide?</h3>
          <p class="text-gray-600 text-sm">We help businesses strengthen their online reputation through review growth strategies, reputation management, and digital marketing solutions.</p>
        </div>
        <div class="border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold text-lg mb-2">How Long Does It Take To See Results?</h3>
          <p class="text-gray-600 text-sm">Most businesses begin to see noticeable improvements within 7 to 14 days, depending on the platform, industry, and strategy.</p>
        </div>
        <div class="border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold text-lg mb-2">Are The Reviews From Real People?</h3>
          <p class="text-gray-600 text-sm">We focus on promoting genuine customer feedback and building a credible review presence through ethical strategies.</p>
        </div>
        <div class="border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold text-lg mb-2">What Platforms Do You Support?</h3>
          <p class="text-gray-600 text-sm">We support major platforms including Google, Trustpilot, Yelp, Facebook, and others based on your specific requirements.</p>
        </div>
      </div>

    </div>
  </div>
</section>`
  },
];
