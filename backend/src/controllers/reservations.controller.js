import supabase from "../services/supabase.js";
import { sendReservationConfirmation } from "../services/email.service.js";
import { sendReservationWhatsApp } from "../services/whatsapp.service.js";

export async function createReservation(req, res) {
  try {
    const {
      branch_id,
      customer_name,
      customer_phone,
      customer_email,
      party_size,
      date,
      time,
      occasion,
      special_requests,
    } = req.body;

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

    const { data, error } = await supabase
      .from("reservations")
      .insert([
        {
          branch_id,
          customer_name,
          customer_phone,
          customer_email,
          party_size,
          date,
          time,
          occasion,
          special_requests,
        },
      ])
      .select()
      .single();
    if (error) throw error;

    sendReservationConfirmation(data, branch).catch(console.error);
    sendReservationWhatsApp(data, branch).catch(console.error);

    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getAllReservations(req, res) {
  try {
    const { branch_id, status, date, limit = 50, page = 1 } = req.query;
    let query = supabase
      .from("reservations")
      .select("*, branches(name)", { count: "exact" })
      .order("date", { ascending: true })
      .order("time", { ascending: true })
      .range((page - 1) * limit, page * limit - 1);

    if (branch_id) query = query.eq("branch_id", branch_id);
    if (status) query = query.eq("status", status);
    if (date) query = query.eq("date", date);
    if (req.admin?.role === "branch_admin" && req.admin?.branch_id) {
      query = query.eq("branch_id", req.admin.branch_id);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    res.json({ success: true, data, total: count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateReservationStatus(req, res) {
  try {
    const { status } = req.body;
    const valid = ["pending", "confirmed", "declined", "cancelled"];
    if (!valid.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }
    const { data, error } = await supabase
      .from("reservations")
      .update({ status })
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
