import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmailNotification } from "@/server/email";

// Extract bare email address from "Display Name <email@example.com>" or plain "email@example.com"
function extractEmail(raw: string): string {
  const match = raw.match(/<([^>]+)>/);
  return match ? match[1].trim() : raw.trim();
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const userAgent = req.headers.get("user-agent") || "";
    const userIp = req.headers.get("x-forwarded-for") || "unknown";

    const existing = await prisma.subscribers.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already subscribed" }, { status: 409 });
    }

    await prisma.subscribers.create({
      data: { email, user_ip: userIp, user_browser: userAgent, status: 1 },
    });

    // Derive a clean admin email address
    const rawAdminEmail = process.env.ADMIN_EMAIL ?? process.env.EMAIL_FROM ?? "";
    const adminEmail = rawAdminEmail ? extractEmail(rawAdminEmail) : "";

    // Notify admin
    if (adminEmail) {
      sendEmailNotification({
        to: adminEmail,
        subject: "New Newsletter Subscriber – Get Reviews Buzz",
        text: `New subscriber: ${email}`,
        html: `<p style="font-family:Arial,sans-serif;font-size:15px">New newsletter subscriber: <strong>${email}</strong></p>`,
      }).catch((err) => console.error("[subscriber admin email]", err.message));
    } else {
      console.warn("[subscribers] ADMIN_EMAIL not set — skipping admin notification");
    }

    // Confirmation to subscriber
    sendEmailNotification({
      to: email,
      subject: "You're subscribed – Get Reviews Buzz",
      text: "Thank you for subscribing to Get Reviews Buzz newsletter!",
      html: `<p style="font-family:Arial,sans-serif;font-size:15px">Hi there,</p><p style="font-family:Arial,sans-serif;font-size:15px">Thank you for subscribing to the <strong>Get Reviews Buzz</strong> newsletter! You'll receive the latest updates, tips, and news from us.</p><p style="font-family:Arial,sans-serif;font-size:14px;color:#555">If you didn\'t subscribe, you can safely ignore this email.</p><p style="font-family:Arial,sans-serif;font-size:14px">Best Regards,<br/><strong>Team Get Reviews Buzz</strong></p>`,
    }).catch((err) => console.error("[subscriber confirm email]", err.message));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[subscribers]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
