import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    const all = await prisma.page.findMany({ select: { id: true, title: true, slug: true, status: true } });
    return NextResponse.json({ pages: all, count: all.length });
  }
  const page = await prisma.page.findUnique({ where: { slug }, select: { id: true, title: true, slug: true, status: true } });
  return NextResponse.json({ found: !!page, page });
}
