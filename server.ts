import "dotenv/config";
import express from "express";
import http from "http";
import next from "next";
import { Server } from "socket.io";
import supportRoutes from "./server/routes/supportRoutes.ts";
import { boss, initQueue } from "./server/queue.ts";
import "./server/worker.ts"; // Start background workers
import prisma from "./lib/prisma.ts";
import { syncMessageToZoho } from "./server/services/zohoSync.ts";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const port = Number(process.env.PORT || 3000);
let ioInstance: Server;

nextApp.prepare().then(async () => {
  await initQueue();
  
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/api/support", supportRoutes);

  app.all("*", (req, res) => {
    if (req.url.startsWith("/_next") || req.url.includes("icon")) {
      // Skip noise
    } else {
      console.log(`[HTTP] ${req.method} ${req.url}`);
    }
    return handle(req, res);
  });

  const server = http.createServer(app);
  ioInstance = new Server(server, {
    cors: {
      origin: dev ? "*" : undefined,
      methods: ["GET", "POST"],
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-ticket", async (ticketId: string) => {
      console.log(`[SOCKET] ${socket.id} attempting to join ticket room: ${ticketId}`);
      if (typeof ticketId !== "string" || !ticketId) {
        console.error(`[SOCKET] Invalid ticketId provided for join-ticket: ${ticketId}`);
        return;
      }
      
      const roomName = `ticket:${ticketId}`;
      socket.join(roomName);
      console.log(`[SOCKET] ${socket.id} successfully joined room: ${roomName}`);

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
        console.log(`[SOCKET] Created message ${message.id} for ticket ${ticketId}.`);

        // Sync to Zoho Desk in the background (non-blocking)
        syncMessageToZoho(ticketId, content.trim(), !!agentId).catch((syncError) => {
          console.error(`[SOCKET] Background Zoho sync failed for message ${message.id}:`, syncError);
        });

        const roomName = `ticket:${ticketId}`;
        console.log(`[SOCKET] Broadcasting 'ticket-message' to room: ${roomName}`);
        ioInstance.to(roomName).emit("ticket-message", message);
        console.log(`[SOCKET] Broadcast complete for message ${message.id}`);
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

export const getIO = () => ioInstance;
