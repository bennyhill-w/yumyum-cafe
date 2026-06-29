import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { HiOutlineSparkles } from "react-icons/hi";
import { IoFlameSharp } from "react-icons/io5";
import { FiClock, FiUsers } from "react-icons/fi";

export default function WhyUs() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const features = [
    {
      title: "Fresh Daily",
      text: "Every dish is prepared fresh in each branch every morning. No reheating, no shortcuts — real food made with care.",
      icon: <IoFlameSharp size={22} />,
    },
    {
      title: "Fast Service",
      text: "Order online and pick up quickly. We have your food ready and waiting so you never have to wait long.",
      icon: <FiClock size={22} />,
    },
    {
      title: "Trusted Quality",
      text: "Trusted across Lagos with over 5,000 happy customers. Our reputation speaks for itself — come taste the difference.",
      icon: <FiUsers size={22} />,
    },
  ];

  return (
    <section
      ref={ref}
      className="py-24 bg-brand-red relative overflow-hidden"
      aria-labelledby="whyus-heading"
    >
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />

      {/* Decorative blobs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-0.5 rounded-full bg-yellow-300" />
            <span className="text-yellow-300 text-sm font-bold uppercase tracking-widest font-sans flex items-center gap-1.5">
              <HiOutlineSparkles size={13} /> Why Choose Us
            </span>
            <div className="w-6 h-0.5 rounded-full bg-yellow-300" />
          </div>
          <h2
            id="whyus-heading"
            className="font-display font-bold text-white text-4xl sm:text-5xl mb-4"
            style={{ letterSpacing: "-0.01em" }}
          >
            Good Food,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #FEF3C7, #D97706)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Great Moments.
            </span>
          </h2>
          <p className="text-white/65 text-lg font-sans leading-relaxed">
            We combine fresh ingredients, speedy service, and a welcoming
            atmosphere to make every meal special.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className="bg-white/10 border border-white/15 backdrop-blur-sm rounded-3xl p-7 group hover:bg-white/15 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/15 group-hover:bg-white/25 flex items-center justify-center text-yellow-300 mb-5 transition-all duration-300">
                {f.icon}
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-3">
                {f.title}
              </h3>
              <p className="text-white/65 text-sm font-sans leading-relaxed">
                {f.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
