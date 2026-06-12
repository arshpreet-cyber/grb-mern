// Master switch — Turnstile only runs when NEXT_PUBLIC_TURNSTILE_ENABLED=true.
// Keep it off until the real keys' domain (getreviews.buzz) is live.
export const TURNSTILE_ENABLED = process.env.NEXT_PUBLIC_TURNSTILE_ENABLED === "true";

// Server-side Cloudflare Turnstile verification.
// Skips (returns true) when disabled or when TURNSTILE_SECRET_KEY is unset, so
// the wrong domain / unconfigured environments don't break submissions.
export async function verifyTurnstile(
  token: string | null | undefined,
  remoteIp?: string | null
): Promise<boolean> {
  if (!TURNSTILE_ENABLED) return true; // disabled — don't block
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured — don't block
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.append("remoteip", remoteIp);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = await res.json();
    return data?.success === true;
  } catch {
    return false;
  }
}
