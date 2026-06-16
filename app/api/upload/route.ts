import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}.${ext}`;

    // Store in Vercel Blob (serverless filesystem isn't persistent). We keep the
    // same relative /uploads/<name> URL — a Next redirect serves it from Blob.
    await put(`uploads/${filename}`, file, { access: "public", addRandomSuffix: false });

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
