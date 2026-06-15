import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../services/supabase.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();
    if (error || !admin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    if (!admin.is_active) {
      return res
        .status(401)
        .json({ success: false, message: "Account is deactivated" });
    }
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );
    const { password: _, ...adminWithoutPassword } = admin;
    res.json({ success: true, data: { admin: adminWithoutPassword, token } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getMe(req, res) {
  res.json({ success: true, data: req.admin });
}

export async function createAdmin(req, res) {
  try {
    const { email, password, name, role, branch_id } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({
          success: false,
          message: "email, password, name are required",
        });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const { data, error } = await supabase
      .from("admin_users")
      .insert([
        {
          email: email.toLowerCase(),
          password: hashedPassword,
          name,
          role: role || "staff",
          branch_id,
        },
      ])
      .select("id, email, name, role, branch_id, is_active, created_at")
      .single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function changePassword(req, res) {
  try {
    const { current_password, new_password } = req.body;
    const { data: admin } = await supabase
      .from("admin_users")
      .select("password")
      .eq("id", req.admin.id)
      .single();
    const isValid = await bcrypt.compare(current_password, admin.password);
    if (!isValid)
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    const hashed = await bcrypt.hash(new_password, 12);
    await supabase
      .from("admin_users")
      .update({ password: hashed })
      .eq("id", req.admin.id);
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
