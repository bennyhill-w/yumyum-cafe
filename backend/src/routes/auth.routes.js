import { Router } from "express";
import {
  login,
  getMe,
  createAdmin,
  changePassword,
} from "../controllers/auth.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();
router.post("/login", authLimiter, login);
router.get("/me", requireAuth, getMe);
router.post("/create", requireAuth, requireRole("super_admin"), createAdmin);
router.patch("/password", requireAuth, changePassword);
export default router;
