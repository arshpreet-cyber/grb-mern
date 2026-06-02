import prisma from "@/lib/prisma";

export async function setEmailOtp(email: string, code: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await prisma.emailOtp.upsert({
    where: { email: email.toLowerCase() },
    update: { code, expiresAt },
    create: { email: email.toLowerCase(), code, expiresAt },
  });
}

export async function verifyEmailOtp(email: string, code: string): Promise<boolean> {
  const entry = await prisma.emailOtp.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (!entry) return false;
  if (new Date() > entry.expiresAt) {
    await prisma.emailOtp.delete({ where: { email: email.toLowerCase() } }).catch(() => {});
    return false;
  }
  if (entry.code !== code.trim()) return false;
  // Only delete after successful verification
  await prisma.emailOtp.delete({ where: { email: email.toLowerCase() } }).catch(() => {});
  return true;
}
