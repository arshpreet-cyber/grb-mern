import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json();
  if (!phone || !code) return NextResponse.json({ error: "Phone and code required" }, { status: 400 });

  try {
    const result = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID!)
      .verificationChecks.create({ to: phone, code });

    if (result.status !== "approved") {
      return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[twilio verify-phone-otp]", err.message);
    return NextResponse.json({ error: "Invalid or expired OTP." }, { status: 400 });
  }
}
