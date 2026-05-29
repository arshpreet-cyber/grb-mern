import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const redirects = await prisma.redirect.findMany({
      where: { active: true },
      select: { fromPath: true, toPath: true, type: true },
    });
    return NextResponse.json(redirects, {
      headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
