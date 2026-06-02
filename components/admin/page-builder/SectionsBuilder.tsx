"use client";

import { useState } from "react";
import { SECTION_TEMPLATES } from "./SectionTemplates";
import VisualEditor from "./VisualEditor";

export type Section = {
  id: string;
  type: string;
  label: string;
  heading: string;
  content: string;
};

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function SectionsBuilder({
  sections, onChange,
}: {
  sections: Section[];
  onChange: (s: Section[]) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addSection = (templateType: string) => {
    const tpl = SECTION_TEMPLATES.find((t) => t.type === templateType);
    if (!tpl) return;
    onChange([...sections, {
      id: genId(),
      type: tpl.type,
      label: tpl.label,
      heading: "",
      content: tpl.defaultContent,
    }]);
    setShowPicker(false);
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

  const editingSection = sections.find((s) => s.id === editingId);

  return (
    <div className="space-y-3">
      {/* Empty state */}
      {sections.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-10 text-center">
          <div className="text-4xl mb-3">≡ƒº⌐</div>
          <p className="text-sm font-semibold text-slate-600">No sections yet</p>
          <p className="text-xs text-slate-400 mt-1">Click "Add Section" to choose a component</p>
        </div>
      )}

      {/* Section Cards */}
      {sections.map((section, i) => {
        const tpl = SECTION_TEMPLATES.find((t) => t.type === section.type);
        return (
          <div key={section.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            {/* Card Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 text-[#D8A720] text-xs font-bold">{i + 1}</span>
                <span className="text-lg">{tpl?.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{section.label}</p>
                  <p className="text-[10px] text-slate-400">{tpl?.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => move(i, -1)} disabled={i === 0} type="button"
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 disabled:opacity-30 transition text-xs">Γåæ</button>
                <button onClick={() => move(i, 1)} disabled={i === sections.length - 1} type="button"
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 disabled:opacity-30 transition text-xs">Γåô</button>
                <button onClick={() => setEditingId(section.id)} type="button"
                  className="h-7 px-3 rounded-lg flex items-center gap-1.5 text-amber-600 hover:bg-amber-50 transition text-xs font-semibold">
                  Γ£Å Edit Section
                </button>
                <button onClick={() => remove(section.id)} type="button"
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition text-xs ml-1">Γ£ò</button>
              </div>
            </div>

            {/* Section heading input */}
            <div className="px-4 py-3">
              <input
                value={section.heading}
                onChange={(e) => update(section.id, "heading", e.target.value)}
                placeholder="Section label / heading (optional)"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#fc0] focus:ring-2 focus:ring-amber-500/20 transition"
              />
            </div>

            {/* Mini HTML preview */}
            <div className="px-4 pb-3">
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 cursor-pointer hover:border-[#fc0] transition"
                onClick={() => setEditingId(section.id)}>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Preview ΓÇö click to edit</p>
                <pre className="text-[11px] text-slate-500 font-mono overflow-hidden whitespace-pre-wrap line-clamp-3">
                  {section.content.slice(0, 200)}{section.content.length > 200 ? "..." : ""}
                </pre>
              </div>
            </div>
          </div>
        );
      })}

      {/* Add Section Button */}
      <button onClick={() => setShowPicker(true)}
        type="button"
        className="w-full rounded-xl border-2 border-dashed border-[#fc0]/40 py-3 text-sm font-semibold text-amber-700 hover:border-amber-400 hover:bg-amber-50 transition flex items-center justify-center gap-2">
        <span className="text-lg">+</span> Add Section
      </button>

      {/* Template Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">Choose a Section</h3>
                <p className="text-xs text-slate-400 mt-0.5">Click any component to add it to your page</p>
              </div>
              <button onClick={() => setShowPicker(false)} type="button"
                className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition text-sm">Γ£ò</button>
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto">
              {SECTION_TEMPLATES.map((tpl) => (
                <button key={tpl.type} onClick={() => addSection(tpl.type)} type="button"
                  className="flex flex-col items-start gap-2 rounded-xl border-2 border-slate-100 bg-slate-50 p-4 text-left hover:border-amber-400 hover:bg-amber-50 transition group">
                  <span className="text-3xl">{tpl.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-amber-700">{tpl.label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{tpl.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Unified Editor Modal */}
      {editingId && editingSection && (
        <VisualEditor
          title={editingSection.label}
          sectionType={editingSection.type}
          value={editingSection.content}
          onChange={(v) => update(editingId, "content", v)}
          onClose={() => setEditingId(null)}
        />
      )}
    </div>
  );
}
