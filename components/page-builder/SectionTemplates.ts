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
    description: "Text on left, image on right",
    defaultContent: `<section style="display:flex;align-items:center;gap:48px;padding:60px 40px;max-width:1200px;margin:0 auto;">
  <div style="flex:1;">
    <h2 style="font-size:36px;font-weight:700;color:#1e1b4b;margin-bottom:16px;">Section Heading</h2>
    <p style="font-size:16px;color:#555;line-height:1.7;margin-bottom:24px;">Add your description here. Explain the benefits, features or story behind this section.</p>
    <a href="#" style="background:#1e1b4b;color:#fff;padding:12px 28px;border-radius:8px;font-weight:600;text-decoration:none;">Learn More →</a>
  </div>
  <div style="flex:1;">
    <img src="https://placehold.co/600x400" alt="Section Image" style="width:100%;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.1);" />
  </div>
</section>`,
  },
  {
    type: "image-left",
    icon: "⬅️🖼️",
    label: "Section — Image Left",
    description: "Image on left, text on right",
    defaultContent: `<section style="display:flex;align-items:center;gap:48px;padding:60px 40px;max-width:1200px;margin:0 auto;">
  <div style="flex:1;">
    <img src="https://placehold.co/600x400" alt="Section Image" style="width:100%;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.1);" />
  </div>
  <div style="flex:1;">
    <h2 style="font-size:36px;font-weight:700;color:#1e1b4b;margin-bottom:16px;">Section Heading</h2>
    <p style="font-size:16px;color:#555;line-height:1.7;margin-bottom:24px;">Add your description here. Explain the benefits, features or story behind this section.</p>
    <a href="#" style="background:#1e1b4b;color:#fff;padding:12px 28px;border-radius:8px;font-weight:600;text-decoration:none;">Learn More →</a>
  </div>
</section>`,
  },
  {
    type: "product-banner",
    icon: "🛍️",
    label: "Product Banner",
    description: "Product showcase with price and buy button",
    defaultContent: `<section style="background:#f8f9ff;padding:60px 40px;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:48px;">
    <div style="flex:1;">
      <span style="background:#FFCE2E;color:#000;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;">FEATURED PRODUCT</span>
      <h2 style="font-size:36px;font-weight:800;color:#1e1b4b;margin:12px 0;">Product Name</h2>
      <p style="font-size:16px;color:#555;line-height:1.7;margin-bottom:16px;">Describe your product here. Highlight key features and benefits.</p>
      <ul style="list-style:none;padding:0;margin-bottom:24px;">
        <li style="padding:6px 0;color:#333;">✅ Feature one</li>
        <li style="padding:6px 0;color:#333;">✅ Feature two</li>
        <li style="padding:6px 0;color:#333;">✅ Feature three</li>
      </ul>
      <div style="display:flex;align-items:center;gap:16px;">
        <span style="font-size:32px;font-weight:800;color:#1e1b4b;">$29.99</span>
        <a href="#" style="background:#FFCE2E;color:#000;padding:12px 28px;border-radius:8px;font-weight:700;text-decoration:none;">Buy Now →</a>
      </div>
    </div>
    <div style="flex:1;">
      <img src="https://placehold.co/500x500" alt="Product" style="width:100%;border-radius:16px;" />
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
    type: "cta-banner",
    icon: "📣",
    label: "CTA Banner",
    description: "Call-to-action with background color",
    defaultContent: `<section style="background:#FFCE2E;padding:60px 40px;text-align:center;">
  <h2 style="font-size:36px;font-weight:800;color:#000;margin-bottom:12px;">Ready to Get Started?</h2>
  <p style="font-size:18px;color:#333;margin-bottom:32px;">Join thousands of businesses that trust us.</p>
  <a href="#" style="background:#000;color:#fff;padding:14px 36px;border-radius:8px;font-weight:700;text-decoration:none;font-size:16px;">Start Today →</a>
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
    description: "Frequently asked questions accordion",
    defaultContent: `<section style="padding:60px 40px;max-width:800px;margin:0 auto;">
  <h2 style="font-size:36px;font-weight:700;color:#1e1b4b;text-align:center;margin-bottom:48px;">Frequently Asked Questions</h2>
  <div style="space-y:16px;">
    <details style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:12px;">
      <summary style="font-weight:600;color:#1e1b4b;cursor:pointer;font-size:16px;">Question one goes here?</summary>
      <p style="color:#666;margin-top:12px;line-height:1.7;">Answer to question one. Provide a clear and helpful response.</p>
    </details>
    <details style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:12px;">
      <summary style="font-weight:600;color:#1e1b4b;cursor:pointer;font-size:16px;">Question two goes here?</summary>
      <p style="color:#666;margin-top:12px;line-height:1.7;">Answer to question two. Provide a clear and helpful response.</p>
    </details>
    <details style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:12px;">
      <summary style="font-weight:600;color:#1e1b4b;cursor:pointer;font-size:16px;">Question three goes here?</summary>
      <p style="color:#666;margin-top:12px;line-height:1.7;">Answer to question three. Provide a clear and helpful response.</p>
    </details>
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
