import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FiMapPin,
  FiPhone,
  FiClock,
  FiNavigation,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { MdStorefront, MdOutlineDeliveryDining } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi";
import { IoFlameSharp } from "react-icons/io5";
import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useBranches } from "../hooks/useBranches";
import SEO from "../components/SEO";

const BRANCH_IMAGES = {
  baruwa: "/src/assets/branch-baruwa.jpg",
  ijegun:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=85",
  ipaja:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85",
  isheri:
    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=85",
};

const GOOGLE_MAPS_EMBED = {
  baruwa:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.1!2d3.2479!3d6.6095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzYnMzQuMiJOIDPCsDE0JzUyLjQiRQ!5e0!3m2!1sen!2sng!4v1620000000000!5m2!1sen!2sng",
  ijegun:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.1!2d3.3156!3d6.5344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzInMDMuOCJOIDPCsDE4JzU2LjIiRQ!5e0!3m2!1sen!2sng!4v1620000000001!5m2!1sen!2sng",
  ipaja:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.2!2d3.2538!3d6.6056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzYnMjAuMiJOIDPCsDE1JzEzLjciRQ!5e0!3m2!1sen!2sng!4v1620000000002!5m2!1sen!2sng",
  isheri:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.3!2d3.3189!3d6.5281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzEnNDEuMiJOIDPCsDE5JzA4LjAiRQ!5e0!3m2!1sen!2sng!4v1620000000003!5m2!1sen!2sng",
};

