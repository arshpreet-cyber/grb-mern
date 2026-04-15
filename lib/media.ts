import { NextRequest } from "next/server";

export type MediaAttachmentType =
  | "BLOG"
  | "BANNER"
  | "CATEGORY"
  | "TESTIMONIAL"
  | "USER"
  | "PAGE"
  | "PORTFOLIO"
  | "SERVICE"
  | "LOGO";

export const attachmentTypeOptions: { value: MediaAttachmentType; label: string }[] = [
  { value: "BLOG", label: "Blog" },
  { value: "BANNER", label: "Banner" },
  { value: "CATEGORY", label: "Category" },
  { value: "TESTIMONIAL", label: "Testimonial" },
  { value: "USER", label: "Employee / User" },
  { value: "PAGE", label: "Page" },
  { value: "PORTFOLIO", label: "Portfolio" },
  { value: "SERVICE", label: "Service" },
  { value: "LOGO", label: "Logo" },
];

export const allowedMediaMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
  "image/bmp",
  "image/x-icon",
  "image/tiff",
]);

export function isAttachmentType(value: string): value is MediaAttachmentType {
  return attachmentTypeOptions.some((option) => option.value === value);
}

export function buildAbsoluteMediaUrl(req: NextRequest, mediaUrl?: string | null) {
  if (!mediaUrl) return null;
  if (/^https?:\/\//i.test(mediaUrl)) return mediaUrl;

  const forwardedProto = req.headers.get("x-forwarded-proto");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const envBaseUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, "");

  if (forwardedProto && host) {
    return `${forwardedProto}://${host}${mediaUrl}`;
  }

  if (host) {
    return `https://${host}${mediaUrl}`;
  }

  return envBaseUrl ? `${envBaseUrl}${mediaUrl}` : mediaUrl;
}
