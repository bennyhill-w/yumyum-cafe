import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLock, FiEye, FiEyeOff, FiCheck, FiArrowLeft } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import api from "../services/api";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-gray-500 font-sans mb-4">Invalid reset link.</p>
          <Link
            to="/"
            className="text-brand-red font-bold font-sans hover:underline"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!form.password) {
      toast.error("Enter a new password");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post("/users/reset-password", {
        token,
        password: form.password,
      });
      setDone(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Reset failed. Link may have expired.",
      );
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
          <div className="w-16 h-16 bg-brand-red rounded-3xl flex items-center justify-center mx-auto mb-4">
            <MdStorefront className="text-white" size={28} />
          </div>
          <h1 className="font-display font-bold text-gray-900 text-3xl mb-1">
            {done ? "Password Reset!" : "Set New Password"}
          </h1>
          <p className="text-gray-400 text-sm font-sans">
            {done
              ? "Redirecting you to the homepage..."
              : "Choose a strong password for your account"}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          {done ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <FiCheck className="text-green-500" size={28} />
              </div>
              <p className="text-gray-500 font-sans">
                Your password has been reset. You can now sign in.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                  New Password
                </label>
                <div className="relative">
                  <FiLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={15}
                  />
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    placeholder="Min. 6 characters"
                    className="w-full pl-11 pr-11 py-3.5 rounded-2xl border border-gray-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-red transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={15}
                  />
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.confirm}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, confirm: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Repeat your password"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-red transition-all"
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
                  <>
                    <FiCheck size={16} /> Reset Password
                  </>
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
