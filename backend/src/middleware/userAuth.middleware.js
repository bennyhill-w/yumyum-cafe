import jwt from "jsonwebtoken";
import supabase from "../services/supabase.js";

export async function requireUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "user") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token type" });
    }

    const { data: user, error } = await supabase
      .from("user_accounts")
      .select("id, name, email, phone, is_active")
      .eq("id", decoded.id)
      .single();

    if (error || !user || !user.is_active) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

// Optional auth — attaches user if token exists, but doesn't block if not
export async function optionalUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return next();

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== "user") return next();

    const { data: user } = await supabase
      .from("user_accounts")
      .select("id, name, email, phone")
      .eq("id", decoded.id)
      .single();

    if (user) req.user = user;
    next();
  } catch {
    next();
  }
}
