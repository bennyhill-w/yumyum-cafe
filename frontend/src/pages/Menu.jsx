import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiSearch, FiShoppingCart, FiX } from "react-icons/fi";
import { IoFlameSharp } from "react-icons/io5";
import { AiFillStar } from "react-icons/ai";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { GiChickenLeg, GiRiceCooker, GiForkKnifeSpoon } from "react-icons/gi";
import { TbGlass, TbIceCream, TbBread } from "react-icons/tb";
import { HiOutlineSparkles } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "../utils/formatCurrency";
import { PLACEHOLDER_MENU } from "../utils/placeholderData";
import { MENU_CATEGORIES } from "../utils/constants";
import MenuItemModal from "../components/menu/MenuItemModal";
import useCartStore from "../store/cartStore";
import toast from "react-hot-toast";
import { getAllMenu } from "../services/menuService";
import Spinner from "../components/ui/Spinner";

const CATEGORY_ICONS = {
  all: <GiForkKnifeSpoon size={18} />,
  "rice-dishes": <GiRiceCooker size={18} />,
  chicken: <GiChickenLeg size={18} />,
  bakery: <TbBread size={18} />,
  snacks: <TbBread size={18} />,
  sides: <HiOutlineSparkles size={18} />,
  drinks: <TbGlass size={18} />,
  desserts: <TbIceCream size={18} />,
};

// Add MENU_CATEGORIES to placeholderData if not already there
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

