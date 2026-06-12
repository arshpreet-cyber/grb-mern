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
  const validTokens = [process.env.GRB_API_TOKEN, process.env.BULK_API_TOKEN].filter(Boolean);

  if (!apiToken || !validTokens.includes(apiToken)) {
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

  // IMPORTANT: created_at must come BEFORE order_detail in this object.
  // PHP grb_payment loops fields and breaks on "created_at" — if order_detail
  // (an array) appears first, Eloquent crashes trying to save it as a DB column.
  return NextResponse.json({
    message: "success",
    orders: [
      {
        id:               order.id,
        order_number:     order.orderNumber,
        first_name:       firstName || order.firstName || "Customer",
        last_name:        lastName,
        email:            order.email ?? "",
        amount:           order.amount ?? 0,
        currency:         order.currency ?? "USD",
        payment_status:   parseInt(order.paymentStatus ?? "1"),
        stripe_session_id: null,
        is_recurring:     0,
        created_at:       (order.createdAt ?? new Date()).toISOString(),
        order_detail:     order.orderDetails.map((d, idx) => ({
          // Stable high-range ID: orderId * 10000 + position avoids clashing with
          // existing grb_order_details rows from the old GRB site (which are small ints).
          id:          order.id * 10000 + idx + 1,
          order_id:    order.id,
          item_name:   d.itemName ?? "",
          item_id:     d.itemId ?? "",
          amount:      d.amount ?? 0,
          quantity:    d.quantity ?? 1,
          is_recurring: d.productType === "2" ? 1 : 0,
          review_data: d.reviewData ?? null,
        })),
      },
    ],
  });
}
