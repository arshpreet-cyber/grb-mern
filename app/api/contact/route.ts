import { NextResponse } from "next/server";
import { sendEmailNotification, buildContactConfirmationEmail, buildContactAdminEmail, ADMIN_EMAIL } from "@/server/email";
import { verifyTurnstile } from "@/lib/turnstile";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, website, message, turnstileToken } = body;

    if (!email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (!(await verifyTurnstile(turnstileToken, ip))) {
      return NextResponse.json({ error: "Captcha verification failed. Please try again." }, { status: 400 });
    }

    // EVT-0017: send confirmation to the person who filled contact form
    const confirmation = buildContactConfirmationEmail({ email, phone, website });
    sendEmailNotification({ to: email, subject: confirmation.subject, text: "Thank you for contacting Get Reviews Buzz. We will get back to you shortly.", html: confirmation.html })
      .catch((err) => console.error("[contact confirmation email]", err.message));

    // Send notification to Admin
    const adminEmailHtml = buildContactAdminEmail({ email, phone, website, message });
    sendEmailNotification({ to: ADMIN_EMAIL, subject: adminEmailHtml.subject, text: `New contact submission from ${email}`, html: adminEmailHtml.html })
      .catch((err) => console.error("[contact admin email]", err.message));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json({ error: "Failed to submit message" }, { status: 500 });
  }
}
