import { NextRequest, NextResponse } from "next/server";
import { setEmailOtp } from "@/lib/email-otp-store";
import { sendEmailNotification } from "@/server/email";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  setEmailOtp(email, code);

  try {
    await sendEmailNotification({
      to: email,
      subject: "Your email verification code",
      text: `Your verification code is: ${code}. It expires in 10 minutes.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
          <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">Verify your email</h2>
          <p style="color:#555;font-size:14px;margin-bottom:24px">Use the code below to complete your registration. It expires in 10 minutes.</p>
          <div style="background:#f5f5f5;border-radius:8px;padding:20px;text-align:center;letter-spacing:12px;font-size:32px;font-weight:700;color:#111">${code}</div>
          <p style="color:#999;font-size:12px;margin-top:24px">If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[send-email-otp]", err.message);
    return NextResponse.json({ error: "Failed to send email OTP" }, { status: 500 });
  }
}
