import jwt from "jsonwebtoken";
import supabase from "../services/supabase.js";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("id, email, name, role, branch_id, is_active")
      .eq("id", decoded.id)
      .single();
    if (error || !admin || !admin.is_active) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.admin?.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Insufficient permissions" });
    }
    next();
  };
}
