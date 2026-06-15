import { NextRequest, NextResponse } from "next/server";
import { pullTicketsFromZoho, syncAllZohoThreadsToLocal } from "@/server/services/zohoSync";
import { isZohoConfigured } from "@/server/services/zohoService";

// Scheduled Zoho → app sync (configured in vercel.json crons).
// Pulls recent tickets from Zoho Desk and pulls new email replies for active tickets.
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // When CRON_SECRET is set, require Vercel's cron Authorization header.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!isZohoConfigured()) {
    return NextResponse.json({ ok: false, error: "Zoho not configured" }, { status: 200 });
  }

  try {
    const tickets = await pullTicketsFromZoho({ maxPages: 10 });
    const threads = await syncAllZohoThreadsToLocal();
    return NextResponse.json({ ok: true, tickets, threads });
  } catch (error) {
    console.error("[CRON zoho-sync] failed:", error);
    return NextResponse.json({ ok: false, error: "Sync failed" }, { status: 500 });
  }
}
