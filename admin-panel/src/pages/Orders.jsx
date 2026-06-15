import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingCart,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiX,
  FiEye,
} from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { getOrders, updateOrderStatus } from "../services/ordersService";
import { formatCurrency } from "../utils/formatCurrency";
import { ORDER_STATUSES, BRANCHES } from "../utils/constants";
import StatCard from "../components/ui/StatCard";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import toast from "react-hot-toast";
import { format } from "date-fns";

const STATUS_FLOW = ["pending", "confirmed", "preparing", "ready", "completed"];

function OrderModal({ order, onClose, onStatusUpdate }) {
  if (!order) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="font-display font-bold text-gray-900 text-xl">
                Order #{order.order_number}
              </h2>
              <p className="text-gray-400 text-xs font-sans mt-0.5">
                {format(new Date(order.created_at), "PPp")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
            >
              <FiX size={16} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Status */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-3">
                Update Status
              </p>
              <div className="flex flex-wrap gap-2">
                {STATUS_FLOW.map((s) => (
                  <button
                    key={s}
                    onClick={() => onStatusUpdate(order.id, s)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all ${
                      order.order_status === s
                        ? "bg-brand-red text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-brand-red-light hover:text-brand-red"
                    }`}
                  >
                    {ORDER_STATUSES[s]?.label}
                  </button>
                ))}
                <button
                  onClick={() => onStatusUpdate(order.id, "cancelled")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all ${
                    order.order_status === "cancelled"
                      ? "bg-red-500 text-white"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Customer */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-3">
                Customer
              </p>
              <p className="font-bold text-gray-900 font-sans">
                {order.customer_name}
              </p>
              <p className="text-gray-500 text-sm font-sans">
                {order.customer_phone}
              </p>
              {order.customer_email && (
                <p className="text-gray-500 text-sm font-sans">
                  {order.customer_email}
                </p>
              )}
            </div>

            {/* Items */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-3">
                Items
              </p>
              <div className="space-y-2">
                {order.items?.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="font-sans text-sm text-gray-700">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-bold text-brand-red font-sans text-sm">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-3 mt-1">
                <span className="font-bold text-gray-900 font-sans">Total</span>
                <span className="font-display font-extrabold text-brand-red text-xl">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-2">
                Payment
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-sans capitalize">
                  {order.payment_method === "pickup"
                    ? "Pay on Pickup"
                    : "Online Payment"}
                </span>
                <Badge
                  className={
                    order.payment_status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                >
                  {order.payment_status}
                </Badge>
              </div>
            </div>

            {order.notes && (
              <div className="bg-brand-gold-light rounded-2xl p-4">
                <p className="text-xs font-bold text-brand-gold uppercase tracking-widest font-sans mb-1">
                  Notes
                </p>
                <p className="text-sm text-gray-700 font-sans">{order.notes}</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Orders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["orders", statusFilter, branchFilter],
    queryFn: () =>
      getOrders({
        ...(statusFilter && { status: statusFilter }),
        ...(branchFilter && { branch_id: branchFilter }),
        limit: 100,
      }).then((r) => r.data),
    refetchInterval: 30000,
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      toast.success("Order status updated");
      setSelectedOrder(null);
    },
    onError: () => toast.error("Failed to update status"),
  });

  const orders = data?.data || [];
  const filtered = orders.filter(
    (o) =>
      !search ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone?.includes(search),
  );

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.order_status === "pending").length,
    preparing: orders.filter((o) =>
      ["confirmed", "preparing"].includes(o.order_status),
    ).length,
    revenue: orders
      .filter((o) => o.payment_status === "paid")
      .reduce((s, o) => s + Number(o.subtotal), 0),
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FiShoppingCart size={20} />}
          label="Total Orders"
          value={stats.total}
          color="red"
          index={0}
        />
        <StatCard
          icon={<FiShoppingCart size={20} />}
          label="Pending"
          value={stats.pending}
          sub="Need attention"
          color="gold"
          index={1}
        />
        <StatCard
          icon={<FiShoppingCart size={20} />}
          label="In Progress"
          value={stats.preparing}
          sub="Being prepared"
          color="blue"
          index={2}
        />
        <StatCard
          icon={<MdStorefront size={20} />}
          label="Revenue"
          value={formatCurrency(stats.revenue)}
          sub="Paid orders"
          color="green"
          index={3}
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <FiSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={15}
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-red appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            {Object.entries(ORDER_STATUSES).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-red appearance-none cursor-pointer capitalize"
          >
            <option value="">All Branches</option>
            {BRANCHES.map((b) => (
              <option key={b} value={b} className="capitalize">
                {b}
              </option>
            ))}
          </select>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-red-light text-brand-red rounded-xl text-sm font-bold font-sans hover:bg-brand-red hover:text-white transition-colors"
          >
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display font-bold text-gray-900 text-lg">
            Orders ({filtered.length})
          </h2>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-400 font-sans">
              Live — refreshes every 30s
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size={32} className="text-brand-red" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-14 h-14 bg-brand-red-light rounded-2xl flex items-center justify-center mb-4">
              <FiShoppingCart className="text-brand-red" size={24} />
            </div>
            <p className="font-bold text-gray-900 font-sans mb-1">
              No orders found
            </p>
            <p className="text-gray-400 text-sm font-sans">
              Orders will appear here when customers place them
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    "Order",
                    "Customer",
                    "Branch",
                    "Items",
                    "Total",
                    "Payment",
                    "Status",
                    "Time",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider font-sans"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="font-bold text-brand-red text-sm font-sans">
                        #{order.order_number}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900 text-sm font-sans">
                        {order.customer_name}
                      </p>
                      <p className="text-gray-400 text-xs font-sans">
                        {order.customer_phone}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="capitalize text-sm text-gray-600 font-sans">
                        {order.branch_id}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600 font-sans">
                        {order.items?.length} item
                        {order.items?.length !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-brand-red font-sans text-sm">
                        {formatCurrency(order.subtotal)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        className={
                          order.payment_status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {order.payment_status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        className={
                          ORDER_STATUSES[order.order_status]?.color ||
                          "bg-gray-100 text-gray-600"
                        }
                      >
                        {ORDER_STATUSES[order.order_status]?.label ||
                          order.order_status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-gray-400 font-sans">
                        {format(new Date(order.created_at), "HH:mm")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1.5 text-brand-red text-xs font-bold font-sans hover:underline"
                      >
                        <FiEye size={13} /> View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order modal */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={(id, status) => updateStatus({ id, status })}
        />
      )}
    </div>
  );
}
