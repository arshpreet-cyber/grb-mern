"use client";

import { useState } from "react";

export type Section = {
  id: string;
  type: string;
  heading: string;
  content: string;
};

const SECTION_TYPES = [
  "Hero", "Text Block", "Image + Text", "Features Grid",
  "Testimonials", "FAQ", "CTA Banner", "Custom HTML",
];

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function SectionsBuilder({
  sections, onChange,
}: {
  sections: Section[];
  onChange: (s: Section[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [newType, setNewType] = useState(SECTION_TYPES[0]);

  const add = () => {
    onChange([...sections, { id: genId(), type: newType, heading: "", content: "" }]);
    setAdding(false);
  };

  const update = (id: string, field: keyof Section, value: string) => {
    onChange(sections.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const remove = (id: string) => onChange(sections.filter((s) => s.id !== id));

  const move = (index: number, dir: -1 | 1) => {
    const arr = [...sections];
    const target = index + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    onChange(arr);
  };

  return (
    <div className="space-y-3">
      {sections.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-8 text-center text-sm text-slate-400">
          No sections yet. Click &quot;Add Section&quot; to get started.
        </div>
      )}

      {sections.map((section, i) => (
        <div key={section.id} className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100 text-violet-600 text-xs font-bold">{i + 1}</span>
              <span className="text-sm font-semibold text-slate-700">{section.type}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => move(i, -1)} disabled={i === 0}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition text-xs">↑</button>
              <button onClick={() => move(i, 1)} disabled={i === sections.length - 1}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition text-xs">↓</button>
              <button onClick={() => remove(section.id)}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition text-xs">✕</button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <input
              value={section.heading}
              onChange={(e) => update(section.id, "heading", e.target.value)}
              placeholder="Section heading (optional)"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
            />
            <textarea
              value={section.content}
              onChange={(e) => update(section.id, "content", e.target.value)}
              placeholder="Section content / HTML / description..."
              rows={3}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition resize-none"
            />
          </div>
        </div>
      ))}

      {adding ? (
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 space-y-3">
          <p className="text-xs font-semibold text-violet-700 uppercase tracking-wider">Choose Section Type</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SECTION_TYPES.map((t) => (
              <button key={t} onClick={() => setNewType(t)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold border transition ${newType === t ? "bg-violet-600 text-white border-violet-600" : "bg-white text-slate-600 border-slate-200 hover:border-violet-300"}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={add}
              className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700 transition">
              Add {newType}
            </button>
            <button onClick={() => setAdding(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)}
          className="w-full rounded-xl border-2 border-dashed border-violet-200 py-3 text-sm font-semibold text-violet-600 hover:border-violet-400 hover:bg-violet-50 transition flex items-center justify-center gap-2">
          <span className="text-lg">+</span> Add Section
        </button>
      )}
    </div>
  );
}
