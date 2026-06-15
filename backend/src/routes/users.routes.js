import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword,
  getUserOrders,
  getUserReservations,
  deleteAccount,
} from "../controllers/users.controller.js";
import { requireUser } from "../middleware/userAuth.middleware.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

// Public
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

// Protected
router.get("/me", requireUser, getMe);
router.patch("/profile", requireUser, updateProfile);
router.patch("/password", requireUser, changePassword);
router.delete("/account", requireUser, deleteAccount);
router.get("/orders", requireUser, getUserOrders);
router.get("/reservations", requireUser, getUserReservations);

export default router;
