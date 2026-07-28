import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FiArrowRight,
  FiMapPin,
  FiStar,
  FiClock,
  FiShield,
} from "react-icons/fi";
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

// Food-themed line art SVG pattern for right side
function FoodLineArt() {
  return (
    <svg
      className="absolute right-0 top-0 h-full w-1/2 pointer-events-none"
      viewBox="0 0 500 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Fork */}
      <g opacity="0.06" stroke="white" strokeWidth="1.5">
        <line x1="380" y1="60" x2="380" y2="160" />
        <line x1="370" y1="60" x2="370" y2="100" />
        <line x1="390" y1="60" x2="390" y2="100" />
        <path d="M370 100 Q380 115 390 100" fill="none" />
        <line x1="380" y1="115" x2="380" y2="160" />
      </g>
      {/* Spoon */}
      <g opacity="0.05" stroke="white" strokeWidth="1.5">
        <ellipse cx="430" cy="75" rx="8" ry="14" />
        <line x1="430" y1="89" x2="430" y2="160" />
      </g>
      {/* Leaf 1 */}
      <path
        d="M460 200 Q490 170 500 200 Q490 230 460 200Z"
        opacity="0.05"
        stroke="white"
        strokeWidth="1"
        fill="none"
      />
      <line
        x1="460"
        y1="200"
        x2="500"
        y2="200"
        opacity="0.04"
        stroke="white"
        strokeWidth="1"
      />
      {/* Circular decorative ring */}
      <circle
        cx="320"
        cy="400"
        r="180"
        opacity="0.04"
        stroke="white"
        strokeWidth="1"
        strokeDasharray="4 8"
      />
      <circle
        cx="320"
        cy="400"
        r="200"
        opacity="0.03"
        stroke="white"
        strokeWidth="0.5"
        strokeDasharray="2 12"
      />
      {/* Small dots scattered */}
      <circle cx="420" cy="300" r="2" fill="white" opacity="0.08" />
      <circle cx="460" cy="340" r="1.5" fill="white" opacity="0.06" />
      <circle cx="400" cy="480" r="2.5" fill="white" opacity="0.07" />
      <circle cx="480" cy="520" r="1.5" fill="white" opacity="0.05" />
      <circle cx="350" cy="600" r="2" fill="white" opacity="0.08" />
      <circle cx="450" cy="650" r="3" fill="white" opacity="0.05" />
      <circle cx="380" cy="720" r="1.5" fill="white" opacity="0.06" />
      {/* Leaf 2 */}
      <path
        d="M350 580 Q380 550 395 580 Q380 610 350 580Z"
        opacity="0.05"
        stroke="white"
        strokeWidth="1"
        fill="none"
      />
      {/* Star shapes */}
      <path
        d="M470 440 L473 448 L481 448 L475 453 L477 461 L470 456 L463 461 L465 453 L459 448 L467 448Z"
        opacity="0.05"
        stroke="white"
        strokeWidth="0.8"
        fill="none"
      />
      {/* Wheat/grain lines */}
      <g opacity="0.04" stroke="white" strokeWidth="1">
        <path d="M490 700 Q500 680 490 660" fill="none" />
        <path d="M490 700 Q480 680 490 660" fill="none" />
        <line x1="490" y1="700" x2="490" y2="750" />
      </g>
    </svg>
  );
}

