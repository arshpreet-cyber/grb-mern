import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { getZohoInvoicePdf } from "@/lib/zoho-billing";

// Streams the order's Zoho Books invoice PDF (matched by order number).
export async function GET(req: NextRequest, { params }: { params: { id: string } | any }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, orderNumber: true, userId: true, email: true },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const isAdmin = (session.user as any).role?.toUpperCase() === "ADMIN";
    const ownsOrder =
      order.userId === parseInt(session.user.id) ||
      (!!order.email && order.email === session.user.email);
    if (!isAdmin && !ownsOrder) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!order.orderNumber) {
      return NextResponse.json({ error: "No invoice available for this order." }, { status: 404 });
    }

    let pdf: ArrayBuffer | null = null;
    try {
      pdf = await getZohoInvoicePdf(order.orderNumber);
    } catch (err: any) {
      console.error("[invoice] Zoho error:", err.message);
      return NextResponse.json({ error: "Could not fetch the invoice right now. Please try again later." }, { status: 502 });
    }

    if (!pdf) {
      return NextResponse.json({ error: "No invoice is available for this order yet." }, { status: 404 });
    }

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${order.orderNumber}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Internal server error" }, { status: 500 });
  }
}
