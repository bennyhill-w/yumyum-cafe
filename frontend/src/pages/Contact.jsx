import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiCheck,
  FiX,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi";
import { IoFlameSharp } from "react-icons/io5";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useBranches } from "../hooks/useBranches";
import { Link } from "react-router-dom";
import { sendContact } from "../services/contactService";
import toast from "react-hot-toast";
import SEO from "../components/SEO";

const SUBJECTS = [
  { id: "general", label: "General Inquiry" },
  { id: "order", label: "Order Issue" },
  { id: "feedback", label: "Feedback" },
  { id: "reservation", label: "Reservation" },
  { id: "partnership", label: "Partnership" },
  { id: "other", label: "Other" },
];

const FAQS = [
  {
    q: "What are your opening hours?",
    a: "All four Yum-Yum Cafe branches are open daily from 8:00 AM to 10:00 PM, including weekends and public holidays.",
  },
  {
    q: "Can I order online and pay on pickup?",
    a: "Yes! You can place your order online, choose your branch, and pay when you come to collect. We also offer online payment via Paystack.",
  },
  {
    q: "Do you cater for large groups or events?",
    a: "Absolutely. For group bookings or event catering, please contact us directly via phone or email and we will work out the best arrangement for you.",
  },
  {
    q: "Is the food freshly made every day?",
    a: "Yes — every dish is prepared fresh in each branch every morning. We do not reheat or serve day-old food.",
  },
  {
    q: "How do I make a table reservation?",
    a: "Visit our Reservations page to book a table online, or call any branch directly. We confirm reservations by phone within 30 minutes.",
  },
];

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold text-gray-900 text-sm font-sans leading-snug pr-4">
          {item.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
            open ? "bg-brand-red text-white" : "bg-gray-100 text-gray-500"
          }`}
        >
          <FiArrowRight size={14} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0">
              <div className="h-px bg-gray-100 mb-4" />
              <p className="text-gray-500 text-sm font-sans leading-relaxed">
                {item.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const { branches: BRANCHES } = useBranches();

  const inputClass = (key) =>
    `w-full px-4 py-3.5 rounded-2xl border text-sm font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all ${
      errors[key] ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
    }`;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.subject) e.subject = "Please select a subject";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 20)
      e.message = "Message must be at least 20 characters";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setSubmitting(true);
    try {
      await sendContact({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        subject: form.subject,
        message: form.message,
      });
      setSuccess(true);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to send message. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <SEO
        title="Contact Us"
        description="Get in touch with Yum-Yum Cafe Lagos. Call, email or visit any of our 4 branches. We'd love to hear from you."
        url="/contact"
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
                Get In Touch
              </span>
            </div>
            <h1
              className="font-display font-extrabold text-white text-5xl sm:text-6xl mb-4"
              style={{ letterSpacing: "-0.025em", lineHeight: 1.05 }}
            >
              We Would Love
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #FEF3C7, #D97706)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                To Hear From You.
              </span>
            </h1>
            <p className="text-white/65 text-lg max-w-xl font-sans">
              Questions, feedback, partnerships — we are always happy to hear
              from you. Reach out any time.
            </p>
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

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-14">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12">
          {/* ── LEFT — Form + FAQ ── */}
          <div className="space-y-10">
            {/* Contact form */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 sm:p-8">
              <h2 className="font-display font-extrabold text-gray-900 text-2xl mb-2">
                Send Us a Message
              </h2>
              <p className="text-gray-400 text-sm font-sans mb-8">
                We typically respond within 24 hours.
              </p>

              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-10 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        delay: 0.1,
                      }}
                      className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6"
                    >
                      <FiCheck className="text-green-500" size={34} />
                    </motion.div>
                    <h3 className="font-display font-bold text-gray-900 text-2xl mb-3">
                      Message Sent!
                    </h3>
                    <p className="text-gray-500 font-sans text-base max-w-sm leading-relaxed mb-8">
                      Thank you,{" "}
                      <span className="text-brand-red font-bold">
                        {form.name}
                      </span>
                      ! We have received your message and will get back to you
                      at{" "}
                      <span className="text-brand-red font-bold">
                        {form.email}
                      </span>{" "}
                      within 24 hours.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setSuccess(false);
                        setForm({
                          name: "",
                          email: "",
                          phone: "",
                          subject: "",
                          message: "",
                        });
                      }}
                      className="inline-flex items-center gap-2 bg-brand-red-light text-brand-red font-bold px-7 py-3 rounded-2xl text-sm hover:bg-brand-red hover:text-white transition-colors font-sans"
                    >
                      Send Another Message
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="space-y-5">
                      {/* Name + Email */}
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                            Full Name <span className="text-brand-red">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => set("name", e.target.value)}
                            placeholder="e.g. Chidi Okonkwo"
                            className={inputClass("name")}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-xs mt-1.5 font-sans flex items-center gap-1">
                              <FiX size={11} /> {errors.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                            Email Address{" "}
                            <span className="text-brand-red">*</span>
                          </label>
                          <div className="relative">
                            <FiMail
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                              size={15}
                            />
                            <input
                              type="email"
                              value={form.email}
                              onChange={(e) => set("email", e.target.value)}
                              placeholder="you@email.com"
                              className={`${inputClass("email")} pl-11`}
                            />
                          </div>
                          {errors.email && (
                            <p className="text-red-500 text-xs mt-1.5 font-sans flex items-center gap-1">
                              <FiX size={11} /> {errors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Phone + Subject */}
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                            Phone Number (optional)
                          </label>
                          <div className="relative">
                            <FiPhone
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                              size={15}
                            />
                            <input
                              type="tel"
                              value={form.phone}
                              onChange={(e) => set("phone", e.target.value)}
                              placeholder="e.g. 08012345678"
                              className={`${inputClass("phone")} pl-11`}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                            Subject <span className="text-brand-red">*</span>
                          </label>
                          <select
                            value={form.subject}
                            onChange={(e) => set("subject", e.target.value)}
                            className={`${inputClass("subject")} appearance-none cursor-pointer`}
                          >
                            <option value="">Select a subject</option>
                            {SUBJECTS.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                          {errors.subject && (
                            <p className="text-red-500 text-xs mt-1.5 font-sans flex items-center gap-1">
                              <FiX size={11} /> {errors.subject}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                          Message <span className="text-brand-red">*</span>
                        </label>
                        <textarea
                          value={form.message}
                          onChange={(e) => set("message", e.target.value)}
                          placeholder="Tell us how we can help you..."
                          rows={5}
                          className={`${inputClass("message")} resize-none`}
                        />
                        <div className="flex items-center justify-between mt-1.5">
                          {errors.message ? (
                            <p className="text-red-500 text-xs font-sans flex items-center gap-1">
                              <FiX size={11} /> {errors.message}
                            </p>
                          ) : (
                            <span />
                          )}
                          <span
                            className={`text-xs font-sans ${form.message.length > 500 ? "text-red-400" : "text-gray-400"}`}
                          >
                            {form.message.length}/500
                          </span>
                        </div>
                      </div>

                      {/* Submit */}
                      <motion.button
                        onClick={handleSubmit}
                        disabled={submitting}
                        whileHover={{ scale: submitting ? 1 : 1.02 }}
                        whileTap={{ scale: submitting ? 1 : 0.98 }}
                        className="w-full flex items-center justify-center gap-3 bg-brand-red text-white font-bold py-4 rounded-2xl text-base hover:bg-brand-red-dark transition-colors font-sans shadow-glow-red disabled:opacity-70"
                      >
                        {submitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <FiSend size={18} />
                            Send Message
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-0.5 bg-brand-red rounded-full" />
                <span className="text-brand-red text-sm font-bold uppercase tracking-widest font-sans flex items-center gap-1.5">
                  <HiOutlineSparkles size={13} /> FAQs
                </span>
              </div>
              <h2
                className="font-display font-extrabold text-gray-900 text-3xl sm:text-4xl mb-8"
                style={{ letterSpacing: "-0.02em" }}
              >
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {FAQS.map((item, i) => (
                  <FAQItem key={i} item={item} index={i} />
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT — Contact info ── */}
          <div className="space-y-5">
            {/* Contact cards */}
            {[
              {
                icon: <FiMail size={22} />,
                title: "Email Us",
                value: "info@yumyum-cafe.com.ng",
                sub: "We reply within 24 hours",
                href: "mailto:info@yumyum-cafe.com.ng",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: <FaWhatsapp size={22} />,
                title: "WhatsApp",
                value: "Chat with us",
                sub: "Quick responses on WhatsApp",
                href: "https://wa.me/2340000000001",
                color: "bg-green-50 text-green-600",
              },
              {
                icon: <FiClock size={22} />,
                title: "Opening Hours",
                value: "8:00 AM – 10:00 PM",
                sub: "Open every day including weekends",
                href: null,
                color: "bg-brand-gold-light text-brand-gold",
              },
            ].map((card, i) => {
              const { ref, inView } = useInView({
                threshold: 0.2,
                triggerOnce: true,
              });
              return (
                <motion.div
                  key={card.title}
                  ref={ref}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  {card.href ? (
                    <a
                      key={card.title}
                      href={card.href}
                      target={
                        card.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-brand-red/20 transition-all group"
                    >
                      <div
                        className={`w-13 h-13 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${card.color} group-hover:scale-110 transition-transform`}
                      >
                        {card.icon}
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs font-sans mb-0.5">
                          {card.title}
                        </p>
                        <p className="font-bold text-gray-900 text-sm font-sans group-hover:text-brand-red transition-colors">
                          {card.value}
                        </p>
                        <p className="text-gray-400 text-xs font-sans">
                          {card.sub}
                        </p>
                      </div>
                      <FiArrowRight
                        className="text-gray-300 group-hover:text-brand-red ml-auto transition-colors"
                        size={18}
                      />
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${card.color}`}
                      >
                        {card.icon}
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs font-sans mb-0.5">
                          {card.title}
                        </p>
                        <p className="font-bold text-gray-900 text-sm font-sans">
                          {card.value}
                        </p>
                        <p className="text-gray-400 text-xs font-sans">
                          {card.sub}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Social */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <h4 className="font-display font-bold text-gray-900 text-lg mb-5">
                Follow Us
              </h4>
              <div className="flex flex-col gap-3">
                {[
                  {
                    icon: <FaFacebook size={20} />,
                    label: "Facebook",
                    handle: "@Yumyumcafeng",
                    href: "https://web.facebook.com/Yumyumcafeng",
                    color: "bg-blue-50 text-blue-600",
                  },
                  {
                    icon: <FaInstagram size={20} />,
                    label: "Instagram",
                    handle: "@yyc_ng",
                    href: "https://instagram.com/yyc_ng",
                    color: "bg-pink-50 text-pink-600",
                  },
                  {
                    icon: <FaWhatsapp size={20} />,
                    label: "WhatsApp",
                    handle: "Chat with us",
                    href: "https://wa.me/2340000000001",
                    color: "bg-green-50 text-green-600",
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-brand-red-light transition-colors group"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}
                    >
                      {s.icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm font-sans group-hover:text-brand-red transition-colors">
                        {s.label}
                      </p>
                      <p className="text-gray-400 text-xs font-sans">
                        {s.handle}
                      </p>
                    </div>
                    <FiArrowRight
                      className="text-gray-300 group-hover:text-brand-red ml-auto transition-colors"
                      size={15}
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Branches quick list */}
            <div className="bg-brand-red rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-hero-pattern opacity-20" />
              <div className="relative">
                <h4 className="font-display font-bold text-white text-lg mb-5">
                  Our Branches
                </h4>
                <div className="space-y-4">
                  {BRANCHES.map((b) => (
                    <div key={b.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FiMapPin className="text-brand-gold-mid" size={14} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm font-sans">
                          {b.name}
                        </p>
                        <p className="text-white/60 text-xs font-sans leading-relaxed">
                          {b.address}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/find-us"
                  className="mt-6 flex items-center gap-2 text-brand-gold-mid text-sm font-bold font-sans hover:gap-3 transition-all"
                >
                  View on map <FiArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