function MenuItemCard({ item, onAdd, onView }) {
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const handleAdd = () => {
    onAdd(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onView && onView(item)}
      className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-card-hover transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <motion.img
          src={item.image}
          alt={item.name}
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/40 to-transparent transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
        />

        {/* Out of stock overlay */}
        {!item.available && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-white text-sm font-bold uppercase tracking-[0.2em]">
              Out of Stock
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {item.popular && (
            <span className="inline-flex items-center gap-1 bg-brand-red text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              <IoFlameSharp size={10} /> Popular
            </span>
          )}
          {!item.available && (
            <span className="inline-flex items-center bg-gray-800/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick add on hover */}
        <motion.button
          onClick={handleAdd}
          disabled={!item.available}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-3 right-3 w-10 h-10 bg-white text-brand-red rounded-full flex items-center justify-center shadow-lg hover:bg-brand-red hover:text-white transition-colors disabled:opacity-50"
          aria-label={`Quick add ${item.name}`}
        >
          <FiShoppingCart size={15} />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-display font-bold text-gray-900 text-base leading-tight group-hover:text-brand-red transition-colors">
            {item.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <AiFillStar className="text-brand-gold-mid" size={13} />
            <span className="text-gray-500 text-xs font-sans">4.8</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2 font-sans">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-brand-red text-xl">
            {formatCurrency(item.price)}
          </span>
          <motion.button
            onClick={handleAdd}
            disabled={!item.available}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-300 font-sans ${
              added
                ? "bg-green-500 text-white"
                : item.available
                  ? "bg-brand-red-light text-brand-red hover:bg-brand-red hover:text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiShoppingCart size={14} />
            {added ? "Added!" : item.available ? "Add to Cart" : "Out of Stock"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function CartDrawer({ open, onClose }) {
  const items = useCartStore((s) => s.items);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="font-display font-bold text-gray-900 text-xl">
                  Your Cart
                </h2>
                <p className="text-gray-400 text-sm font-sans">
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center pb-16">
                  <div className="w-20 h-20 rounded-full bg-brand-red-light flex items-center justify-center mb-4">
                    <FiShoppingCart className="text-brand-red" size={28} />
                  </div>
                  <p className="font-display font-bold text-gray-900 text-lg mb-2">
                    Cart is empty
                  </p>
                  <p className="text-gray-400 text-sm font-sans">
                    Add some delicious dishes to get started
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate font-sans">
                          {item.name}
                        </p>
                        <p className="text-brand-red font-bold text-sm font-sans">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-brand-red hover:text-brand-red transition-colors text-sm font-bold"
                        >
                          −
                        </button>
                        <span className="w-5 text-center font-bold text-gray-900 text-sm font-sans">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-7 h-7 rounded-full bg-brand-red text-white flex items-center justify-center hover:bg-brand-red-dark transition-colors text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-gray-100 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500 font-sans">Subtotal</span>
                  <span className="font-display font-bold text-gray-900 text-xl">
                    {formatCurrency(getTotalPrice())}
                  </span>
                </div>
                <Link to="/order" onClick={onClose}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2.5 bg-brand-red text-white font-bold py-4 rounded-2xl text-base hover:bg-brand-red-dark transition-colors font-sans"
                  >
                    <MdOutlineDeliveryDining size={20} />
                    Proceed to Order
                    <FiShoppingCart size={16} />
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const addItem = useCartStore((s) => s.addItem);
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const totalItems = getTotalItems();

  const { data: menuData, isLoading: menuLoading } = useQuery({
    queryKey: ["menu"],
    queryFn: () => getAllMenu().then((r) => r.data),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  });

  const allItems = (menuData?.data || []).map((item) => ({
    ...item,
    image:
      item.image_url ||
      item.image ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
    available: item.is_available,
    popular: item.is_popular,
  }));

  const seen = new Set();
  const uniqueItems = allItems.filter((item) => {
    const key = item.name.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const filtered = useMemo(() => {
    let items = uniqueItems.length > 0 ? uniqueItems : PLACEHOLDER_MENU;
    if (activeCategory !== "all") {
      items = items.filter((i) => i.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q),
      );
    }
    return items;
  }, [allItems, activeCategory, search]);

  const handleAdd = (item) => {
    addItem(item);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── PAGE HEADER ── */}
      <div className="bg-brand-red relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.07), transparent)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineSparkles className="text-brand-gold-mid" size={16} />
              <span className="text-white/70 text-sm font-semibold uppercase tracking-widest font-sans">
                Our Menu
              </span>
            </div>
            <h1
              className="font-display font-extrabold text-white text-5xl sm:text-6xl mb-4"
              style={{ letterSpacing: "-0.02em" }}
            >
              What Are You
              <br />
              Craving Today?
            </h1>
            <p className="text-white/65 text-lg max-w-xl font-sans leading-relaxed">
              Fresh Continental & African dishes made daily. Browse, pick your
              favourites, and order online.
            </p>
          </motion.div>
        </div>

        {/* Bottom wave */}
        <svg
          viewBox="0 0 1440 50"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
          style={{ display: "block", marginBottom: -1 }}
        >
          <path d="M0 50L720 20L1440 50V50H0Z" fill="#F9FAFB" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-10">
        {/* ── SEARCH + CART ROW ── */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={17}
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes..."
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent shadow-sm transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Cart button */}
          <motion.button
            onClick={() => setCartOpen(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="relative flex items-center gap-2.5 bg-brand-red text-white font-bold px-5 py-3.5 rounded-2xl text-sm shadow-md hover:bg-brand-red-dark transition-colors font-sans"
          >
            <FiShoppingCart size={17} />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-brand-gold-mid text-white text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {totalItems > 9 ? "9+" : totalItems}
              </motion.span>
            )}
          </motion.button>
        </div>

        {/* ── CATEGORY FILTER ── */}
        <div className="flex gap-3 overflow-x-auto pb-3 mb-10 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 flex-shrink-0 font-sans ${
                activeCategory === cat.id
                  ? "bg-brand-red text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-brand-red hover:text-brand-red shadow-sm"
              }`}
            >
              <span>{CATEGORY_ICONS[cat.id]}</span>
              {cat.label}
              {activeCategory === cat.id && (
                <span className="bg-white/25 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {cat.id === "all"
                    ? PLACEHOLDER_MENU.length
                    : PLACEHOLDER_MENU.filter((i) => i.category === cat.id)
                        .length}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* ── RESULTS COUNT ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm font-sans">
            Showing{" "}
            <span className="font-bold text-gray-900">{filtered.length}</span>{" "}
            dish{filtered.length !== 1 ? "es" : ""}
            {search && (
              <span>
                {" "}
                for "<span className="text-brand-red">{search}</span>"
              </span>
            )}
          </p>
          {activeCategory !== "all" && (
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearch("");
              }}
              className="text-brand-red text-sm font-semibold hover:underline font-sans flex items-center gap-1"
            >
              <FiX size={14} /> Clear filter
            </button>
          )}
        </div>

        {/* ── MENU GRID ── */}
        {menuLoading && allItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner />
            <p className="mt-4 text-sm font-sans text-gray-500">
              Loading menu...
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeCategory + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAdd={handleAdd}
                  onView={setSelectedItem}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-brand-red-light flex items-center justify-center mb-5">
                <FiSearch className="text-brand-red" size={28} />
              </div>
              <h3 className="font-display font-bold text-gray-900 text-xl mb-2">
                No dishes found
              </h3>
              <p className="text-gray-400 text-sm font-sans mb-6 max-w-xs">
                We could not find any dishes matching your search. Try a
                different keyword.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                }}
                className="inline-flex items-center gap-2 bg-brand-red text-white font-bold px-6 py-3 rounded-xl text-sm font-sans hover:bg-brand-red-dark transition-colors"
              >
                <FiX size={14} /> Clear Search
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ORDER CTA BANNER ── */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 bg-brand-red rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-hero-pattern opacity-20" />
            <div className="relative text-center sm:text-left">
              <h3 className="font-display font-extrabold text-white text-2xl sm:text-3xl mb-2">
                Ready to Order?
              </h3>
              <p className="text-white/70 font-sans text-sm">
                Select your branch and place your order online — we will have it
                ready for you.
              </p>
            </div>
            <Link to="/order" className="relative flex-shrink-0">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 40px rgba(253,211,77,0.3)",
                }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 bg-white text-brand-red font-bold px-8 py-4 rounded-2xl text-sm shadow-lg hover:bg-gray-50 transition-colors font-sans"
              >
                <MdOutlineDeliveryDining size={20} />
                Go to Order Page
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Menu Item Modal */}
      <MenuItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
