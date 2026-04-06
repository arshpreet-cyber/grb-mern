import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isAdminPage = pathname.startsWith("/admin");
  const isUserDashboard = pathname.startsWith("/dashboard");

  if (!isAuthPage && !isAdminPage && !isUserDashboard) return NextResponse.next();

  try {
    // Try secure cookie first (Vercel/production), then fallback to non-secure (localhost)
    const secret = process.env.NEXTAUTH_SECRET;
    const token =
      (await getToken({ req, secret, secureCookie: true })) ??
      (await getToken({ req, secret, secureCookie: false }));

    if (token && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (!token && (isAdminPage || isUserDashboard)) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    if (isAdminPage || isUserDashboard) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/dashboard", "/login", "/register"],
};
