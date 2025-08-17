import { Router } from "express";
import {} from "../controllers/users.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { listUsersSchema } from "@chat-app/validators";
import { protectRoute } from "../middleware/protectRoute.js";
import { getAllUsers } from "../controllers/users.controller.js";

const router = Router();

router.get(
  "/",
  (req, res, next) => {
    console.log("HIT /users");
    next();
  },
  protectRoute,
  validateRequest(listUsersSchema),
  getAllUsers
);

export default router;
