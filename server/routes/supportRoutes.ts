import express from "express";
import { boss } from "../queue.ts";
import {
  createTicket,
  createTicketMessage,
  getTicketByTicketId,
  getTicketMessages,
  getTickets,
  updateTicket,
} from "../services/ticketService.ts";

const router = express.Router();

router.get("/tickets", async (req, res) => {
  try {
    const userId = typeof req.query.userId === "string" ? req.query.userId : undefined;
    const tickets = await getTickets(userId);
    return res.json(tickets);
  } catch (error) {
    console.error("Failed to load tickets", error);
    return res.status(500).json({ error: "Failed to load tickets" });
  }
});

router.post("/tickets", async (req, res) => {
  try {
    const { userId, assignedTo, name, email, phone, subject, query, ticketType } = req.body;

    if (!userId || !subject || !query) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const ticket = await createTicket({
      userId,
      assignedTo,
      name,
      email,
      phone,
      subject,
      query,
      ticketType: typeof ticketType === "number" ? ticketType : 1,
    });

    if (boss) {
      await boss.send("support-email-queue", {
        type: "ticket.created",
        ticketId: ticket.ticketId,
        name: ticket.name,
        email: ticket.email,
        subject: ticket.subject,
      });

      await boss.send("support-ticket-sync-queue", {
        type: "ticket.created",
        ticketId: ticket.ticketId,
        userId: ticket.userId,
        subject: ticket.subject,
        query: ticket.query,
        email: ticket.email,
        name: ticket.name,
        phone: ticket.phone,
      });
    }

    return res.json(ticket);
  } catch (error) {
    console.error("Failed to create ticket", error);
    return res.status(500).json({ error: "Failed to create ticket" });
  }
});

router.get("/tickets/:ticketId", async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const ticket = await getTicketByTicketId(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    return res.json(ticket);
  } catch (error) {
    console.error("Failed to load ticket", error);
    return res.status(500).json({ error: "Failed to load ticket" });
  }
});

router.patch("/tickets/:ticketId", async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const updates = req.body;
    const ticket = await updateTicket(ticketId, updates);
    return res.json(ticket);
  } catch (error) {
    console.error("Failed to update ticket", error);
    return res.status(500).json({ error: "Failed to update ticket" });
  }
});

router.get("/tickets/:ticketId/messages", async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const messages = await getTicketMessages(ticketId);
    return res.json(messages);
  } catch (error) {
    console.error("Failed to load messages", error);
    return res.status(500).json({ error: "Failed to load messages" });
  }
});

router.post("/tickets/:ticketId/messages", async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const { content, agentId, direction, media } = req.body;

    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "Message content is required" });
    }

    const message = await createTicketMessage({
      ticketId,
      content,
      agentId: agentId ?? null,
      direction: typeof direction === "string" ? direction : "1",
      media: media ?? null,
    });

    const ticket = await getTicketByTicketId(ticketId);
    if (ticket && boss) {
      await boss.send("support-email-queue", {
        type: "ticket.message",
        ticketId: ticket.ticketId,
        name: ticket.name,
        email: ticket.email,
        message: content,
      });
      
      await boss.send("support-ticket-sync-queue", {
        type: "ticket.message",
        ticketId: ticket.ticketId,
        message: content,
        isAgent: !!agentId,
      });
    }

    return res.json(message);
  } catch (error) {
    console.error("Failed to create message", error);
    return res.status(500).json({ error: "Failed to create message" });
  }
});

export default router;
