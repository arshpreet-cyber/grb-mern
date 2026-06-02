import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import { sendEmailNotification, buildContactConfirmationEmail } from "@/server/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, website, message, turnstileToken } = body;

    if (!email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify Turnstile
    /*
    if (!turnstileToken) {
       return NextResponse.json({ error: "Captcha verification failed" }, { status: 400 });
    }

    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${turnstileToken}`,
    });

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
       return NextResponse.json({ error: "Captcha verification failed" }, { status: 400 });
    }
    */

    // Find an admin to assign the guest ticket to, or just create it with a system user
    // For now, let's find the first user (usually an admin or the first user created)
    // In a real app, you'd have a specific system user for guest tickets.
    const systemUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    });

    if (!systemUser) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    const ticketNumber = `TKT-GUEST-${Date.now().toString(36).toUpperCase()}`;

    // Create a ticket for the contact submission
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        userId: systemUser.id, // Associated with an admin for guest submissions
        name: email.split('@')[0], // Fallback name
        email,
        phone: phone || null,
        subject: `Contact Request: ${website || 'No website'}`,
        query: message,
        title: `Contact Request: ${website || 'No website'}`,
        ticketType: 2, // Assuming 2 is 'Contact/Sales'
        status: "Open",
      },
    });

    // EVT-0017: send confirmation to the person who filled contact form
    const confirmation = buildContactConfirmationEmail({ email });
    sendEmailNotification({ to: email, subject: confirmation.subject, text: "Thank you for contacting Get Reviews Buzz. We will get back to you shortly.", html: confirmation.html })
      .catch((err) => console.error("[contact confirmation email]", err.message));

    return NextResponse.json({ success: true, ticketId: ticket.id });
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json({ error: "Failed to submit message" }, { status: 500 });
  }
}
