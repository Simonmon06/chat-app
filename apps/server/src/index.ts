import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import { config } from "./config.js";
import usersRoutes from "./routes/users.route.js";
import avatarRoutes from "./routes/avatar.route.js";
import { app, server } from "./socket/socket.js";
import cors from "cors";
const PORT = Number(process.env.PORT ?? 3001);
const ORIGINS = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());
app.set("trust proxy", 1);

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ORIGINS,
    credentials: true,
  })
);
app.get("/health-check", (_req, res) => res.status(200).json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/avatars", avatarRoutes);

server.listen(PORT, () => {
  console.log(
    `[server] ready at ${
      process.env.PUBLIC_BASE_URL ?? `http://localhost:${PORT}`
    }`
  );
});
