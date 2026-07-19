import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import { IoFlameSharp } from "react-icons/io5";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import useCartStore from "../../store/cartStore";
import toast from "react-hot-toast";
import ReviewSection from "./ReviewSection";

export default function MenuItemModal({ item, onClose }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  if (!item) return null;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(item);
    setAdded(true);
    toast.success(`${qty}× ${item.name} added to cart!`);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      >
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
        >
          {/* Image */}
          <div className="relative h-64 flex-shrink-0 overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <FiX size={18} />
            </button>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {item.popular && (
                <span className="inline-flex items-center gap-1 bg-brand-red text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  <IoFlameSharp size={11} /> Popular
                </span>
              )}
              {!item.available && (
                <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  Sold Out
                </span>
              )}
            </div>

            {/* Name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2 className="font-display font-extrabold text-white text-2xl leading-tight">
                    {item.name}
                  </h2>
                  <span className="text-white/70 text-sm font-sans capitalize">
                    {item.category.replace("-", " ")}
                  </span>
                </div>
                <div
                  className="font-display font-extrabold text-3xl leading-none flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #FEF3C7, #D97706)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {formatCurrency(item.price)}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-1 bg-brand-gold-light px-3 py-1.5 rounded-full">
                {Array.from({ length: 5 }).map((_, i) => (
                  <AiFillStar
                    key={i}
                    className="text-brand-gold-mid"
                    size={14}
                  />
                ))}
                <span className="text-brand-gold font-bold text-sm font-sans ml-1">
                  4.8
                </span>
              </div>
              <span className="text-gray-400 text-sm font-sans">
                2,400+ ratings
              </span>
              <div className="flex items-center gap-1 ml-auto bg-green-50 px-3 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-green-600 text-xs font-bold font-sans">
                  Fresh today
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <h3 className="font-display font-bold text-gray-900 text-lg mb-2">
                About this dish
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed font-sans">
                {item.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { icon: <IoFlameSharp size={13} />, text: "Freshly Made" },
                {
                  icon: <HiOutlineSparkles size={13} />,
                  text: "No Preservatives",
                },
                {
                  icon: <MdOutlineDeliveryDining size={13} />,
                  text: "Order Online",
                },
              ].map((h) => (
                <span
                  key={h.text}
                  className="inline-flex items-center gap-1.5 bg-brand-red-light text-brand-red text-xs font-bold px-3 py-1.5 rounded-full font-sans"
                >
                  {h.icon} {h.text}
                </span>
              ))}
            </div>

            {/* Extras */}
            {item.extras && item.extras.length > 0 && (
              <div className="mb-5">
                <h3 className="font-display font-bold text-gray-900 text-base mb-3">
                  Add-ons & options
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.extras.map((extra) => (
                    <span
                      key={extra}
                      className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full font-sans"
                    >
                      {extra}
                    </span>
                  ))}
                </div>
                <p className="text-gray-400 text-xs font-sans mt-2">
                  Add-ons can be requested in your order notes
                </p>
              </div>
            )}

            <ReviewSection itemName={item.name} />
          </div>

          {/* Bottom — Qty + Add to cart */}
          <div className="p-5 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="flex items-center gap-4">
              {/* Quantity selector */}
              <div className="flex items-center gap-3 bg-gray-100 rounded-2xl p-1.5">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-700 hover:bg-brand-red hover:text-white transition-colors"
                >
                  <FiMinus size={15} />
                </button>
                <span className="w-6 text-center font-bold text-gray-900 font-sans text-base">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-9 h-9 rounded-xl bg-brand-red text-white flex items-center justify-center hover:bg-brand-red-dark transition-colors"
                >
                  <FiPlus size={15} />
                </button>
              </div>

              {/* Add to cart */}
              <motion.button
                onClick={handleAdd}
                disabled={!item.available || added}
                whileHover={{ scale: item.available ? 1.02 : 1 }}
                whileTap={{ scale: item.available ? 0.98 : 1 }}
                className={`flex-1 flex items-center justify-center gap-2.5 font-bold py-4 rounded-2xl text-sm transition-all font-sans ${
                  added
                    ? "bg-green-500 text-white"
                    : item.available
                      ? "bg-brand-red text-white hover:bg-brand-red-dark shadow-glow-red"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <FiShoppingCart size={17} />
                {added
                  ? "Added to Cart!"
                  : !item.available
                    ? "Sold Out"
                    : `Add ${qty > 1 ? `${qty}×` : ""} — ${formatCurrency(item.price * qty)}`}
              </motion.button>
            </div>

            <Link to="/order" onClick={onClose} className="block mt-3">
              <button className="w-full flex items-center justify-center gap-2 text-brand-red font-bold text-sm font-sans hover:underline py-1">
                <MdOutlineDeliveryDining size={16} />
                Go to Order Page
              </button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
