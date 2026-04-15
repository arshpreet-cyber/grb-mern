"use client";

import { useState } from "react";

interface VisualField {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "color" | "image";
  placeholder?: string;
}

// Extract editable fields from HTML by parsing common patterns
function extractFields(html: string, sectionType: string): VisualField[] {
  const fields: VisualField[] = [];

  if (sectionType === "hero") {
    fields.push(
      { key: "h1", label: "Main Heading", type: "text", placeholder: "Your headline here" },
      { key: "p", label: "Subheading Text", type: "textarea", placeholder: "Supporting text..." },
      { key: "cta_text", label: "Button Text", type: "text", placeholder: "Get Started →" },
      { key: "cta_href", label: "Button Link", type: "url", placeholder: "https://..." },
      { key: "bg_color", label: "Background Color", type: "color" },
    );
  } else if (sectionType === "image-right" || sectionType === "image-left") {
    fields.push(
      { key: "h2", label: "Heading", type: "text", placeholder: "Section heading" },
      { key: "p", label: "Description", type: "textarea", placeholder: "Description text..." },
      { key: "cta_text", label: "Button Text", type: "text", placeholder: "Learn More →" },
      { key: "cta_href", label: "Button Link", type: "url", placeholder: "https://..." },
      { key: "img_src", label: "Image URL", type: "image", placeholder: "https://..." },
      { key: "img_alt", label: "Image Alt Text", type: "text", placeholder: "Image description" },
    );
  } else if (sectionType === "product-banner") {
    fields.push(
      { key: "badge", label: "Badge Text", type: "text", placeholder: "FEATURED PRODUCT" },
      { key: "h2", label: "Product Name", type: "text", placeholder: "Product Name" },
      { key: "p", label: "Description", type: "textarea", placeholder: "Product description..." },
      { key: "price", label: "Price", type: "text", placeholder: "$29.99" },
      { key: "cta_text", label: "Button Text", type: "text", placeholder: "Buy Now →" },
      { key: "cta_href", label: "Button Link", type: "url", placeholder: "https://..." },
      { key: "img_src", label: "Product Image URL", type: "image", placeholder: "https://..." },
    );
  } else if (sectionType === "cta-banner") {
    fields.push(
      { key: "h2", label: "Heading", type: "text", placeholder: "Ready to Get Started?" },
      { key: "p", label: "Subtext", type: "text", placeholder: "Join thousands of businesses..." },
      { key: "cta_text", label: "Button Text", type: "text", placeholder: "Start Today →" },
      { key: "cta_href", label: "Button Link", type: "url", placeholder: "https://..." },
      { key: "bg_color", label: "Background Color", type: "color" },
    );
  } else if (sectionType === "text-block") {
    fields.push(
      { key: "h2", label: "Heading", type: "text", placeholder: "Section Heading" },
      { key: "p", label: "Content", type: "textarea", placeholder: "Your content..." },
    );
  } else {
    // Generic fallback
    fields.push(
      { key: "h2", label: "Heading", type: "text", placeholder: "Section heading" },
      { key: "p", label: "Content", type: "textarea", placeholder: "Content..." },
    );
  }

  return fields;
}

// Parse current values from HTML
function parseValues(html: string, fields: VisualField[]): Record<string, string> {
  const values: Record<string, string> = {};

  fields.forEach((f) => {
    if (f.key === "h1") {
      const m = html.match(/<h1[^>]*>(.*?)<\/h1>/s);
      values[f.key] = m ? m[1].replace(/<[^>]+>/g, "") : "";
    } else if (f.key === "h2") {
      const m = html.match(/<h2[^>]*>(.*?)<\/h2>/s);
      values[f.key] = m ? m[1].replace(/<[^>]+>/g, "") : "";
    } else if (f.key === "p") {
      const m = html.match(/<p[^>]*>(.*?)<\/p>/s);
      values[f.key] = m ? m[1].replace(/<[^>]+>/g, "") : "";
    } else if (f.key === "cta_text") {
      const m = html.match(/<a[^>]*>(.*?)<\/a>/s);
      values[f.key] = m ? m[1].replace(/<[^>]+>/g, "") : "";
    } else if (f.key === "cta_href") {
      const m = html.match(/href="([^"]+)"/);
      values[f.key] = m ? m[1] : "#";
    } else if (f.key === "img_src") {
      const m = html.match(/src="([^"]+)"/);
      values[f.key] = m ? m[1] : "";
    } else if (f.key === "img_alt") {
      const m = html.match(/alt="([^"]*)"/);
      values[f.key] = m ? m[1] : "";
    } else if (f.key === "bg_color") {
      const m = html.match(/background(?:-color)?:\s*(#[a-fA-F0-9]{3,6}|[a-z]+)/);
      values[f.key] = m ? m[1] : "#ffffff";
    } else if (f.key === "price") {
      const m = html.match(/\$[\d.,]+/);
      values[f.key] = m ? m[0] : "$0.00";
    } else if (f.key === "badge") {
      const m = html.match(/<span[^>]*>(.*?)<\/span>/s);
      values[f.key] = m ? m[1].replace(/<[^>]+>/g, "") : "";
    }
  });

  return values;
}

