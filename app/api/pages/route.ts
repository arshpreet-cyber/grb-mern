import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const includeDrafts = req.nextUrl.searchParams.get("include") === "drafts";

    const select: any = {
      id: true, title: true, slug: true, status: true,
      inSitemap: true, createdAt: true, updatedAt: true,
    };

    if (includeDrafts) {
      select.sections = true;
      select.draftSections = true;
    }

    const pages = await prisma.page.findMany({
      orderBy: { createdAt: "desc" },
      select,
    });
    return NextResponse.json(pages);
  } catch {
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, ...rest } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const existing = await prisma.page.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const page = await prisma.page.create({
      data: { title, slug, ...rest },
    });
    return NextResponse.json(page, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}
