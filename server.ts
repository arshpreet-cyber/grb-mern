import "dotenv/config";
import express from "express";
import http from "http";
import next from "next";
import { Server } from "socket.io";
import supportRoutes from "./server/routes/supportRoutes.ts";
import { boss, initQueue } from "./server/queue.ts";
import prisma from "./lib/prisma.ts";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const port = Number(process.env.PORT || 3000);

nextApp.prepare().then(async () => {
  await initQueue();
  
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/api/support", supportRoutes);

  app.all("*", (req, res) => {
    return handle(req, res);
  });

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: dev ? "*" : undefined,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-ticket", async (ticketId: string) => {
      console.log(`Socket ${socket.id} joining ticket: ${ticketId}`);
      if (typeof ticketId !== "string" || !ticketId) return;
      socket.join(`ticket:${ticketId}`);

      try {
        const history = await prisma.ticketThread.findMany({
          where: { ticketId },
          orderBy: { createdAt: "asc" },
        });
        console.log(`Sending history of ${history.length} messages for ticket: ${ticketId}`);
        socket.emit("ticket-history", history);
      } catch (error) {
        console.error("Failed to load ticket history", error);
      }
    });

    socket.on("send-ticket-message", async (payload) => {
      console.log(`Received message payload from ${socket.id}:`, payload);
      const { ticketId, content, agentId, direction, media } = payload ?? {};
      if (typeof ticketId !== "string" || !ticketId || typeof content !== "string" || !content.trim()) {
        console.error("Invalid ticket payload");
        socket.emit("ticket-error", { message: "Invalid ticket payload" });
        return;
      }

      try {
        const message = await prisma.ticketThread.create({
          data: {
            ticketId,
            agentId: agentId || null,
            content: content.trim(),
            media: media || null,
            direction: typeof direction === "string" ? direction : "1",
          },
        });
        console.log(`Created message ${message.id} for ticket ${ticketId}. Emitting to room ticket:${ticketId}`);

        if (boss) {
          await boss.send("support-ticket-sync-queue", {
            type: "ticket.message",
            ticketId,
            message: content.trim(),
            isAgent: !!agentId,
          });
        }

        io.to(`ticket:${ticketId}`).emit("ticket-message", message);
      } catch (error) {
        console.error("Socket.IO save error", error);
        socket.emit("ticket-error", { message: "Failed to save ticket message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  server.listen(port, () => {
    console.log(`> Express + Next ready on http://localhost:${port}`);
  });
});