function BranchCard({ branch, active, onClick, index }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className={`group cursor-pointer rounded-3xl overflow-hidden border-2 transition-all duration-300 ${
        active
          ? "border-brand-red shadow-glow-red"
          : "border-gray-100 shadow-sm hover:border-brand-red/40 hover:shadow-md"
      }`}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <motion.img
          src={BRANCH_IMAGES[branch.id]}
          alt={`${branch.name} branch`}
          animate={{ scale: active ? 1.05 : 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t transition-all duration-300 ${
            active
              ? "from-brand-red/70 to-transparent"
              : "from-black/50 to-transparent"
          }`}
        />

        {/* Branch number */}
        <div className="absolute top-4 left-4">
          <span
            className={`font-display font-extrabold text-4xl transition-colors ${
              active ? "text-white" : "text-white/60"
            }`}
          >
            0{index + 1}
          </span>
        </div>

        {/* Open badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-300 text-xs font-semibold font-sans">
            {branch.is_open ? "Open Now" : "Closed"}
          </span>
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-4 left-4">
          <h3 className="font-display font-extrabold text-white text-2xl">
            {branch.name}
          </h3>
          <p className="text-white/70 text-xs font-sans">{branch.area}</p>
        </div>
      </div>

      {/* Details */}
      <div
        className={`p-5 transition-colors duration-300 ${active ? "bg-brand-red-light" : "bg-white"}`}
      >
        <div className="space-y-2.5">
          <div className="flex items-start gap-2.5">
            <FiMapPin
              className={`mt-0.5 flex-shrink-0 ${active ? "text-brand-red" : "text-gray-400"}`}
              size={14}
            />
            <span
              className={`text-sm font-sans leading-relaxed ${active ? "text-brand-red-dark" : "text-gray-600"}`}
            >
              {branch.address}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <FiClock
              className={`flex-shrink-0 ${active ? "text-brand-red" : "text-gray-400"}`}
              size={14}
            />
            <span
              className={`text-sm font-sans ${active ? "text-brand-red-dark" : "text-gray-600"}`}
            >
              {branch.hours}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <FiPhone
              className={`flex-shrink-0 ${active ? "text-brand-red" : "text-gray-400"}`}
              size={14}
            />

            <a
              href={`tel:${branch.phone}`}
              className={`text-sm font-sans hover:underline ${active ? "text-brand-red font-semibold" : "text-gray-600"}`}
              onClick={(e) => e.stopPropagation()}
            >
              {branch.phone}
            </a>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2.5 mt-5">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address + " Lagos Nigeria")}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold font-sans transition-all ${
              active
                ? "bg-brand-red text-white hover:bg-brand-red-dark"
                : "bg-brand-red-light text-brand-red hover:bg-brand-red hover:text-white"
            }`}
          >
            <FiNavigation size={13} />
            Get Directions
          </a>

          <a
            href={`tel:${branch.phone}`}
            onClick={(e) => e.stopPropagation()}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold font-sans transition-all border ${
              active
                ? "border-brand-red text-brand-red bg-white hover:bg-brand-red hover:text-white"
                : "border-gray-200 text-gray-600 bg-white hover:border-brand-red hover:text-brand-red"
            }`}
          >
            <FiPhone size={13} />
            Call Branch
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function FindUs() {
  const { branches: BRANCHES } = useBranches();
  const [activeBranch, setActiveBranch] = useState(null);
  const [search, setSearch] = useState("");
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  // Set first branch as active once loaded
  useEffect(() => {
    if (BRANCHES.length > 0 && !activeBranch) {
      setActiveBranch(BRANCHES[0]);
    }
  }, [BRANCHES]);

  const filtered = BRANCHES.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.area.toLowerCase().includes(search.toLowerCase()) ||
      b.address.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-white min-h-screen">
      <SEO
        title="Find Us"
        description="Find your nearest Yum-Yum Cafe branch in Lagos. We have 4 locations — Baruwa, Ijegun, Idimu and Abulegba. Open daily 8AM–10PM."
        url="/find-us"
      />
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
                Our Locations
              </span>
            </div>
            <h1
              className="font-display font-extrabold text-white text-5xl sm:text-6xl mb-5"
              style={{ letterSpacing: "-0.025em", lineHeight: 1.05 }}
            >
              Find Us
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #FEF3C7, #D97706)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Near You.
              </span>
            </h1>
            <p className="text-white/65 text-lg max-w-xl font-sans leading-relaxed mb-8">
              Four branches spread across Lagos — there is always a Yum-Yum Cafe
              within reach of you.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: <MdStorefront size={16} />, text: "4 Branches" },
                { icon: <FiClock size={16} />, text: "Open 8AM – 10PM Daily" },
                { icon: <AiFillStar size={16} />, text: "4.8 Rated" },
                { icon: <IoFlameSharp size={16} />, text: "Fresh Food Always" },
              ].map((s, i) => (
                <motion.div
                  key={s.text}
                  initial={{ opacity: 0, y: 15 }}
                  animate={headerInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full"
                >
                  <span className="text-brand-gold-mid">{s.icon}</span>
                  <span className="text-white/80 text-xs font-semibold font-sans">
                    {s.text}
                  </span>
                </motion.div>
              ))}
            </div>
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

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-14">
        {/* Search */}
        <div className="max-w-md mb-10">
          <div className="relative">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={17}
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by area or address..."
              className="w-full pl-11 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent shadow-sm transition-all"
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
        </div>

        <div className="grid lg:grid-cols-[1fr_500px] gap-10">
          {/* Branch cards */}
          <div>
            <p className="text-gray-500 text-sm font-sans mb-6">
              Showing{" "}
              <span className="font-bold text-gray-900">{filtered.length}</span>{" "}
              location{filtered.length !== 1 ? "s" : ""}
            </p>

            <AnimatePresence>
              {filtered.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-5">
                  {filtered.map((branch, i) => (
                    <BranchCard
                      key={branch.id}
                      branch={branch}
                      active={activeBranch?.id === branch.id}
                      onClick={() => setActiveBranch(branch)}
                      index={i}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center py-20 text-center"
                >
                  <div className="w-16 h-16 bg-brand-red-light rounded-2xl flex items-center justify-center mb-4">
                    <FiMapPin className="text-brand-red" size={24} />
                  </div>
                  <p className="font-bold text-gray-900 font-sans mb-2">
                    No branches found
                  </p>
                  <p className="text-gray-400 text-sm font-sans">
                    Try a different search term
                  </p>
                  <button
                    onClick={() => setSearch("")}
                    className="mt-4 text-brand-red font-semibold text-sm font-sans hover:underline"
                  >
                    Clear search
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Map panel */}
          <div className="lg:sticky lg:top-24 self-start">
            <AnimatePresence mode="wait">
              {activeBranch && (
                <motion.div
                  key={activeBranch.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Map */}
                  <div className="relative h-72 bg-gray-100">
                    <iframe
                      title={`Map of ${activeBranch.name} branch`}
                      src={GOOGLE_MAPS_EMBED[activeBranch.id]}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                    />
                  </div>

                  {/* Branch info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display font-extrabold text-gray-900 text-2xl">
                            {activeBranch.name}
                          </h3>
                          <div className="flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-green-600 text-xs font-bold font-sans">
                              Open
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm font-sans">
                          {activeBranch.area}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <AiFillStar className="text-brand-gold-mid" size={16} />
                        <span className="font-bold text-gray-900 text-sm font-sans">
                          4.8
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl">
                        <FiMapPin
                          className="text-brand-red mt-0.5 flex-shrink-0"
                          size={16}
                        />
                        <span className="text-gray-700 text-sm font-sans leading-relaxed">
                          {activeBranch.address}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                          <FiClock
                            className="text-brand-red flex-shrink-0"
                            size={16}
                          />
                          <span className="text-gray-700 text-xs font-sans">
                            {activeBranch.hours}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                          <FiPhone
                            className="text-brand-red flex-shrink-0"
                            size={16}
                          />
                          <span className="text-gray-700 text-xs font-sans">
                            {activeBranch.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeBranch.address + " Lagos Nigeria")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-brand-red text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans"
                      >
                        <FiNavigation size={15} />
                        Get Directions
                      </a>
                      <Link
                        to="/order"
                        className="flex-1 flex items-center justify-center gap-2 bg-brand-red-light text-brand-red font-bold py-3.5 rounded-2xl text-sm hover:bg-brand-red hover:text-white transition-colors font-sans"
                      >
                        <MdOutlineDeliveryDining size={17} />
                        Order Here
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="font-display font-extrabold text-gray-900 text-4xl sm:text-5xl mb-5"
              style={{ letterSpacing: "-0.02em" }}
            >
              Ready to Order?
            </h2>
            <p className="text-gray-500 text-lg font-sans mb-8 max-w-xl mx-auto">
              Order online now and have your food ready for pickup at your
              nearest branch.
            </p>
            <Link to="/order">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 bg-brand-red text-white font-bold px-10 py-4 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans shadow-glow-red"
              >
                <MdOutlineDeliveryDining size={20} />
                Order Online Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
