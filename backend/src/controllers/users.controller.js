import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import supabase from "../services/supabase.js";

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, type: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "30d" },
  );
}

export async function register(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    if (!name?.trim())
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    if (!email?.trim())
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email" });
    if (!password || password.length < 6)
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 6 characters",
        });

    // Check if email already exists
    const { data: existing } = await supabase
      .from("user_accounts")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existing)
      return res
        .status(409)
        .json({
          success: false,
          message: "An account with this email already exists",
        });

    const hashedPassword = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabase
      .from("user_accounts")
      .insert([
        {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone?.trim() || null,
          password: hashedPassword,
        },
      ])
      .select("id, name, email, phone, created_at")
      .single();

    if (error) throw error;

    const token = generateToken(user);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });

    const { data: user, error } = await supabase
      .from("user_accounts")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (error || !user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    if (!user.is_active)
      return res
        .status(401)
        .json({ success: false, message: "Account is deactivated" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    // Track last login
    await supabase
      .from("user_accounts")
      .update({ last_login: new Date().toISOString() })
      .eq("id", user.id);

    res.json({ success: true, data: { user: userWithoutPassword, token } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    const { data: user } = await supabase
      .from("user_accounts")
      .select("id, name, email")
      .eq("email", email.toLowerCase())
      .single();

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: "If this email exists, a reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await supabase
      .from("user_accounts")
      .update({
        reset_token: token,
        reset_token_expires: expires.toISOString(),
      })
      .eq("id", user.id);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: "Reset your Yum-Yum Cafe password",
      html: `
        <div style="font-family: Arial, sans-serif; color: #111;">
          <h2>Yum-Yum Cafe</h2>
          <p>Hi ${user.name}, click the button below to reset your password. This link expires in 1 hour.</p>
          <p><a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#b91c1c;color:#fff;text-decoration:none;border-radius:8px;">Reset Password</a></p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "If this email exists, a reset link has been sent.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res
        .status(400)
        .json({ success: false, message: "Token and password are required" });
    if (password.length < 6)
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 6 characters",
        });

    const { data: user, error } = await supabase
      .from("user_accounts")
      .select("id, reset_token_expires")
      .eq("reset_token", token)
      .single();

    if (error || !user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    if (
      !user.reset_token_expires ||
      new Date(user.reset_token_expires) < new Date()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Token has expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await supabase
      .from("user_accounts")
      .update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expires: null,
      })
      .eq("id", user.id);

    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getMe(req, res) {
  try {
    const { data: user, error } = await supabase
      .from("user_accounts")
      .select("id, name, email, phone, created_at")
      .eq("id", req.user.id)
      .single();

    if (error || !user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const { name, phone } = req.body;
    const updates = {};
    if (name?.trim()) updates.name = name.trim();
    if (phone?.trim()) updates.phone = phone.trim();

    const { data, error } = await supabase
      .from("user_accounts")
      .update(updates)
      .eq("id", req.user.id)
      .select("id, name, email, phone, created_at")
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function changePassword(req, res) {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password)
      return res
        .status(400)
        .json({ success: false, message: "Both passwords are required" });
    if (new_password.length < 6)
      return res
        .status(400)
        .json({
          success: false,
          message: "New password must be at least 6 characters",
        });

    const { data: user } = await supabase
      .from("user_accounts")
      .select("password")
      .eq("id", req.user.id)
      .single();

    const isValid = await bcrypt.compare(current_password, user.password);
    if (!isValid)
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(new_password, 12);
    await supabase
      .from("user_accounts")
      .update({ password: hashed })
      .eq("id", req.user.id);
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getUserOrders(req, res) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*, branches(name, address, phone)")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getUserReservations(req, res) {
  try {
    const { data, error } = await supabase
      .from("reservations")
      .select("*, branches(name, address)")
      .eq("user_id", req.user.id)
      .order("date", { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteAccount(req, res) {
  try {
    const { password } = req.body;
    const { data: user } = await supabase
      .from("user_accounts")
      .select("password")
      .eq("id", req.user.id)
      .single();

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });

    await supabase
      .from("user_accounts")
      .update({ is_active: false })
      .eq("id", req.user.id);
    res.json({ success: true, message: "Account deactivated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
