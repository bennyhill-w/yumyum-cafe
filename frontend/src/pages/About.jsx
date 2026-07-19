import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { IoFlameSharp } from "react-icons/io5";
import { AiFillStar } from "react-icons/ai";
import { GiChickenLeg, GiForkKnifeSpoon, GiRiceCooker } from "react-icons/gi";
import { HiOutlineSparkles } from "react-icons/hi";
import { MdOutlineDeliveryDining, MdStorefront } from "react-icons/md";
import { TbChefHat, TbHeart, TbBread, TbIceCream } from "react-icons/tb";
import { FiMapPin, FiClock, FiUsers } from "react-icons/fi";
import CountUpModule from "react-countup";

const CountUp = CountUpModule.default || CountUpModule;

const STATS = [
  {
    end: 4,
    suffix: "+",
    label: "Lagos Branches",
    icon: <MdStorefront size={22} />,
  },
  {
    end: 50,
    suffix: "+",
    label: "Menu Items",
    icon: <GiForkKnifeSpoon size={22} />,
  },
  {
    end: 5000,
    suffix: "+",
    label: "Happy Customers",
    icon: <FiUsers size={22} />,
  },
  {
    end: 6,
    suffix: "+",
    label: "Years Serving Lagos",
    icon: <IoFlameSharp size={22} />,
  },
];

const VALUES = [
  {
    icon: <IoFlameSharp size={26} />,
    title: "Fresh Every Day",
    description:
      "Every dish is prepared fresh in each branch every morning. No reheating, no shortcuts — just real food made with care the way it should be.",
    color: "bg-brand-red-light text-brand-red",
  },
  {
    icon: <TbChefHat size={26} />,
    title: "Crafted With Skill",
    description:
      "Our chefs bring years of culinary experience to every plate. From our signature jollof rice to our perfectly grilled chicken — every dish is crafted with skill.",
    color: "bg-brand-gold-light text-brand-gold",
  },
  {
    icon: <TbHeart size={26} />,
    title: "Made With Love",
    description:
      "Food is personal. We cook every meal the way we would cook for family — with genuine love, care, and attention to detail that you can taste in every bite.",
    color: "bg-pink-50 text-pink-600",
  },
  {
    icon: <GiForkKnifeSpoon size={26} />,
    title: "African & Continental",
    description:
      "Our menu bridges the gap between beloved Nigerian classics and continental favourites — making Yum-Yum Cafe a place for everyone.",
    color: "bg-green-50 text-green-600",
  },
];

const TEAM_IMAGES = [
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80",
];

function AnimatedNumber({ value, suffix, inView, delay = 0 }) {
  if (!inView) return <span>0{suffix}</span>;
  return (
    <>
      <CountUp end={value} duration={2.5} delay={delay} />
      {suffix}
    </>
  );
}

function SectionHeader({ label, title, sub, light = false }) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center max-w-2xl mx-auto mb-16"
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <div
          className={`w-8 h-0.5 rounded-full ${light ? "bg-brand-gold-mid" : "bg-brand-red"}`}
        />
        <span
          className={`text-sm font-bold uppercase tracking-widest font-sans flex items-center gap-1.5 ${light ? "text-brand-gold-mid" : "text-brand-red"}`}
        >
          <HiOutlineSparkles size={13} /> {label}
        </span>
        <div
          className={`w-8 h-0.5 rounded-full ${light ? "bg-brand-gold-mid" : "bg-brand-red"}`}
        />
      </div>
      <h2
        className={`font-display font-extrabold text-4xl sm:text-5xl mb-4 ${light ? "text-white" : "text-gray-900"}`}
        style={{ letterSpacing: "-0.02em" }}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`text-lg leading-relaxed font-sans ${light ? "text-white/65" : "text-gray-500"}`}
        >
          {sub}
        </p>
      )}
    </motion.div>
  );
}

