import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FiShoppingCart,
  FiTrash2,
  FiArrowRight,
  FiArrowLeft,
  FiMapPin,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { IoFlameSharp } from "react-icons/io5";
import { MdOutlineDeliveryDining, MdOutlinePayment } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { HiOutlineSparkles } from "react-icons/hi";
import { TbChefHat } from "react-icons/tb";
import { formatCurrency } from "../utils/formatCurrency";
import { PLACEHOLDER_MENU } from "../utils/placeholderData";
import { useBranches } from "../hooks/useBranches";
import Spinner from "../components/ui/Spinner";
import useCartStore from "../store/cartStore";
import useUserStore from "../store/userStore";
import toast from "react-hot-toast";
import api from "../services/api";
import { createOrder } from "../services/orderService";
import { getMenuByBranch } from "../services/menuService";
import MenuItemModal from "../components/menu/MenuItemModal";

const STEPS = [
  { id: 1, label: "Select Branch" },
  { id: 2, label: "Choose Dishes" },
  { id: 3, label: "Your Details" },
  { id: 4, label: "Confirm & Pay" },
];

const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "rice-dishes", label: "Rice Dishes" },
  { id: "chicken", label: "Chicken" },
  { id: "bakery", label: "Bakery" },
  { id: "snacks", label: "Snacks" },
  { id: "sides", label: "Sides" },
  { id: "drinks", label: "Drinks" },
  { id: "desserts", label: "Ice Cream & Desserts" },
];

