import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req: NextRequest) {
  const { phone } = await req.json();
  if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

  try {
    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID!)
      .verifications.create({ to: phone, channel: "sms" });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[twilio send-phone-otp]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
