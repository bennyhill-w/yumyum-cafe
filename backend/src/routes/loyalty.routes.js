import { Router } from "express";
import {
  getLoyaltyAccount,
  getLoyaltyTransactions,
  calculateRedemption,
  redeemPoints,
  getLoyaltyStats,
  manualAdjustPoints,
} from "../controllers/loyalty.controller.js";
import { requireUser } from "../middleware/userAuth.middleware.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

// Customer routes
router.get("/account", requireUser, getLoyaltyAccount);
router.get("/transactions", requireUser, getLoyaltyTransactions);
router.post("/calculate", requireUser, calculateRedemption);
router.post("/redeem", requireUser, redeemPoints);

// Admin routes
router.get(
  "/stats",
  requireAuth,
  requireRole("super_admin", "branch_admin"),
  getLoyaltyStats,
);
router.post(
  "/adjust",
  requireAuth,
  requireRole("super_admin"),
  manualAdjustPoints,
);

export default router;
