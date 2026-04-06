import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// GET: Fetch all reviews from the database
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST: Save a new review to the database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rating, content, authorName } = body;

    const newReview = await prisma.review.create({
      data: { rating, content, authorName }
    });

    return NextResponse.json(newReview);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}