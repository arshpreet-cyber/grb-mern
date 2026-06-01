import { NextResponse } from "next/server";
import { sendEmailNotification, emailWrapper } from "@/server/email";

export async function GET() {
  try {
    const testContent = `
      <p style="margin:0 0 14px;font-size:15px;color:#333">Hello Admin,</p>
      <p style="margin:0 0 20px;font-size:15px;color:#333">SMTP check is successful. Your email dispatch system is fully functional!</p>
      <div style="background:#ffffff;border:1px solid #e0e0e0;border-radius:6px;padding:16px;text-align:center;font-size:16px;font-weight:700;color:#10b981;margin:20px 0">
        ✅ Connection Verified & Secure
      </div>
      <p style="margin:20px 0 4px;font-size:14px;color:#444">Best Regards,</p>
      <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
    `;

    await sendEmailNotification({
      to: "sourabh@adaired.org",
      subject: "Test Email - GetReviews SMTP Check",
      text: "SMTP is working correctly.",
      html: emailWrapper(testContent),
    });
    return NextResponse.json({ success: true, message: "Email sent to sourabh@adaired.org" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
