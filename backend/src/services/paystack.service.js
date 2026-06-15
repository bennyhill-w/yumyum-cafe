import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const PAYSTACK_BASE = "https://api.paystack.co";
const SECRET = process.env.PAYSTACK_SECRET_KEY;

if (!SECRET) {
  throw new Error("PAYSTACK_SECRET_KEY is not configured");
}

const paystackApi = axios.create({
  baseURL: PAYSTACK_BASE,
  headers: {
    Authorization: `Bearer ${SECRET}`,
    "Content-Type": "application/json",
  },
});

export async function initializePayment({
  email,
  amount,
  reference,
  metadata,
}) {
  if (!email) {
    throw new Error("Customer email is required for online payment");
  }

  const response = await paystackApi.post("/transaction/initialize", {
    email,
    amount: Math.round(amount * 100), // Convert to kobo
    reference,
    metadata,
    callback_url: `${process.env.FRONTEND_URL}/order?payment=success`,
  });
  return response.data.data;
}

export async function verifyPayment(reference) {
  const response = await paystackApi.get(`/transaction/verify/${reference}`);
  return response.data.data;
}
