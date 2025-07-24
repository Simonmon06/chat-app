import express from "express";
import {
  sendMessage,
  getConversation,
  getUserForSideBar,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { sendMessageSchema, getConversationSchema } from "@chat-app/validators";
import { validateRequest } from "../middleware/validateRequest.js";
const router = express.Router();

router.post(
  "/send/:receiverId",
  protectRoute,
  validateRequest(sendMessageSchema),
  sendMessage
);

router.get(
  "/conversation/:conversationId",
  protectRoute,
  validateRequest(getConversationSchema),
  getConversation
);

router.get("/conversations", protectRoute, getUserForSideBar);

export default router;
