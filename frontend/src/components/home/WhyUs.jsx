import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { HiOutlineSparkles } from "react-icons/hi";
import { GiCheckMark } from "react-icons/gi";

export default function WhyUs() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const features = [
    {
      title: "Fresh Daily",
      text: "Ingredients sourced and prepared every morning.",
      icon: <GiCheckMark size={18} />,
    },
    {
      title: "Fast Service",
      text: "Order online and pick up quickly or get speedy delivery.",
      icon: <GiCheckMark size={18} />,
    },
    {
      title: "Trusted Quality",
      text: "Trusted across Lagos with 5,000+ happy customers.",
      icon: <GiCheckMark size={18} />,
    },
  ];

  return (
    <section
      ref={ref}
      className="py-24 bg-gray-50"
      aria-labelledby="whyus-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-1 bg-brand-red rounded-full" />
            <span className="text-brand-red text-sm font-bold uppercase tracking-widest font-sans flex items-center gap-1.5">
              <HiOutlineSparkles size={13} /> Why Choose Us
            </span>
          </div>
          <h2
            id="whyus-heading"
            className="font-display font-bold text-gray-900 text-4xl sm:text-5xl"
            style={{ letterSpacing: "-0.01em" }}
          >
            Good Food, Great Moments
          </h2>
          <p className="text-gray-400 text-base font-sans mt-2 max-w-sm">
            We combine fresh ingredients, speedy service, and a welcoming
            atmosphere to make every meal special.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-red-light text-brand-red flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-display font-bold text-gray-900 text-lg mb-2">
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
