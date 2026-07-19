import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiCheck,
  FiArrowRight,
  FiX,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { MdStorefront, MdOutlineTableRestaurant } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi";
import { IoFlameSharp } from "react-icons/io5";
import { TbChefHat } from "react-icons/tb";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { useBranches } from "../hooks/useBranches";
import { Link } from "react-router-dom";
import { createReservation } from "../services/reservationService";
import toast from "react-hot-toast";
import SEO from "../components/SEO";

const TIME_SLOTS = [
  "08:00 AM",
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
  "09:00 PM",
  "09:30 PM",
];

const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const OCCASIONS = [
  {
    id: "casual",
    label: "Casual Dining",
    icon: <GiForkKnifeSpoon size={16} />,
  },
  { id: "birthday", label: "Birthday", icon: <IoFlameSharp size={16} /> },
  {
    id: "anniversary",
    label: "Anniversary",
    icon: <HiOutlineSparkles size={16} />,
  },
  { id: "business", label: "Business Lunch", icon: <TbChefHat size={16} /> },
  {
    id: "conference",
    label: "Conference / Meeting",
    icon: <MdOutlineTableRestaurant size={16} />,
  },
  { id: "family", label: "Family Gathering", icon: <FiUsers size={16} /> },
  {
    id: "event",
    label: "Private Event",
    icon: <MdOutlineTableRestaurant size={16} />,
  },
  { id: "other", label: "Other", icon: <MdOutlineTableRestaurant size={16} /> },
];

const INITIAL_FORM = {
  branch: "",
  date: "",
  time: "",
  partySize: "",
  occasion: "",
  name: "",
  phone: "",
  email: "",
  requests: "",
};

