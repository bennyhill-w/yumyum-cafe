import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiArrowLeft, FiCheck } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import api from "../services/api";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast.error("Enter your email address");
      return;
    }
    setLoading(true);
    try {
      await api.post("/users/forgot-password", { email });
      setSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-red rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-glow-red">
            <MdStorefront className="text-white" size={28} />
          </div>
          <h1 className="font-display font-bold text-gray-900 text-3xl mb-1">
            Forgot Password?
          </h1>
          <p className="text-gray-400 text-sm font-sans">
            No worries — we will send you a reset link
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <FiCheck className="text-green-500" size={28} />
              </div>
              <h2 className="font-display font-bold text-gray-900 text-xl mb-3">
                Check Your Email
              </h2>
              <p className="text-gray-500 font-sans text-sm leading-relaxed mb-6">
                If <span className="font-bold text-gray-900">{email}</span> is
                registered, you will receive a password reset link shortly.
              </p>
              <p className="text-gray-400 text-xs font-sans">
                Didn't receive it? Check your spam folder or{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-brand-red font-bold hover:underline"
                >
                  try again
                </button>
              </p>
            </motion.div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={15}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="you@email.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                    autoFocus
                  />
                </div>
              </div>

              <motion.button
                onClick={handleSubmit}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full flex items-center justify-center gap-2.5 bg-brand-red text-white font-bold py-4 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans disabled:opacity-70 shadow-glow-red"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  "Send Reset Link"
                )}
              </motion.button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-red text-sm font-semibold font-sans transition-colors"
          >
            <FiArrowLeft size={14} /> Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
