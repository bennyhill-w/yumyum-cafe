import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  FiShoppingCart,
  FiArrowRight,
  FiArrowLeft,
  FiHeart,
} from "react-icons/fi";
import { IoFlameSharp } from "react-icons/io5";
import { AiFillStar } from "react-icons/ai";
import { HiOutlineSparkles } from "react-icons/hi";
import { formatCurrency } from "../../utils/formatCurrency";
import { PLACEHOLDER_MENU } from "../../utils/placeholderData";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import useCartStore from "../../store/cartStore";
import toast from "react-hot-toast";

// (featured list built from API inside component)

// Confetti particle effect
function Confetti({ x, y }) {
  const confetti = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: x + (Math.random() - 0.5) * 100,
    top: y,
    delay: i * 0.02,
    duration: 2 + Math.random(),
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti.map((c) => (
        <motion.div
          key={c.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 200,
            y: 300 + Math.random() * 200,
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: c.duration,
            delay: c.delay,
            ease: "easeOut",
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: c.left,
            top: c.top,
            backgroundColor: ["#B91C1C", "#D97706", "#FEF3C7", "#FFFFFF"][
              Math.floor(Math.random() * 4)
            ],
          }}
        />
      ))}
    </div>
  );
}

function DishCard({ item, onAdd }) {
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const [timeLeft, setTimeLeft] = useState(null);

  // Sale countdown timer
  useEffect(() => {
    if (!item.onSale) return;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const saleEnd = new Date(item.saleEndsAt).getTime();
      const distance = saleEnd - now;

      if (distance > 0) {
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${mins}m`);
      } else {
        setTimeLeft(null);
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [item]);

  const handleAdd = (e) => {
    onAdd(item);
    setAdded(true);
    setShowConfetti(true);
    setConfettiPos({ x: e.clientX, y: e.clientY });
    setTimeout(() => {
      setAdded(false);
      setShowConfetti(false);
    }, 2500);
  };

  return (
    <>
      {showConfetti && <Confetti x={confettiPos.x} y={confettiPos.y} />}
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={() => setFlipped(!flipped)}
        whileHover={
          !flipped
            ? { y: -8, boxShadow: "0 30px 80px rgba(185, 28, 28, 0.15)" }
            : {}
        }
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 group cursor-pointer relative h-96"
      >
        {/* Front side */}
        <motion.div
          initial={false}
          animate={{ rotateY: flipped ? 90 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ backfaceVisibility: "hidden" }}
          className="absolute inset-0"
        >
          {/* Image */}
          <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <motion.img
              src={item.image}
              alt={item.name}
              animate={{ scale: hovered ? 1.08 : 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Overlay gradient on hover */}
            <motion.div
              animate={{ opacity: hovered ? 0.3 : 0 }}
              className="absolute inset-0 bg-brand-red pointer-events-none"
            />

            {/* Wishlist heart button */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setWishlisted(!wishlisted);
              }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-10"
            >
              <motion.div
                animate={{ scale: wishlisted ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <FiHeart
                  size={18}
                  className={
                    wishlisted
                      ? "fill-brand-red text-brand-red"
                      : "text-gray-400"
                  }
                />
              </motion.div>
            </motion.button>

            {/* Popular badge */}
            {item.popular && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="absolute top-4 left-4 flex items-center gap-1.5 bg-brand-red text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg border border-brand-red-light"
              >
                <IoFlameSharp size={12} />
                <span>Most Loved</span>
              </motion.div>
            )}

            {/* Sale countdown badge */}
            {item.onSale && timeLeft && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute bottom-4 left-4 bg-brand-gold text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg"
              >
                Sale ends in {timeLeft}
              </motion.div>
            )}

            {/* Quick add on hover */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleAdd(e);
              }}
              animate={{
                opacity: hovered && !flipped ? 1 : 0,
                scale: hovered && !flipped ? 1 : 0.7,
                y: hovered && !flipped ? 0 : 10,
              }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-brand-red hover:text-white text-gray-700 transition-all border border-gray-100 font-bold"
            >
              <FiShoppingCart size={18} />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-5 relative flex flex-col justify-between h-40">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-display font-bold text-gray-900 text-lg leading-tight group-hover:text-brand-red transition-colors">
                  {item.name}
                </h3>
                <motion.div
                  animate={{ scale: hovered ? 1.1 : 1 }}
                  className="flex items-center gap-1.5 flex-shrink-0 bg-brand-gold-light px-2.5 py-1 rounded-full"
                >
                  <AiFillStar
                    className="text-brand-gold-mid"
                    size={13}
                    style={{ fill: "#D97706" }}
                  />
                  <span className="text-gray-700 text-xs font-bold font-sans">
                    4.8
                  </span>
                </motion.div>
              </div>

              {/* Allergen badges */}
              {item.allergens && item.allergens.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {item.allergens.map((allergen) => (
                    <span
                      key={allergen}
                      className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-gray-400 text-sm font-sans leading-relaxed line-clamp-1">
                {item.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div>
                {item.onSale && (
                  <span className="text-xs line-through text-gray-400 font-sans">
                    {formatCurrency(item.originalPrice)}
                  </span>
                )}
                <motion.span
                  animate={{ scale: hovered ? 1.08 : 1 }}
                  className="font-display font-bold text-brand-red text-2xl block"
                >
                  {formatCurrency(item.price)}
                </motion.span>
              </div>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdd(e);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all font-sans ${
                  added
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-brand-red-light text-brand-red hover:bg-brand-red hover:text-white shadow-md hover:shadow-lg"
                }`}
              >
                <FiShoppingCart size={14} />
                {added ? "Added!" : "Add"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Back side - flip view */}
        <motion.div
          initial={false}
          animate={{ rotateY: flipped ? 0 : -90 }}
          transition={{ duration: 0.6 }}
          style={{ backfaceVisibility: "hidden" }}
          className="absolute inset-0 bg-gradient-to-br from-brand-red-light to-brand-gold-light p-6 flex flex-col justify-between"
        >
          <div>
            <h3 className="font-display font-bold text-gray-900 text-xl mb-3">
              {item.name}
            </h3>
            <p className="text-gray-700 text-sm font-sans leading-relaxed mb-4">
              {item.description}
            </p>
            {item.extras && item.extras.length > 0 && (
              <div>
                <p className="font-bold text-gray-900 text-sm mb-2">Add-ons:</p>
                <div className="space-y-1">
                  {item.extras.slice(0, 3).map((extra, i) => (
                    <div key={i} className="text-sm text-gray-700 font-sans">
                      • {extra}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-600 font-sans text-center italic">
            Click to flip back
          </p>
        </motion.div>
      </motion.div>
    </>
  );
}

export default function FeaturedDishes() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const addItem = useCartStore((s) => s.addItem);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const { data: menuData } = useQuery({
    queryKey: ["menu-featured"],
    queryFn: () => api.get("/menu").then((r) => r.data),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  });

  const featured = (menuData?.data || [])
    .filter((i) => i.is_popular && i.is_available)
    .map((item) => ({
      ...item,
      image:
        item.image_url ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
      available: item.is_available,
      popular: item.is_popular,
    }))
    .filter(
      (item, index, self) =>
        index ===
        self.findIndex((i) => i.name.toLowerCase() === item.name.toLowerCase()),
    )
    // Fall back to placeholder if no real data yet
    .concat(
      menuData?.data?.length === 0
        ? PLACEHOLDER_MENU.filter((i) => i.popular)
        : [],
    );

  const handleAdd = (item) => {
    addItem(item);
    toast.success(`${item.name} added!`);
  };

  return (
    <section
      ref={ref}
      className="py-24 bg-white relative overflow-hidden"
      aria-labelledby="featured-heading"
    >
      {/* Decorative background elements */}
      <div className="absolute -right-32 top-0 w-64 h-64 rounded-full bg-brand-red/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-32 bottom-0 w-96 h-96 rounded-full bg-brand-gold-light/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-6 h-1 bg-brand-red rounded-full"
              />
              <span className="text-brand-red text-sm font-bold uppercase tracking-widest font-sans flex items-center gap-1.5">
                <HiOutlineSparkles size={13} /> Fan Favourites
              </span>
            </div>
            <h2
              id="featured-heading"
              className="font-display font-bold text-gray-900 text-4xl sm:text-5xl"
              style={{ letterSpacing: "-0.01em" }}
            >
              Most Loved Dishes
            </h2>
            <p className="text-gray-400 text-base font-sans mt-2 max-w-sm">
              Fresh made daily — the dishes our customers keep coming back for.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <button
              ref={prevRef}
              className="w-11 h-11 rounded-full border-2 border-gray-200 text-gray-500 flex items-center justify-center hover:border-brand-red hover:text-brand-red transition-all"
              aria-label="Previous"
            >
              <FiArrowLeft size={18} />
            </button>
            <button
              ref={nextRef}
              className="w-11 h-11 rounded-full bg-brand-red text-white flex items-center justify-center hover:bg-brand-red-dark transition-all"
              aria-label="Next"
            >
              <FiArrowRight size={18} />
            </button>
            <Link
              to="/menu"
              className="hidden sm:inline-flex items-center gap-1.5 text-brand-red font-bold text-sm font-sans hover:gap-2.5 transition-all ml-1"
            >
              Full Menu <FiArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        {/* Swiper */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            loop
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onBeforeInit={(s) => {
              s.params.navigation.prevEl = prevRef.current;
              s.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
              1280: { slidesPerView: 4, spaceBetween: 20 },
            }}
          >
            {featured.map((item) => (
              <SwiperSlide key={item.id}>
                <DishCard item={item} onAdd={handleAdd} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Mobile CTA */}
        <div className="flex justify-center mt-8 sm:hidden">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-brand-red font-bold text-sm font-sans"
          >
            View Full Menu <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
