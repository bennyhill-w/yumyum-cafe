import supabase from "../services/supabase.js";

const POINTS_PER_NAIRA = 0.002; // ₦500 = 1 point
const WELCOME_BONUS = 20; // points on first completed order
const POINTS_PER_REDEMPTION = 100; // 100 points = ₦500
const NAIRA_PER_REDEMPTION = 500; // ₦500 discount per 100 points
const MIN_POINTS_TO_REDEEM = 100;
const MAX_DISCOUNT_PERCENT = 0.5; // 50% of order value

// ── Get user's loyalty account ──
export async function getLoyaltyAccount(req, res) {
  try {
    const { data, error } = await supabase
      .from("loyalty_accounts")
      .select("*")
      .eq("user_id", req.user.id)
      .single();

    if (error || !data) {
      const { data: newAccount, error: createError } = await supabase
        .from("loyalty_accounts")
        .insert([{ user_id: req.user.id }])
        .select()
        .single();

      if (createError) throw createError;
      return res.json({ success: true, data: newAccount });
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ── Get user's transaction history ──
export async function getLoyaltyTransactions(req, res) {
  try {
    const { data, error } = await supabase
      .from("loyalty_transactions")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ── Award points when order is completed ──
export async function awardOrderPoints(userId, order) {
  try {
    const pointsEarned = Math.floor(order.subtotal * POINTS_PER_NAIRA);
    if (pointsEarned <= 0) return;

    const { count } = await supabase
      .from("loyalty_transactions")
      .select("id", { count: "exact" })
      .eq("user_id", userId)
      .eq("type", "earned");

    const isFirstOrder = count === 0;

    let { data: account } = await supabase
      .from("loyalty_accounts")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!account) {
      const { data: newAcc } = await supabase
        .from("loyalty_accounts")
        .insert([{ user_id: userId }])
        .select()
        .single();
      account = newAcc;
    }

    const totalPoints = pointsEarned + (isFirstOrder ? WELCOME_BONUS : 0);

    await supabase
      .from("loyalty_accounts")
      .update({
        points_balance: account.points_balance + totalPoints,
        lifetime_points: account.lifetime_points + totalPoints,
        last_activity: new Date().toISOString(),
      })
      .eq("user_id", userId);

    await supabase.from("loyalty_transactions").insert([
      {
        user_id: userId,
        type: "earned",
        points: pointsEarned,
        order_id: order.id,
        description: `Order #${order.order_number} — earned ${pointsEarned} points`,
      },
    ]);

    if (isFirstOrder) {
      await supabase.from("loyalty_transactions").insert([
        {
          user_id: userId,
          type: "bonus",
          points: WELCOME_BONUS,
          order_id: order.id,
          description: `Welcome bonus — ${WELCOME_BONUS} points on your first order!`,
        },
      ]);
    }

    return {
      pointsEarned,
      welcomeBonus: isFirstOrder ? WELCOME_BONUS : 0,
      total: totalPoints,
    };
  } catch (err) {
    console.error("Award points error:", err);
  }
}

// ── Reverse points if order is cancelled ──
export async function reverseOrderPoints(userId, order) {
  try {
    const { data: transactions } = await supabase
      .from("loyalty_transactions")
      .select("*")
      .eq("user_id", userId)
      .eq("order_id", order.id)
      .in("type", ["earned", "bonus"]);

    if (!transactions || transactions.length === 0) return;

    const totalToReverse = transactions.reduce((sum, t) => sum + t.points, 0);

    const { data: account } = await supabase
      .from("loyalty_accounts")
      .select("points_balance, lifetime_points")
      .eq("user_id", userId)
      .single();

    if (!account) return;

    await supabase
      .from("loyalty_accounts")
      .update({
        points_balance: Math.max(0, account.points_balance - totalToReverse),
        lifetime_points: Math.max(0, account.lifetime_points - totalToReverse),
      })
      .eq("user_id", userId);

    await supabase.from("loyalty_transactions").insert([
      {
        user_id: userId,
        type: "refunded",
        points: -totalToReverse,
        order_id: order.id,
        description: `Points reversed — Order #${order.order_number} cancelled`,
      },
    ]);
  } catch (err) {
    console.error("Reverse points error:", err);
  }
}

// ── Calculate discount for points ──
export async function calculateRedemption(req, res) {
  try {
    const { points_to_use, order_subtotal } = req.body;

    if (!points_to_use || !order_subtotal) {
      return res.status(400).json({
        success: false,
        message: "points_to_use and order_subtotal are required",
      });
    }

    const { data: account } = await supabase
      .from("loyalty_accounts")
      .select("points_balance")
      .eq("user_id", req.user.id)
      .single();

    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Loyalty account not found" });
    }

    const balance = account.points_balance;

    if (points_to_use < MIN_POINTS_TO_REDEEM) {
      return res.status(400).json({
        success: false,
        message: `Minimum ${MIN_POINTS_TO_REDEEM} points required to redeem`,
      });
    }
    if (points_to_use > balance) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient points balance" });
    }
    if (points_to_use % POINTS_PER_REDEMPTION !== 0) {
      return res.status(400).json({
        success: false,
        message: `Points must be redeemed in multiples of ${POINTS_PER_REDEMPTION}`,
      });
    }

    const rawDiscount =
      (points_to_use / POINTS_PER_REDEMPTION) * NAIRA_PER_REDEMPTION;
    const maxAllowed = order_subtotal * MAX_DISCOUNT_PERCENT;
    const discount = Math.min(rawDiscount, maxAllowed);
    const finalTotal = order_subtotal - discount;

    res.json({
      success: true,
      data: {
        points_to_use,
        discount_amount: discount,
        final_total: finalTotal,
        remaining_balance: balance - points_to_use,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ── Redeem points on an order ──
export async function redeemPoints(req, res) {
  try {
    const { order_id, points_to_use } = req.body;

    if (!order_id || !points_to_use) {
      return res.status(400).json({
        success: false,
        message: "order_id and points_to_use required",
      });
    }

    const { data: account } = await supabase
      .from("loyalty_accounts")
      .select("*")
      .eq("user_id", req.user.id)
      .single();

    if (!account || account.points_balance < points_to_use) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient points" });
    }

    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    const discount =
      (points_to_use / POINTS_PER_REDEMPTION) * NAIRA_PER_REDEMPTION;
    const maxAllowed = order.subtotal * MAX_DISCOUNT_PERCENT;
    const finalDiscount = Math.min(discount, maxAllowed);

    await supabase
      .from("loyalty_accounts")
      .update({
        points_balance: account.points_balance - points_to_use,
        last_activity: new Date().toISOString(),
      })
      .eq("user_id", req.user.id);

    await supabase
      .from("orders")
      .update({
        points_redeemed: points_to_use,
        loyalty_discount: finalDiscount,
        subtotal: order.subtotal - finalDiscount,
      })
      .eq("id", order_id);

    await supabase.from("loyalty_transactions").insert([
      {
        user_id: req.user.id,
        type: "redeemed",
        points: -points_to_use,
        order_id,
        description: `Redeemed ${points_to_use} points for ₦${finalDiscount.toLocaleString()} discount on Order #${order.order_number}`,
      },
    ]);

    await supabase.from("loyalty_redemptions").insert([
      {
        user_id: req.user.id,
        order_id,
        points_used: points_to_use,
        discount_amount: finalDiscount,
      },
    ]);

    res.json({
      success: true,
      data: {
        points_used: points_to_use,
        discount_amount: finalDiscount,
        new_balance: account.points_balance - points_to_use,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ── Admin: get all loyalty stats ──
export async function getLoyaltyStats(req, res) {
  try {
    const { data: accounts } = await supabase
      .from("loyalty_accounts")
      .select("*, user_accounts(name, email)")
      .order("lifetime_points", { ascending: false });

    const { data: transactions } = await supabase
      .from("loyalty_transactions")
      .select("type, points, created_at");

    const totalIssued =
      transactions
        ?.filter((t) => t.points > 0)
        .reduce((sum, t) => sum + t.points, 0) || 0;

    const totalRedeemed =
      transactions
        ?.filter((t) => t.type === "redeemed")
        .reduce((sum, t) => sum + Math.abs(t.points), 0) || 0;

    res.json({
      success: true,
      data: {
        total_members: accounts?.length || 0,
        total_points_issued: totalIssued,
        total_points_redeemed: totalRedeemed,
        top_customers: accounts?.slice(0, 10) || [],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ── Admin: manually adjust points ──
export async function manualAdjustPoints(req, res) {
  try {
    const { user_id, points, reason } = req.body;
    if (!user_id || !points || !reason) {
      return res.status(400).json({
        success: false,
        message: "user_id, points and reason are required",
      });
    }

    const { data: account } = await supabase
      .from("loyalty_accounts")
      .select("points_balance, lifetime_points")
      .eq("user_id", user_id)
      .single();

    if (!account)
      return res
        .status(404)
        .json({ success: false, message: "User loyalty account not found" });

    const newBalance = Math.max(0, account.points_balance + points);
    const newLifetime =
      points > 0 ? account.lifetime_points + points : account.lifetime_points;

    await supabase
      .from("loyalty_accounts")
      .update({ points_balance: newBalance, lifetime_points: newLifetime })
      .eq("user_id", user_id);

    await supabase.from("loyalty_transactions").insert([
      {
        user_id,
        type: "manual_adjustment",
        points,
        description: `Manual adjustment by admin: ${reason}`,
      },
    ]);

    res.json({ success: true, data: { new_balance: newBalance } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
