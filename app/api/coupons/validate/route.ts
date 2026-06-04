import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, total } = await req.json();

    if (!code?.trim()) {
      return NextResponse.json({ error: "Please enter a coupon code" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findFirst({
      where: {
        code:      { equals: code.trim(), mode: "insensitive" },
        status:    "1",
        deletedAt: null,
      },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid or expired coupon code" }, { status: 404 });
    }

    // Check expiry
    if (coupon.expiry) {
      const expDate = new Date(coupon.expiry);
      if (!isNaN(expDate.getTime()) && expDate < new Date()) {
        return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
      }
    }

    // Check quantity remaining
    if (coupon.quantity !== null && coupon.quantity !== undefined) {
      const remaining = parseInt(String(coupon.quantity));
      if (!isNaN(remaining) && remaining <= 0) {
        return NextResponse.json({ error: "This coupon has been fully used" }, { status: 400 });
      }
    }

    const discountValue = parseFloat(String(coupon.discount ?? "0"));
    const orderTotal    = parseFloat(String(total ?? 0));

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.min((discountValue / 100) * orderTotal, orderTotal);
    } else {
      discountAmount = Math.min(discountValue, orderTotal);
    }
    discountAmount = Math.round(discountAmount * 100) / 100;

    return NextResponse.json({
      valid:          true,
      couponId:       coupon.id,
      code:           coupon.code,
      discountType:   coupon.discountType,
      discountValue,
      discountAmount,
      discountedTotal: Math.round((orderTotal - discountAmount) * 100) / 100,
    });
  } catch (err: any) {
    console.error("[coupons/validate]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
