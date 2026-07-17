import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import {
  FiUser,
  FiShoppingCart,
  FiCalendar,
  FiLogOut,
  FiEdit2,
  FiArrowRight,
  FiCheck,
  FiX,
  FiLock,
  FiGift,
  FiTrendingUp,
} from "react-icons/fi";
import { MdOutlineDeliveryDining, MdStorefront } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi";
import { IoFlameSharp } from "react-icons/io5";
import { AiFillStar } from "react-icons/ai";
import {
  getUserOrders,
  getUserReservations,
  updateProfile,
  changePassword,
  getLoyaltyAccount,
  getLoyaltyTransactions,
} from "../services/userService";
import useUserStore from "../store/userStore";
import { formatCurrency } from "../utils/formatCurrency";
import { format } from "date-fns";
import toast from "react-hot-toast";

const TABS = [
  { id: "overview", label: "Overview", icon: <HiOutlineSparkles size={16} /> },
  { id: "orders", label: "My Orders", icon: <FiShoppingCart size={16} /> },
  { id: "reservations", label: "Reservations", icon: <FiCalendar size={16} /> },
  { id: "loyalty", label: "Loyalty Points", icon: <AiFillStar size={16} /> },
  { id: "profile", label: "Profile", icon: <FiUser size={16} /> },
];

const ORDER_STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  ready: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-600",
};

