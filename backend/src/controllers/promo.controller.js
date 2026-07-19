import supabase from "../services/supabase.js";

export async function validatePromoCode(req, res) {
  try {
    const { code, order_subtotal } = req.body;
    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "Promo code is required" });
    }

    const { data: promo, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .single();

    if (error || !promo) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid promo code" });
    }

    if (!promo.is_active) {
      return res
        .status(400)
        .json({
          success: false,
          message: "This promo code is no longer active",
        });
    }

    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "This promo code has expired" });
    }

    if (promo.max_uses && promo.uses_count >= promo.max_uses) {
      return res
        .status(400)
        .json({
          success: false,
          message: "This promo code has reached its usage limit",
        });
    }

    if (
      order_subtotal &&
      promo.min_order &&
      Number(order_subtotal) < Number(promo.min_order)
    ) {
      return res.status(400).json({
        success: false,
        message: `Minimum order of ₦${Number(promo.min_order).toLocaleString()} required for this code`,
      });
    }

    let discount = 0;
    if (promo.type === "percentage") {
      discount = (Number(order_subtotal) * Number(promo.value)) / 100;
    } else {
      discount = Number(promo.value);
    }

    discount = Math.min(discount, Number(order_subtotal));

    res.json({
      success: true,
      data: {
        code: promo.code,
        description: promo.description,
        type: promo.type,
        value: promo.value,
        discount: Math.round(discount),
        final_total: Number(order_subtotal) - Math.round(discount),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function applyPromoCode(code) {
  const { data: promo } = await supabase
    .from("promo_codes")
    .select("id, uses_count")
    .eq("code", code.toUpperCase().trim())
    .single();

  if (promo) {
    await supabase
      .from("promo_codes")
      .update({ uses_count: promo.uses_count + 1 })
      .eq("id", promo.id);
  }
}

export async function getAllPromoCodes(req, res) {
  try {
    const { data, error } = await supabase
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createPromoCode(req, res) {
  try {
    const { code, description, type, value, min_order, max_uses, expires_at } =
      req.body;
    if (!code || !type || !value) {
      return res
        .status(400)
        .json({ success: false, message: "code, type and value are required" });
    }

    const { data, error } = await supabase
      .from("promo_codes")
      .insert([
        {
          code: code.toUpperCase().trim(),
          description,
          type,
          value: Number(value),
          min_order: min_order ? Number(min_order) : 0,
          max_uses: max_uses ? Number(max_uses) : null,
          expires_at: expires_at || null,
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return res
          .status(409)
          .json({ success: false, message: "This promo code already exists" });
      }
      throw error;
    }

    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updatePromoCode(req, res) {
  try {
    const { data, error } = await supabase
      .from("promo_codes")
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

export async function deletePromoCode(req, res) {
  try {
    const { error } = await supabase
      .from("promo_codes")
      .delete()
      .eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true, message: "Promo code deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
