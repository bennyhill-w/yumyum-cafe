import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FiMapPin, FiPhone, FiClock, FiArrowRight, FiNavigation,
} from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi";
import { useBranches } from "../../hooks/useBranches";

export default function BranchStrip() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { branches: BRANCHES } = useBranches();

  return (
    <section
      ref={ref}
      className="py-24 bg-gray-900 relative overflow-hidden"
      aria-labelledby="branches-heading"
    >
      {/* Subtle pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5 pointer-events-none" />

      {/* Gold glow top right */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, #D97706, transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full" style={{ background: "#D97706" }} />
              <span
                className="text-sm font-bold uppercase tracking-widest font-sans flex items-center gap-1.5"
                style={{ color: "#D97706" }}
              >
                <HiOutlineSparkles size={13} /> Our Locations
              </span>
            </div>
            <h2
              id="branches-heading"
              className="font-display font-bold text-white text-4xl sm:text-5xl"
              style={{ letterSpacing: "-0.01em" }}
            >
              Find Us Near You
            </h2>
            <p className="text-gray-400 text-base font-sans mt-2">
              Four branches across Lagos — one is always close to you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Link to="/find-us">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-brand-red text-white font-bold px-6 py-3.5 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans shadow-lg"
              >
                <FiMapPin size={15} />
                View All Branches
                <FiArrowRight size={14} />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BRANCHES.map((branch, i) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gray-800/80 border border-gray-700 rounded-3xl p-6 transition-all duration-300 group hover:border-brand-red/40 hover:bg-gray-800"
            >
              {/* Number + icon */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 bg-brand-red/20 rounded-2xl flex items-center justify-center group-hover:bg-brand-red transition-colors duration-300">
                  <MdStorefront
                    className="text-brand-red group-hover:text-white transition-colors duration-300"
                    size={22}
                  />
                </div>
                <span className="font-display font-bold text-gray-700 text-4xl group-hover:text-brand-red/40 transition-colors">
                  0{i + 1}
                </span>
              </div>

              {/* Name */}
              <h3 className="font-display font-bold text-white text-xl mb-4 group-hover:text-brand-red transition-colors">
                {branch.name}
              </h3>

              {/* Details */}
              <div className="space-y-2.5 mb-5">
                <div className="flex items-start gap-2.5">
                  <FiMapPin className="text-brand-red flex-shrink-0 mt-0.5" size={13} />
                  <span className="text-gray-400 text-xs font-sans leading-relaxed">
                    {branch.address}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <FiClock className="text-brand-red flex-shrink-0" size={13} />
                  <span className="text-gray-400 text-xs font-sans">{branch.hours}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <FiPhone className="text-brand-red flex-shrink-0" size={13} />
                  <a
                    href={`tel:${branch.phone}`}
                    className="text-gray-400 text-xs font-sans hover:text-brand-red transition-colors"
                  >
                    {branch.phone}
                  </a>
                </div>
              </div>

              {/* Status + directions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                      branch.is_open ? "bg-green-400" : "bg-red-400"
                    }`}
                  />
                  <span
                    className={`text-xs font-bold font-sans ${
                      branch.is_open ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {branch.is_open ? "Open Now" : "Closed"}
                  </span>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address + " Lagos Nigeria")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-brand-red text-xs font-bold font-sans hover:underline"
                >
                  <FiNavigation size={11} /> Directions
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}