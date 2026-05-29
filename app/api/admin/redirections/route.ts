import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const redirects = await prisma.redirect.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(redirects);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { fromPath, toPath, type } = await req.json();
    if (!fromPath || !toPath) return NextResponse.json({ error: "fromPath and toPath required" }, { status: 400 });
    const redirect = await prisma.redirect.create({ data: { fromPath, toPath, type: Number(type) || 301 } });
    return NextResponse.json(redirect);
  } catch (e: any) {
    if (e?.code === "P2002") return NextResponse.json({ error: "That 'from' path already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...data } = await req.json();
    const redirect = await prisma.redirect.update({ where: { id }, data });
    return NextResponse.json(redirect);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.redirect.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
