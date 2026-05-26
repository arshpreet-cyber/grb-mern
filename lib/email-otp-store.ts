// In-memory OTP store. Codes expire after 10 minutes.
const store = new Map<string, { code: string; expiresAt: number }>();

export function setEmailOtp(email: string, code: string) {
  store.set(email.toLowerCase(), { code, expiresAt: Date.now() + 10 * 60 * 1000 });
}

export function verifyEmailOtp(email: string, code: string): boolean {
  const entry = store.get(email.toLowerCase());
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) { store.delete(email.toLowerCase()); return false; }
  if (entry.code !== code) return false;
  store.delete(email.toLowerCase());
  return true;
}
