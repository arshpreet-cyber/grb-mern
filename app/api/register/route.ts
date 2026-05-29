import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendEmailNotification, buildRegistrationAdminEmail, buildWelcomeEmail, ADMIN_EMAIL } from "@/server/email";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone || null,
        role: "USER",
      },
    });

    // EVT-0001: notify admin of new registration
    if (ADMIN_EMAIL) {
      const adminEmail = buildRegistrationAdminEmail({ name, email: normalizedEmail });
      sendEmailNotification({ to: ADMIN_EMAIL, subject: adminEmail.subject, text: `New user registered: ${normalizedEmail}`, html: adminEmail.html })
        .catch((err) => console.error("[register admin email]", err.message));
    }

    // EVT-0002: welcome email to the new user
    const welcome = buildWelcomeEmail({ name });
    sendEmailNotification({ to: normalizedEmail, subject: welcome.subject, text: `Welcome to Get Reviews Buzz, ${name}!`, html: welcome.html })
      .catch((err) => console.error("[welcome email]", err.message));

    return NextResponse.json({
      message: "User created successfully",
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
