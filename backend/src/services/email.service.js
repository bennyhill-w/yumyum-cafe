import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.FROM_EMAIL || "noreply@yumyum-cafe.com.ng";
const ADMIN = process.env.ADMIN_EMAIL || "info@yumyum-cafe.com.ng";

// ── Order confirmation to customer ──
export async function sendOrderConfirmation(order, branch) {
  const itemsHtml = order.items
    .map(
      (i) => `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-family:sans-serif;font-size:14px;">${i.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-family:sans-serif;font-size:14px;text-align:center;">${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-family:sans-serif;font-size:14px;text-align:right;color:#B91C1C;font-weight:700;">₦${(i.price * i.quantity).toLocaleString()}</td>
    </tr>`,
    )
    .join("");

  const html = `
    <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="background:#B91C1C;border-radius:16px 16px 0 0;padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;font-weight:800;">Yum-Yum Cafe</h1>
          <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:14px;">Order Confirmation</p>
        </div>
        <div style="background:#fff;border-radius:0 0 16px 16px;padding:32px;border:1px solid #f3f4f6;">
          <h2 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px;">
            Order Received! 🎉
          </h2>
          <p style="color:#6b7280;font-size:15px;margin:0 0 24px;">
            Hi ${order.customer_name}, your order has been received by our <strong style="color:#B91C1C;">${branch.name}</strong> branch and is being prepared fresh for you.
          </p>
          <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:24px;">
            <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Order Number</p>
            <p style="margin:0;font-size:20px;font-weight:800;color:#B91C1C;">#${order.order_number}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <thead>
              <tr>
                <th style="text-align:left;font-size:12px;color:#9ca3af;text-transform:uppercase;padding-bottom:12px;letter-spacing:0.05em;">Item</th>
                <th style="text-align:center;font-size:12px;color:#9ca3af;text-transform:uppercase;padding-bottom:12px;letter-spacing:0.05em;">Qty</th>
                <th style="text-align:right;font-size:12px;color:#9ca3af;text-transform:uppercase;padding-bottom:12px;letter-spacing:0.05em;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="display:flex;justify-content:space-between;padding:16px 0;border-top:2px solid #f3f4f6;">
            <span style="font-weight:700;color:#111827;font-size:16px;">Total</span>
            <span style="font-weight:800;color:#B91C1C;font-size:20px;">₦${order.subtotal.toLocaleString()}</span>
          </div>
          <div style="background:#fef2f2;border-radius:12px;padding:16px;margin-top:20px;">
            <p style="margin:0;font-size:14px;color:#7f1d1d;font-weight:600;">📍 Pickup at: ${branch.name} Branch</p>
            <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">${branch.address}</p>
            <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">Payment: ${order.payment_method === "pickup" ? "Pay on Pickup" : "Paid Online"}</p>
          </div>
          <p style="color:#9ca3af;font-size:13px;margin-top:24px;text-align:center;">
            Questions? Call us at ${branch.phone} or reply to this email.
          </p>
        </div>
      </div>
    </body></html>
  `;

  try {
    if (order.customer_email) {
      await resend.emails.send({
        from: FROM,
        to: order.customer_email,
        subject: `Order Confirmed — #${order.order_number} | Yum-Yum Cafe`,
        html,
      });
    }
    // Also notify admin
    await resend.emails.send({
      from: FROM,
      to: ADMIN,
      subject: `New Order #${order.order_number} — ${branch.name}`,
      html: `<p>New order received at <strong>${branch.name}</strong>.</p><p>Customer: ${order.customer_name} (${order.customer_phone})</p><p>Total: ₦${order.subtotal.toLocaleString()}</p><p>Items: ${order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}</p>`,
    });
  } catch (err) {
    console.error("Email send error:", err);
  }
}

