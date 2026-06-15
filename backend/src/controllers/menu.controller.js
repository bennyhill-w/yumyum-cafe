import supabase from "../services/supabase.js";

export async function getMenuByBranch(req, res) {
  try {
    const { branch_id } = req.params;
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("branch_id", branch_id)
      .eq("is_available", true)
      .order("category");
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getAllMenu(req, res) {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("category");
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createMenuItem(req, res) {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .insert([req.body])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateMenuItem(req, res) {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .update(req.body)
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteMenuItem(req, res) {
  try {
    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true, message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function uploadMenuImage(req, res) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image file provided" });
    }
    res.json({ success: true, data: { url: req.file.path } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function toggleAvailability(req, res) {
  try {
    const { data: current, error: fetchError } = await supabase
      .from("menu_items")
      .select("is_available")
      .eq("id", req.params.id)
      .single();
    if (fetchError) throw fetchError;

    const { data, error } = await supabase
      .from("menu_items")
      .update({ is_available: !current.is_available })
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getMenuAdmin(req, res) {
  try {
    const { branch_id, category } = req.query;
    let query = supabase
      .from("menu_items")
      .select("*")
      .order("category")
      .order("name");

    if (branch_id) query = query.eq("branch_id", branch_id);
    if (category) query = query.eq("category", category);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
