import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiArrowRight } from "react-icons/fi";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { GiForkKnifeSpoon } from "react-icons/gi";
import SEO from "../components/SEO";
import HeroSection from "../components/home/HeroSection";
import MarqueeStrip from "../components/home/MarqueeStrip";
import FeaturedDishes from "../components/home/FeaturedDishes";
import WhyUs from "../components/home/WhyUs";
import BranchStrip from "../components/home/BranchStrip";
import Testimonials from "../components/home/Testimonials";
import SectionDivider from "../components/ui/SectionDivider";

function StatsBar() {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  const targets = [4, 50, 5000, 6];
  const labels = [
    "Lagos Branches",
    "Menu Items",
    "Happy Customers",
    "Years in Lagos",
  ];
  const suffixes = ["+", "+", "+", "+"];

  useEffect(() => {
    if (!inView) return;
    targets.forEach((target, i) => {
      const duration = 2000;
      const step = 16;
      const increment = target / (duration / step);
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCounts((prev) => {
            const n = [...prev];
            n[i] = target;
            return n;
          });
          clearInterval(timer);
        } else {
          setCounts((prev) => {
            const n = [...prev];
            n[i] = Math.floor(current);
            return n;
          });
        }
      }, step);
    });
  }, [inView]);

  return (
    <section ref={ref} className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {targets.map((_, i) => (
            <motion.div
              key={labels[i]}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div
                className="font-display font-bold mb-1.5"
                style={{
                  fontSize: "clamp(36px, 5vw, 56px)",
                  background:
                    "linear-gradient(135deg, #FEF3C7 0%, #FCD34D 40%, #D97706 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {counts[i].toLocaleString()}
                {suffixes[i]}
              </div>
              <p className="text-gray-400 text-sm font-sans font-semibold">
                {labels[i]}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Yum-Yum Cafe",
  description:
    "Quick service restaurant offering fresh Continental & African dishes, bakery, ice cream and conference hall across 4 Lagos locations.",
  url: "https://yumyum-cafe.com.ng",
  telephone: "+2349165661589",
  servesCuisine: ["Nigerian", "Continental", "African"],
  priceRange: "₦₦",
  openingHours: "Mo-Su 08:00-22:00",
  hasMap: "https://maps.google.com/?q=Yum-Yum+Cafe+Lagos",
  location: [
    {
      "@type": "Place",
      name: "Baruwa Branch",
      address: {
        "@type": "PostalAddress",
        streetAddress: "67B Aina Obembe Street Off Oluwaga Road",
        addressLocality: "Baruwa",
        addressRegion: "Lagos",
        addressCountry: "NG",
      },
    },
    {
      "@type": "Place",
      name: "Ijegun Branch",
      address: {
        "@type": "PostalAddress",
        streetAddress: "136 Isheri Oshun Rd, Isolo Rd",
        addressLocality: "Ijegun",
        addressRegion: "Lagos",
        addressCountry: "NG",
      },
    },
    {
      "@type": "Place",
      name: "Idimu Branch",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Adjacent Idimu Central Mosque",
        addressLocality: "Idimu",
        addressRegion: "Lagos",
        addressCountry: "NG",
      },
    },
    {
      "@type": "Place",
      name: "Abulegba Branch",
      address: {
        "@type": "PostalAddress",
        streetAddress: "378 Lagos-Abeokuta Expy",
        addressLocality: "Abule Egba",
        addressRegion: "Lagos",
        addressCountry: "NG",
      },
    },
  ],
};

function OrderCTA() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section ref={ref} className="py-20 bg-brand-red relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern opacity-10" />

      {/* Decorative circles */}
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5 pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white/5 pointer-events-none"
      />

      <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-16 h-16 bg-white/15 rounded-3xl flex items-center justify-center mx-auto mb-6"
          >
            <MdOutlineDeliveryDining className="text-white" size={32} />
          </motion.div>

          <h2
            className="font-display font-bold text-white text-4xl sm:text-5xl lg:text-6xl mb-5"
            style={{ letterSpacing: "-0.01em" }}
          >
            Hungry Right Now?
          </h2>
          <p className="text-white/75 text-lg font-sans mb-10 max-w-xl mx-auto leading-relaxed">
            Pick your nearest branch, browse the menu, and place your order
            online. We will have it fresh and ready when you arrive.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/order">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 bg-white text-brand-red font-bold px-10 py-4 rounded-2xl text-base shadow-xl hover:bg-gray-50 transition-all font-sans"
              >
                <MdOutlineDeliveryDining size={20} />
                Order Online Now
                <FiArrowRight size={16} />
              </motion.button>
            </Link>
            <Link to="/menu">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 bg-white/15 border border-white/25 text-white font-bold px-10 py-4 rounded-2xl text-base hover:bg-white/25 transition-all font-sans"
              >
                <GiForkKnifeSpoon size={18} />
                View Full Menu
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <SEO
        title="Order Fresh Food Online"
        description="Lagos favourite fast food restaurant. Fresh Continental & African dishes, bakery, ice cream across 4 locations — Baruwa, Ijegun, Idimu, Abulegba."
        url="/"
        structuredData={restaurantSchema}
      />
      <HeroSection />
      <MarqueeStrip />
      <StatsBar />
      <SectionDivider color="#ffffff" opacity={1} variant="wave" />
      <FeaturedDishes />
      <SectionDivider color="#B91C1C" opacity={1} variant="curve" />
      <WhyUs />
      <SectionDivider color="#111827" opacity={1} variant="tilt" />
      <BranchStrip />
      <SectionDivider color="#ffffff" opacity={1} variant="wave" flip={true} />
      <Testimonials />
      <SectionDivider color="#B91C1C" opacity={1} variant="curve" />
      <OrderCTA />
    </>
  );
}
