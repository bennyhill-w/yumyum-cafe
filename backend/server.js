import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import branchRoutes from "./src/routes/branches.routes.js";
import menuRoutes from "./src/routes/menu.routes.js";
import orderRoutes from "./src/routes/orders.routes.js";
import reservationRoutes from "./src/routes/reservations.routes.js";
import contactRoutes from "./src/routes/contact.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import userRoutes from "./src/routes/users.routes.js";
import loyaltyRoutes from "./src/routes/loyalty.routes.js";
import analyticsRoutes from "./src/routes/analytics.routes.js";
import promoRoutes from "./src/routes/promo.routes.js";
import reviewRoutes from "./src/routes/reviews.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5175",
    "http://localhost:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "http://localhost:4174",
    "http://127.0.0.1:4174",
    "http://localhost:5174",
    "http://localhost:5176",
    "https://yumyum-cafe.vercel.app",
    "https://yumyum-cafe-ftmy.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 204,
};

// ── Middleware ──
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ──
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Yum-Yum Cafe API",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ── Routes ──
app.use("/api/branches", branchRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/loyalty", loyaltyRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/promo", promoRoutes);
app.use("/api/reviews", reviewRoutes);

// ── 404 handler ──
app.use("*splat", (req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ──
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`\n🍽️  Yum-Yum Cafe API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}\n`);
});
