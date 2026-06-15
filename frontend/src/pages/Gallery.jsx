import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiX, FiChevronLeft, FiChevronRight, FiZoomIn } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import { IoFlameSharp } from "react-icons/io5";
import { AiFillStar } from "react-icons/ai";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { Link } from "react-router-dom";

const GALLERY_ITEMS = [
  {
    id: 1,
    src: "/src/assets/branch-baruwa.jpg",
    thumb: "/src/assets/branch-baruwa.jpg",
    category: "restaurant",
    label: "Yum-Yum Cafe — Baruwa Branch",
    size: "large",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=800&q=85",
    thumb:
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=400&q=75",
    category: "food",
    label: "Grilled Chicken",
    size: "small",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&q=85",
    thumb:
      "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=75",
    category: "food",
    label: "Crispy Fried Chicken",
    size: "small",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=85",
    thumb:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=75",
    category: "restaurant",
    label: "Restaurant Ambiance",
    size: "large",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1574226516831-e1dff420e562?w=800&q=85",
    thumb:
      "https://images.unsplash.com/photo-1574226516831-e1dff420e562?w=400&q=75",
    category: "food",
    label: "Fried Plantain",
    size: "small",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=85",
    thumb:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=75",
    category: "food",
    label: "Fresh Food Spread",
    size: "small",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=85",
    thumb:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=75",
    category: "food",
    label: "Food Display",
    size: "large",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=85",
    thumb:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=75",
    category: "restaurant",
    label: "Dining Area",
    size: "small",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85",
    thumb:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=75",
    category: "restaurant",
    label: "Restaurant Setting",
    size: "small",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=85",
    thumb:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=75",
    category: "drinks",
    label: "Chapman Cocktail",
    size: "small",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=85",
    thumb:
      "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&q=75",
    category: "desserts",
    label: "Ice Cream",
    size: "small",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=85",
    thumb:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=75",
    category: "restaurant",
    label: "Kitchen Fresh",
    size: "large",
  },
];

const FILTERS = [
  { id: "all", label: "All Photos" },
  { id: "food", label: "Food" },
  { id: "restaurant", label: "Restaurant" },
  { id: "drinks", label: "Drinks" },
  { id: "desserts", label: "Desserts" },
];

