import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // Try both secure and non-secure cookie names
  const token =
    (await getToken({ req, secret: process.env.NEXTAUTH_SECRET, secureCookie: true })) ??
    (await getToken({ req, secret: process.env.NEXTAUTH_SECRET, secureCookie: false }));

  const cookies = req.cookies.getAll().map((c) => c.name);

  return NextResponse.json({
    token,
    hasRole: !!token?.role,
    role: token?.role,
    email: token?.email,
    cookieNames: cookies,
    nodeEnv: process.env.NODE_ENV,
  });
}
