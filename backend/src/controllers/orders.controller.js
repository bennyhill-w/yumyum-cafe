import supabase from "../services/supabase.js";
import { sendOrderConfirmation } from "../services/email.service.js";
import { sendOrderWhatsApp } from "../services/whatsapp.service.js";
import {
  initializePayment,
  verifyPayment,
} from "../services/paystack.service.js";
import { awardOrderPoints, reverseOrderPoints } from "./loyalty.controller.js";

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `YYC-${timestamp}-${random}`;
}

export async function createOrder(req, res) {
  try {
    const {
      branch_id,
      customer_name,
      customer_phone,
      customer_email,
      items,
      payment_method,
      notes,
      user_id,
      promo_code,
      promo_discount,
    } = req.body;

    // Get branch
    const { data: branch, error: branchError } = await supabase
      .from("branches")
      .select("*")
      .eq("id", branch_id)
      .single();
    if (branchError || !branch) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }

    // Calculate subtotal
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const order_number = generateOrderNumber();

    const orderData = {
      order_number,
      branch_id,
      customer_name,
      customer_phone,
      customer_email,
      items,
      subtotal,
      payment_method,
      payment_status: "pending",
      order_status: "pending",
      notes,
      user_id: user_id || null,
      promo_code: promo_code || null,
      promo_discount: promo_discount || 0,
    };

    const { data: order, error } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();
    if (error) throw error;

    // If online payment — initialize Paystack
    let paymentUrl = null;
    if (payment_method === "online") {
      if (!customer_email) {
        return res.status(400).json({
          success: false,
          message: "Customer email is required for online payment",
        });
      }

      try {
        const payment = await initializePayment({
          email: customer_email,
          amount: subtotal,
          reference: order_number,
          metadata: { order_id: order.id, customer_name, branch: branch.name },
        });
        paymentUrl = payment.authorization_url;
      } catch (err) {
        console.error("Paystack initialization error:", err.message || err);
        return res.status(502).json({
          success: false,
          message: `Payment initialization failed: ${err.message}`,
        });
      }
    }

    // Increment promo code usage count
    if (promo_code) {
      const { applyPromoCode } = await import("./promo.controller.js");
      applyPromoCode(promo_code).catch(console.error);
    }

    // Send notifications (non-blocking)
    sendOrderConfirmation(order, branch).catch(console.error);
    sendOrderWhatsApp(order, branch).catch(console.error);

    res.status(201).json({
      success: true,
      data: { order, paymentUrl },
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function verifyOrderPayment(req, res) {
  try {
    const { reference } = req.params;
    const payment = await verifyPayment(reference);

    if (payment.status === "success") {
      const { data: order, error } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          payment_ref: reference,
          order_status: "confirmed",
        })
        .eq("order_number", reference)
        .select()
        .single();
      if (error) throw error;
      return res.json({ success: true, data: order });
    }

    res.json({
      success: false,
      message: "Payment not successful",
      status: payment.status,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getAllOrders(req, res) {
  try {
    const { branch_id, status, limit = 50, page = 1 } = req.query;
    let query = supabase
      .from("orders")
      .select("*, branches(name, phone)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (branch_id) query = query.eq("branch_id", branch_id);
    if (status) query = query.eq("order_status", status);

    // Branch admins only see their branch
    if (req.admin?.role === "branch_admin" && req.admin?.branch_id) {
      query = query.eq("branch_id", req.admin.branch_id);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    res.json({
      success: true,
      data,
      total: count,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { status, payment_status } = req.body;
    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "completed",
      "cancelled",
    ];
    const validPaymentStatuses = ["pending", "paid", "failed"];

    if (status && !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order status" });
    }
    if (payment_status && !validPaymentStatuses.includes(payment_status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment status" });
    }

    const updatePayload = {};
    if (status) updatePayload.order_status = status;
    if (payment_status) updatePayload.payment_status = payment_status;

    if (Object.keys(updatePayload).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No updates provided" });
    }

    const { data, error } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) throw error;

    if (status === "completed" && data?.user_id) {
      awardOrderPoints(data.user_id, data).catch(console.error);
    }

    if (status === "cancelled" && data?.user_id) {
      reverseOrderPoints(data.user_id, data).catch(console.error);
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getOrderById(req, res) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*, branches(name, address, phone)")
      .eq("id", req.params.id)
      .single();
    if (error || !data)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
