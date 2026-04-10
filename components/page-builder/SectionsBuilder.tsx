"use client";

import { useState } from "react";
import { Section } from "@/scripts/types";
import { sectionMap } from "@/scripts/sectionMap";

const SECTION_TYPES = ["SectionWithRightImage", "SectionWithLeftImage"];

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function SectionsBuilder() {
  const [sections, setSections] = useState<Section[]>([]);

  const [newType, setNewType] = useState(SECTION_TYPES[0]);
  const [adding, setAdding] = useState(false);

  // ADD SECTION
 const add = () => {
  setSections((prev) => [
    ...prev,
    {
      id: genId(),
      type: newType,
      data: {},
    },
  ]);
  setAdding(false);
};

  // UPDATE SECTION DATA
  const update = (id: string, field: string, value: any) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, data: { ...s.data, [field]: value } }
          : s
      )
    );
  };

  // DELETE
  const remove = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  // MOVE UP/DOWN (like Laravel reorder)
  const move = (index: number, dir: number) => {
    const arr = [...sections];
    const target = index + dir;
    if (target < 0 || target >= arr.length) return;

    [arr[index], arr[target]] = [arr[target], arr[index]];
    setSections(arr);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">

      {/* EMPTY STATE */}
      {sections.length === 0 && (
        <div className="border-2 border-dashed p-10 text-center text-gray-400 rounded-xl">
          No sections yet. Add one.
        </div>
      )}

      {/* SECTIONS */}
      {sections.map((section, i) => {
        const Component = sectionMap[section.type];

        return (
          <div key={section.id} className="border rounded-xl bg-gray-50">

            {/* HEADER */}
            <div className="flex justify-between items-center p-3 bg-white border-b">
              <div className="font-semibold">
                {i + 1}. {section.type}
              </div>

              <div className="flex gap-2">
                <button onClick={() => move(i, -1)}>⬆</button>
                <button onClick={() => move(i, 1)}>⬇</button>
                <button onClick={() => remove(section.id)}>❌</button>
              </div>
            </div>

            {/* LIVE PREVIEW (LIKE YOUR PHP INCLUDE) */}
            <div className="p-4">
              {Component ? (
                <Component data={section.data} />
              ) : (
                <p>Component not found</p>
              )}
            </div>

            {/* EDIT FORM */}
            <div className="p-4 space-y-2">
              <input
                placeholder="Heading"
                className="w-full border p-2 rounded"
                value={section.data.heading || ""}
                onChange={(e) =>
                  update(section.id, "heading", e.target.value)
                }
              />

              <textarea
                placeholder="Content"
                className="w-full border p-2 rounded"
                value={section.data.content || ""}
                onChange={(e) =>
                  update(section.id, "content", e.target.value)
                }
              />

              <input
                placeholder="Image URL"
                className="w-full border p-2 rounded"
                value={section.data.image || ""}
                onChange={(e) =>
                  update(section.id, "image", e.target.value)
                }
              />
            </div>
          </div>
        );
      })}

      {/* ADD SECTION UI */}
      {adding ? (
        <div className="p-4 border rounded-xl bg-violet-50 space-y-2">
          <div className="flex gap-2">
            {SECTION_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setNewType(t)}
                className={`px-3 py-1 rounded ${
                  newType === t
                    ? "bg-violet-600 text-white"
                    : "bg-white border"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={add}
              className="bg-violet-600 text-white px-4 py-2 rounded"
            >
              Add Section
            </button>

            <button
              onClick={() => setAdding(false)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full border-dashed border-2 p-4 rounded-xl text-violet-600"
        >
          + Add Section
        </button>
      )}
    </div>
  );
}