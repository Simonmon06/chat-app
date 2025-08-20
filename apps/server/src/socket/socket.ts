import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import prisma from "../db/prisma.js";
// JWT-authenticate and attach userId
type JwtPayload = { userId: string; iat: number; exp: number };

const app = express();

const server = http.createServer(app);

const allowed = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

const io = new Server(server, {
  cors: {
    origin: allowed,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  },
});

io.use((socket, next) => {
  try {
    const raw = socket.handshake.headers.cookie ?? "";
    console.log("[socket] Cookie hdr:", raw); //jwt

    const { myJWT } = cookie.parse(raw);
    if (!myJWT) return next(new Error("unauthorized")); // no jwt

    const { userId } = jwt.verify(myJWT, process.env.JWT_SECRET!) as JwtPayload;
    (socket.data as any).userId = userId; // attach
    return next();
  } catch (e) {
    console.error("[socket] JWT verify failed:", e);
    return next(new Error("unauthorized"));
  }
});

// one userId has many socket.id
const online = new Map<string, Set<string>>();
const broadcastOnline = () => io.emit("onlineUsers", [...online.keys()]);

// step1: user connection established, update userSocketMap
io.on("connection", (socket) => {
  // identity: attach JWT to socket.data）
  const userId = (socket.data as any).userId as string | undefined;
  console.log("[socket] connected:", { sid: socket.id, userId });

  if (!userId) {
    console.warn("[socket] no userId on socket.data, disconnect");
    socket.disconnect();
    return;
  }

  // presence：多标签/多设备
  let set = online.get(userId);
  if (!set) online.set(userId, (set = new Set()));
  set.add(socket.id);

  // user private room
  socket.join(`user:${userId}`);

  broadcastOnline();

  // tool
  const roomSize = (conversationId: string) =>
    io.sockets.adapter.rooms.get(`conversation:${conversationId}`)?.size ?? 0;

  // ---- conversation rooms ----
  socket.on(
    "conversation:join",
    async (
      { conversationId }: { conversationId: string },
      ack?: (res: {
        ok: boolean;
        conversationId?: string;
        size?: number;
        reason?: string;
      }) => void
    ) => {
      if (!conversationId) {
        ack?.({ ok: false, reason: "no_conversationId" });
        return;
      }

      // （可选 authZ）建议在这里用 Prisma 校验 membership
      const member = prisma.conversationParticipant.findUnique({
        where: { conversationId_userId: { conversationId, userId } },
      });
      if (!member) {
        ack?.({ ok: false, reason: "not_member" });
        return;
      }

      const prev = (socket.data as any).activeConvId as string | undefined;
      if (prev && prev !== conversationId) {
        socket.leave(`conversation:${prev}`);
        console.log("[socket] auto-leave prev:", { sid: socket.id, prev });
      }

      socket.join(`conversation:${conversationId}`);
      (socket.data as any).activeConvId = conversationId;

      const size = roomSize(conversationId);
      console.log("[socket] join:", {
        sid: socket.id,
        conversationId,
        size,
        rooms: [...socket.rooms],
      });
      ack?.({ ok: true, conversationId, size });
    }
  );

  socket.on(
    "conversation:leave",
    ({ conversationId }: { conversationId: string }) => {
      if (!conversationId) return;
      socket.leave(`conversation:${conversationId}`);

      // 清掉活动会话标记
      const prev = (socket.data as any).activeConvId as string | undefined;
      if (prev === conversationId)
        (socket.data as any).activeConvId = undefined;

      const size = roomSize(conversationId);
      console.log("[socket] leave:", { sid: socket.id, conversationId, size });
    }
  );

  socket.on("disconnect", () => {
    const set = online.get(userId);
    if (set) {
      set.delete(socket.id);
      if (set.size === 0) online.delete(userId);
    }
    broadcastOnline();
    console.log("[socket] disconnected:", { sid: socket.id, userId });
  });
});

export { app, io, server };
