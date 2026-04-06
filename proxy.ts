import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isAdminPage = pathname.startsWith("/admin");

  // Only run auth check on relevant pages
  if (!isAuthPage && !isAdminPage) return NextResponse.next();

  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      // Support both secure (Vercel) and non-secure (localhost) cookies
      secureCookie: process.env.NODE_ENV === "production",
    });

    if (token && isAuthPage) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    if (!token && isAdminPage) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    // If token check fails, allow auth pages, block admin pages
    if (isAdminPage) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register"],
};
