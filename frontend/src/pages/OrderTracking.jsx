import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCheck,
  FiClock,
  FiMapPin,
  FiPhone,
  FiArrowLeft,
} from "react-icons/fi";
import { MdOutlineDeliveryDining, MdStorefront } from "react-icons/md";
import { IoFlameSharp } from "react-icons/io5";
import { HiOutlineSparkles } from "react-icons/hi";
import api from "../services/api";
import { formatCurrency } from "../utils/formatCurrency";
import Spinner from "../components/ui/Spinner";

const STATUSES = [
  {
    key: "pending",
    label: "Order Received",
    icon: <MdOutlineDeliveryDining size={20} />,
    desc: "Your order has been received by our team",
  },
  {
    key: "confirmed",
    label: "Order Confirmed",
    icon: <FiCheck size={20} />,
    desc: "Your order has been confirmed and is being queued",
  },
  {
    key: "preparing",
    label: "Being Prepared",
    icon: <IoFlameSharp size={20} />,
    desc: "Our chefs are preparing your food fresh right now",
  },
  {
    key: "ready",
    label: "Ready for Pickup",
    icon: <HiOutlineSparkles size={20} />,
    desc: "Your order is ready! Come collect it at the branch",
  },
  {
    key: "completed",
    label: "Completed",
    icon: <FiCheck size={20} />,
    desc: "Order collected. Enjoy your meal!",
  },
];

const STATUS_INDEX = Object.fromEntries(STATUSES.map((s, i) => [s.key, i]));

export default function OrderTracking() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/track/${orderNumber}`);
      setOrder(res.data.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Order not found. Please check your order number.");
      } else {
        setError("Unable to load order. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [orderNumber]);

  const currentIndex = order ? (STATUS_INDEX[order.order_status] ?? 0) : 0;
  const isCancelled = order?.order_status === "cancelled";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-red relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold font-sans mb-5 transition-colors"
          >
            <FiArrowLeft size={15} /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <MdOutlineDeliveryDining
              className="text-brand-gold-mid"
              size={22}
            />
            <span className="text-white/70 text-sm font-semibold uppercase tracking-widest font-sans">
              Order Tracking
            </span>
          </div>
          <h1
            className="font-display font-extrabold text-white text-4xl sm:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Track Your Order
          </h1>
          {order && (
            <p className="text-white/60 font-sans mt-2">
              Order{" "}
              <span className="text-white font-bold">
                #{order.order_number}
              </span>
            </p>
          )}
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

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Spinner size={40} className="text-brand-red mb-4" />
            <p className="text-gray-500 font-sans">Loading your order...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
            <div className="w-16 h-16 bg-brand-red-light rounded-2xl flex items-center justify-center mx-auto mb-5">
              <MdOutlineDeliveryDining className="text-brand-red" size={28} />
            </div>
            <h2 className="font-display font-bold text-gray-900 text-2xl mb-3">
              Order Not Found
            </h2>
            <p className="text-gray-500 font-sans mb-6">{error}</p>
            <Link to="/order">
              <button className="inline-flex items-center gap-2 bg-brand-red text-white font-bold px-7 py-3.5 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans">
                Place a New Order
              </button>
            </Link>
          </div>
        ) : (
          order && (
            <div className="space-y-6">
              {/* Status card */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Current status banner */}
                <div
                  className={`p-6 ${isCancelled ? "bg-red-50" : "bg-brand-red"} relative overflow-hidden`}
                >
                  {!isCancelled && (
                    <div className="absolute inset-0 bg-hero-pattern opacity-20" />
                  )}
                  <div className="relative flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${isCancelled ? "bg-red-100" : "bg-white/20"}`}
                    >
                      {isCancelled ? (
                        <span className="text-red-500 text-2xl">✕</span>
                      ) : STATUSES[currentIndex]?.icon ? (
                        <span className="text-white">
                          {STATUSES[currentIndex].icon}
                        </span>
                      ) : null}
                    </div>
                    <div>
                      <p
                        className={`font-sans text-sm font-semibold mb-1 ${isCancelled ? "text-red-500" : "text-white/70"}`}
                      >
                        Current Status
                      </p>
                      <h3
                        className={`font-display font-extrabold text-2xl ${isCancelled ? "text-red-700" : "text-white"}`}
                      >
                        {isCancelled
                          ? "Order Cancelled"
                          : STATUSES[currentIndex]?.label}
                      </h3>
                      <p
                        className={`font-sans text-sm mt-1 ${isCancelled ? "text-red-500" : "text-white/75"}`}
                      >
                        {isCancelled
                          ? "This order has been cancelled. Please contact us for assistance."
                          : STATUSES[currentIndex]?.desc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                {!isCancelled && (
                  <div className="p-6">
                    <div className="space-y-0">
                      {STATUSES.map((status, i) => {
                        const isDone = i < currentIndex;
                        const isCurrent = i === currentIndex;
                        const isPending = i > currentIndex;
                        return (
                          <div key={status.key} className="flex gap-4">
                            {/* Line + dot */}
                            <div className="flex flex-col items-center">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.1, type: "spring" }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                  isDone
                                    ? "bg-green-500 text-white"
                                    : isCurrent
                                      ? "bg-brand-red text-white ring-4 ring-brand-red/20"
                                      : "bg-gray-100 text-gray-400"
                                }`}
                              >
                                {isDone ? (
                                  <FiCheck size={16} />
                                ) : (
                                  <span className="text-xs font-bold font-sans">
                                    {i + 1}
                                  </span>
                                )}
                              </motion.div>
                              {i < STATUSES.length - 1 && (
                                <div
                                  className={`w-0.5 h-10 transition-all ${isDone ? "bg-green-300" : "bg-gray-200"}`}
                                />
                              )}
                            </div>
                            {/* Content */}
                            <div className="pb-8 pt-1.5 flex-1 min-w-0">
                              <p
                                className={`font-bold text-sm font-sans ${isDone || isCurrent ? "text-gray-900" : "text-gray-400"}`}
                              >
                                {status.label}
                              </p>
                              <p
                                className={`text-xs font-sans mt-0.5 ${isCurrent ? "text-brand-red" : "text-gray-400"}`}
                              >
                                {isCurrent
                                  ? status.desc
                                  : isPending
                                    ? "Waiting..."
                                    : "Done"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Order details */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-display font-bold text-gray-900 text-xl mb-5">
                  Order Details
                </h3>
                <div className="space-y-3 mb-5">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-red-light rounded-xl flex items-center justify-center flex-shrink-0">
                        <IoFlameSharp className="text-brand-red" size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm font-sans">
                          {item.name}
                        </p>
                        <p className="text-gray-400 text-xs font-sans">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-brand-red text-sm font-sans">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between">
                  <span className="text-gray-500 font-sans">Total</span>
                  <span className="font-display font-extrabold text-brand-red text-xl">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
              </div>

              {/* Branch info */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-display font-bold text-gray-900 text-xl mb-4">
                  Pickup Location
                </h3>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-brand-red-light rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="text-brand-red" size={17} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 font-sans capitalize">
                      {order.branch_id} Branch
                    </p>
                    <p className="text-gray-400 text-sm font-sans">
                      Open 8:00 AM – 10:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Last updated + refresh */}
              <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-gray-400 text-xs font-sans">
                    Last updated: {lastUpdated?.toLocaleTimeString()}
                  </span>
                </div>
                <button
                  onClick={fetchOrder}
                  className="text-brand-red text-xs font-bold font-sans hover:underline flex items-center gap-1"
                >
                  <FiClock size={12} /> Refresh
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
