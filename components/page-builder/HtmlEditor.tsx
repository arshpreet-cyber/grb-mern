"use client";

import { useState, useEffect } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  title?: string;
}

export default function HtmlEditor({ value, onChange, onClose, title }: Props) {
  const [code, setCode] = useState(value);
  const [tab, setTab] = useState<"code" | "preview">("code");

  useEffect(() => { setCode(value); }, [value]);

  const handleSave = () => { onChange(code); onClose(); };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ height: "85vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-lg">💻</span>
            <div>
              <p className="text-sm font-bold text-slate-800">{title || "HTML Editor"}</p>
              <p className="text-xs text-slate-400">Edit the HTML content for this section</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex rounded-lg border border-slate-200 overflow-hidden mr-2">
              <button onClick={() => setTab("code")}
                className={`px-4 py-1.5 text-xs font-semibold transition ${tab === "code" ? "bg-violet-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                &lt;/&gt; Code
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

        {/* Editor / Preview */}
        <div className="flex-1 overflow-hidden">
          {tab === "code" ? (
            <div className="h-full flex flex-col">
              {/* Toolbar */}
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
                  <button key={btn.label} onClick={btn.action} title={btn.title}
                    className="px-2.5 py-1 rounded text-xs font-bold text-slate-300 hover:bg-slate-600 hover:text-white transition font-mono">
                    {btn.label}
                  </button>
                ))}
                <div className="ml-auto text-xs text-slate-500">{code.length} chars</div>
              </div>
              <textarea
                id="html-editor-textarea"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 w-full bg-slate-900 text-green-400 font-mono text-sm p-4 outline-none resize-none leading-relaxed"
                spellCheck={false}
                placeholder="<!-- Write your HTML here -->"
              />
            </div>
          ) : (
            <div className="h-full overflow-auto bg-white">
              <div className="p-4 bg-amber-50 border-b border-amber-200 text-xs text-amber-700 font-medium">
                ⚠ Preview — styles may differ slightly from the live page
              </div>
              <div
                className="p-4"
                dangerouslySetInnerHTML={{ __html: code }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function wrap(open: string, close: string) {
    const ta = document.getElementById("html-editor-textarea") as HTMLTextAreaElement;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = code.slice(start, end);
    const newCode = code.slice(0, start) + open + selected + close + code.slice(end);
    setCode(newCode);
  }

  function insert(html: string) {
    const ta = document.getElementById("html-editor-textarea") as HTMLTextAreaElement;
    if (!ta) return;
    const pos = ta.selectionStart;
    setCode(code.slice(0, pos) + html + code.slice(pos));
  }
}
