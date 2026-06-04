import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Called by payments.adaired.com (PHP grb_payment) to fetch order details.
 * Returns data in the GRB API format the PHP controller expects.
 *
 * GET /api/order/{orderno}?api_token=xxx
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderno: string }> }
) {
  const apiToken = new URL(req.url).searchParams.get("api_token");

  if (!apiToken || apiToken !== process.env.GRB_API_TOKEN) {
    return NextResponse.json({ message: "error", error: "Unauthorized" }, { status: 401 });
  }

  const { orderno } = await params;
  const id = parseInt(orderno);
  if (isNaN(id)) {
    return NextResponse.json({ message: "error", error: "Invalid order ID" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { orderDetails: true },
  });

  if (!order) {
    return NextResponse.json({ message: "error", error: "Order not found" }, { status: 404 });
  }

  const [firstName, ...rest] = (order.firstName ?? "").split(" ");
  const lastName = order.lastName ?? rest.join(" ") ?? "";

  return NextResponse.json({
    message: "success",
    orders: [
      {
        id:             order.id,
        order_number:   order.orderNumber,
        first_name:     firstName || order.firstName || "Customer",
        last_name:      lastName,
        email:          order.email ?? "",
        amount:         order.amount ?? 0,
        currency:       order.currency ?? "USD",
        payment_status: parseInt(order.paymentStatus ?? "1"),
        stripe_session_id: null,
        is_recurring:   0,
        order_detail:   order.orderDetails.map((d) => ({
          id:          d.id,
          order_id:    order.id,
          item_name:   d.itemName ?? d.platform ?? "",
          item_id:     d.itemId ?? d.platform ?? "",
          amount:      d.amount ?? 0,
          quantity:    d.quantity ?? 1,
          is_recurring: d.type === "subscribe" ? 1 : 0,
          review_data: null,
        })),
      },
    ],
  });
}