// Rotating circular text ring
function CircularText({
  radius = 130,
  text = "FRESH · TASTY · SATISFYING · ",
}) {
  const chars = text.split("");
  const angleStep = 360 / chars.length;
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ width: radius * 2, height: radius * 2, position: "relative" }}
      >
        {chars.map((char, i) => {
          const angle = angleStep * i - 90;
          const rad = (angle * Math.PI) / 180;
          const x = radius + radius * Math.cos(rad);
          const y = radius + radius * Math.sin(rad);
          return (
            <span
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
                fontSize: "9px",
                fontWeight: "700",
                letterSpacing: "0.05em",
                color: "rgba(255,255,255,0.25)",
                fontFamily: "sans-serif",
                userSelect: "none",
              }}
            >
              {char}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}

// Floating particles
function FloatingParticles() {
  const particles = [
    { x: "15%", y: "20%", size: 5, delay: 0, duration: 4 },
    { x: "80%", y: "15%", size: 4, delay: 1, duration: 5 },
    { x: "90%", y: "70%", size: 6, delay: 2, duration: 3.5 },
    { x: "10%", y: "75%", size: 3, delay: 0.5, duration: 4.5 },
    { x: "50%", y: "10%", size: 4, delay: 1.5, duration: 3 },
    { x: "70%", y: "85%", size: 5, delay: 2.5, duration: 5 },
    { x: "25%", y: "45%", size: 3, delay: 3, duration: 4 },
    { x: "85%", y: "40%", size: 4, delay: 0.8, duration: 3.8 },
  ];
  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(253,211,77,0.6), rgba(253,211,77,0.1))`,
          }}
          animate={{ y: [-8, 8, -8], opacity: [0.3, 0.7, 0.3] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

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
      className="relative overflow-hidden -mt-16"
      aria-label="Hero"
      style={{
        background: `
          radial-gradient(ellipse at 15% 50%, #7F1D1D 0%, transparent 60%),
          radial-gradient(ellipse at 85% 20%, #92140C 0%, transparent 50%),
          radial-gradient(ellipse at 70% 70%, rgba(217,119,6,0.18) 0%, transparent 40%),
          radial-gradient(ellipse at 50% 100%, #6B1010 0%, transparent 55%),
          #7C0A02
        `,
      }}
    >
      {/* Food-themed line art — right side only */}
      <FoodLineArt />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <FloatingParticles />
      </div>

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
              <line
                x1="0"
                y1="48"
                x2="48"
                y2="0"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="0"
                x2="48"
                y2="48"
                stroke="rgba(255,255,255,0.02)"
                strokeWidth="0.5"
              />
              <circle cx="0" cy="0" r="1" fill="rgba(255,255,255,0.04)" />
              <circle cx="48" cy="48" r="1" fill="rgba(255,255,255,0.04)" />
              <circle cx="48" cy="0" r="1" fill="rgba(255,255,255,0.04)" />
              <circle cx="0" cy="48" r="1" fill="rgba(255,255,255,0.04)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Animated depth blobs */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.28, 0.15] }}
        transition={{ duration: 9, repeat: Infinity }}
        className="absolute -top-20 -right-20 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(253,211,77,0.1), transparent 70%)",
        }}
      />
      <motion.div
        animate={{ scale: [1, 0.88, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 11, repeat: Infinity, delay: 2 }}
        className="absolute -bottom-40 -left-20 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,0,0,0.4), transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div
          ref={ref}
          className="grid lg:grid-cols-2 gap-8 lg:gap-0 items-center min-h-screen pt-28 pb-16 lg:pt-24 lg:pb-0 relative z-10"
        >
          {/* ── LEFT ── */}
          <div className="order-2 lg:order-1 lg:pr-8">
            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-7 flex-wrap"
            >
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full font-sans backdrop-blur-sm">
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
                  We&apos;ve got
                </span>
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

            {/* Subtext with left border accent */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="border-l-2 border-yellow-400 pl-4 mb-8"
            >
              <p className="text-white/75 text-lg leading-relaxed max-w-md font-sans">
                From local favourites to continental classics, explore our
                delicious menu and enjoy fast delivery to your doorstep across{" "}
                <span className="text-white font-semibold">
                  5 Lagos locations.
                </span>
              </p>
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
                    boxShadow: "0 12px 40px rgba(217,119,6,0.5)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 font-bold px-8 py-4 rounded-2xl text-base transition-all font-sans shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #FCD34D, #D97706)",
                    color: "#111",
                  }}
                >
                  <MdOutlineDeliveryDining size={20} />
                  Order Online
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <FiArrowRight size={16} />
                  </motion.span>
                </motion.button>
              </Link>

              <Link to="/reservations">
                <motion.button
                  whileHover={{
                    scale: 1.04,
                    backgroundColor: "rgba(255,255,255,0.18)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-white/10 border-2 border-white/25 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all font-sans backdrop-blur-sm"
                >
                  Make Reservation
                </motion.button>
              </Link>
            </motion.div>

            {/* Bottom feature strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-wrap items-center gap-6"
            >
              {[
                {
                  icon: <MdOutlineDeliveryDining size={20} />,
                  label: "Fast Delivery",
                  sub: "To all locations",
                },
                {
                  icon: <IoFlameSharp size={20} />,
                  label: "Quality Meals",
                  sub: "Fresh & Delicious",
                },
                {
                  icon: <FiShield size={20} />,
                  label: "Secure Payment",
                  sub: "Pay safely online",
                },
              ].map((feat, i) => (
                <div key={feat.label} className="flex items-center gap-3">
                  {i > 0 && (
                    <div className="w-px h-8 bg-white/15 hidden sm:block" />
                  )}
                  <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 flex-shrink-0">
                    {feat.icon}
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold font-sans leading-none">
                      {feat.label}
                    </p>
                    <p className="text-white/50 text-xs font-sans mt-0.5">
                      {feat.sub}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2 relative flex flex-col items-center"
          >
            {/* "Deliciously Made for You!" floating text */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="absolute top-8 right-0 lg:-right-4 z-20 hidden sm:block"
            >
              <motion.div
                animate={{ rotate: [-2, 2, -2] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-right"
              >
                <p
                  className="text-yellow-300 font-bold leading-tight"
                  style={{
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "clamp(14px, 1.5vw, 20px)",
                    textShadow: "0 2px 12px rgba(217,119,6,0.5)",
                  }}
                >
                  Deliciously
                </p>
                <p
                  className="text-yellow-300 font-bold leading-tight"
                  style={{
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "clamp(14px, 1.5vw, 20px)",
                    textShadow: "0 2px 12px rgba(217,119,6,0.5)",
                  }}
                >
                  Made for
                </p>
                <p
                  className="text-yellow-300 font-bold"
                  style={{
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "clamp(16px, 1.8vw, 24px)",
                    textShadow: "0 2px 12px rgba(217,119,6,0.5)",
                  }}
                >
                  You! ✦
                </p>
                {/* Arrow */}
                <div className="flex justify-end mt-1">
                  <svg width="40" height="30" viewBox="0 0 40 30">
                    <path
                      d="M5 5 Q20 2 35 25"
                      stroke="#FCD34D"
                      strokeWidth="1.5"
                      fill="none"
                      opacity="0.7"
                      strokeDasharray="3 2"
                    />
                    <path
                      d="M30 22 L35 25 L32 20"
                      stroke="#FCD34D"
                      strokeWidth="1.5"
                      fill="none"
                      opacity="0.7"
                    />
                  </svg>
                </div>
              </motion.div>
            </motion.div>

            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(253,211,77,0.13) 0%, transparent 70%)",
              }}
            />

            {/* Outer glow ring */}
            <div
              className="absolute pointer-events-none rounded-full"
              style={{
                width: "clamp(340px, 44vw, 580px)",
                height: "clamp(340px, 44vw, 580px)",
                background:
                  "radial-gradient(circle, rgba(180,0,0,0.0) 55%, rgba(253,211,77,0.06) 70%, transparent 100%)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Food image container with circular text */}
            <div
              className="relative w-full max-w-lg mx-auto flex items-center justify-center"
              style={{ height: "clamp(320px, 42vw, 560px)" }}
            >
              {/* Rotating circular text */}
              <CircularText radius={Math.min(160, 140)} />

              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide.id}
                  src={currentSlide.image}
                  alt={currentSlide.label}
                  initial={{ opacity: 0, scale: 1.04, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -12 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full relative z-10"
                  style={{
                    objectFit: "contain",
                    filter:
                      "drop-shadow(0 30px 60px rgba(0,0,0,0.5)) drop-shadow(0 0 40px rgba(217,119,6,0.2))",
                  }}
                  loading="eager"
                />
              </AnimatePresence>

              {/* Floating dish label */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`label-${currentSlide.id}`}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="absolute top-5 left-5 z-20"
                >
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-xl">
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

              {/* Fresh Daily badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-2 lg:-right-6 top-1/3 hidden sm:block z-20"
              >
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl px-4 py-3 border border-gray-100/50">
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

              {/* New — Order count floating badge */}
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{
                  duration: 4,
                  delay: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -left-2 lg:-left-4 bottom-1/4 hidden sm:block z-20"
              >
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl px-3 py-2.5 border border-gray-100/50">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #FCD34D, #D97706)",
                      }}
                    >
                      <FiStar
                        size={14}
                        style={{ fill: "#111", stroke: "#111" }}
                      />
                    </div>
                    <div>
                      <p className="text-gray-900 text-xs font-bold font-sans leading-none">
                        5,000+ Orders
                      </p>
                      <p className="text-gray-400 text-[10px] font-sans mt-0.5">
                        This month
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Service pills */}
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
                      : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
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
                  className="h-1 rounded-full overflow-hidden transition-all duration-300"
                  style={{
                    width: i === active ? 28 : 8,
                    backgroundColor: "rgba(255,255,255,0.2)",
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
