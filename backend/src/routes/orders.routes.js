import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  verifyOrderPayment,
} from "../controllers/orders.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateOrder } from "../middleware/validate.middleware.js";
import { orderLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();
router.post("/", orderLimiter, validateOrder, createOrder);
router.get("/", requireAuth, getAllOrders);
router.get("/track/:orderNumber", async (req, res) => {
  try {
    const { data, error } = await (
      await import("../services/supabase.js")
    ).default
      .from("orders")
      .select(
        "order_number, branch_id, customer_name, items, subtotal, payment_method, payment_status, order_status, notes, created_at",
      )
      .eq("order_number", req.params.orderNumber)
      .single();
    if (error || !data)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.get("/:id", requireAuth, getOrderById);
router.patch("/:id/status", requireAuth, updateOrderStatus);
router.get("/verify/:reference", verifyOrderPayment);
export default router;
