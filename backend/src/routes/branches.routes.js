import { Router } from "express";
import {
  getAllBranches,
  getBranchById,
  updateBranch,
} from "../controllers/branches.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", getAllBranches);
router.get("/:id", getBranchById);
router.patch("/:id", requireAuth, requireRole("super_admin"), updateBranch);
export default router;
