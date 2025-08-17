import express from "express";
import {
  startConversation,
  getConversation,
  getAllSidebarConversations,
  addMessageToConversation,
  ensureDmConversation,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  startConversationSchema,
  getConversationSchema,
  addMessageToConversationSchema,
  ensureDmConversationSchema,
} from "@chat-app/validators";
import { validateRequest } from "../middleware/validateRequest.js";
const router = express.Router();

router.post(
  "/users/:receiverId/conversation",
  protectRoute,
  validateRequest(ensureDmConversationSchema),
  ensureDmConversation
);
router.post(
  "/send/:receiverId",
  protectRoute,
  validateRequest(startConversationSchema),
  startConversation
);

router.post(
  "/conversations/add/:conversationId",
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
