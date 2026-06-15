import { Router } from "express";
import {
  getMenuByBranch,
  getAllMenu,
  getMenuAdmin,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  uploadMenuImage,
  toggleAvailability,
} from "../controllers/menu.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { upload } from "../services/cloudinary.js";

const router = Router();

// Public routes
router.get("/", getAllMenu);
router.get("/branch/:branch_id", getMenuByBranch);

// Admin routes
router.get("/admin/all", requireAuth, getMenuAdmin);
router.post(
  "/",
  requireAuth,
  requireRole("super_admin", "branch_admin"),
  createMenuItem,
);
router.patch(
  "/:id",
  requireAuth,
  requireRole("super_admin", "branch_admin"),
  updateMenuItem,
);
router.patch(
  "/:id/toggle",
  requireAuth,
  requireRole("super_admin", "branch_admin"),
  toggleAvailability,
);
router.delete("/:id", requireAuth, requireRole("super_admin"), deleteMenuItem);
router.post(
  "/upload-image",
  requireAuth,
  upload.single("image"),
  uploadMenuImage,
);

export default router;
