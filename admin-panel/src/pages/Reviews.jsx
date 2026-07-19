import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AiFillStar } from "react-icons/ai";
import { FiCheck, FiTrash2, FiRefreshCw } from "react-icons/fi";
import api from "../services/api";
import StatCard from "../components/ui/StatCard";
import Spinner from "../components/ui/Spinner";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function Reviews() {
  const [filter, setFilter] = useState("false");
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-reviews", filter],
    queryFn: () =>
      api.get(`/reviews/admin/all?approved=${filter}`).then((r) => r.data),
  });

  const { mutate: doApprove } = useMutation({
    mutationFn: (id) => api.patch(`/reviews/admin/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-reviews"]);
      toast.success("Review approved — now visible on menu");
    },
    onError: () => toast.error("Failed to approve"),
  });

  const { mutate: doDelete } = useMutation({
    mutationFn: (id) => api.delete(`/reviews/admin/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-reviews"]);
      toast.success("Review deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const reviews = data?.data || [];

  function StarDisplay({ rating }) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <AiFillStar
            key={s}
            size={13}
            style={{ fill: s <= rating ? "#D97706" : "#e5e7eb" }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<AiFillStar size={20} />}
          label="Total Reviews"
          value={reviews.length}
          color="gold"
          index={0}
        />
        <StatCard
          icon={<FiCheck size={20} />}
          label="Pending Approval"
          value={reviews.filter((r) => !r.is_approved).length}
          sub="Need your review"
          color="red"
          index={1}
        />
        <StatCard
          icon={<AiFillStar size={20} />}
          label="Approved"
          value={reviews.filter((r) => r.is_approved).length}
          color="green"
          index={2}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2">
          {[
            { label: "Pending", value: "false" },
            { label: "Approved", value: "true" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-xl text-sm font-bold font-sans transition-all ${filter === f.value ? "bg-brand-red text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 text-brand-red font-bold text-sm font-sans hover:underline"
        >
          <FiRefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-display font-bold text-gray-900 text-lg">
            {filter === "false" ? "Pending Reviews" : "Approved Reviews"} (
            {reviews.length})
          </h2>
          {filter === "false" && (
            <p className="text-gray-400 text-xs font-sans mt-0.5">
              Review and approve before they appear publicly on the menu
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size={32} className="text-brand-red" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <AiFillStar className="text-gray-200 mb-3" size={40} />
            <p className="font-bold text-gray-900 font-sans mb-1">
              {filter === "false"
                ? "No pending reviews"
                : "No approved reviews yet"}
            </p>
            <p className="text-gray-400 text-sm font-sans">
              {filter === "false"
                ? "All caught up! Check back later."
                : "Approve pending reviews to show them here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.04 }}
                className="p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-brand-red font-sans text-sm">
                        {review.item_name}
                      </span>
                      <StarDisplay rating={review.rating} />
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-sans ${review.is_approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {review.is_approved ? "Approved" : "Pending"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm font-sans mb-2">
                      {review.comment || (
                        <span className="text-gray-400 italic">No comment</span>
                      )}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 font-sans">
                      <span>{review.user_accounts?.name}</span>
                      <span>·</span>
                      <span>
                        {format(new Date(review.created_at), "MMM dd, yyyy")}
                      </span>
                      {review.orders?.order_number && (
                        <>
                          <span>·</span>
                          <span>Order #{review.orders.order_number}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!review.is_approved && (
                      <button
                        onClick={() => doApprove(review.id)}
                        className="flex items-center gap-1.5 bg-green-50 text-green-600 hover:bg-green-100 font-bold text-xs px-3 py-2 rounded-xl font-sans transition-colors"
                      >
                        <FiCheck size={13} /> Approve
                      </button>
                    )}
                    <button
                      onClick={() => doDelete(review.id)}
                      className="w-8 h-8 rounded-xl bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
