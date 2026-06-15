import supabase from "../services/supabase.js";
import { sendContactEmail } from "../services/email.service.js";

export async function createContact(req, res) {
  try {
    const { name, email, phone, subject, message } = req.body;
    const { data, error } = await supabase
      .from("contacts")
      .insert([{ name, email, phone, subject, message }])
      .select()
      .single();
    if (error) throw error;
    sendContactEmail(data).catch(console.error);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getAllContacts(req, res) {
  try {
    const { is_read, limit = 50, page = 1 } = req.query;
    let query = supabase
      .from("contacts")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);
    if (is_read !== undefined) query = query.eq("is_read", is_read === "true");
    const { data, error, count } = await query;
    if (error) throw error;
    res.json({ success: true, data, total: count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function markContactRead(req, res) {
  try {
    const { data, error } = await supabase
      .from("contacts")
      .update({ is_read: true })
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