// ── STEP INDICATOR ──
function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center mb-6 sm:mb-10 overflow-x-auto">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center flex-shrink-0">
          <div className="flex flex-col items-center">
            <motion.div
              animate={{
                backgroundColor:
                  current >= step.id
                    ? "#B91C1C"
                    : current === step.id - 1
                      ? "#FEE2E2"
                      : "#F3F4F6",
                scale: current === step.id ? 1.1 : 1,
              }}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                current >= step.id ? "text-white" : "text-gray-400"
              }`}
            >
              {current > step.id ? <FiCheck size={12} /> : step.id}
            </motion.div>
            <span
              className={`text-[10px] sm:text-xs mt-1 sm:mt-1.5 font-sans font-semibold hidden sm:block ${
                current >= step.id ? "text-brand-red" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-8 sm:w-16 md:w-24 h-[2px] mx-1 sm:mx-2 mb-4 sm:mb-5 rounded-full transition-all duration-500 ${
                current > step.id ? "bg-brand-red" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── STEP 1: BRANCH SELECTOR ──
function BranchStep({ onSelect }) {
  const [selected, setSelected] = useState(null);
  const { branches: BRANCHES, isLoading: branchesLoading } = useBranches();

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-6 sm:mb-10">
        <h2 className="font-display font-extrabold text-gray-900 text-2xl sm:text-4xl mb-2 sm:mb-3">
          Pick Your Branch
        </h2>
        <p className="text-gray-500 font-sans text-sm sm:text-base">
          Choose the Yum-Yum Cafe closest to you
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-2xl mx-auto mb-8 sm:mb-10">
        {branchesLoading && (
          <div className="col-span-full flex items-center justify-center py-8">
            <Spinner size={36} className="text-brand-red" />
          </div>
        )}
        {BRANCHES.map((branch, i) => (
          <motion.button
            key={branch.id}
            onClick={() => setSelected(branch.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`relative text-left p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 ${
              selected === branch.id
                ? "border-brand-red bg-brand-red-light shadow-glow-red"
                : "border-gray-200 bg-white hover:border-brand-red/40 shadow-sm hover:shadow-md"
            }`}
          >
            {selected === branch.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-7 sm:h-7 bg-brand-red rounded-full flex items-center justify-center"
              >
                <FiCheck className="text-white" size={12} />
              </motion.div>
            )}
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 ${
                selected === branch.id ? "bg-brand-red" : "bg-brand-red-light"
              }`}
            >
              <FiMapPin
                className={
                  selected === branch.id ? "text-white" : "text-brand-red"
                }
                size={18}
              />
            </div>
            <h3
              className={`font-display font-bold text-lg sm:text-xl mb-0.5 sm:mb-1 ${
                selected === branch.id ? "text-brand-red" : "text-gray-900"
              }`}
            >
              {branch.name}
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm font-sans leading-relaxed mb-2 sm:mb-3">
              {branch.address}
            </p>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-600 text-xs font-semibold font-sans">
                {branch.hours}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-center px-4 sm:px-0">
        <motion.button
          onClick={() =>
            selected && onSelect(BRANCHES.find((b) => b.id === selected))
          }
          disabled={!selected}
          whileHover={{ scale: selected ? 1.03 : 1 }}
          whileTap={{ scale: selected ? 0.97 : 1 }}
          className={`inline-flex items-center gap-2 sm:gap-3 font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-2xl text-sm sm:text-base transition-all font-sans w-full sm:w-auto justify-center ${
            selected
              ? "bg-brand-red text-white hover:bg-brand-red-dark shadow-glow-red"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continue to Menu
          <FiArrowRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── STEP 2: MENU + CART ──
function MenuStep({ branch, onBack, onNext }) {
  const [category, setCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const getTotalItems = useCartStore((s) => s.getTotalItems);

  const { data: branchMenuData } = useQuery({
    queryKey: ["menu", branch.id],
    queryFn: () => getMenuByBranch(branch.id).then((r) => r.data),
    enabled: !!branch?.id,
    staleTime: 1000 * 30,
  });

  const branchMenu = (branchMenuData?.data || []).map((item) => ({
    ...item,
    image:
      item.image_url ||
      item.image ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
    available: item.is_available,
    popular: item.is_popular,
  }));

  const filtered = useMemo(() => {
    const source = branchMenu.length > 0 ? branchMenu : PLACEHOLDER_MENU;
    if (category === "all") return source;
    return source.filter((i) => i.category === category);
  }, [branchMenu, category]);

  const handleAdd = (item) => {
    addItem(item);
    toast.success(`${item.name} added!`);
  };

  const cartItem = (id) => items.find((i) => i.id === id);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="font-display font-extrabold text-gray-900 text-2xl sm:text-3xl mb-1">
            Choose Your Dishes
          </h2>
          <div className="flex items-center gap-2 text-gray-500">
            <FiMapPin size={13} className="text-brand-red" />
            <span className="text-xs sm:text-sm font-sans">
              {branch.name} Branch
            </span>
          </div>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-gray-400 hover:text-brand-red text-xs sm:text-sm font-semibold font-sans transition-colors whitespace-nowrap"
        >
          <FiArrowLeft size={14} /> Change branch
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4 sm:gap-6 lg:gap-8">
        {/* Menu */}
        <div className="min-w-0">
          {/* Category filter */}
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-4 sm:mb-6 scrollbar-hide -mx-2 sm:-mx-1 px-2 sm:px-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-2.5 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all font-sans flex-shrink-0 ${
                  category === cat.id
                    ? "bg-brand-red text-white shadow-glow-red"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <AnimatePresence>
              {filtered.map((item) => {
                const inCart = cartItem(item.id);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                  >
                    {/* Clickable image */}
                    <div
                      className="relative w-16 sm:w-20 h-16 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {item.popular && (
                        <div className="absolute top-1 left-1">
                          <IoFlameSharp
                            className="text-brand-red drop-shadow-sm"
                            size={14}
                          />
                        </div>
                      )}
                      {/* View details overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                        <span className="text-white text-[9px] font-bold font-sans opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 px-1.5 py-0.5 rounded-full">
                          Details
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-bold text-gray-900 text-xs sm:text-sm leading-tight mb-0.5 font-sans truncate cursor-pointer hover:text-brand-red transition-colors"
                        onClick={() => setSelectedItem(item)}
                      >
                        {item.name}
                      </h4>
                      <p className="text-gray-400 text-[10px] sm:text-xs font-sans line-clamp-1 mb-1.5 sm:mb-2">
                        {item.description}
                      </p>
                      <span className="font-display font-bold text-brand-red text-sm sm:text-base">
                        {formatCurrency(item.price)}
                      </span>
                    </div>

                    <div className="flex-shrink-0">
                      {inCart ? (
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, inCart.quantity - 1)
                            }
                            className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-brand-red-light text-brand-red flex items-center justify-center font-bold text-xs sm:text-base hover:bg-brand-red hover:text-white transition-colors"
                          >
                            −
                          </button>
                          <span className="w-4 text-center font-bold text-gray-900 text-xs sm:text-sm font-sans">
                            {inCart.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, inCart.quantity + 1)
                            }
                            className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-xs sm:text-base hover:bg-brand-red-dark transition-colors"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <motion.button
                          onClick={() => handleAdd(item)}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-brand-red-light text-brand-red flex items-center justify-center hover:bg-brand-red hover:text-white transition-colors"
                        >
                          <FiShoppingCart size={14} />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Cart sidebar */}
        <div className="lg:sticky lg:top-24 self-start order-last lg:order-none">
          <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-red-light rounded-xl flex items-center justify-center">
                  <FiShoppingCart className="text-brand-red" size={15} />
                </div>
                <h3 className="font-display font-bold text-gray-900 text-lg">
                  Your Order
                </h3>
              </div>
              <span className="bg-brand-red text-white text-xs font-bold px-2.5 py-1 rounded-full font-sans">
                {getTotalItems()} items
              </span>
            </div>

            {items.length === 0 ? (
              <div className="p-8 text-center">
                <GiForkKnifeSpoon
                  className="text-gray-200 mx-auto mb-3"
                  size={40}
                />
                <p className="text-gray-400 text-sm font-sans">
                  No items added yet
                </p>
                <p className="text-gray-300 text-xs font-sans mt-1">
                  Select dishes from the menu
                </p>
              </div>
            ) : (
              <div className="p-4 flex flex-col gap-3 max-h-72 overflow-y-auto">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-xs truncate font-sans">
                          {item.name}
                        </p>
                        <p className="text-brand-red text-xs font-bold font-sans">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold hover:bg-brand-red hover:text-white transition-colors"
                        >
                          −
                        </button>
                        <span className="text-xs font-bold text-gray-900 font-sans w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-6 h-6 rounded-full bg-brand-red text-white flex items-center justify-center text-xs font-bold hover:bg-brand-red-dark transition-colors"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors ml-1"
                        >
                          <FiTrash2 size={11} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {items.length > 0 && (
              <div className="p-5 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 text-sm font-sans">Total</span>
                  <span className="font-display font-extrabold text-gray-900 text-2xl">
                    {formatCurrency(getTotalPrice())}
                  </span>
                </div>
                <motion.button
                  onClick={onNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2.5 bg-brand-red text-white font-bold py-4 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans"
                >
                  Continue to Details
                  <FiArrowRight size={16} />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Food detail modal */}
      <MenuItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </motion.div>
  );
}

// ── STEP 3: CUSTOMER DETAILS ──
function DetailsStep({ onBack, onNext }) {
  const { user, isAuthenticated } = useUserStore();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    notes: "",
    paymentMethod: "pickup",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[0-9+\s\-()]{10,15}$/.test(form.phone.trim()))
      e.phone = "Enter a valid Nigerian phone number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    onNext(form);
  };

  const field = (label, key, type = "text", placeholder = "") => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
        {label}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3.5 rounded-2xl border text-sm font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all ${
          errors[key] ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
        }`}
      />
      {errors[key] && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1.5 font-sans flex items-center gap-1"
        >
          <FiX size={11} /> {errors[key]}
        </motion.p>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-6 sm:mb-10">
        <h2 className="font-display font-extrabold text-gray-900 text-2xl sm:text-4xl mb-2 sm:mb-3">
          Your Details
        </h2>
        <p className="text-gray-500 font-sans text-sm sm:text-base">
          So we know who to prepare your order for
        </p>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-8">
        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          {field("Full Name *", "name", "text", "e.g. Adaeze Okonkwo")}
          {field("Phone Number *", "phone", "tel", "e.g. 08012345678")}
        </div>
        {field(
          "Email Address (optional)",
          "email",
          "email",
          "e.g. you@email.com",
        )}

        <div className="mt-5">
          <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
            Order Notes (optional)
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Any special instructions? e.g. extra spicy, no onions..."
            rows={3}
            className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Payment method */}
        <div className="mt-6">
          <label className="block text-sm font-bold text-gray-700 mb-3 font-sans">
            Payment Method
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                id: "pickup",
                icon: <TbChefHat size={22} />,
                label: "Pay on Pickup",
                sub: "Pay cash or card when you collect",
              },
              {
                id: "online",
                icon: <MdOutlinePayment size={22} />,
                label: "Pay Online Now",
                sub: "Secure payment via Paystack",
              },
            ].map((pm) => (
              <motion.button
                key={pm.id}
                onClick={() => set("paymentMethod", pm.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`text-left p-5 rounded-2xl border-2 transition-all ${
                  form.paymentMethod === pm.id
                    ? "border-brand-red bg-brand-red-light"
                    : "border-gray-200 bg-white hover:border-brand-red/40"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
                    form.paymentMethod === pm.id
                      ? "bg-brand-red text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {pm.icon}
                </div>
                <p
                  className={`font-bold text-sm font-sans ${form.paymentMethod === pm.id ? "text-brand-red" : "text-gray-900"}`}
                >
                  {pm.label}
                </p>
                <p className="text-gray-500 text-xs font-sans mt-0.5">
                  {pm.sub}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-6 sm:mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-red font-semibold text-xs sm:text-sm font-sans transition-colors"
        >
          <FiArrowLeft size={14} /> Back to Menu
        </button>
        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center justify-center gap-2 sm:gap-2.5 bg-brand-red text-white font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-2xl text-sm sm:text-base hover:bg-brand-red-dark transition-colors font-sans shadow-glow-red w-full sm:w-auto"
        >
          Review Order <FiArrowRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── STEP 4: CONFIRM + PAY ──
function ConfirmStep({
  branch,
  customerDetails,
  onBack,
  onPlaceOrder,
  placing,
}) {
  const items = useCartStore((s) => s.items);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const total = getTotalPrice();

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-6 sm:mb-10">
        <h2 className="font-display font-extrabold text-gray-900 text-2xl sm:text-4xl mb-2 sm:mb-3">
          Confirm Your Order
        </h2>
        <p className="text-gray-500 font-sans text-sm sm:text-base">
          Review everything before you place your order
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {/* Branch */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-brand-red-light rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <FiMapPin className="text-brand-red" size={14} />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-gray-900 font-sans">
              Pickup Branch
            </h3>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm font-sans ml-10 sm:ml-12">
            {branch.name} — {branch.address}
          </p>
          <p className="text-gray-400 text-[10px] sm:text-xs font-sans ml-10 sm:ml-12 mt-1">
            {branch.hours}
          </p>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-brand-red-light rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <FiShoppingCart className="text-brand-red" size={14} />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-gray-900 font-sans">
              Order Summary
            </h3>
          </div>
          <div className="flex flex-col gap-3 sm:gap-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 sm:gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-xs sm:text-sm font-sans mb-0.5 sm:mb-1 truncate">
                    {item.name}
                  </p>
                  <p className="text-gray-500 text-xs font-sans">
                    {item.quantity}x {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-xs sm:text-sm font-sans">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 sm:mt-5 pt-4 sm:pt-5 flex items-center justify-between">
            <span className="text-gray-500 font-sans text-xs sm:text-sm">
              Total Amount
            </span>
            <span className="font-display font-extrabold text-gray-900 text-xl sm:text-2xl">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {/* Customer details */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-brand-red-light rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <TbChefHat className="text-brand-red" size={14} />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-gray-900 font-sans">
              Your Details
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
            <div>
              <span className="text-gray-400 font-sans text-xs sm:text-xs">
                Name
              </span>
              <p className="font-semibold text-gray-900 font-sans text-sm sm:text-base">
                {customerDetails.name}
              </p>
            </div>
            <div>
              <span className="text-gray-400 font-sans text-xs sm:text-xs">
                Phone
              </span>
              <p className="font-semibold text-gray-900 font-sans text-sm sm:text-base">
                {customerDetails.phone}
              </p>
            </div>
            {customerDetails.email && (
              <div>
                <span className="text-gray-400 font-sans text-xs sm:text-xs">
                  Email
                </span>
                <p className="font-semibold text-gray-900 font-sans text-sm sm:text-base">
                  {customerDetails.email}
                </p>
              </div>
            )}
            <div>
              <span className="text-gray-400 font-sans text-xs sm:text-xs">
                Payment
              </span>
              <p className="font-semibold text-gray-900 font-sans text-sm sm:text-base capitalize">
                {customerDetails.paymentMethod === "online"
                  ? "Online (Paystack)"
                  : "Pickup Payment"}
              </p>
            </div>
            {customerDetails.notes && (
              <div className="sm:col-span-2">
                <span className="text-gray-400 font-sans text-xs sm:text-xs">
                  Notes
                </span>
                <p className="font-semibold text-gray-900 font-sans text-sm sm:text-base">
                  {customerDetails.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-6 sm:mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-red font-semibold text-xs sm:text-sm font-sans transition-colors"
        >
          <FiArrowLeft size={14} /> Edit Details
        </button>
        <motion.button
          onClick={onPlaceOrder}
          disabled={placing}
          whileHover={{ scale: placing ? 1 : 1.03 }}
          whileTap={{ scale: placing ? 1 : 0.97 }}
          className="inline-flex items-center justify-center gap-2 sm:gap-2.5 bg-brand-red text-white font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-2xl text-sm sm:text-base hover:bg-brand-red-dark transition-colors font-sans shadow-glow-red disabled:opacity-70 w-full sm:w-auto"
        >
          {placing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              <span className="hidden sm:inline">Placing Order...</span>
              <span className="sm:hidden">Placing...</span>
            </>
          ) : (
            <>
              <MdOutlineDeliveryDining size={18} />
              {customerDetails.paymentMethod === "online"
                ? "Pay Now"
                : "Place Order"}
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── SUCCESS ──
function SuccessStep({ branch, customerDetails, order }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="max-w-lg mx-auto text-center py-10"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 sm:mb-8"
      >
        <FiCheck className="text-green-500" size={32} />
      </motion.div>
      <h2 className="font-display font-extrabold text-gray-900 text-3xl sm:text-4xl mb-3 sm:mb-4">
        Order Placed!
      </h2>
      <p className="text-gray-500 font-sans text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 px-2">
        Your order has been received by our{" "}
        <span className="text-brand-red font-bold">{branch.name}</span> branch.
        We are preparing it fresh for you right now!
      </p>
      <div className="bg-brand-red-light rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-left mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <HiOutlineSparkles className="text-brand-red" size={14} />
          <span className="font-bold text-brand-red font-sans text-xs sm:text-sm">
            What happens next?
          </span>
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          {[
            "Our team receives your order instantly",
            "Your food is freshly prepared",
            customerDetails.paymentMethod === "pickup"
              ? "Come to the branch and pay on collection"
              : "Payment confirmed — just come collect",
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-brand-red flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[8px] sm:text-[9px] font-bold font-sans">
                  ✓
                </span>
              </div>
              <span className="text-gray-700 text-xs sm:text-sm font-sans">
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
      {order && (
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 text-center">
          <p className="text-gray-500 text-xs sm:text-sm font-sans">
            Order Number
          </p>
          <p className="font-bold text-base sm:text-lg mb-2 sm:mb-3">
            #{order.order_number}
          </p>
          <Link
            to={`/order-tracking/${order.order_number}`}
            className="inline-flex items-center justify-center gap-2 bg-brand-red text-white font-bold px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm hover:bg-brand-red-dark transition-colors font-sans"
          >
            Track My Order
          </Link>
        </div>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center px-4 sm:px-0">
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-brand-red text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans"
        >
          Back to Home
        </a>
        <a
          href="/menu"
          className="inline-flex items-center justify-center gap-2 bg-brand-red-light text-brand-red font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-sm hover:bg-brand-red hover:text-white transition-colors font-sans"
        >
          Order Again
        </a>
      </div>
    </motion.div>
  );
}

// ── MAIN ORDER PAGE ──
export default function Order() {
  const [step, setStep] = useState(1);
  const [branch, setBranch] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const clearCart = useCartStore((s) => s.clearCart);
  const items = useCartStore((s) => s.items);
  const { user, isAuthenticated } = useUserStore();

  // Handle Paystack callback when user returns from payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("payment");
    const reference = urlParams.get("reference") || urlParams.get("trxref");
    const pendingOrder = sessionStorage.getItem("pending_order_number");

    if (paymentStatus === "success" && (reference || pendingOrder)) {
      const ref = reference || pendingOrder;
      // Verify payment with backend
      api
        .get(`/payment/verify/${ref}`)
        .then((res) => {
          if (res.data.success) {
            sessionStorage.removeItem("pending_order_number");
            clearCart();
            setSuccess(true);
            toast.success("Payment confirmed! Your order is being prepared.");
            // Clean URL
            window.history.replaceState({}, "", "/order");
          } else {
            toast.error("Payment could not be verified. Please contact us.");
          }
        })
        .catch(() =>
          toast.error("Payment verification failed. Please contact us."),
        );
    }
  }, []);

  const handleBranchSelect = (b) => {
    setBranch(b);
    setStep(2);
  };

  const handleMenuNext = () => {
    if (items.length === 0) {
      toast.error("Add at least one dish to continue");
      return;
    }
    setStep(3);
  };

  const handleDetailsNext = (details) => {
    setCustomerDetails(details);
    setStep(4);
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const orderPayload = {
        branch_id: branch.id,
        customer_name: customerDetails.name,
        customer_phone: customerDetails.phone,
        customer_email: customerDetails.email || null,
        user_id: isAuthenticated ? user?.id : null,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        payment_method: customerDetails.paymentMethod,
        notes: customerDetails.notes || null,
      };

      const res = await createOrder(orderPayload);
      const { order, paymentUrl } = res.data.data;

      if (customerDetails.paymentMethod === "online" && paymentUrl) {
        // Store order number in sessionStorage before redirecting
        sessionStorage.setItem(
          "pending_order_number",
          res.data.data.order.order_number,
        );
        window.location.href = paymentUrl;
        return;
      }

      clearCart();
      setPlacedOrder(order);
      setSuccess(true);
      toast.success("Order placed successfully!");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to place order. Please try again.";
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-brand-red relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <MdOutlineDeliveryDining className="text-white/80" size={16} />
              <span className="text-white/70 text-xs sm:text-sm font-semibold uppercase tracking-widest font-sans">
                FOOD DELIVERY
              </span>
            </div>
            <h1
              className="font-display font-extrabold text-white text-3xl sm:text-5xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              Order Fresh Food
            </h1>
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

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {!success && <StepIndicator current={step} />}

        <AnimatePresence mode="wait">
          {success ? (
            <SuccessStep
              key="success"
              branch={branch}
              customerDetails={customerDetails}
              order={placedOrder}
            />
          ) : step === 1 ? (
            <BranchStep key="branch" onSelect={handleBranchSelect} />
          ) : step === 2 ? (
            <MenuStep
              key="menu"
              branch={branch}
              onBack={() => setStep(1)}
              onNext={handleMenuNext}
            />
          ) : step === 3 ? (
            <DetailsStep
              key="details"
              onBack={() => setStep(2)}
              onNext={handleDetailsNext}
            />
          ) : (
            <ConfirmStep
              key="confirm"
              branch={branch}
              customerDetails={customerDetails}
              onBack={() => setStep(3)}
              onPlaceOrder={handlePlaceOrder}
              placing={placing}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
