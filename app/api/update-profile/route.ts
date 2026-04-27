import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, phone, currentPassword, newPassword, confirmPassword } = await req.json();

  // Handle password change
  if (currentPassword && newPassword && confirmPassword) {
    if (newPassword !== confirmPassword)
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user?.password)
      return NextResponse.json({ error: "User not found." }, { status: 404 });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid)
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame)
      return NextResponse.json({ error: "New password cannot be the same as the current password." }, { status: 400 });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { email: session.user.email }, data: { password: hashed } });
    return NextResponse.json({ message: "Password changed successfully." });
  }

  // Handle profile update
  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: { name, phone },
  });

  return NextResponse.json({ message: "Profile updated successfully.", name: user.name, phone: user.phone });
}
