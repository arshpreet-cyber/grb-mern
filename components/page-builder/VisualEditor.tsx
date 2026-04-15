"use client";

import { useState, useRef } from "react";

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
      { key: "bg_color", label: "Background Color", type: "color" }
    );
  } else if (sectionType === "image-right" || sectionType === "image-left") {
    fields.push(
      { key: "h2", label: "Heading", type: "text", placeholder: "Section heading" },
      { key: "p", label: "Description", type: "textarea", placeholder: "Description text..." },
      { key: "cta_text", label: "Button Text", type: "text", placeholder: "Learn More →" },
      { key: "cta_href", label: "Button Link", type: "url", placeholder: "https://..." },
      { key: "img_src", label: "Image URL", type: "image", placeholder: "https://..." },
      { key: "img_alt", label: "Image Alt Text", type: "text", placeholder: "Image description" }
    );
  } else if (sectionType === "product-banner") {
    fields.push(
      { key: "badge", label: "Badge Text", type: "text", placeholder: "FEATURED PRODUCT" },
      { key: "h2", label: "Product Name", type: "text", placeholder: "Product Name" },
      { key: "p", label: "Description", type: "textarea", placeholder: "Product description..." },
      { key: "price", label: "Price", type: "text", placeholder: "$29.99" },
      { key: "cta_text", label: "Button Text", type: "text", placeholder: "Buy Now →" },
      { key: "cta_href", label: "Button Link", type: "url", placeholder: "https://..." },
      { key: "img_src", label: "Product Image URL", type: "image", placeholder: "https://..." }
    );
  } else if (sectionType === "cta-banner") {
    fields.push(
      { key: "h2", label: "Heading", type: "text", placeholder: "Ready to Get Started?" },
      { key: "p", label: "Subtext", type: "text", placeholder: "Join thousands of businesses..." },
      { key: "cta_text", label: "Button Text", type: "text", placeholder: "Start Today →" },
      { key: "cta_href", label: "Button Link", type: "url", placeholder: "https://..." },
      { key: "bg_color", label: "Background Color", type: "color" }
    );
  } else if (sectionType === "text-block") {
    fields.push(
      { key: "h2", label: "Heading", type: "text", placeholder: "Section Heading" },
      { key: "p", label: "Content", type: "textarea", placeholder: "Your content..." }
    );
  } else {
    // Generic fallback
    fields.push(
      { key: "h2", label: "Heading", type: "text", placeholder: "Section heading" },
      { key: "p", label: "Content", type: "textarea", placeholder: "Content..." }
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
  
  const [viewMode, setViewMode] = useState<"visual" | "code" | "preview">("visual");
  const [htmlValue, setHtmlValue] = useState(value);
  const [values, setValues] = useState<Record<string, string>>(parseValues(value, fields));
  const [activeField, setActiveField] = useState<string | null>(null);
  
  const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleSave = () => {
    onChange(htmlValue);
    onClose();
  };

  const set = (key: string, val: string) => {
    const newValues = { ...values, [key]: val };
    setValues(newValues);
    setHtmlValue(applyValues(htmlValue, newValues, sectionType));
  };

  const updateHtmlState = (newHtml: string) => {
    setHtmlValue(newHtml);
    setValues(parseValues(newHtml, fields));
  };

  function wrap(open: string, close: string) {
    const ta = document.getElementById("html-editor-textarea") as HTMLTextAreaElement;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = htmlValue.slice(start, end);
    const newCode = htmlValue.slice(0, start) + open + selected + close + htmlValue.slice(end);
    updateHtmlState(newCode);
  }

  function insert(html: string) {
    const ta = document.getElementById("html-editor-textarea") as HTMLTextAreaElement;
    if (!ta) return;
    const pos = ta.selectionStart;
    const newCode = htmlValue.slice(0, pos) + html + htmlValue.slice(pos);
    updateHtmlState(newCode);
  }

  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const target = e.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    
    let targetKey: string | null = null;

    if (tagName === "h1") targetKey = "h1";
    else if (tagName === "h2") targetKey = "h2";
    else if (tagName === "p") targetKey = "p";
    else if (tagName === "a") targetKey = "cta_text";
    else if (tagName === "img") targetKey = "img_src";
    else if (tagName === "span") targetKey = "badge";
    else if (tagName === "section" || tagName === "div") targetKey = "bg_color";

    if (targetKey && fields.some(f => f.key === targetKey)) {
      setActiveField(targetKey);
      const ref = fieldRefs.current[targetKey];
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ height: "90vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <span className="text-xl">{viewMode === "visual" ? "✨" : "💻"}</span>
            <div>
              <p className="text-base font-bold text-slate-800">
                {title || (viewMode === "visual" ? "Edit Section" : "HTML Editor")}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {viewMode === "visual" 
                  ? "Click any element in the preview to edit it" 
                  : "Edit the HTML content for this section"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            
            {/* The old pill-style switch button */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                type="button"
                onClick={() => setViewMode("visual")} 
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${viewMode === 'visual' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Visual Edit
              </button>
              <button 
                type="button"
                onClick={() => setViewMode("code")} 
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${viewMode === 'code' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                &lt;/&gt; Code
              </button>
              <button 
                type="button"
                onClick={() => setViewMode("preview")} 
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${viewMode === 'preview' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                👁 Preview
              </button>
            </div>

            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            <button onClick={onClose}
              type="button"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              Cancel
            </button>
            <button onClick={handleSave}
              type="button"
              className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-bold text-white hover:bg-violet-700 transition shadow-sm">
              Save Changes
            </button>
          </div>
        </div>

        {/* Dynamic Content Area based on View Mode */}
        <div className="flex-1 overflow-hidden flex bg-slate-100">
          
          {viewMode === "visual" && (
            <>
              {/* Interactive Preview Area (Left Side) */}
              <div className="flex-1 overflow-auto p-8 relative flex items-start justify-center">
                <style dangerouslySetInnerHTML={{__html: `
                  .interactive-preview h1:hover, 
                  .interactive-preview h2:hover, 
                  .interactive-preview p:hover, 
                  .interactive-preview a:hover, 
                  .interactive-preview img:hover,
                  .interactive-preview span:hover {
                    outline: 2px dashed #8b5cf6 !important;
                    outline-offset: 4px;
                    cursor: pointer;
                    border-radius: 4px;
                    transition: outline 0.1s ease-in-out;
                  }
                `}} />
                
                <div 
                  className="interactive-preview w-full max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden border border-slate-200"
                  onClick={handlePreviewClick}
                  dangerouslySetInnerHTML={{ __html: htmlValue }} 
                />
              </div>

              {/* Sidebar Editor (Right Side) */}
              <div className="w-96 flex-shrink-0 bg-white border-l border-slate-200 overflow-y-auto shadow-[-4px_0_15px_rgba(0,0,0,0.03)] z-10">
                <div className="p-6 space-y-6">
                  <div className="rounded-xl bg-violet-50 border border-violet-100 p-4 shadow-sm">
                    <p className="text-xs text-violet-700 font-medium leading-relaxed">
                      💡 Select an element on the left, or edit the fields directly below.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {fields.map((field) => {
                      const isActive = activeField === field.key;
                      
                      return (
                        <div 
                          key={field.key} 
                          ref={(el) => { fieldRefs.current[field.key] = el }}
                          className={`p-4 rounded-xl border transition-all duration-300 ${
                            isActive 
                              ? "border-violet-500 bg-violet-50/50 shadow-[0_0_0_4px_rgba(139,92,246,0.1)] ring-1 ring-violet-500" 
                              : "border-slate-200 bg-white hover:border-violet-300"
                          }`}
                          onClick={() => setActiveField(field.key)}
                        >
                          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isActive ? "text-violet-700" : "text-slate-600"}`}>
                            {field.label}
                          </label>
                          
                          {field.type === "textarea" ? (
                            <textarea
                              value={values[field.key] || ""}
                              onChange={(e) => set(field.key, e.target.value)}
                              placeholder={field.placeholder}
                              rows={4}
                              className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-800 outline-none transition resize-none ${
                                isActive ? "border-violet-400 bg-white ring-2 ring-violet-100" : "border-slate-200 bg-slate-50 focus:border-violet-400 focus:bg-white"
                              }`}
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
                                className={`flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                                  isActive ? "border-violet-400 bg-white ring-2 ring-violet-100" : "border-slate-200 bg-slate-50 focus:border-violet-400 focus:bg-white"
                                }`}
                              />
                            </div>
                          ) : field.type === "image" ? (
                            <div className="space-y-3">
                              <input
                                type="url"
                                value={values[field.key] || ""}
                                onChange={(e) => set(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                                  isActive ? "border-violet-400 bg-white ring-2 ring-violet-100" : "border-slate-200 bg-slate-50 focus:border-violet-400 focus:bg-white"
                                }`}
                              />
                              {values[field.key] && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={values[field.key]} alt="preview"
                                  className="w-full h-auto rounded-lg border border-slate-200 object-cover shadow-sm bg-slate-50"
                                  onError={(e) => (e.currentTarget.style.display = "none")} />
                              )}
                            </div>
                          ) : (
                            <input
                              type={field.type === "url" ? "url" : "text"}
                              value={values[field.key] || ""}
                              onChange={(e) => set(field.key, e.target.value)}
                              placeholder={field.placeholder}
                              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-800 outline-none transition ${
                                isActive ? "border-violet-400 bg-white ring-2 ring-violet-100" : "border-slate-200 bg-slate-50 focus:border-violet-400 focus:bg-white"
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {viewMode === "code" && (
            <div className="flex-1 flex flex-col w-full h-full">
              {/* HTML Editor Toolbar */}
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700 shrink-0">
                {[
                  { label: "B", action: () => wrap("<strong>", "</strong>"), title: "Bold" },
                  { label: "I", action: () => wrap("<em>", "</em>"), title: "Italic" },
                  { label: "H2", action: () => wrap('<h2 style="font-size:28px;font-weight:700;">', "</h2>"), title: "Heading" },
                  { label: "P", action: () => wrap("<p>", "</p>"), title: "Paragraph" },
                  { label: "A", action: () => wrap('<a href="#">', "</a>"), title: "Link" },
                  { label: "IMG", action: () => insert('<img src="https://placehold.co/600x400" alt="" style="width:100%;border-radius:8px;" />'), title: "Image" },
                  { label: "DIV", action: () => wrap('<div style="padding:20px;">', "</div>"), title: "Div" },
                ].map((btn) => (
                  <button key={btn.label} onClick={btn.action} title={btn.title} type="button"
                    className="px-2.5 py-1 rounded text-xs font-bold text-slate-300 hover:bg-slate-600 hover:text-white transition font-mono">
                    {btn.label}
                  </button>
                ))}
                <div className="ml-auto text-xs text-slate-500">{htmlValue.length} chars</div>
              </div>
              
              <textarea
                id="html-editor-textarea"
                value={htmlValue}
                onChange={(e) => updateHtmlState(e.target.value)}
                className="flex-1 w-full bg-slate-900 text-green-400 font-mono text-sm p-4 outline-none resize-none leading-relaxed"
                spellCheck={false}
                placeholder=""
              />
            </div>
          )}

          {viewMode === "preview" && (
            <div className="flex-1 w-full h-full overflow-auto bg-white flex flex-col">
              <div className="p-4 bg-amber-50 border-b border-amber-200 text-xs text-amber-700 font-medium shrink-0">
                ⚠ Preview — styles may differ slightly from the live page
              </div>
              <div
                className="p-8 mx-auto w-full max-w-4xl"
                dangerouslySetInnerHTML={{ __html: htmlValue }}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}