import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // 1. Check if an admin already exists so we don't accidentally make duplicates
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@getreviews.buzz" }
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Admin already exists! Go log in." });
    }

    // 2. Hash a secure password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // 3. Create the user in the database
    const newAdmin = await prisma.user.create({
      data: {
        name: "Super Admin",
        email: "admin@getreviews.buzz",
        password: hashedPassword,
        role: "ADMIN",
        status: "active"
      }
    });

    return NextResponse.json({ 
      message: "Success! First admin created.",
      email: newAdmin.email,
      password: "admin123" 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}