// Apply updated values back to HTML
function applyValues(html: string, values: Record<string, string>, sectionType: string): string {
  let result = html;

  Object.entries(values).forEach(([key, val]) => {
    if (key === "h1") {
      result = result.replace(/(<h1[^>]*>)(.*?)(<\/h1>)/s, `$1${val}$3`);
    } else if (key === "h2") {
      result = result.replace(/(<h2[^>]*>)(.*?)(<\/h2>)/s, `$1${val}$3`);
    } else if (key === "p") {
      result = result.replace(/(<p[^>]*>)(.*?)(<\/p>)/s, `$1${val}$3`);
    } else if (key === "cta_text") {
      result = result.replace(/(<a[^>]*>)(.*?)(<\/a>)/s, `$1${val}$3`);
    } else if (key === "cta_href") {
      result = result.replace(/(href=")[^"]*(")/g, `$1${val}$2`);
    } else if (key === "img_src") {
      result = result.replace(/(src=")[^"]*(")/g, `$1${val}$2`);
    } else if (key === "img_alt") {
      result = result.replace(/(alt=")[^"]*(")/g, `$1${val}$2`);
    } else if (key === "bg_color") {
      result = result.replace(/(background(?:-color)?:\s*)(#[a-fA-F0-9]{3,6}|[a-z]+)/g, `$1${val}`);
    } else if (key === "price") {
      result = result.replace(/\$[\d.,]+/, val);
    } else if (key === "badge") {
      result = result.replace(/(<span[^>]*>)(.*?)(<\/span>)/s, `$1${val}$3`);
    }
  });

  return result;
}

interface Props {
  value: string;
  sectionType: string;
  onChange: (v: string) => void;
  onClose: () => void;
  title?: string;
}

export default function VisualEditor({ value, sectionType, onChange, onClose, title }: Props) {
  const fields = extractFields(value, sectionType);
  const [values, setValues] = useState<Record<string, string>>(parseValues(value, fields));
  const [tab, setTab] = useState<"visual" | "preview">("visual");

  const previewHtml = applyValues(value, values, sectionType);

  const handleSave = () => {
    onChange(previewHtml);
    onClose();
  };

  const set = (key: string, val: string) => setValues((p) => ({ ...p, [key]: val }));

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ height: "85vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-lg">✏️</span>
            <div>
              <p className="text-sm font-bold text-slate-800">{title || "Edit Section"}</p>
              <p className="text-xs text-slate-400">No coding required — just fill in the fields</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 overflow-hidden mr-2">
              <button onClick={() => setTab("visual")}
                className={`px-4 py-1.5 text-xs font-semibold transition ${tab === "visual" ? "bg-violet-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                ✏️ Edit
              </button>
              <button onClick={() => setTab("preview")}
                className={`px-4 py-1.5 text-xs font-semibold transition ${tab === "preview" ? "bg-violet-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                👁 Preview
              </button>
            </div>
            <button onClick={handleSave}
              className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700 transition">
              Save Changes
            </button>
            <button onClick={onClose}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
              Cancel
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {tab === "visual" ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="rounded-xl bg-violet-50 border border-violet-100 px-4 py-3 text-xs text-violet-700">
                💡 Edit the fields below. Changes will be applied to the section automatically.
              </div>
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={values[field.key] || ""}
                      onChange={(e) => set(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition resize-none"
                    />
                  ) : field.type === "color" ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={values[field.key] || "#ffffff"}
                        onChange={(e) => set(field.key, e.target.value)}
                        className="h-10 w-16 rounded-lg border border-slate-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={values[field.key] || ""}
                        onChange={(e) => set(field.key, e.target.value)}
                        placeholder="#000000"
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition"
                      />
                    </div>
                  ) : field.type === "image" ? (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={values[field.key] || ""}
                        onChange={(e) => set(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition"
                      />
                      {values[field.key] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={values[field.key]} alt="preview"
                          className="h-24 rounded-lg border border-slate-200 object-cover"
                          onError={(e) => (e.currentTarget.style.display = "none")} />
                      )}
                    </div>
                  ) : (
                    <input
                      type={field.type === "url" ? "url" : "text"}
                      value={values[field.key] || ""}
                      onChange={(e) => set(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 overflow-auto bg-white">
              <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-700 font-medium">
                ⚠ Preview — styles may differ slightly from the live page
              </div>
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
