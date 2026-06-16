import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}.${ext}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Store in Vercel Blob (serverless filesystem isn't persistent). We keep the
      // same relative /uploads/<name> URL — a Next redirect serves it from Blob.
      await put(`uploads/${filename}`, file, { access: "public", addRandomSuffix: false });
    } else {
      // Store locally in public/uploads/
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const dirPath = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(dirPath, { recursive: true });
      await fs.writeFile(path.join(dirPath, filename), buffer);
    }

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
