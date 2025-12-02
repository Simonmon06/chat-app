import express from "express";
import { proxyAvatar } from "../controllers/avatar.controller.js";

const router = express.Router();

router.get("/:userId", proxyAvatar);

export default router;
