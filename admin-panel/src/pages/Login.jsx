import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { login } from "../services/authService";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const res = await login(email, password);
      setAuth(res.data.data.admin, res.data.data.token);
      toast.success(`Welcome back, ${res.data.data.admin.name}!`);
      navigate("/orders");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (key) =>
    `w-full pl-11 pr-4 py-3.5 rounded-2xl border text-sm font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all ${
      errors[key] ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-red rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-glow-red">
            <MdStorefront className="text-white" size={30} />
          </div>
          <h1 className="font-display font-extrabold text-gray-900 text-3xl mb-1">
            Admin Panel
          </h1>
          <p className="text-gray-400 text-sm font-sans">
            Yum-Yum Cafe Management
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h2 className="font-display font-bold text-gray-900 text-xl mb-6">
            Sign in to continue
          </h2>

          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 text-sm font-sans px-4 py-3 rounded-2xl mb-5"
            >
              {errors.general}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((v) => ({ ...v, email: "" }));
                  }}
                  placeholder="admin@yumyum-cafe.com.ng"
                  className={inputClass("email")}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 font-sans">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={15}
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((v) => ({ ...v, password: "" }));
                  }}
                  placeholder="••••••••"
                  className={`${inputClass("password")} pr-11`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 font-sans">
                  {errors.password}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-2.5 bg-brand-red text-white font-bold py-4 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans disabled:opacity-70 shadow-glow-red"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-gray-400 text-xs font-sans mt-6">
          Yum-Yum Cafe © {new Date().getFullYear()} — Admin Access Only
        </p>
      </motion.div>
    </div>
  );
}
