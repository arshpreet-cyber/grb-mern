import { NextResponse } from "next/server";
import { sendEmailNotification, buildContactConfirmationEmail, ADMIN_EMAIL } from "@/server/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, website, message } = body;

    if (!email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Contact submissions are no longer turned into support tickets.
    // Notify the business inbox so the lead isn't lost…
    if (ADMIN_EMAIL) {
      const html = `
        <h2>New Contact Request</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "—"}</p>
        <p><strong>Website:</strong> ${website || "—"}</p>
        <p><strong>Message:</strong></p>
        <p>${String(message).replace(/\n/g, "<br>")}</p>
      `;
      sendEmailNotification({
        to: ADMIN_EMAIL,
        subject: `Contact Request from ${email}`,
        text: `New contact request from ${email}. Message: ${message}`,
        html,
      }).catch((err) => console.error("[contact admin email]", err.message));
    }

    // …and send a confirmation to the person who filled the form.
    const confirmation = buildContactConfirmationEmail({ email });
    sendEmailNotification({ to: email, subject: confirmation.subject, text: "Thank you for contacting Get Reviews Buzz. We will get back to you shortly.", html: confirmation.html })
      .catch((err) => console.error("[contact confirmation email]", err.message));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json({ error: "Failed to submit message" }, { status: 500 });
  }
}
