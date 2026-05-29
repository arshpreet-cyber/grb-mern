import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  try {
    const listUrl = `${req.nextUrl.origin}/api/admin/redirections/list`;
    const res = await fetch(listUrl, { next: { revalidate: 60 } });
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
