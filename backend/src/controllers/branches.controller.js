import supabase from "../services/supabase.js";

export async function getAllBranches(req, res) {
  try {
    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .order("name");
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getBranchById(req, res) {
  try {
    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .eq("id", req.params.id)
      .single();
    if (error || !data)
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateBranch(req, res) {
  try {
    const { data, error } = await supabase
      .from("branches")
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
