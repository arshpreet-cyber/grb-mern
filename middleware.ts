import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  try {
    const listUrl = `${req.nextUrl.origin}/api/admin/redirections/list`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(listUrl, {
      signal: controller.signal,
      next: { revalidate: 60 },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const redirects: { fromPath: string; toPath: string; type: number }[] = await res.json();
      const match = redirects.find(r => r.fromPath === pathname);
      if (match) {
        const dest = match.toPath.startsWith("http") ? match.toPath : `${req.nextUrl.origin}${match.toPath}`;
        return NextResponse.redirect(dest, { status: match.type });
      }
    }
  } catch {}

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|api/).*)"],
};
