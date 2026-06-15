import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiSearch,
  FiRefreshCw,
  FiUsers,
  FiX,
  FiEye,
} from "react-icons/fi";
import { AnimatePresence } from "framer-motion";
import {
  getReservations,
  updateReservationStatus,
} from "../services/reservationsService";
import { RESERVATION_STATUSES, BRANCHES } from "../utils/constants";
import StatCard from "../components/ui/StatCard";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import toast from "react-hot-toast";
import { format } from "date-fns";

function ReservationModal({ item, onClose, onUpdate }) {
  if (!item) return null;
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
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="font-display font-bold text-gray-900 text-xl">
              Reservation Details
            </h2>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
            >
              <FiX size={16} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
              {[
                { label: "Customer", value: item.customer_name },
                { label: "Phone", value: item.customer_phone },
                { label: "Branch", value: item.branch_id, capitalize: true },
                { label: "Date", value: format(new Date(item.date), "PPP") },
                { label: "Time", value: item.time },
                { label: "Party Size", value: `${item.party_size} people` },
                ...(item.occasion
                  ? [{ label: "Occasion", value: item.occasion }]
                  : []),
                ...(item.special_requests
                  ? [{ label: "Requests", value: item.special_requests }]
                  : []),
              ].map((row) => (
                <div key={row.label} className="flex justify-between gap-4">
                  <span className="text-gray-400 text-sm font-sans">
                    {row.label}
                  </span>
                  <span
                    className={`font-bold text-gray-900 text-sm font-sans text-right ${row.capitalize ? "capitalize" : ""}`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-3">
                Update Status
              </p>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(RESERVATION_STATUSES).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => onUpdate(item.id, k)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all ${
                      item.status === k
                        ? "bg-brand-red text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-brand-red-light hover:text-brand-red"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Reservations() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["reservations", statusFilter, branchFilter],
    queryFn: () =>
      getReservations({
        ...(statusFilter && { status: statusFilter }),
        ...(branchFilter && { branch_id: branchFilter }),
        limit: 100,
      }).then((r) => r.data),
    refetchInterval: 60000,
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }) => updateReservationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["reservations"]);
      toast.success("Reservation updated");
      setSelected(null);
    },
    onError: () => toast.error("Failed to update"),
  });

  const reservations = data?.data || [];
  const filtered = reservations.filter(
    (r) =>
      !search ||
      r.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.customer_phone?.includes(search),
  );

  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === "pending").length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    today: reservations.filter(
      (r) => r.date === new Date().toISOString().split("T")[0],
    ).length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FiCalendar size={20} />}
          label="Total"
          value={stats.total}
          color="red"
          index={0}
        />
        <StatCard
          icon={<FiCalendar size={20} />}
          label="Pending"
          value={stats.pending}
          sub="Need confirmation"
          color="gold"
          index={1}
        />
        <StatCard
          icon={<FiCalendar size={20} />}
          label="Confirmed"
          value={stats.confirmed}
          color="green"
          index={2}
        />
        <StatCard
          icon={<FiUsers size={20} />}
          label="Today"
          value={stats.today}
          sub="Reservations today"
          color="blue"
          index={3}
        />
      </div>

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
              placeholder="Search reservations..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-red appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            {Object.entries(RESERVATION_STATUSES).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-red appearance-none cursor-pointer"
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-display font-bold text-gray-900 text-lg">
            Reservations ({filtered.length})
          </h2>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size={32} className="text-brand-red" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-14 h-14 bg-brand-red-light rounded-2xl flex items-center justify-center mb-4">
              <FiCalendar className="text-brand-red" size={24} />
            </div>
            <p className="font-bold text-gray-900 font-sans mb-1">
              No reservations found
            </p>
            <p className="text-gray-400 text-sm font-sans">
              Reservations will appear here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    "Customer",
                    "Branch",
                    "Date",
                    "Time",
                    "Party",
                    "Occasion",
                    "Status",
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
                {filtered.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900 text-sm font-sans">
                        {item.customer_name}
                      </p>
                      <p className="text-gray-400 text-xs font-sans">
                        {item.customer_phone}
                      </p>
                    </td>
                    <td className="px-5 py-4 capitalize text-sm text-gray-600 font-sans">
                      {item.branch_id}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700 font-sans">
                      {format(new Date(item.date), "MMM dd, yyyy")}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700 font-sans">
                      {item.time}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700 font-sans">
                      {item.party_size}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 font-sans capitalize">
                      {item.occasion || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        className={
                          RESERVATION_STATUSES[item.status]?.color ||
                          "bg-gray-100 text-gray-600"
                        }
                      >
                        {RESERVATION_STATUSES[item.status]?.label ||
                          item.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelected(item)}
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

      {selected && (
        <ReservationModal
          item={selected}
          onClose={() => setSelected(null)}
          onUpdate={(id, status) => updateStatus({ id, status })}
        />
      )}
    </div>
  );
}
