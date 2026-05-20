import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status");
    const catType = searchParams.get("catType");

    // 1. Diagnostic test to see if the Prisma model identifier exists
    if (!prisma.product) {
      throw new Error(
        "prisma.product is undefined. Check your schema.prisma file to see if the model is named differently (e.g., prisma.productTable or prisma.products)."
      );
    }

    // 2. Fetch raw lines to isolate if it's an environment connection issue or field mapping issue
    const dbProducts = await prisma.product.findMany({
      where: {
        // Temporarily comment out filters to test basic DB connectivity first
        // deletedAt: null, 
      },
    }).catch((dbError) => {
      console.error("Prisma Core Database Error:", dbError);
      throw new Error(`Prisma Query Failed: ${dbError.message || dbError}`);
    });

    // 3. Map values safely to prevent client-side crashes
    const formattedProducts = dbProducts.map((product: any) => {
      const standardPrice = product.price ? parseFloat(product.price) : 0;
      const monthlyPrice = product.dropdownPrice 
        ? parseFloat(product.dropdownPrice) 
        : standardPrice * 0.9;

      return {
        id: product.id?.toString() || Math.random().toString(),
        // Pulling the slug exactly as it exists in the database column
        slug: product.slug || "",
        platform: product.title || "Unknown Platform",
        image: product.media || " ",
        oneTimePrice: standardPrice,
        subscribePrice: monthlyPrice,
        minimumQuantity: product.minimumQuantity || 1,
        status: product.status || null,
        stock: product.stock || null,
        catType: product.catType || null,
        // Pulling the priority value exactly as it exists in the database
        priority: product.priority !== undefined ? Number(product.priority) : null,
        // Kept for backward compatibility if other files expect it
        badge: product.badge || null, 
      };
    });

    return NextResponse.json(formattedProducts);
  } catch (e: any) {
    console.error("API Route Execution Error:", e);
    // Forward the real database or runtime error directly to the response body
    return NextResponse.json(
      { error: e.message || "Unknown Server Error" }, 
      { status: 500 }
    );
  }
}