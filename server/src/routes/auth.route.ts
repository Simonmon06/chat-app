import express from "express";
import {
  signup,
  login,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { signupSchema, loginSchema } from "../utils/validationSchemas.js";
const router = express.Router();

router.post("/signup", validateRequest(signupSchema), signup);

router.post("/login", validateRequest(loginSchema), login);

router.post("/logout", logout);

router.get("/me", protectRoute, getMe);

export default router;
