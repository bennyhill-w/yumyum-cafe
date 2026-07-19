import supabase from "../services/supabase.js";

export async function getAnalytics(req, res) {
  try {
    const { period = "30" } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startISO = startDate.toISOString();

    // ── Fetch all completed orders in period ──
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        "id, subtotal, branch_id, order_status, payment_status, items, created_at, user_id",
      )
      .gte("created_at", startISO)
      .neq("order_status", "cancelled")
      .order("created_at", { ascending: true });

    if (error) throw error;

    const completedOrders = orders.filter(
      (o) => o.order_status === "completed",
    );
    const allOrders = orders;

    // ── Revenue by day ──
    const revenueByDay = {};
    completedOrders.forEach((o) => {
      const day = o.created_at.split("T")[0];
      revenueByDay[day] = (revenueByDay[day] || 0) + Number(o.subtotal);
    });
    const revenueChart = Object.entries(revenueByDay).map(
      ([date, revenue]) => ({ date, revenue }),
    );

    // ── Orders by branch ──
    const ordersByBranch = {};
    allOrders.forEach((o) => {
      ordersByBranch[o.branch_id] = (ordersByBranch[o.branch_id] || 0) + 1;
    });

    // ── Most ordered items ──
    const itemCounts = {};
    allOrders.forEach((o) => {
      if (!Array.isArray(o.items)) return;
      o.items.forEach((item) => {
        if (!itemCounts[item.name])
          itemCounts[item.name] = { name: item.name, count: 0, revenue: 0 };
        itemCounts[item.name].count += item.quantity || 1;
        itemCounts[item.name].revenue +=
          (item.price || 0) * (item.quantity || 1);
      });
    });
    const topItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // ── Peak hours ──
    const hourCounts = Array(24).fill(0);
    allOrders.forEach((o) => {
      const hour = new Date(o.created_at).getHours();
      hourCounts[hour]++;
    });
    const peakHours = hourCounts.map((count, hour) => ({ hour, count }));

    // ── Orders by day of week ──
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeekCounts = Array(7).fill(0);
    allOrders.forEach((o) => {
      const day = new Date(o.created_at).getDay();
      dayOfWeekCounts[day]++;
    });
    const ordersByDayOfWeek = dayOfWeekCounts.map((count, i) => ({
      day: dayNames[i],
      count,
    }));

    // ── Summary stats ──
    const totalRevenue = completedOrders.reduce(
      (sum, o) => sum + Number(o.subtotal),
      0,
    );
    const totalOrders = allOrders.length;
    const completedCount = completedOrders.length;
    const avgOrderValue =
      completedCount > 0 ? totalRevenue / completedCount : 0;

    // ── Unique customers ──
    const uniqueCustomers = new Set(
      allOrders.filter((o) => o.user_id).map((o) => o.user_id),
    ).size;

    // ── Payment method breakdown ──
    const { data: allOrdersForPayment } = await supabase
      .from("orders")
      .select("payment_method, payment_status")
      .gte("created_at", startISO);

    const paymentBreakdown = { pickup: 0, online: 0 };
    allOrdersForPayment?.forEach((o) => {
      paymentBreakdown[o.payment_method] =
        (paymentBreakdown[o.payment_method] || 0) + 1;
    });

    // ── Compare to previous period ──
    const prevStart = new Date();
    prevStart.setDate(prevStart.getDate() - days * 2);
    const { data: prevOrders } = await supabase
      .from("orders")
      .select("subtotal, order_status")
      .gte("created_at", prevStart.toISOString())
      .lt("created_at", startISO)
      .neq("order_status", "cancelled");

    const prevRevenue = (prevOrders || [])
      .filter((o) => o.order_status === "completed")
      .reduce((sum, o) => sum + Number(o.subtotal), 0);
    const prevOrderCount = (prevOrders || []).length;

    const revenueGrowth =
      prevRevenue > 0
        ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100)
        : 100;
    const orderGrowth =
      prevOrderCount > 0
        ? Math.round(((totalOrders - prevOrderCount) / prevOrderCount) * 100)
        : 100;

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalOrders,
          completedOrders: completedCount,
          avgOrderValue,
          uniqueCustomers,
          revenueGrowth,
          orderGrowth,
        },
        revenueChart,
        ordersByBranch,
        topItems,
        peakHours,
        ordersByDayOfWeek,
        paymentBreakdown,
        period: days,
      },
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}
