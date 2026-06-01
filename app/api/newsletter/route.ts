import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmailNotification } from "@/server/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL ?? process.env.EMAIL_FROM ?? "";
    if (adminEmail) {
      sendEmailNotification({
        to: adminEmail,
        subject: "New Newsletter Subscriber – Get Reviews Buzz",
        text: `New subscriber: ${email}`,
        html: `<p>New newsletter subscriber: <strong>${email}</strong></p>`,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
