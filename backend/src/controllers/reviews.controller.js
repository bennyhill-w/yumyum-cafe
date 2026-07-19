import supabase from "../services/supabase.js";

export async function createReview(req, res) {
  try {
    const { order_id, menu_item_id, item_name, rating, comment } = req.body;
    const user_id = req.user.id;

    if (!order_id || !item_name || !rating) {
      return res
        .status(400)
        .json({
          success: false,
          message: "order_id, item_name and rating are required",
        });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, user_id, order_status, items")
      .eq("id", order_id)
      .maybeSingle();

    if (orderError) throw orderError;
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    if (order.user_id !== user_id)
      return res
        .status(403)
        .json({
          success: false,
          message: "You can only review your own orders",
        });
    if (order.order_status !== "completed")
      return res
        .status(400)
        .json({
          success: false,
          message: "You can only review completed orders",
        });

    const { data: existing, error: existingError } = await supabase
      .from("reviews")
      .select("id")
      .eq("user_id", user_id)
      .eq("order_id", order_id)
      .eq("item_name", item_name)
      .maybeSingle();

    if (existingError) throw existingError;
    if (existing)
      return res
        .status(409)
        .json({
          success: false,
          message: "You have already reviewed this item from this order",
        });

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          user_id,
          order_id,
          menu_item_id: menu_item_id || null,
          item_name,
          rating,
          comment: comment || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getItemReviews(req, res) {
  try {
    const { item_name } = req.params;
    const { data, error } = await supabase
      .from("reviews")
      .select("id, rating, comment, item_name, created_at, user_accounts(name)")
      .eq("item_name", decodeURIComponent(item_name))
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    const avgRating =
      data.length > 0
        ? data.reduce((s, r) => s + r.rating, 0) / data.length
        : 0;

    res.json({
      success: true,
      data,
      avg_rating: Math.round(avgRating * 10) / 10,
      total: data.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getAllReviews(req, res) {
  try {
    const { approved } = req.query;
    let query = supabase
      .from("reviews")
      .select("*, user_accounts(name, email), orders(order_number)")
      .order("created_at", { ascending: false });

    if (approved !== undefined)
      query = query.eq("is_approved", approved === "true");

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function approveReview(req, res) {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .update({ is_approved: true })
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteReview(req, res) {
  try {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
