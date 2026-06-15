import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper function to map database fields cleanly to what your frontend UI looks for
function formatProductData(product: any) {
  const standardPrice = product.price ? parseFloat(product.price) : 0;
  const monthlyPrice = product.dropdownPrice
    ? parseFloat(product.dropdownPrice)
    : standardPrice * 0.9;

  return {
    id: product.id.toString(),
    platform: product.title || "Unknown Platform",
    image: product.media || "/uploads/media/1778825935130-48c8352e-e042-4cd7-a93a-1edf9b56925e-experience.svg",
    oneTimePrice: standardPrice,
    subscribePrice: monthlyPrice,
    minimumQuantity: product.minimumQuantity || 1,
    badge: product.priority && product.priority <= 100 ? "Most Popular" : null,
    // Including additional metadata your single product detail page might need
    content: product.content || "",
    stock: product.stock || "In Stock",
    replacementPolicy: product.replacementPolicy || "",
  };
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product || product.deletedAt) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Wrap the returned database object in our formatting transformer
    return NextResponse.json(formatProductData(product));
  } catch (error) {
    console.error("GET Product Error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: body
    });

    return NextResponse.json(formatProductData(product));
  } catch (error) {
    console.error("PUT Product Error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Safely soft-deleting the item using the updated column layout rules
    await prisma.product.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Product Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}