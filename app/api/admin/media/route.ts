import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { AttachmentType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  allowedMediaMimeTypes,
  buildAbsoluteMediaUrl,
  isAttachmentType,
} from "@/lib/media";

export const runtime = "nodejs";

const uploadDirectory = path.join(process.cwd(), "public", "uploads", "media");
const maxFileSizeInBytes = 10 * 1024 * 1024;

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9.-]+/g, "-").replace(/-+/g, "-");
}

function fileExtensionFromMimeType(mimeType: string) {
  const mimeExtensionMap: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "image/avif": ".avif",
    "image/bmp": ".bmp",
    "image/x-icon": ".ico",
    "image/tiff": ".tiff",
  };

  return mimeExtensionMap[mimeType] ?? "";
}

function serializeAttachment(
  req: NextRequest,
  attachment: {
    id: number;
    mediaUrl: string | null;
    alt: string | null;
    isTitle: string | null;
    mediaType: string | null;
    type: AttachmentType;
    createdAt: Date | null;
    updatedAt: Date | null;
  }
) {
  return {
    ...attachment,
    staticUrl: attachment.mediaUrl,
    absoluteUrl: buildAbsoluteMediaUrl(req, attachment.mediaUrl),
  };
}

export async function GET(req: NextRequest) {
  try {
    const media = await prisma.attachment.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(media.map((item) => serializeAttachment(req, item)));
  } catch {
    return NextResponse.json({ error: "Failed to fetch media." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const alt = String(formData.get("alt") ?? "").trim();
    const type = String(formData.get("type") ?? "PAGE").trim();
    const isTitle = formData.get("isTitle") === "true" ? "true" : null;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Please choose a file to upload." }, { status: 400 });
    }

    if (!allowedMediaMimeTypes.has(file.type)) {
      return NextResponse.json(
        { error: "Only image files such as SVG, PNG, JPG, WEBP, GIF, AVIF, BMP, ICO, and TIFF are allowed." },
        { status: 400 }
      );
    }

    if (file.size > maxFileSizeInBytes) {
      return NextResponse.json({ error: "Maximum upload size is 10MB." }, { status: 400 });
    }

    if (!isAttachmentType(type)) {
      return NextResponse.json({ error: "Invalid media type selected." }, { status: 400 });
    }

    await mkdir(uploadDirectory, { recursive: true });

    const originalExtension = path.extname(file.name);
    const extension = originalExtension || fileExtensionFromMimeType(file.type);
    const baseName = sanitizeFileName(path.basename(file.name, originalExtension || extension || ""));
    const storedFileName = `${Date.now()}-${randomUUID()}-${baseName || "media"}${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDirectory, storedFileName);
    const mediaUrl = `/uploads/media/${storedFileName}`;

    await writeFile(filePath, buffer);

    const attachment = await prisma.attachment.create({
      data: {
        mediaUrl,
        alt: alt || null,
        isTitle,
        mediaType: file.type || extension || null,
        type: type as AttachmentType,
      },
    });

    return NextResponse.json(serializeAttachment(req, attachment), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to upload media." }, { status: 500 });
  }
}
