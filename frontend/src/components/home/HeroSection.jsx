import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiArrowRight, FiMapPin, FiStar, FiClock } from "react-icons/fi";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { IoFlameSharp } from "react-icons/io5";
import { GiChickenLeg, GiForkKnifeSpoon } from "react-icons/gi";
import { TbChefHat, TbIceCream } from "react-icons/tb";
import { MdStorefront } from "react-icons/md";

// Import hero images
import akoumeDish from "../../assets/Burger.png";
import foodDish from "../../assets/Food.png";
import iceCream from "../../assets/Ice-Cream.png";
import bakery from "../../assets/Bread-removebg-preview.png";
import hallImage from "../../assets/Hall.jpg";
import SectionDivider from "../../components/ui/SectionDivider";

const SLIDES = [
  {
    id: 1,
    image: akoumeDish,
    service: "Restaurant",
    icon: <GiForkKnifeSpoon size={14} />,
    label: "Jollof Rice & Seafood",
  },
  {
    id: 2,
    image: foodDish,
    service: "Restaurant",
    icon: <GiChickenLeg size={14} />,
    label: "Grilled Chicken & Noodles",
  },
  {
    id: 3,
    image: iceCream,
    service: "Ice Cream",
    icon: <TbIceCream size={14} />,
    label: "Hand-Scooped Ice Cream",
  },
  {
    id: 4,
    image: bakery,
    service: "Bakery",
    icon: <TbChefHat size={14} />,
    label: "Freshly Baked Bread",
  },
  {
    id: 5,
    image: hallImage,
    service: "Conference Hall",
    icon: <MdStorefront size={14} />,
    label: "Conference & Meetings",
  },
];

