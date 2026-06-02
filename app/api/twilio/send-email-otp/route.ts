import { NextRequest, NextResponse } from "next/server";
import { setEmailOtp } from "@/lib/email-otp-store";
import { sendEmailNotification, buildOtpEmail } from "@/server/email";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await setEmailOtp(email, code);

  try {
    const { subject, html } = buildOtpEmail({ code });
    await sendEmailNotification({
      to: email,
      subject,
      text: `Your verification code is: ${code}. It expires in 10 minutes.`,
      html,
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[send-email-otp]", err.message);
    return NextResponse.json({ error: "Failed to send email OTP" }, { status: 500 });
  }
}