// ── Reservation confirmation ──
export async function sendReservationConfirmation(reservation, branch) {
  const html = `
    <!DOCTYPE html><html><body style="font-family:sans-serif;background:#f9fafb;margin:0;padding:0;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="background:#B91C1C;border-radius:16px 16px 0 0;padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;font-weight:800;">Yum-Yum Cafe</h1>
          <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;">Table Reservation</p>
        </div>
        <div style="background:#fff;border-radius:0 0 16px 16px;padding:32px;border:1px solid #f3f4f6;">
          <h2 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 16px;">Reservation Received!</h2>
          <p style="color:#6b7280;font-size:15px;">Hi ${reservation.customer_name}, your table reservation at our <strong style="color:#B91C1C;">${branch.name}</strong> branch has been received. We will confirm by phone shortly.</p>
          <div style="background:#f9fafb;border-radius:12px;padding:20px;margin:24px 0;">
            <p><strong>Branch:</strong> ${branch.name}</p>
            <p><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            <p><strong>Time:</strong> ${reservation.time}</p>
            <p><strong>Party Size:</strong> ${reservation.party_size} people</p>
            ${reservation.occasion ? `<p><strong>Occasion:</strong> ${reservation.occasion}</p>` : ""}
          </div>
          <p style="color:#9ca3af;font-size:13px;">Questions? Call us at ${branch.phone}</p>
        </div>
      </div>
    </body></html>
  `;
  try {
    if (reservation.customer_email) {
      await resend.emails.send({
        from: FROM,
        to: reservation.customer_email,
        subject: `Reservation Received — ${branch.name} | Yum-Yum Cafe`,
        html,
      });
    }
    await resend.emails.send({
      from: FROM,
      to: ADMIN,
      subject: `New Reservation — ${branch.name} — ${reservation.date} ${reservation.time}`,
      html: `<p>New reservation at <strong>${branch.name}</strong>.</p><p>Customer: ${reservation.customer_name} (${reservation.customer_phone})</p><p>Date: ${reservation.date} at ${reservation.time}</p><p>Party: ${reservation.party_size} people</p>`,
    });
  } catch (err) {
    console.error("Email send error:", err);
  }
}

export async function sendOTPEmail(user, otp) {
  try {
    await resend.emails.send({
      from: FROM,
      to: user.email,
      subject: `${otp} is your Yum-Yum Cafe verification code`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
          <div style="max-width:480px;margin:0 auto;padding:40px 20px;">
            <div style="background:#B91C1C;border-radius:16px 16px 0 0;padding:32px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800;">Yum-Yum Cafe</h1>
              <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:14px;">Email Verification</p>
            </div>
            <div style="background:#fff;border-radius:0 0 16px 16px;padding:32px;border:1px solid #f3f4f6;">
              <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">Hi ${user.name},</h2>
              <p style="color:#6b7280;font-size:15px;margin:0 0 24px;">
                Use this code to verify your Yum-Yum Cafe account.
                It expires in <strong>10 minutes.</strong>
              </p>
              <div style="background:#fef2f2;border:2px solid #fecaca;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
                <p style="color:#9ca3af;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px;">
                  Your verification code
                </p>
                <p style="color:#B91C1C;font-size:42px;font-weight:800;letter-spacing:0.3em;margin:0;font-family:monospace;">
                  ${otp}
                </p>
              </div>
              <p style="color:#9ca3af;font-size:13px;text-align:center;">
                If you did not create a Yum-Yum Cafe account, you can safely ignore this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (err) {
    console.error("OTP email error:", err);
  }
}

// ── Contact form ──
export async function sendContactEmail(contact) {
  try {
    await resend.emails.send({
      from: FROM,
      to: ADMIN,
      subject: `New Contact Message — ${contact.subject} | Yum-Yum Cafe`,
      html: `<p><strong>From:</strong> ${contact.name} (${contact.email})</p>${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ""}<p><strong>Subject:</strong> ${contact.subject}</p><p><strong>Message:</strong></p><p>${contact.message}</p>`,
    });
  } catch (err) {
    console.error("Email send error:", err);
  }
}
