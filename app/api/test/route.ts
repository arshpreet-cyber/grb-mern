import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Test endpoint called");
    
    // Try importing Prisma
    const prisma = await import("@/lib/prisma").then(m => m.default);
    
    console.log("Prisma type:", typeof prisma);
    console.log("Prisma keys:", prisma ? Object.keys(prisma).slice(0, 5) : "undefined");
    
    return NextResponse.json({
      message: "Test successful",
      prismaLoaded: !!prisma,
      prismaType: typeof prisma,
    });
  } catch (error) {
    console.error("Error in test endpoint:", error);
    return NextResponse.json(
      {
        error: String(error),
      },
      { status: 500 }
    );
  }
}
