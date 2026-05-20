import { NextResponse } from "next/server";
import { sendEmailNotification } from "@/server/email";

export async function GET() {
  try {
    await sendEmailNotification({
      to: "sourabh@adaired.org",
      subject: "Test Email - GetReviews SMTP Check",
      text: "SMTP is working correctly.",
      html: "<p>SMTP is working correctly from <strong>GetReviews Buzz</strong>.</p>",
    });
    return NextResponse.json({ success: true, message: "Email sent to sourabh@adaired.org" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
