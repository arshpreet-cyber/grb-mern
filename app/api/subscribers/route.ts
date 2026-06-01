import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const userAgent = req.headers.get("user-agent") || "";
    const userIp =
      req.headers.get("x-forwarded-for") || "unknown";

    // prevent duplicate emails
    const existing = await prisma.subscribers.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already subscribed" },
        { status: 409 }
      );
    }

    const subscriber = await prisma.subscribers.create({
      data: {
        email,
        user_ip: userIp,
        user_browser: userAgent,
        status: 1,
      },
    });

    return NextResponse.json({
      success: true,
      subscriber,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}