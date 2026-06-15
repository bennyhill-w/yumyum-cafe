import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiHome } from "react-icons/fi";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { IoFlameSharp } from "react-icons/io5";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Display */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-8"
        >
          <div
            className="font-display font-extrabold text-center select-none"
            style={{
              fontSize: "clamp(100px, 20vw, 200px)",
              lineHeight: 1,
              background: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.04em",
            }}
          >
            404
          </div>

          {/* Floating food icon in center */}
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-brand-red rounded-3xl flex items-center justify-center shadow-glow-red"
          >
            <GiForkKnifeSpoon className="text-white" size={36} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1
            className="font-display font-extrabold text-gray-900 text-4xl sm:text-5xl mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            Page Not Found
          </h1>
          <p className="text-gray-500 text-lg font-sans leading-relaxed mb-10 max-w-md mx-auto">
            Looks like this page went missing — just like the last piece of
            chicken pie. Let&apos;s get you back to something delicious.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-14">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 bg-brand-red text-white font-bold px-8 py-4 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans shadow-glow-red"
              >
                <FiHome size={17} />
                Back to Home
              </motion.button>
            </Link>
            <Link to="/menu">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 bg-white border border-gray-200 text-gray-700 font-bold px-8 py-4 rounded-2xl text-sm hover:border-brand-red hover:text-brand-red transition-colors font-sans shadow-sm"
              >
                <GiForkKnifeSpoon size={17} />
                View Menu
              </motion.button>
            </Link>
            <Link to="/order">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 bg-brand-gold-light text-brand-gold font-bold px-8 py-4 rounded-2xl text-sm hover:bg-brand-gold hover:text-white transition-colors font-sans"
              >
                <MdOutlineDeliveryDining size={19} />
                Order Now
              </motion.button>
            </Link>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { to: "/about", label: "About Us" },
              { to: "/find-us", label: "Find a Branch" },
              { to: "/reservations", label: "Book a Table" },
              { to: "/gallery", label: "Gallery" },
              { to: "/contact", label: "Contact Us" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="inline-flex items-center gap-1.5 text-gray-400 hover:text-brand-red text-sm font-semibold font-sans transition-colors"
              >
                <IoFlameSharp size={12} className="text-brand-gold-mid" />
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
