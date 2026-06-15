import {
  initializePayment,
  verifyPayment,
} from "../services/paystack.service.js";
import supabase from "../services/supabase.js";

export async function initiatePayment(req, res) {
  try {
    const { order_number, email, amount } = req.body;
    if (!order_number || !email || !amount) {
      return res
        .status(400)
        .json({
          success: false,
          message: "order_number, email and amount required",
        });
    }
    const data = await initializePayment({
      email,
      amount,
      reference: order_number,
      metadata: { order_number },
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function confirmPayment(req, res) {
  try {
    const { reference } = req.params;
    const payment = await verifyPayment(reference);
    if (payment.status === "success") {
      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          payment_ref: reference,
          order_status: "confirmed",
        })
        .eq("order_number", reference);
      return res.json({
        success: true,
        message: "Payment confirmed",
        data: payment,
      });
    }
    res.json({
      success: false,
      message: "Payment not completed",
      status: payment.status,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