const RESERVATION_STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-600",
  cancelled: "bg-gray-100 text-gray-600",
};

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  const { user, updateUser, clearAuth } = useUserStore();
  const navigate = useNavigate();

  const { data: ordersData } = useQuery({
    queryKey: ["user-orders"],
    queryFn: () => getUserOrders().then((r) => r.data),
  });

  const { data: reservationsData } = useQuery({
    queryKey: ["user-reservations"],
    queryFn: () => getUserReservations().then((r) => r.data),
  });

  const { data: loyaltyData } = useQuery({
    queryKey: ["user-loyalty"],
    queryFn: () => getLoyaltyAccount().then((r) => r.data),
  });

  const { data: transactionsData } = useQuery({
    queryKey: ["user-loyalty-transactions"],
    queryFn: () => getLoyaltyTransactions().then((r) => r.data),
    enabled: tab === "loyalty",
  });

  const orders = ordersData?.data || [];
  const reservations = reservationsData?.data || [];
  const loyaltyAccount = loyaltyData?.data;
  const transactions = transactionsData?.data || [];

  const handleLogout = () => {
    clearAuth();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-red relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/30 flex-shrink-0">
                <span className="font-display font-bold text-white text-3xl">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white/70 text-sm font-sans font-semibold uppercase tracking-widest mb-1">
                  My Account
                </p>
                <h1 className="font-display font-bold text-white text-3xl sm:text-4xl leading-tight">
                  {user?.name}
                </h1>
                <p className="text-white/60 text-sm font-sans mt-1">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/20 transition-colors font-sans"
            >
              <FiLogOut size={15} /> Sign Out
            </button>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap gap-6 mt-8"
          >
            {[
              {
                icon: <FiShoppingCart size={14} />,
                val: orders.length,
                label: "Total Orders",
              },
              {
                icon: <FiCalendar size={14} />,
                val: reservations.length,
                label: "Reservations",
              },
              {
                icon: <IoFlameSharp size={14} />,
                val: orders.filter((o) =>
                  ["pending", "confirmed", "preparing", "ready"].includes(
                    o.order_status,
                  ),
                ).length,
                label: "Active Orders",
              },
              {
                icon: <AiFillStar size={14} />,
                val: loyaltyAccount?.points_balance || 0,
                label: "Loyalty Points",
              },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center text-brand-gold-mid">
                  {s.icon}
                </div>
                <div>
                  <p className="text-white font-display font-bold text-xl leading-none">
                    {s.val}
                  </p>
                  <p className="text-white/55 text-xs font-sans">{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        <svg
          viewBox="0 0 1440 40"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
          style={{ display: "block", marginBottom: -1 }}
        >
          <path d="M0 40L720 10L1440 40V40H0Z" fill="#F9FAFB" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-8">
        <div className="grid lg:grid-cols-[220px_1fr] gap-8">
          {/* Sidebar tabs */}
          <div className="space-y-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold font-sans transition-all ${
                  tab === t.id
                    ? "bg-brand-red text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-100 shadow-sm hover:border-brand-red/30 hover:text-brand-red"
                }`}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold font-sans text-gray-500 bg-white border border-gray-100 shadow-sm hover:bg-red-50 hover:text-brand-red hover:border-red-200 transition-all sm:hidden"
            >
              <FiLogOut size={16} /> Sign Out
            </button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {tab === "overview" && (
                <OverviewTab
                  orders={orders}
                  reservations={reservations}
                  setTab={setTab}
                />
              )}
              {tab === "orders" && <OrdersTab orders={orders} />}
              {tab === "reservations" && (
                <ReservationsTab reservations={reservations} />
              )}
              {tab === "loyalty" && (
                <LoyaltyTab
                  account={loyaltyAccount}
                  transactions={transactions}
                />
              )}
              {tab === "profile" && (
                <ProfileTab user={user} updateUser={updateUser} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── OVERVIEW TAB ──
function OverviewTab({ orders, reservations, setTab }) {
  const recentOrders = orders.slice(0, 3);
  const activeOrders = orders.filter((o) =>
    ["pending", "confirmed", "preparing", "ready"].includes(o.order_status),
  );

  return (
    <div className="space-y-6">
      {/* Active orders alert */}
      {activeOrders.length > 0 && (
        <div className="bg-brand-red rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-pattern opacity-20" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <MdOutlineDeliveryDining className="text-white" size={24} />
              </div>
              <div>
                <p className="font-display font-bold text-white text-lg">
                  {activeOrders.length} Active Order
                  {activeOrders.length > 1 ? "s" : ""}
                </p>
                <p className="text-white/70 text-sm font-sans">
                  {activeOrders[0]?.order_status === "ready"
                    ? "Your order is ready for pickup!"
                    : "Your food is being prepared"}
                </p>
              </div>
            </div>
            <Link to={`/track/${activeOrders[0]?.order_number}`}>
              <button className="flex items-center gap-2 bg-white text-brand-red font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors font-sans flex-shrink-0">
                Track <FiArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-display font-bold text-gray-900 text-xl">
            Recent Orders
          </h2>
          <button
            onClick={() => setTab("orders")}
            className="text-brand-red text-sm font-bold font-sans hover:underline flex items-center gap-1"
          >
            View all <FiArrowRight size={13} />
          </button>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-10 text-center">
            <FiShoppingCart className="text-gray-200 mx-auto mb-3" size={36} />
            <p className="text-gray-400 text-sm font-sans">No orders yet</p>
            <Link to="/menu">
              <button className="mt-4 inline-flex items-center gap-2 bg-brand-red text-white font-bold px-6 py-3 rounded-xl text-sm font-sans hover:bg-brand-red-dark transition-colors">
                Browse Menu
              </button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-11 h-11 bg-brand-red-light rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiShoppingCart className="text-brand-red" size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm font-sans">
                    #{order.order_number}
                  </p>
                  <p className="text-gray-400 text-xs font-sans">
                    {order.items?.length} item
                    {order.items?.length !== 1 ? "s" : ""} · {order.branch_id}{" "}
                    branch
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-brand-red text-sm font-sans">
                    {formatCurrency(order.subtotal)}
                  </p>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full font-sans ${ORDER_STATUS_STYLES[order.order_status] || "bg-gray-100 text-gray-600"}`}
                  >
                    {order.order_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            icon: <MdOutlineDeliveryDining size={22} />,
            label: "Order Food",
            sub: "Place a new order",
            to: "/order",
            color: "brand-red",
          },
          {
            icon: <FiCalendar size={22} />,
            label: "Book a Table",
            sub: "Reserve your spot",
            to: "/reservations",
            color: "brand-gold",
          },
          {
            icon: <MdStorefront size={22} />,
            label: "View Menu",
            sub: "Browse our dishes",
            to: "/menu",
            color: "blue",
          },
        ].map((action) => (
          <Link key={action.label} to={action.to}>
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="w-11 h-11 bg-brand-red-light rounded-2xl flex items-center justify-center text-brand-red mb-3">
                {action.icon}
              </div>
              <p className="font-bold text-gray-900 text-sm font-sans">
                {action.label}
              </p>
              <p className="text-gray-400 text-xs font-sans">{action.sub}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── LOYALTY TAB ──
function LoyaltyTab({ account, transactions }) {
  const pointsBalance = account?.points_balance || 0;
  const lifetimePoints = account?.lifetime_points || 0;
  const currentCycleProgress = pointsBalance % 100;
  const pointsToNextReward = 100 - currentCycleProgress;
  const rewardsAvailable = Math.floor(pointsBalance / 100);
  const progressPercent = (currentCycleProgress / 100) * 100;
  const nextMilestone = (rewardsAvailable + 1) * 100;
  const prevMilestone = rewardsAvailable * 100;

  const TRANSACTION_ICONS = {
    earned: {
      icon: <AiFillStar size={14} />,
      color: "text-green-600 bg-green-50",
    },
    redeemed: {
      icon: <FiGift size={14} />,
      color: "text-brand-red bg-brand-red-light",
    },
    bonus: {
      icon: <HiOutlineSparkles size={14} />,
      color: "text-yellow-600 bg-yellow-50",
    },
    refunded: {
      icon: <FiTrendingUp size={14} />,
      color: "text-blue-600 bg-blue-50",
    },
    manual_adjustment: {
      icon: <FiCheck size={14} />,
      color: "text-gray-600 bg-gray-100",
    },
    expired: { icon: <FiX size={14} />, color: "text-gray-400 bg-gray-100" },
  };

  return (
    <div className="space-y-5">
      <div className="bg-brand-red rounded-3xl p-7 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-2xl"
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <AiFillStar className="text-yellow-300" size={18} />
            <span className="text-white/75 text-sm font-bold font-sans uppercase tracking-widest">
              Loyalty Points
            </span>
          </div>
          <div className="flex items-end gap-4 mb-2">
            <span
              className="font-display font-bold text-white"
              style={{ fontSize: "clamp(48px, 8vw, 72px)", lineHeight: 1 }}
            >
              {pointsBalance.toLocaleString()}
            </span>
            <span className="text-white/60 text-lg font-sans pb-2">pts</span>
          </div>
          <p className="text-white/60 text-sm font-sans mb-6">
            {lifetimePoints.toLocaleString()} total points earned all time
          </p>

          <div className="bg-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white text-sm font-bold font-sans">
                Progress to next ₦500 reward
              </span>
              <span className="text-yellow-300 text-sm font-bold font-sans">
                {pointsToNextReward === 100
                  ? "🎉 Reward ready!"
                  : `${pointsToNextReward} pts to go`}
              </span>
            </div>
            <p className="text-white/50 text-xs font-sans mb-3">
              {pointsBalance} / {nextMilestone} total points
            </p>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full rounded-full bg-yellow-300"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-white/40 text-xs font-sans">
                {prevMilestone} pts
              </span>
              <span className="text-white/40 text-xs font-sans">
                {nextMilestone} pts
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <FiGift className="text-green-600" size={20} />
          </div>
          <p className="font-display font-bold text-gray-900 text-2xl">
            {rewardsAvailable}
          </p>
          <p className="text-gray-400 text-xs font-sans mt-0.5">
            Rewards available
          </p>
          <p className="text-green-600 text-xs font-bold font-sans mt-1">
            ₦{(rewardsAvailable * 500).toLocaleString()} in discounts
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <div className="w-11 h-11 bg-brand-red-light rounded-xl flex items-center justify-center mx-auto mb-3">
            <AiFillStar className="text-brand-red" size={20} />
          </div>
          <p className="font-display font-bold text-gray-900 text-2xl">
            {lifetimePoints.toLocaleString()}
          </p>
          <p className="text-gray-400 text-xs font-sans mt-0.5">
            Lifetime points
          </p>
          <p className="text-brand-red text-xs font-bold font-sans mt-1">
            All time earned
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-display font-bold text-gray-900 text-lg mb-4">
          How to Earn Points
        </h3>
        <div className="space-y-3">
          {[
            {
              icon: <MdOutlineDeliveryDining size={18} />,
              title: "Place an order",
              desc: "Earn 1 point for every ₦100 spent on direct orders",
              color: "bg-brand-red-light text-brand-red",
            },
            {
              icon: <HiOutlineSparkles size={18} />,
              title: "First order bonus",
              desc: "Get 20 bonus points when you complete your first order",
              color: "bg-yellow-50 text-yellow-600",
            },
            {
              icon: <FiGift size={18} />,
              title: "Redeem rewards",
              desc: "100 points = ₦500 discount on your next order",
              color: "bg-green-50 text-green-600",
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}
              >
                {item.icon}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm font-sans">
                  {item.title}
                </p>
                <p className="text-gray-400 text-xs font-sans">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {rewardsAvailable > 0 && (
          <Link to="/order" className="block mt-5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2.5 bg-brand-red text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans"
            >
              <FiGift size={16} />
              Use {rewardsAvailable * 100} points → Get ₦
              {(rewardsAvailable * 500).toLocaleString()} off
            </motion.button>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="font-display font-bold text-gray-900 text-lg">
            Points History
          </h3>
        </div>
        {transactions.length === 0 ? (
          <div className="p-10 text-center">
            <AiFillStar className="text-gray-200 mx-auto mb-3" size={36} />
            <p className="text-gray-400 text-sm font-sans">
              No transactions yet
            </p>
            <p className="text-gray-300 text-xs font-sans mt-1">
              Place your first order to start earning points
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {transactions.map((tx) => {
              const style =
                TRANSACTION_ICONS[tx.type] || TRANSACTION_ICONS.earned;
              const isPositive = tx.points > 0;
              return (
                <div key={tx.id} className="flex items-center gap-4 px-6 py-4">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${style.color}`}
                  >
                    {style.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm font-sans leading-tight">
                      {tx.description}
                    </p>
                    <p className="text-gray-400 text-xs font-sans mt-0.5">
                      {format(new Date(tx.created_at), "MMM dd, yyyy · h:mm a")}
                    </p>
                  </div>
                  <span
                    className={`font-bold text-sm font-sans flex-shrink-0 ${isPositive ? "text-green-600" : "text-brand-red"}`}
                  >
                    {isPositive ? "+" : ""}
                    {tx.points} pts
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── ORDERS TAB ──
function OrdersTab({ orders }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="font-display font-bold text-gray-900 text-xl">
          Order History
        </h2>
        <p className="text-gray-400 text-sm font-sans">
          {orders.length} total order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>
      {orders.length === 0 ? (
        <div className="p-12 text-center">
          <FiShoppingCart className="text-gray-200 mx-auto mb-4" size={40} />
          <p className="font-bold text-gray-700 font-sans mb-2">
            No orders yet
          </p>
          <p className="text-gray-400 text-sm font-sans mb-6">
            Your order history will appear here
          </p>
          <Link to="/order">
            <button className="inline-flex items-center gap-2 bg-brand-red text-white font-bold px-7 py-3.5 rounded-2xl text-sm font-sans hover:bg-brand-red-dark transition-colors">
              <MdOutlineDeliveryDining size={18} /> Place Your First Order
            </button>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {orders.map((order) => (
            <div key={order.id} className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-brand-red font-sans text-sm">
                      #{order.order_number}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full font-sans ${ORDER_STATUS_STYLES[order.order_status] || "bg-gray-100 text-gray-600"}`}
                    >
                      {order.order_status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs font-sans">
                    {format(new Date(order.created_at), "PPp")} ·{" "}
                    {order.branch_id} branch
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-brand-red text-xl">
                    {formatCurrency(order.subtotal)}
                  </p>
                  <p className="text-gray-400 text-xs font-sans capitalize">
                    {order.payment_method === "pickup"
                      ? "Pay on pickup"
                      : "Paid online"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {order.items?.slice(0, 3).map((item, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full font-sans"
                  >
                    {item.name} ×{item.quantity}
                  </span>
                ))}
                {order.items?.length > 3 && (
                  <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1.5 rounded-full font-sans">
                    +{order.items.length - 3} more
                  </span>
                )}
              </div>

              {["pending", "confirmed", "preparing", "ready"].includes(
                order.order_status,
              ) && (
                <Link to={`/track/${order.order_number}`}>
                  <button className="inline-flex items-center gap-2 text-brand-red font-bold text-sm font-sans hover:underline">
                    <MdOutlineDeliveryDining size={15} /> Track this order
                  </button>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── RESERVATIONS TAB ──
function ReservationsTab({ reservations }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="font-display font-bold text-gray-900 text-xl">
          My Reservations
        </h2>
        <p className="text-gray-400 text-sm font-sans">
          {reservations.length} total reservation
          {reservations.length !== 1 ? "s" : ""}
        </p>
      </div>
      {reservations.length === 0 ? (
        <div className="p-12 text-center">
          <FiCalendar className="text-gray-200 mx-auto mb-4" size={40} />
          <p className="font-bold text-gray-700 font-sans mb-2">
            No reservations yet
          </p>
          <p className="text-gray-400 text-sm font-sans mb-6">
            Your table bookings will appear here
          </p>
          <Link to="/reservations">
            <button className="inline-flex items-center gap-2 bg-brand-red text-white font-bold px-7 py-3.5 rounded-2xl text-sm font-sans hover:bg-brand-red-dark transition-colors">
              <FiCalendar size={16} /> Book a Table
            </button>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {reservations.map((r) => (
            <div key={r.id} className="p-6 flex items-center gap-5">
              <div className="w-12 h-12 bg-brand-red-light rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiCalendar className="text-brand-red" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-gray-900 text-sm font-sans capitalize">
                    {r.branch_id} Branch
                  </p>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full font-sans ${RESERVATION_STATUS_STYLES[r.status] || "bg-gray-100 text-gray-600"}`}
                  >
                    {r.status}
                  </span>
                </div>
                <p className="text-gray-500 text-sm font-sans">
                  {format(new Date(r.date), "PPP")} at {r.time} · {r.party_size}{" "}
                  people
                </p>
                {r.occasion && (
                  <p className="text-gray-400 text-xs font-sans capitalize mt-0.5">
                    {r.occasion}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── PROFILE TAB ──
function ProfileTab({ user, updateUser }) {
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [passForm, setPassForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updateProfile(form);
      updateUser(res.data.data);
      toast.success("Profile updated!");
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePass = async () => {
    if (passForm.newPass !== passForm.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (passForm.newPass.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setPassLoading(true);
    try {
      await changePassword({
        current_password: passForm.current,
        new_password: passForm.newPass,
      });
      toast.success("Password changed successfully!");
      setChangingPassword(false);
      setPassForm({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setPassLoading(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all bg-white";

  return (
    <div className="space-y-5">
      {/* Profile info */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-gray-900 text-xl">
            Profile Information
          </h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 text-brand-red font-bold text-sm font-sans hover:underline"
            >
              <FiEdit2 size={14} /> Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                Full Name
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                Phone Number
              </label>
              <input
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                Email Address
              </label>
              <input
                value={user?.email}
                disabled
                className={`${inputCls} bg-gray-50 text-gray-400`}
              />
              <p className="text-gray-400 text-xs font-sans mt-1">
                Email cannot be changed
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <motion.button
                onClick={handleSave}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-red text-white font-bold py-3.5 rounded-2xl text-sm font-sans hover:bg-brand-red-dark transition-colors disabled:opacity-70"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <FiCheck size={16} /> Save Changes
                  </>
                )}
              </motion.button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-2 bg-gray-100 text-gray-600 font-bold px-6 py-3.5 rounded-2xl text-sm font-sans hover:bg-gray-200 transition-colors"
              >
                <FiX size={16} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { label: "Full Name", value: user?.name },
              { label: "Email Address", value: user?.email },
              { label: "Phone Number", value: user?.phone || "Not provided" },
              {
                label: "Member Since",
                value: user?.created_at
                  ? format(new Date(user.created_at), "MMMM yyyy")
                  : "—",
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-400 text-sm font-sans">
                  {row.label}
                </span>
                <span className="font-bold text-gray-900 text-sm font-sans">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Change password */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-red-light rounded-xl flex items-center justify-center">
              <FiLock className="text-brand-red" size={17} />
            </div>
            <div>
              <h2 className="font-display font-bold text-gray-900 text-lg">
                Password
              </h2>
              <p className="text-gray-400 text-xs font-sans">
                Keep your account secure
              </p>
            </div>
          </div>
          {!changingPassword && (
            <button
              onClick={() => setChangingPassword(true)}
              className="text-brand-red font-bold text-sm font-sans hover:underline"
            >
              Change
            </button>
          )}
        </div>

        {changingPassword && (
          <div className="space-y-4">
            {[
              {
                label: "Current Password",
                key: "current",
                value: passForm.current,
              },
              {
                label: "New Password",
                key: "newPass",
                value: passForm.newPass,
              },
              {
                label: "Confirm New Password",
                key: "confirm",
                value: passForm.confirm,
              },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                  {f.label}
                </label>
                <input
                  type="password"
                  value={f.value}
                  onChange={(e) =>
                    setPassForm((p) => ({ ...p, [f.key]: e.target.value }))
                  }
                  className={inputCls}
                />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <motion.button
                onClick={handleChangePass}
                disabled={passLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-red text-white font-bold py-3.5 rounded-2xl text-sm font-sans hover:bg-brand-red-dark transition-colors disabled:opacity-70"
              >
                {passLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <FiCheck size={16} /> Update Password
                  </>
                )}
              </motion.button>
              <button
                onClick={() => setChangingPassword(false)}
                className="flex items-center gap-2 bg-gray-100 text-gray-600 font-bold px-6 py-3.5 rounded-2xl text-sm font-sans hover:bg-gray-200 transition-colors"
              >
                <FiX size={16} /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
