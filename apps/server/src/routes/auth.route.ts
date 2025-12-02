import express from "express";
import {
  signup,
  login,
  logout,
  getMe,
  googleAuth,
  googleCallback,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { signupSchema, loginSchema } from "@chat-app/validators";
const router = express.Router();

router.post("/signup", validateRequest(signupSchema), signup);

router.post("/login", validateRequest(loginSchema), login);

router.post("/logout", logout);

router.get("/me", protectRoute, getMe);

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

export default router;