function FormField({ label, error, children, required }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
        {label} {required && <span className="text-brand-red">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-500 text-xs mt-1.5 font-sans flex items-center gap-1"
          >
            <FiX size={11} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Reservations() {
  const [form, setForm] = useState(INITIAL_FORM);
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
    if (!form.branch) e.branch = "Please select a branch";
    if (!form.date) e.date = "Please select a date";
    else {
      const selected = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) e.date = "Date cannot be in the past";
    }
    if (!form.time) e.time = "Please select a time";
    if (!form.partySize) e.partySize = "Please select party size";
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[0-9+\s\-()]{10,15}$/.test(form.phone.trim()))
      e.phone = "Enter a valid phone number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
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
      await createReservation({
        branch_id: form.branch,
        customer_name: form.name,
        customer_phone: form.phone,
        customer_email: form.email || null,
        party_size: parseInt(form.partySize),
        date: form.date,
        time: form.time,
        occasion: form.occasion || null,
        special_requests: form.requests || null,
      });
      setSuccess(true);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to submit reservation. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Min date — today
  const today = new Date().toISOString().split("T")[0];

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="max-w-lg w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8"
          >
            <FiCheck className="text-green-500" size={40} />
          </motion.div>
          <h2 className="font-display font-extrabold text-gray-900 text-4xl mb-4">
            Reservation Received!
          </h2>
          <p className="text-gray-500 font-sans text-base leading-relaxed mb-3">
            Thank you,{" "}
            <span className="text-brand-red font-bold">{form.name}</span>! Your
            table at our{" "}
            <span className="text-brand-red font-bold">
              {BRANCHES.find((b) => b.id === form.branch)?.name}
            </span>{" "}
            branch has been requested.
          </p>
          <p className="text-gray-400 font-sans text-sm mb-8">
            We will confirm your reservation via phone shortly. Please arrive 5
            minutes before your booking time.
          </p>

          {/* Booking summary */}
          <div className="bg-brand-red-light rounded-2xl p-5 text-left mb-8 space-y-3">
            {[
              {
                icon: <MdStorefront size={15} />,
                label: "Branch",
                value: BRANCHES.find((b) => b.id === form.branch)?.name,
              },
              {
                icon: <FiCalendar size={15} />,
                label: "Date",
                value: new Date(form.date).toLocaleDateString("en-NG", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              },
              { icon: <FiClock size={15} />, label: "Time", value: form.time },
              {
                icon: <FiUsers size={15} />,
                label: "Party Size",
                value: `${form.partySize} ${parseInt(form.partySize) === 1 ? "person" : "people"}`,
              },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-red rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  {row.icon}
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-sans">
                    {row.label}
                  </span>
                  <p className="text-gray-900 text-sm font-bold font-sans">
                    {row.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 bg-brand-red text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans"
            >
              Back to Home
            </Link>
            <Link
              to="/order"
              className="flex-1 flex items-center justify-center gap-2 bg-brand-red-light text-brand-red font-bold py-3.5 rounded-2xl text-sm hover:bg-brand-red hover:text-white transition-colors font-sans"
            >
              Order Food Too
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
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
                Book a Table
              </span>
            </div>
            <h1
              className="font-display font-extrabold text-white text-5xl sm:text-6xl mb-4"
              style={{ letterSpacing: "-0.025em", lineHeight: 1.05 }}
            >
              Reserve Your
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #FEF3C7, #D97706)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Table Today.
              </span>
            </h1>
            <p className="text-white/65 text-lg max-w-xl font-sans">
              Skip the wait. Book your table online and we will have everything
              ready when you arrive.
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
          {/* ── FORM ── */}
          <div>
            <div className="space-y-8">
              {/* Step 1 — Branch + Date + Time */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 bg-brand-red rounded-2xl flex items-center justify-center">
                    <span className="text-white font-display font-bold text-lg">
                      1
                    </span>
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-gray-900 text-xl">
                      When & Where
                    </h2>
                    <p className="text-gray-400 text-sm font-sans">
                      Choose your branch, date and time
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Branch */}
                  <FormField label="Branch" error={errors.branch} required>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {BRANCHES.map((b) => (
                        <motion.button
                          key={b.id}
                          type="button"
                          onClick={() => set("branch", b.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                            form.branch === b.id
                              ? "border-brand-red bg-brand-red-light"
                              : "border-gray-200 bg-white hover:border-brand-red/40"
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              form.branch === b.id
                                ? "bg-brand-red"
                                : "bg-gray-100"
                            }`}
                          >
                            <MdStorefront
                              className={
                                form.branch === b.id
                                  ? "text-white"
                                  : "text-gray-500"
                              }
                              size={18}
                            />
                          </div>
                          <div className="min-w-0">
                            <p
                              className={`font-bold text-sm font-sans ${form.branch === b.id ? "text-brand-red" : "text-gray-900"}`}
                            >
                              {b.name}
                            </p>
                            <p className="text-gray-400 text-xs font-sans truncate">
                              {b.area}
                            </p>
                          </div>
                          {form.branch === b.id && (
                            <FiCheck
                              className="text-brand-red ml-auto flex-shrink-0"
                              size={16}
                            />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </FormField>

                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Date */}
                    <FormField label="Date" error={errors.date} required>
                      <div className="relative">
                        <FiCalendar
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="date"
                          value={form.date}
                          min={today}
                          onChange={(e) => set("date", e.target.value)}
                          className={`${inputClass("date")} pl-11`}
                        />
                      </div>
                    </FormField>

                    {/* Party size */}
                    <FormField
                      label="Party Size"
                      error={errors.partySize}
                      required
                    >
                      <div className="relative">
                        <FiUsers
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <select
                          value={form.partySize}
                          onChange={(e) => set("partySize", e.target.value)}
                          className={`${inputClass("partySize")} pl-11 appearance-none cursor-pointer`}
                        >
                          <option value="">Select party size</option>
                          {PARTY_SIZES.map((s) => (
                            <option key={s} value={s}>
                              {s} {s === 1 ? "person" : "people"}
                            </option>
                          ))}
                          <option value="10+">More than 10</option>
                        </select>
                      </div>
                    </FormField>
                  </div>

                  {/* Time slots */}
                  <FormField label="Time" error={errors.time} required>
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <motion.button
                          key={slot}
                          type="button"
                          onClick={() => set("time", slot)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`py-2 px-1 rounded-xl text-xs font-bold font-sans transition-all ${
                            form.time === slot
                              ? "bg-brand-red text-white shadow-sm"
                              : "bg-gray-100 text-gray-600 hover:bg-brand-red-light hover:text-brand-red"
                          }`}
                        >
                          {slot}
                        </motion.button>
                      ))}
                    </div>
                  </FormField>
                </div>
              </div>

              {/* Step 2 — Occasion */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 bg-brand-red rounded-2xl flex items-center justify-center">
                    <span className="text-white font-display font-bold text-lg">
                      2
                    </span>
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-gray-900 text-xl">
                      What&apos;s the Occasion?
                    </h2>
                    <p className="text-gray-400 text-sm font-sans">
                      Optional — helps us prepare
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {OCCASIONS.map((occ) => (
                    <motion.button
                      key={occ.id}
                      type="button"
                      onClick={() =>
                        set("occasion", form.occasion === occ.id ? "" : occ.id)
                      }
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-center gap-2.5 p-4 rounded-2xl border-2 text-left transition-all ${
                        form.occasion === occ.id
                          ? "border-brand-red bg-brand-red-light"
                          : "border-gray-200 bg-white hover:border-brand-red/40"
                      }`}
                    >
                      <span
                        className={
                          form.occasion === occ.id
                            ? "text-brand-red"
                            : "text-gray-500"
                        }
                      >
                        {occ.icon}
                      </span>
                      <span
                        className={`text-sm font-bold font-sans ${form.occasion === occ.id ? "text-brand-red" : "text-gray-700"}`}
                      >
                        {occ.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Step 3 — Contact Details */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 bg-brand-red rounded-2xl flex items-center justify-center">
                    <span className="text-white font-display font-bold text-lg">
                      3
                    </span>
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-gray-900 text-xl">
                      Your Details
                    </h2>
                    <p className="text-gray-400 text-sm font-sans">
                      So we can confirm your booking
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <FormField label="Full Name" error={errors.name} required>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="e.g. Adaeze Okonkwo"
                        className={inputClass("name")}
                      />
                    </FormField>
                    <FormField
                      label="Phone Number"
                      error={errors.phone}
                      required
                    >
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
                    </FormField>
                  </div>

                  <FormField
                    label="Email Address (optional)"
                    error={errors.email}
                  >
                    <div className="relative">
                      <FiMail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={15}
                      />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="e.g. you@email.com"
                        className={`${inputClass("email")} pl-11`}
                      />
                    </div>
                  </FormField>

                  <FormField label="Special Requests (optional)">
                    <textarea
                      value={form.requests}
                      onChange={(e) => set("requests", e.target.value)}
                      placeholder="Any dietary requirements, accessibility needs, or special arrangements..."
                      rows={3}
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all resize-none"
                    />
                  </FormField>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                onClick={handleSubmit}
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className="w-full flex items-center justify-center gap-3 bg-brand-red text-white font-bold py-5 rounded-2xl text-base hover:bg-brand-red-dark transition-colors font-sans shadow-glow-red disabled:opacity-70"
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
                    Confirming Reservation...
                  </>
                ) : (
                  <>
                    <MdOutlineTableRestaurant size={22} />
                    Reserve My Table
                    <FiArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-6">
            {/* Booking summary */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-24">
              <h3 className="font-display font-bold text-gray-900 text-xl mb-6">
                Booking Summary
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: <MdStorefront size={16} />,
                    label: "Branch",
                    value: form.branch
                      ? BRANCHES.find((b) => b.id === form.branch)?.name
                      : "Not selected",
                  },
                  {
                    icon: <FiCalendar size={16} />,
                    label: "Date",
                    value: form.date
                      ? new Date(form.date).toLocaleDateString("en-NG", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })
                      : "Not selected",
                  },
                  {
                    icon: <FiClock size={16} />,
                    label: "Time",
                    value: form.time || "Not selected",
                  },
                  {
                    icon: <FiUsers size={16} />,
                    label: "Party",
                    value: form.partySize
                      ? `${form.partySize} ${parseInt(form.partySize) === 1 ? "person" : "people"}`
                      : "Not selected",
                  },
                  {
                    icon: <HiOutlineSparkles size={16} />,
                    label: "Occasion",
                    value: form.occasion
                      ? OCCASIONS.find((o) => o.id === form.occasion)?.label
                      : "Not specified",
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        row.value !== "Not selected" &&
                        row.value !== "Not specified"
                          ? "bg-brand-red text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {row.icon}
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-sans">
                        {row.label}
                      </p>
                      <p
                        className={`text-sm font-bold font-sans ${
                          row.value !== "Not selected" &&
                          row.value !== "Not specified"
                            ? "text-gray-900"
                            : "text-gray-300"
                        }`}
                      >
                        {row.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info cards */}
            <div className="bg-brand-red rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-hero-pattern opacity-20" />
              <div className="relative space-y-4">
                <h4 className="font-display font-bold text-white text-lg">
                  Good to Know
                </h4>
                {[
                  "Reservations are confirmed by phone call within 30 minutes",
                  "Please arrive 5 minutes before your booking time",
                  "Tables are held for 15 minutes after booking time",
                  "For groups larger than 10, please call us directly",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold font-sans">
                        {i + 1}
                      </span>
                    </div>
                    <p className="text-white/75 text-sm font-sans leading-relaxed">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conference Hall card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-brand-gold-light rounded-2xl flex items-center justify-center">
                  <TbChefHat className="text-brand-gold" size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-900 text-lg">
                    Conference & Meeting Hall
                  </h4>
                  <p className="text-gray-400 text-xs font-sans">
                    Available for bookings
                  </p>
                </div>
              </div>

              <p className="text-gray-500 text-sm font-sans mb-4 leading-relaxed">
                Yum-Yum Cafe offers a fully equipped conference and meeting hall
                — perfect for business meetings, training sessions, and private
                events.
              </p>

              <div className="space-y-2 mb-5">
                {[
                  "Seats up to 30 people",
                  "Catering available on request",
                  "AV equipment available",
                  "Call to check availability",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FiCheck
                      className="text-brand-red flex-shrink-0"
                      size={14}
                    />
                    <span className="text-gray-600 text-xs font-sans">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href="tel:+2340000000001"
                className="mt-5 flex items-center justify-center gap-2 bg-brand-red text-white font-bold py-3 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans"
              >
                <FiPhone size={16} />
                Call to Book Hall
              </a>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h4 className="font-display font-bold text-gray-900 text-lg mb-4">
                Prefer to Call?
              </h4>
              <p className="text-gray-500 text-sm font-sans mb-5">
                You can also reserve your table by calling any of our branches
                directly.
              </p>
              <div className="space-y-3">
                {BRANCHES.map((b) => (
                  <a
                    key={b.id}
                    href={`tel:${b.phone}`}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-brand-red-light transition-colors group"
                  >
                    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                      <FiPhone className="text-brand-red" size={15} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm font-sans group-hover:text-brand-red transition-colors">
                        {b.name}
                      </p>
                      <p className="text-gray-400 text-xs font-sans">
                        {b.phone}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
