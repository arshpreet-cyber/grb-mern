import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get the first day of the current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Run all database queries in parallel for maximum speed
    const [allUsers, monthlySignups, activeUsers, passiveUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { createdAt: { gte: firstDayOfMonth } }
      }),
      prisma.user.count({
        where: { status: 'active' }
      }),
      prisma.user.count({
        where: { status: 'passive' }
      })
    ]);

    return NextResponse.json({
      allUsers,
      monthlySignups,
      activeUsers,
      passiveUsers
    });
  } catch (error) {
    // Add this line to print the EXACT error to your VS Code terminal
    console.error("DATABASE FETCH ERROR:", error);
    
    return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 });
  }
}