function GalleryItem({ item, index, onClick }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: (index % 6) * 0.07 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onClick(item)}
      className={`relative rounded-3xl overflow-hidden cursor-pointer group ${
        item.size === "large" ? "row-span-2" : ""
      }`}
      style={{ aspectRatio: item.size === "large" ? "3/4" : "1/1" }}
    >
      <motion.img
        src={item.thumb}
        alt={item.label}
        animate={{ scale: hovered ? 1.08 : 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />

      {/* Overlay */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
      />

      {/* Zoom icon */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
        transition={{ duration: 0.25 }}
        className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
      >
        <FiZoomIn className="text-white" size={18} />
      </motion.div>

      {/* Label */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 p-5"
      >
        <div className="flex items-center gap-2 mb-1">
          <IoFlameSharp className="text-brand-gold-mid" size={13} />
          <span className="text-white/70 text-xs font-sans font-semibold uppercase tracking-wider capitalize">
            {item.category}
          </span>
        </div>
        <p className="text-white font-display font-bold text-lg leading-tight">
          {item.label}
        </p>
      </motion.div>

      {/* Popular indicator */}
      {index < 3 && (
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1 bg-brand-red text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            <AiFillStar size={9} /> Featured
          </span>
        </div>
      )}
    </motion.div>
  );
}

function Lightbox({ items, initial, onClose }) {
  const [current, setCurrent] = useState(
    items.findIndex((i) => i.id === initial.id),
  );

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + items.length) % items.length);
  }, [items.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % items.length);
  }, [items.length]);

  // Keyboard navigation
  useState(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const item = items[current];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
        aria-label="Close"
      >
        <FiX size={20} />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-5 bg-white/10 px-4 py-2 rounded-full text-white text-sm font-sans font-semibold">
        {current + 1} / {items.length}
      </div>

      {/* Prev */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        className="absolute left-4 sm:left-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
        aria-label="Previous"
      >
        <FiChevronLeft size={22} />
      </button>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.35 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-4xl max-h-[80vh] w-full"
        >
          <img
            src={item.src}
            alt={item.label}
            className="w-full max-h-[75vh] object-contain rounded-2xl"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 rounded-b-2xl">
            <p className="text-white font-display font-bold text-xl">
              {item.label}
            </p>
            <p className="text-white/60 text-sm font-sans capitalize">
              {item.category}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Next */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        className="absolute right-4 sm:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
        aria-label="Next"
      >
        <FiChevronRight size={22} />
      </button>

      {/* Thumbnail strip */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-sm px-4">
        {items.map((it, i) => (
          <button
            key={it.id}
            onClick={(e) => {
              e.stopPropagation();
              setCurrent(i);
            }}
            className={`flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden transition-all ${
              i === current
                ? "ring-2 ring-white scale-110"
                : "opacity-50 hover:opacity-80"
            }`}
          >
            <img
              src={it.thumb}
              alt={it.label}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const [filter, setFilter] = useState("all");
  const [lightboxItem, setLightboxItem] = useState(null);
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const filtered =
    filter === "all"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((i) => i.category === filter);

  return (
    <div className="bg-white min-h-screen">
      {/* ── HERO ── */}
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
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineSparkles className="text-brand-gold-mid" size={16} />
              <span className="text-white/70 text-sm font-semibold uppercase tracking-widest font-sans">
                Our Gallery
              </span>
            </div>
            <h1
              className="font-display font-extrabold text-white text-5xl sm:text-6xl mb-4"
              style={{ letterSpacing: "-0.025em", lineHeight: 1.05 }}
            >
              See the Food
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #FEF3C7, #D97706)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Before You Taste It.
              </span>
            </h1>
            <p className="text-white/65 text-lg max-w-xl font-sans">
              A visual tour of our food, our restaurants, and the passion behind
              every dish.
            </p>
          </motion.div>
        </div>
        <svg
          viewBox="0 0 1440 50"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
          style={{ display: "block", marginBottom: -1 }}
        >
          <path d="M0 50L720 20L1440 50V50H0Z" fill="#ffffff" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12">
        {/* Filters */}
        <div className="flex items-center gap-3 overflow-x-auto pb-3 mb-10 scrollbar-hide">
          {FILTERS.map((f) => (
            <motion.button
              key={f.id}
              onClick={() => setFilter(f.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all font-sans flex-shrink-0 ${
                filter === f.id
                  ? "bg-brand-red text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-brand-red-light hover:text-brand-red"
              }`}
            >
              {f.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-sans ${
                  filter === f.id
                    ? "bg-white/20 text-white"
                    : "bg-white text-gray-500"
                }`}
              >
                {f.id === "all"
                  ? GALLERY_ITEMS.length
                  : GALLERY_ITEMS.filter((i) => i.category === f.id).length}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Masonry grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]"
          >
            {filtered.map((item, i) => (
              <GalleryItem
                key={item.id}
                item={item}
                index={i}
                onClick={setLightboxItem}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-brand-red rounded-3xl p-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-hero-pattern opacity-20" />
          <div className="relative">
            <h2 className="font-display font-extrabold text-white text-3xl sm:text-4xl mb-4">
              Looks Delicious?
            </h2>
            <p className="text-white/70 font-sans text-base mb-8 max-w-md mx-auto">
              Stop looking and start eating. Order online and have it fresh and
              ready for you.
            </p>
            <Link to="/order">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 bg-white text-brand-red font-bold px-10 py-4 rounded-2xl text-sm hover:bg-gray-50 transition-colors font-sans shadow-lg"
              >
                <MdOutlineDeliveryDining size={20} />
                Order Now
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <Lightbox
            items={filtered}
            initial={lightboxItem}
            onClose={() => setLightboxItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
