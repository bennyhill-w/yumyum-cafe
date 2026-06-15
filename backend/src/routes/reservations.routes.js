import { Router } from "express";
import {
  createReservation,
  getAllReservations,
  updateReservationStatus,
} from "../controllers/reservations.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateReservation } from "../middleware/validate.middleware.js";

const router = Router();
router.post("/", validateReservation, createReservation);
router.get("/", requireAuth, getAllReservations);
router.patch("/:id/status", requireAuth, updateReservationStatus);
export default router;
