import { Router } from "express";
import {
  initiatePayment,
  confirmPayment,
} from "../controllers/payment.controller.js";

const router = Router();
router.post("/initiate", initiatePayment);
router.get("/verify/:reference", confirmPayment);
export default router;