const SERVICE_PILLS = [
  { label: "Restaurant", icon: <GiForkKnifeSpoon size={13} />, slides: [0, 1] },
  { label: "Ice Cream", icon: <TbIceCream size={13} />, slides: [2] },
  { label: "Bakery", icon: <TbChefHat size={13} />, slides: [3] },
  { label: "Conference Hall", icon: <MdStorefront size={13} />, slides: [4] },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    const t = setInterval(
      () => setActive((v) => (v + 1) % SLIDES.length),
      3500,
    );
    return () => clearInterval(t);
  }, []);

  const currentSlide = SLIDES[active];

  return (
    <section
      className="relative overflow-hidden"
      aria-label="Hero"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,237,237,0.6) 35%, rgba(251,191,36,0.1) 60%, rgba(185,28,28,1) 100%)",
      }}
    >
      {/* Animated decorative blobs matching food theme */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-10 right-1/4 w-96 h-96 rounded-full bg-brand-red/5 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 0.9, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-amber-200/10 blur-3xl pointer-events-none"
      />

      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
        <div
          ref={ref}
          className="grid lg:grid-cols-2 gap-18 lg:gap-0 items-center min-h-[92vh] py-16 lg:py-0 relative z-10"
        >
          {/* ── LEFT — Text ── */}
          <div className="order-2 lg:order-1 lg:pr-8 relative">
            <div className="hidden xl:block absolute -left-10 top-20 w-36 h-36 rounded-full bg-brand-red/10 blur-3xl" />
            <div className="hidden xl:block absolute left-4 top-6 w-24 h-24 rounded-full bg-brand-red/5 border border-brand-red/10" />

            {/* Top label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-7"
            >
              <span className="inline-flex items-center gap-2 bg-brand-red-light text-brand-red text-xs font-bold px-4 py-2 rounded-full font-sans">
                <IoFlameSharp size={12} />
                Lagos&apos; Favourite Fast Food
              </span>
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-3 py-2 rounded-full font-sans">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Open Now
              </span>
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden mb-6">
              <motion.h1
                initial={{ opacity: 0, y: 60 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-display font-bold leading-[1.0] tracking-tight text-gray-900"
                style={{ fontSize: "clamp(50px, 6.5vw, 84px)" }}
              >
                <span className="block">Hungry?</span>
                <span className="block">We&apos;ve got</span>
                <span className="block text-brand-red">you covered.</span>
              </motion.h1>
            </div>

            {/* Animated underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="h-1 w-24 bg-brand-red rounded-full origin-left mb-6"
            />

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md font-sans"
            >
              Fresh Continental & African dishes, freshly baked pastries, creamy
              ice cream, and a conference hall — all under one roof across{" "}
              <span className="text-gray-900 font-semibold">
                4 Lagos locations.
              </span>
            </motion.p>

            {/* Feature chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10"
            >
              <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-brand-red/10 text-brand-red mb-3">
                  <IoFlameSharp size={18} />
                </div>
                <p className="text-gray-900 font-semibold">Fresh Daily</p>
                <p className="text-gray-400 text-sm mt-1">Made every morning</p>
              </div>
              <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-brand-red/10 text-brand-red mb-3">
                  <FiClock size={18} />
                </div>
                <p className="text-gray-900 font-semibold">Fast Service</p>
                <p className="text-gray-400 text-sm mt-1">Ready when you are</p>
              </div>
              <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-brand-red/10 text-brand-red mb-3">
                  <FiMapPin size={18} />
                </div>
                <p className="text-gray-900 font-semibold">4 Branches</p>
                <p className="text-gray-400 text-sm mt-1">Across Lagos</p>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link to="/order">
                <motion.button
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 12px 40px rgba(185,28,28,0.3)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 bg-brand-red text-white font-bold px-8 py-4 rounded-2xl text-base hover:bg-brand-red-dark transition-all font-sans shadow-md"
                >
                  <MdOutlineDeliveryDining size={20} />
                  Order Now
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <FiArrowRight size={16} />
                  </motion.span>
                </motion.button>
              </Link>

              <Link to="/menu">
                <motion.button
                  whileHover={{
                    scale: 1.04,
                    borderColor: "#B91C1C",
                    color: "#B91C1C",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 font-bold px-8 py-4 rounded-2xl text-base transition-all font-sans"
                >
                  View Menu
                </motion.button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center gap-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[
                    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&q=80",
                    "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=60&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80",
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      aria-hidden="true"
                      className="w-9 h-9 rounded-full border-2 border-white object-cover"
                      style={{ marginLeft: i === 0 ? 0 : -10, zIndex: 4 - i }}
                      loading="lazy"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar
                        key={i}
                        size={12}
                        className="text-brand-gold-mid"
                        style={{ fill: "#D97706", stroke: "#D97706" }}
                      />
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs font-sans">
                    <span className="font-bold text-gray-700">5,000+</span>{" "}
                    happy customers
                  </p>
                </div>
              </div>

              <div className="h-8 w-px bg-gray-200 hidden sm:block" />

              <div className="flex items-center gap-1.5">
                <FiMapPin className="text-brand-red" size={14} />
                <span className="text-gray-400 text-sm font-sans">
                  4 branches, Lagos
                </span>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT — Free floating image ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2 relative flex flex-col items-center"
          >
            {/* Ambient background glow — behind the image, not on it */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 50%, #FEE2E2 0%, transparent 70%)",
              }}
            />

            {/* Free-floating image — no card, no border */}
            <div className="relative w-3xl max-w-lg ">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide.id}
                  src={currentSlide.image}
                  alt={currentSlide.label}
                  initial={{ opacity: 0, scale: 1.04, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -12 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-auto"
                  style={{
                    maxHeight:
                      currentSlide.id === 1 || currentSlide.id === 2
                        ? "700px"
                        : "800px",
                    objectFit: "cover",
                    borderRadius: "50px",
                    filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.15))",
                  }}
                  loading="eager"
                />
              </AnimatePresence>

              {/* Floating label — current dish name */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`label-${currentSlide.id}`}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="absolute top-5 left-5"
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-lg border border-white/50">
                    <div className="flex items-center gap-2">
                      <span className="text-brand-red">
                        {currentSlide.icon}
                      </span>
                      <div>
                        <p className="text-gray-900 text-xs font-bold font-sans leading-none">
                          {currentSlide.label}
                        </p>
                        <p className="text-gray-400 text-[10px] font-sans mt-0.5">
                          {currentSlide.service}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Freshly made badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-4 top-1/3 hidden lg:block"
              >
                <div className="bg-white rounded-2xl shadow-xl px-4 py-3 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand-red rounded-xl flex items-center justify-center flex-shrink-0">
                      <IoFlameSharp className="text-white" size={15} />
                    </div>
                    <div>
                      <p className="text-gray-900 text-xs font-bold font-sans leading-none">
                        Fresh Daily
                      </p>
                      <p className="text-gray-400 text-[10px] font-sans mt-0.5">
                        Made every morning
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Service selector pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-6 relative z-10">
              {SLIDES.map((slide, i) => (
                <motion.button
                  key={slide.id}
                  onClick={() => setActive(i)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold font-sans transition-all duration-300 ${
                    active === i
                      ? "bg-brand-red text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-500 hover:border-brand-red hover:text-brand-red"
                  }`}
                >
                  {slide.icon}
                  {slide.service}
                </motion.button>
              ))}
            </div>

            {/* Progress bar */}
            <div className="flex gap-1.5 mt-4 relative z-10">
              {SLIDES.map((_, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full bg-gray-200 overflow-hidden"
                  style={{ width: i === active ? 28 : 8 }}
                >
                  {i === active && (
                    <motion.div
                      className="h-full bg-brand-red rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3.5, ease: "linear" }}
                      key={active}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Curved divider into next section */}
      {/* Curved divider into next section */}
      <SectionDivider color="#B91C1C" opacity={0.98} variant="wave" />
    </section>
  );
}
