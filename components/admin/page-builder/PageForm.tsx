"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FormField, Input, Textarea, Select, Toggle, SectionCard, ImageUpload,
} from "./FormFields";
import SectionsBuilder, { Section } from "./SectionsBuilder";

type PageData = {
  title: string;
  slug: string;
  status: string;
  titleImage: string;
  opengraphImage: string;
  canonicalLink: string;
  robotsText: string;
  keywords: string;
  metaTitle: string;
  metaDescription: string;
  inSitemap: boolean;
  schemaCode: string;
  headerScript: string;
  bodyScript: string;
  footerScript: string;
  sections: Section[];
};

const empty: PageData = {
  title: "", slug: "", status: "Draft", titleImage: "", opengraphImage: "",
  canonicalLink: "", robotsText: "index, follow", keywords: "", metaTitle: "",
  metaDescription: "", inSitemap: true, schemaCode: "", headerScript: "",
  bodyScript: "", footerScript: "", sections: [],
};

function toSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function PageForm({
  initial, pageId, onSuccess,
}: {
  initial?: Partial<PageData>;
  pageId?: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [data, setData] = useState<PageData>({ ...empty, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const set = (field: keyof PageData) => (val: string | boolean | Section[]) =>
    setData((p) => ({ ...p, [field]: val }));

  const handleTitleChange = (val: string) => {
    setData((p) => ({
      ...p,
      title: val,
      slug: pageId ? p.slug : toSlug(val),
      metaTitle: p.metaTitle || val,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = pageId ? `/api/pages/${pageId}` : "/api/pages";
      const method = pageId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, sections: data.sections }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to save page");
      } else {
        setSuccess(pageId ? "Page updated successfully!" : "Page created successfully!");
        if (!pageId) {
          setData(empty);
        }
        onSuccess?.();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
          <span>ΓÜá</span> {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-600 flex items-center gap-2">
          <span>Γ£à</span> {success}
        </div>
      )}

      {/* Basic Info */}
      <SectionCard title="Basic Information">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Title" required>
            <Input
              placeholder="Page title"
              value={data.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
          </FormField>
          <FormField label="Status">
            <Select value={data.status} onChange={(e) => set("status")(e.target.value)}>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </Select>
          </FormField>
        </div>

        <FormField label="Slug" hint="Auto-generated from title. Edit manually if needed.">
          <Input
            prefix="https://beta.getreviews.buzz/"
            placeholder="page-slug"
            value={data.slug}
            onChange={(e) => set("slug")(toSlug(e.target.value))}
            required
          />
        </FormField>
      </SectionCard>

      {/* Images */}
      <SectionCard title="Images">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Title Image">
            <ImageUpload label="Paste image URL..." value={data.titleImage} onChange={set("titleImage")} />
          </FormField>
          <FormField label="Opengraph Image">
            <ImageUpload label="Paste image URL..." value={data.opengraphImage} onChange={set("opengraphImage")} />
          </FormField>
        </div>
      </SectionCard>

      {/* Page Sections */}
      <SectionCard title="Page Sections">
        <SectionsBuilder sections={data.sections} onChange={set("sections") as (s: Section[]) => void} />
      </SectionCard>

      {/* SEO */}
      <SectionCard title="SEO & Meta">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Meta Title">
            <Input placeholder="Meta title" value={data.metaTitle} onChange={(e) => set("metaTitle")(e.target.value)} />
          </FormField>
          <FormField label="Canonical Link">
            <Input placeholder="canonical_link" value={data.canonicalLink} onChange={(e) => set("canonicalLink")(e.target.value)} />
          </FormField>
        </div>

        <FormField label="Meta Description">
          <Textarea placeholder="Meta description..." rows={3} value={data.metaDescription} onChange={(e) => set("metaDescription")(e.target.value)} />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Keywords">
            <Input placeholder="keyword1, keyword2..." value={data.keywords} onChange={(e) => set("keywords")(e.target.value)} />
          </FormField>
          <FormField label="Robots Text">
            <Select value={data.robotsText} onChange={(e) => set("robotsText")(e.target.value)}>
              <option>index, follow</option>
              <option>noindex, follow</option>
              <option>index, nofollow</option>
              <option>noindex, nofollow</option>
            </Select>
          </FormField>
        </div>

        <FormField label="Include in Sitemap?">
          <Toggle checked={data.inSitemap} onChange={set("inSitemap") as (v: boolean) => void} label={data.inSitemap ? "Yes" : "No"} />
        </FormField>

        <FormField label="Schema Code" hint="JSON-LD structured data">
          <Textarea placeholder='{"@context": "https://schema.org", ...}' rows={4} value={data.schemaCode} onChange={(e) => set("schemaCode")(e.target.value)} className="font-mono text-xs" />
        </FormField>
      </SectionCard>

      {/* Scripts */}
      <SectionCard title="Scripts">
        <FormField label="Header Script" hint="Injected inside <head>">
          <Textarea placeholder="<script>...</script>" rows={3} value={data.headerScript} onChange={(e) => set("headerScript")(e.target.value)} className="font-mono text-xs" />
        </FormField>
        <FormField label="Body Script" hint="Injected after <body> opening tag">
          <Textarea placeholder="<script>...</script>" rows={3} value={data.bodyScript} onChange={(e) => set("bodyScript")(e.target.value)} className="font-mono text-xs" />
        </FormField>
        <FormField label="Footer Script" hint="Injected before </body>">
          <Textarea placeholder="<script>...</script>" rows={3} value={data.footerScript} onChange={(e) => set("footerScript")(e.target.value)} className="font-mono text-xs" />
        </FormField>
      </SectionCard>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="rounded-xl bg-[#fc0] hover:bg-[#e6bb00] px-8 py-3 text-sm font-bold text-slate-900 shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving...
            </span>
          ) : pageId ? "Update Page" : "Create Page"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
          Cancel
        </button>
      </div>
    </form>
  );
}
