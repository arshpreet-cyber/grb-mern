import { NextRequest, NextResponse } from "next/server";
import { verifyEmailOtp } from "@/lib/email-otp-store";

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();
  if (!email || !code) return NextResponse.json({ error: "Email and code required" }, { status: 400 });

  const valid = await verifyEmailOtp(email.trim().toLowerCase(), code.trim());
  if (!valid) return NextResponse.json({ error: "Invalid or expired code. Please try again." }, { status: 400 });

  return NextResponse.json({ success: true });
}
