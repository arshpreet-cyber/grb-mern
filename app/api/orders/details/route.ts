import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { sendEmailNotification, buildUserSubmittedDetailsAdminEmail, ADMIN_EMAIL } from "@/server/email";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, notes, items } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { orderDetails: true },
    });

    if (!order || order.userId !== parseInt(session.user.id)) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Save notes and mark details as filled
    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        notes,
        detailsFilled: true,
        detailsFilledAt: new Date(),
      },
    });

    // Save profile URL per item
    if (items?.length) {
      await Promise.all(
        items.map((item: { id: string; profileUrl: string }) =>
          prisma.orderDetail.update({
            where: { id: parseInt(item.id) },
            data: { profileUrl: item.profileUrl },
          })
        )
      );
    }

    // EVT-0016: notify admin that user submitted order details
    if (ADMIN_EMAIL) {
      const userEmail = order.email ?? session.user.email ?? "";
      const userName = order.firstName ? `${order.firstName} ${order.lastName ?? ""}`.trim() : (session.user.name ?? "Customer");
      const adminNotif = buildUserSubmittedDetailsAdminEmail({
        name: userName,
        email: userEmail,
        orderNumber: order.orderNumber ?? orderId,
        orderId,
      });
      sendEmailNotification({ to: ADMIN_EMAIL, subject: adminNotif.subject, text: `Order #${order.orderNumber} details submitted.`, html: adminNotif.html })
        .catch((err) => console.error("[submitted details email]", err.message));
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[orders/details]", err);
    return NextResponse.json({ error: err.message ?? "Internal server error" }, { status: 500 });
  }
}
