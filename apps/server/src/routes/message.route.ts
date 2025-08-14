import express from "express";
import {
  sendMessage,
  getConversation,
  getAllSidebarConversations,
  addMessageToConversation,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  sendMessageSchema,
  getConversationSchema,
  addMessageToConversationSchema,
} from "@chat-app/validators";
import { validateRequest } from "../middleware/validateRequest.js";
const router = express.Router();

router.post(
  "/send/:receiverId",
  protectRoute,
  validateRequest(sendMessageSchema),
  sendMessage
);

router.post(
  "/conversations/send/:conversationId",
  protectRoute,
  validateRequest(addMessageToConversationSchema),
  addMessageToConversation
);
router.get(
  "/conversations/:conversationId",
  protectRoute,
  validateRequest(getConversationSchema),
  getConversation
);

router.get("/conversations", protectRoute, getAllSidebarConversations);

export default router;
