import prisma from "../../lib/prisma.ts";
import { randomUUID } from "crypto";

export type CreateTicketPayload = {
  userId: string;
  assignedTo?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  subject: string;
  query: string;
  ticketType?: number;
};

export async function createTicket(data: CreateTicketPayload) {
  const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}`;

  return prisma.ticket.create({
    data: {
      id: randomUUID(),
      ticketNumber,
      userId: data.userId,
      assignedTo: data.assignedTo ?? null,
      name: data.name ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      subject: data.subject,
      query: data.query,
      ticketType: data.ticketType ?? 1,
      title: data.subject,
      status: "Open",
      readStatus: 1,
      repliedStatus: 1,
      userReadStatus: 1,
    },
  });
}

export async function getTickets(userId?: string) {
  return prisma.ticket.findMany({
    where: userId ? { userId } : undefined,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getTicketByTicketId(ticketId: string) {
  return prisma.ticket.findUnique({
    where: { ticketId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function updateTicket(ticketId: string, updates: Partial<Record<string, unknown>>) {
  return prisma.ticket.update({
    where: { ticketId },
    data: updates,
  });
}

export async function getTicketMessages(ticketId: string) {
  return prisma.ticketThread.findMany({
    where: { ticketId },
    orderBy: { createdAt: "asc" },
  });
}

export async function createTicketMessage(payload: {
  ticketId: string;
  content: string;
  agentId?: string | null;
  direction?: string;
  media?: string | null;
}) {
  return prisma.ticketThread.create({
    data: {
      ticketId: payload.ticketId,
      agentId: payload.agentId ?? null,
      content: payload.content,
      media: payload.media ?? null,
      direction: payload.direction ?? "1",
    },
  });
}
