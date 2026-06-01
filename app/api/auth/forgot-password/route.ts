import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendEmailNotification, buildPasswordResetEmail } from "@/server/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });

    // Always return success to avoid revealing whether an email exists
    if (!user) return NextResponse.json({ success: true });

    // Invalidate any existing unused tokens for this email
    await prisma.passwordResetToken.updateMany({
      where: { email: user.email, used: false },
      data: { used: true },
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { email: user.email, token, expiresAt },
    });

    const siteUrl = (process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "https://grb-mern-gilt.vercel.app").replace(/\/$/, "");
    const resetUrl = `${siteUrl}/reset-password?token=${token}`;

    const { subject, html } = buildPasswordResetEmail({
      name: user.name ?? "Customer",
      resetUrl,
    });

    await sendEmailNotification({
      to: user.email,
      subject,
      text: `Reset your password: ${resetUrl}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
