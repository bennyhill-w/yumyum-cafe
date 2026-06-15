import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

let client = null;

try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }
} catch (err) {
  console.warn("WhatsApp (Twilio) not configured:", err.message);
}

export async function sendOrderWhatsApp(order, branch) {
  if (!client) return;
  const msg = `🍽️ *NEW ORDER — Yum-Yum Cafe ${branch.name}*\n\n*Order #${order.order_number}*\n*Customer:* ${order.customer_name}\n*Phone:* ${order.customer_phone}\n*Payment:* ${order.payment_method === "pickup" ? "Pay on Pickup" : "Paid Online"}\n\n*Items:*\n${order.items.map((i) => `• ${i.name} x${i.quantity} — ₦${(i.price * i.quantity).toLocaleString()}`).join("\n")}\n\n*Total: ₦${order.subtotal.toLocaleString()}*\n\n${order.notes ? `*Notes:* ${order.notes}` : ""}`;
  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${branch.whatsapp}`,
      body: msg,
    });
  } catch (err) {
    console.error("WhatsApp send error:", err.message);
  }
}

export async function sendReservationWhatsApp(reservation, branch) {
  if (!client) return;
  const msg = `📅 *NEW RESERVATION — Yum-Yum Cafe ${branch.name}*\n\n*Customer:* ${reservation.customer_name}\n*Phone:* ${reservation.customer_phone}\n*Date:* ${reservation.date}\n*Time:* ${reservation.time}\n*Party Size:* ${reservation.party_size} people\n${reservation.occasion ? `*Occasion:* ${reservation.occasion}\n` : ""}${reservation.special_requests ? `*Requests:* ${reservation.special_requests}` : ""}`;
  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${branch.whatsapp}`,
      body: msg,
    });
  } catch (err) {
    console.error("WhatsApp send error:", err.message);
  }
}
