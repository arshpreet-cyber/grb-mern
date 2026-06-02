import { createTicket, getTickets } from "@/server/services/ticketService";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || undefined;

    const tickets = await getTickets(userId);
    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, assignedTo, name, email, phone, subject, query, ticketType } = body;

    if (!userId || !subject || !query) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ticket = await createTicket({
      userId: parseInt(userId),
      assignedTo,
      name,
      email,
      phone,
      subject,
      query,
      ticketType: typeof ticketType === "number" ? ticketType : 1,
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
