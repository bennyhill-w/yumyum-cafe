import { Router } from "express";
import {
  createReview,
  getItemReviews,
  getAllReviews,
  approveReview,
  deleteReview,
} from "../controllers/reviews.controller.js";
import { requireUser } from "../middleware/userAuth.middleware.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/item/:item_name", getItemReviews);
router.post("/", requireUser, createReview);
router.get(
  "/admin/all",
  requireAuth,
  requireRole("super_admin", "branch_admin"),
  getAllReviews,
);
router.patch(
  "/admin/:id/approve",
  requireAuth,
  requireRole("super_admin"),
  approveReview,
);
router.delete(
  "/admin/:id",
  requireAuth,
  requireRole("super_admin"),
  deleteReview,
);

export default router;
