import { Router } from "express";
import {
  validatePromoCode,
  getAllPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
} from "../controllers/promo.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/validate", validatePromoCode);
router.get(
  "/",
  requireAuth,
  requireRole("super_admin", "branch_admin"),
  getAllPromoCodes,
);
router.post("/", requireAuth, requireRole("super_admin"), createPromoCode);
router.patch("/:id", requireAuth, requireRole("super_admin"), updatePromoCode);
router.delete("/:id", requireAuth, requireRole("super_admin"), deletePromoCode);

export default router;
