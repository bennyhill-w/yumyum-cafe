import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();
router.get(
  "/",
  requireAuth,
  requireRole("super_admin", "branch_admin"),
  getAnalytics,
);
export default router;
