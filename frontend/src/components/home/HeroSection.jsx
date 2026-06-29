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
import SectionDivider from "../../components/ui/SectionDivider";

import akoumeDish from "../../assets/Burger.png";
import foodDish from "../../assets/Food.png";
import iceCream from "../../assets/Ice-Cream.png";
import bakery from "../../assets/Bread-removebg-preview.png";
import hallImage from "../../assets/Hall.jpg";

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
        background: `
          radial-gradient(ellipse at 0% 0%, #C2410C 0%, transparent 55%),
          radial-gradient(ellipse at 100% 0%, #9B1C1C 0%, transparent 50%),
          radial-gradient(ellipse at 70% 60%, #D97706 0%, transparent 35%),
          radial-gradient(ellipse at 0% 100%, #7F1D1D 0%, transparent 55%),
          radial-gradient(ellipse at 100% 100%, #B91C1C 0%, transparent 50%),
          #991B1B
        `,
      }}
    >
      {/* Geometric diagonal pattern overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="hero-grid"
              x="0"
              y="0"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              {/* Diagonal lines going bottom-left to top-right */}
              <line
                x1="0"
                y1="48"
                x2="48"
                y2="0"
                stroke="rgba(255,255,255,0.055)"
                strokeWidth="1"
              />
              {/* Cross diagonal — creates diamond grid */}
              <line
                x1="0"
                y1="0"
                x2="48"
                y2="48"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="0.5"
              />
              {/* Dot at intersections */}
              <circle cx="0" cy="0" r="1" fill="rgba(255,255,255,0.06)" />
              <circle cx="48" cy="48" r="1" fill="rgba(255,255,255,0.06)" />
              <circle cx="48" cy="0" r="1" fill="rgba(255,255,255,0.06)" />
              <circle cx="0" cy="48" r="1" fill="rgba(255,255,255,0.06)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Animated depth blobs — complement the mesh gradient */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 9, repeat: Infinity }}
        className="absolute -top-20 -right-20 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(253,211,77,0.12), transparent 70%)",
        }}
      />
      <motion.div
        animate={{ scale: [1, 0.88, 1], opacity: [0.15, 0.28, 0.15] }}
        transition={{ duration: 11, repeat: Infinity, delay: 2 }}
        className="absolute -bottom-40 -left-20 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,0,0,0.3), transparent 70%)",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 7, repeat: Infinity, delay: 4 }}
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div
          ref={ref}
          className="grid lg:grid-cols-2 gap-8 lg:gap-0 items-center min-h-[92vh] py-16 lg:py-0 relative z-10"
        >
          {/* ── LEFT — Text ── */}
          <div className="order-2 lg:order-1 lg:pr-8">
            {/* Top badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-7 flex-wrap"
            >
              <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full font-sans">
                <IoFlameSharp size={12} className="text-yellow-300" />
                Lagos&apos; Favourite Fast Food
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-white text-xs font-bold px-3 py-2 rounded-full font-sans">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Open Now
              </span>
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden mb-4">
              <motion.h1
                initial={{ opacity: 0, y: 60 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-display font-bold leading-[1.0] tracking-tight"
                style={{ fontSize: "clamp(50px, 6.5vw, 84px)" }}
              >
                <span className="block text-white">Hungry?</span>
                <span className="block text-white">We&apos;ve got</span>
                <span
                  className="block"
                  style={{
                    background:
                      "linear-gradient(135deg, #FEF3C7 0%, #FCD34D 40%, #D97706 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  you covered.
                </span>
              </motion.h1>
            </div>

            {/* Gold underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="h-1 w-24 rounded-full origin-left mb-6"
              style={{
                background:
                  "linear-gradient(to right, #FCD34D, rgba(253,211,77,0))",
              }}
            />

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/70 text-lg leading-relaxed mb-8 max-w-md font-sans"
            >
              Fresh Continental & African dishes, freshly baked pastries, creamy
              ice cream, and a conference hall — all under one roof across{" "}
              <span className="text-white font-semibold">
                4 Lagos locations.
              </span>
            </motion.p>

            {/* Feature chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="grid grid-cols-3 gap-3 mb-8"
            >
              {[
                {
                  icon: <IoFlameSharp size={16} />,
                  title: "Fresh Daily",
                  sub: "Every morning",
                },
                {
                  icon: <FiClock size={16} />,
                  title: "Fast Service",
                  sub: "Ready for you",
                },
                {
                  icon: <FiMapPin size={16} />,
                  title: "4 Branches",
                  sub: "Across Lagos",
                },
              ].map((chip) => (
                <div
                  key={chip.title}
                  className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm p-3.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-yellow-300 mb-2">
                    {chip.icon}
                  </div>
                  <p className="text-white font-bold text-sm font-sans leading-none">
                    {chip.title}
                  </p>
                  <p className="text-white/55 text-xs font-sans mt-1">
                    {chip.sub}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link to="/order">
                <motion.button
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 bg-white text-brand-red font-bold px-8 py-4 rounded-2xl text-base transition-all font-sans shadow-lg"
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
                    backgroundColor: "rgba(255,255,255,0.2)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-white/10 border-2 border-white/25 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all font-sans"
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
                      className="w-9 h-9 rounded-full border-2 border-brand-red object-cover"
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
                        style={{ fill: "#FCD34D", stroke: "#FCD34D" }}
                      />
                    ))}
                  </div>
                  <p className="text-white/60 text-xs font-sans">
                    <span className="font-bold text-white">5,000+</span> happy
                    customers
                  </p>
                </div>
              </div>

              <div className="h-8 w-px bg-white/20 hidden sm:block" />

              <div className="flex items-center gap-1.5">
                <FiMapPin className="text-yellow-300" size={14} />
                <span className="text-white/60 text-sm font-sans">
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
            {/* Ambient gold glow behind image */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(253,211,77,0.15) 0%, transparent 70%)",
              }}
            />

            {/* Fixed-size image container */}
            <div
              className="relative w-full max-w-lg mx-auto flex items-center justify-center"
              style={{ height: "clamp(320px, 42vw, 560px)" }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide.id}
                  src={currentSlide.image}
                  alt={currentSlide.label}
                  initial={{ opacity: 0, scale: 1.04, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -12 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full"
                  style={{
                    objectFit: "contain",
                    borderRadius: "50px",
                    filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.35))",
                  }}
                  loading="eager"
                />
              </AnimatePresence>

              {/* Floating label */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`label-${currentSlide.id}`}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="absolute top-5 left-5"
                >
                  <div className="bg-white rounded-2xl px-4 py-2.5 shadow-xl">
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
                className="absolute -right-2 lg:-right-6 top-1/3 hidden sm:block"
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
                      ? "bg-white text-brand-red shadow-lg"
                      : "bg-white/15 border border-white/25 text-white hover:bg-white/25"
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
                  className="h-1 rounded-full overflow-hidden"
                  style={{
                    width: i === active ? 28 : 8,
                    backgroundColor: "rgba(255,255,255,0.25)",
                  }}
                >
                  {i === active && (
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "#FCD34D" }}
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

      <SectionDivider color="#111827" opacity={1} variant="wave" />
    </section>
  );
}