export default function About() {
  const { ref: statsRef, inView: statsInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  const { ref: storyRef, inView: storyInView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <div className="bg-white">
      <SEO
        title="About Us"
        description="Learn about Yum-Yum Cafe — Lagos favourite fast food restaurant serving fresh Continental and African dishes daily since 2018."
        url="/about"
      />
      {/* ── HERO ── */}
      <div className="relative bg-brand-red overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.07), transparent)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <HiOutlineSparkles className="text-brand-gold-mid" size={16} />
                <span className="text-white/70 text-sm font-semibold uppercase tracking-widest font-sans">
                  Our Story
                </span>
              </div>
              <h1
                className="font-display font-extrabold text-white text-5xl sm:text-6xl lg:text-7xl mb-6"
                style={{ letterSpacing: "-0.025em", lineHeight: 1.05 }}
              >
                More Than
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #FEF3C7, #D97706)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Just Food.
                </span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed max-w-lg font-sans mb-8">
                Yum-Yum Cafe was born from a simple belief — that everyone
                deserves fresh, delicious, home-style food in the heart of
                Lagos.
              </p>

              {/* Services chips */}
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { icon: <MdStorefront size={16} />, label: "Restaurant" },
                  { icon: <TbBread size={16} />, label: "Bakery" },
                  { icon: <TbIceCream size={16} />, label: "Ice Cream" },
                  { icon: <TbChefHat size={16} />, label: "Conference Hall" },
                ].map((s) => (
                  <motion.div
                    key={s.label}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-white/10 border border-white/25 px-4 py-2 rounded-full text-white/80 text-xs font-semibold font-sans backdrop-blur-sm hover:bg-white/20 transition-colors"
                  >
                    {s.icon}
                    {s.label}
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/menu">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2.5 bg-white text-brand-red font-bold px-7 py-3.5 rounded-2xl text-sm shadow-lg hover:bg-gray-50 transition-colors font-sans"
                  >
                    <GiForkKnifeSpoon size={17} />
                    View Our Menu
                  </motion.button>
                </Link>
                <Link to="/find-us">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2.5 bg-white/10 border border-white/25 text-white font-bold px-7 py-3.5 rounded-2xl text-sm hover:bg-white/20 transition-colors font-sans backdrop-blur-sm"
                  >
                    <FiMapPin size={16} />
                    Find a Branch
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Image grid */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:grid grid-cols-2 gap-3"
            >
              {TEAM_IMAGES.map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.03, zIndex: 10 }}
                  className={`relative rounded-3xl overflow-hidden shadow-xl ${i === 0 ? "h-52" : i === 1 ? "h-40 mt-8" : i === 2 ? "h-40" : "h-52"}`}
                >
                  <img
                    src={src}
                    alt="Yum-Yum Cafe food"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </motion.div>
              ))}
            </motion.div>
          </div>
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

      {/* ── STATS ── */}
      <section ref={statsRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-red-light flex items-center justify-center text-brand-red mx-auto mb-4 group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                  {stat.icon}
                </div>
                <div
                  className="font-display font-extrabold text-5xl mb-1"
                  style={{
                    background: "linear-gradient(135deg, #B91C1C, #D97706)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  <AnimatedNumber
                    value={stat.end}
                    suffix={stat.suffix}
                    inView={statsInView}
                    delay={i * 0.1}
                  />
                </div>
                <p className="text-gray-500 text-sm font-semibold font-sans">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section ref={storyRef} className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-0.5 bg-brand-red rounded-full" />
                <span className="text-brand-red text-sm font-bold uppercase tracking-widest font-sans">
                  How It Started
                </span>
              </div>
              <h2
                className="font-display font-extrabold text-gray-900 text-4xl sm:text-5xl mb-6"
                style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}
              >
                Born in Lagos,
                <br />
                Built for Lagos.
              </h2>
              <div className="space-y-4 text-gray-500 font-sans text-base leading-relaxed">
                <p>
                  Yum-Yum Cafe started with one branch and one mission: serve
                  Lagos with food that tastes like it came from a loving kitchen
                  — not a factory.
                </p>
                <p>
                  We quickly grew from a single location to four branches across
                  Lagos — Baruwa, Ijegun, Ipaja, and Isheri — each serving the
                  same freshly made Continental and African dishes that made us
                  famous.
                </p>
                <p>
                  Our tagline says it all:{" "}
                  <span className="text-brand-red font-bold">
                    "Delicious. Healthy. Home Made."
                  </span>{" "}
                  That is not marketing speak — it is a promise we keep every
                  single day.
                </p>
              </div>

              <div className="flex items-center gap-5 mt-8">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <AiFillStar
                        key={i}
                        className="text-brand-gold-mid"
                        size={18}
                      />
                    ))}
                  </div>
                  <span className="text-gray-700 font-bold text-sm font-sans">
                    4.8/5
                  </span>
                </div>
                <div className="h-5 w-px bg-gray-200" />
                <span className="text-gray-500 text-sm font-sans">
                  Rated by 5,000+ customers
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
                <img
                  src="/src/assets/branch-baruwa.jpg"
                  alt="Yum-Yum Cafe Baruwa Branch"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
              </div>

              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={storyInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.6, type: "spring" }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-brand-red rounded-2xl flex items-center justify-center">
                    <GiChickenLeg className="text-white" size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm font-sans">
                      Fresh Daily
                    </p>
                    <p className="text-gray-400 text-xs font-sans">
                      Cooked every morning
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Decorative ring */}
              <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full rounded-3xl border-2 border-brand-red/20" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <SectionHeader
            label="Our Values"
            title="What We Stand For"
            sub="Every decision we make at Yum-Yum Cafe comes back to these four core beliefs."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => {
              const { ref, inView } = useInView({
                threshold: 0.2,
                triggerOnce: true,
              });
              return (
                <motion.div
                  key={v.title}
                  ref={ref}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{
                    y: -6,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                  }}
                  className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm transition-all duration-300 group"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${v.color} transition-all duration-300 group-hover:scale-110`}
                  >
                    {v.icon}
                  </div>
                  <h3 className="font-display font-bold text-gray-900 text-xl mb-3 group-hover:text-brand-red transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-sans">
                    {v.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BRANCHES OVERVIEW ── */}
      <section className="py-24 bg-brand-red relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.06), transparent)",
          }}
        />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative">
          <SectionHeader
            label="Find Us"
            title="We Are All Over Lagos"
            sub="Four branches, one promise — the same fresh food, warm service, and great taste at every location."
            light
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {["Baruwa", "Ijegun", "Ipaja", "Isheri"].map((name, i) => {
              const { ref, inView } = useInView({
                threshold: 0.2,
                triggerOnce: true,
              });
              return (
                <motion.div
                  key={name}
                  ref={ref}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-3xl p-6 text-center hover:bg-white/15 transition-all"
                >
                  <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiMapPin className="text-brand-gold-mid" size={22} />
                  </div>
                  <h3 className="font-display font-bold text-white text-xl mb-2">
                    {name}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-300 text-xs font-semibold font-sans">
                      Open Now
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center">
            <Link to="/find-us">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 bg-white text-brand-red font-bold px-10 py-4 rounded-2xl text-sm shadow-lg hover:bg-gray-50 transition-colors font-sans"
              >
                <FiMapPin size={17} />
                View All Branches & Directions
                <FiArrowRight size={16} />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-brand-red-light rounded-3xl flex items-center justify-center mx-auto mb-6">
              <MdOutlineDeliveryDining className="text-brand-red" size={30} />
            </div>
            <h2
              className="font-display font-extrabold text-gray-900 text-4xl sm:text-5xl mb-5"
              style={{ letterSpacing: "-0.02em" }}
            >
              Come Taste the Difference.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-xl mx-auto font-sans">
              Visit any of our four Lagos branches or order online. Fresh food
              is waiting for you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/order">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 bg-brand-red text-white font-bold px-10 py-4 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans shadow-glow-red"
                >
                  <MdOutlineDeliveryDining size={20} />
                  Order Online Now
                  <FiArrowRight size={16} />
                </motion.button>
              </Link>
              <Link to="/menu">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 bg-brand-red-light text-brand-red font-bold px-10 py-4 rounded-2xl text-sm hover:bg-brand-red hover:text-white transition-colors font-sans"
                >
                  <GiForkKnifeSpoon size={17} />
                  Browse the Menu
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
