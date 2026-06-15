import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AiFillStar } from "react-icons/ai";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import { MdFormatQuote } from "react-icons/md";
import { PLACEHOLDER_TESTIMONIALS } from "../../utils/placeholderData";

export default function Testimonials() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = PLACEHOLDER_TESTIMONIALS.length;

  useEffect(() => {
    const t = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % total);
    }, 5000);
    return () => clearInterval(t);
  }, [total]);

  const go = (dir) => {
    setDirection(dir);
    setCurrent((c) => (c + dir + total) % total);
  };

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 50 : -50 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -50 : 50 }),
  };

  return (
    <section
      ref={ref}
      className="py-24 bg-white"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-1 bg-brand-red rounded-full" />
            <span className="text-brand-red text-sm font-bold uppercase tracking-widest font-sans flex items-center gap-1.5">
              <HiOutlineSparkles size={13} /> Customer Love
            </span>
            <div className="w-6 h-1 bg-brand-red rounded-full" />
          </div>
          <h2
            id="testimonials-heading"
            className="font-display font-bold text-gray-900 text-4xl sm:text-5xl"
            style={{ letterSpacing: "-0.01em" }}
          >
            What Our Customers Say
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative bg-gray-50 rounded-3xl p-8 sm:p-12 overflow-hidden"
        >
          {/* Decorative quote */}
          <div className="absolute top-6 right-8 opacity-5">
            <MdFormatQuote size={120} className="text-brand-red" />
          </div>

          {/* Stars */}
          <div className="flex gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <AiFillStar
                key={i}
                className="text-brand-gold-mid"
                size={22}
                style={{ fill: "#D97706" }}
              />
            ))}
          </div>

          {/* Quote */}
          <div className="min-h-[100px] mb-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.p
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="text-gray-700 text-xl sm:text-2xl font-display leading-relaxed"
              >
                "{PLACEHOLDER_TESTIMONIALS[current].text}"
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Author + controls */}
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={`author-${current}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-11 h-11 rounded-full bg-brand-red flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold font-sans">
                    {PLACEHOLDER_TESTIMONIALS[current].name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm font-sans">
                    {PLACEHOLDER_TESTIMONIALS[current].name}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold-mid" />
                    <p className="text-gray-400 text-xs font-sans">
                      {PLACEHOLDER_TESTIMONIALS[current].location} Branch
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-2">
              <button
                onClick={() => go(-1)}
                className="w-10 h-10 rounded-full border-2 border-gray-200 text-gray-500 flex items-center justify-center hover:border-brand-red hover:text-brand-red transition-colors"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                onClick={() => go(1)}
                className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center hover:bg-brand-red-dark transition-colors"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 mt-6">
            {PLACEHOLDER_TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-7 h-2 bg-brand-red"
                    : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
