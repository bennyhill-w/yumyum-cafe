import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FiCheck } from "react-icons/fi";
import api from "../../services/api";
import useUserStore from "../../store/userStore";
import { format } from "date-fns";
import toast from "react-hot-toast";

function StarRating({ value, onChange, size = 24, readOnly = false }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={
            readOnly
              ? "cursor-default"
              : "cursor-pointer transition-transform hover:scale-110"
          }
          disabled={readOnly}
        >
          {(hovered || value) >= star ? (
            <AiFillStar size={size} style={{ fill: "#D97706" }} />
          ) : (
            <AiOutlineStar size={size} className="text-gray-300" />
          )}
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ itemName, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated } = useUserStore();

  const { data: ordersData } = useQuery({
    queryKey: ["user-orders-review"],
    queryFn: () => api.get("/users/orders").then((r) => r.data),
    enabled: isAuthenticated,
  });

  const completedOrders = (ordersData?.data || []).filter(
    (order) =>
      order.order_status === "completed" &&
      order.items?.some((item) => item.name === itemName),
  );
  const reviewableOrder = completedOrders[0];

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 rounded-2xl p-5 text-center">
        <p className="text-gray-500 text-sm font-sans">
          <button className="text-brand-red font-bold hover:underline">
            Sign in
          </button>{" "}
          to leave a review
        </p>
      </div>
    );
  }

  if (!reviewableOrder) {
    return (
      <div className="bg-gray-50 rounded-2xl p-5 text-center">
        <p className="text-gray-400 text-sm font-sans">
          Order this dish to leave a review — only verified customers can
          review.
        </p>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/reviews", {
        order_id: reviewableOrder.id,
        item_name: itemName,
        rating,
        comment: comment.trim() || null,
      });
      toast.success("Review submitted! It will appear after approval.");
      setRating(0);
      setComment("");
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-red-light rounded-2xl p-5">
      <p className="font-bold text-gray-900 text-sm font-sans mb-3">
        Rate {itemName}
      </p>
      <div className="mb-3">
        <StarRating value={rating} onChange={setRating} size={28} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell others what you think (optional)..."
        rows={3}
        className="w-full px-4 py-3 rounded-2xl border border-brand-red/20 bg-white text-sm font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red resize-none mb-3"
      />
      <motion.button
        onClick={handleSubmit}
        disabled={submitting || rating === 0}
        whileHover={{ scale: submitting ? 1 : 1.02 }}
        whileTap={{ scale: submitting ? 1 : 0.98 }}
        className="w-full flex items-center justify-center gap-2 bg-brand-red text-white font-bold py-3 rounded-xl text-sm font-sans hover:bg-brand-red-dark transition-colors disabled:opacity-60"
      >
        {submitting ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
          />
        ) : (
          <>
            <FiCheck size={14} /> Submit Review
          </>
        )}
      </motion.button>
    </div>
  );
}

export default function ReviewSection({ itemName }) {
  const [showForm, setShowForm] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["reviews", itemName],
    queryFn: () =>
      api
        .get(`/reviews/item/${encodeURIComponent(itemName)}`)
        .then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });

  const reviews = data?.data || [];
  const avgRating = data?.avg_rating || 0;
  const total = data?.total || 0;

  return (
    <div className="mt-5 border-t border-gray-100 pt-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-display font-bold text-gray-900 text-base">
            Reviews
          </h3>
          {total > 0 && (
            <div className="flex items-center gap-1.5">
              <AiFillStar style={{ fill: "#D97706" }} size={14} />
              <span className="font-bold text-gray-700 text-sm font-sans">
                {avgRating}
              </span>
              <span className="text-gray-400 text-xs font-sans">({total})</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-brand-red text-xs font-bold font-sans hover:underline"
        >
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <ReviewForm
              itemName={itemName}
              onSuccess={() => {
                setShowForm(false);
                refetch();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {reviews.length === 0 ? (
        <p className="text-gray-400 text-xs font-sans text-center py-4">
          No reviews yet — be the first to review this dish!
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-bold text-gray-900 text-sm font-sans">
                    {review.user_accounts?.name || "Customer"}
                  </p>
                  <p className="text-gray-400 text-[10px] font-sans">
                    {format(new Date(review.created_at), "MMM dd, yyyy")}
                  </p>
                </div>
                <StarRating value={review.rating} readOnly size={14} />
              </div>
              {review.comment && (
                <p className="text-gray-600 text-xs font-sans leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
