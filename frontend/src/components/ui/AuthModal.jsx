import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi";
import { register, login } from "../../services/userService";
import useUserStore from "../../store/userStore";
import toast from "react-hot-toast";

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }) {
  const [tab, setTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const { setAuth } = useUserStore();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const setL = (k, v) => {
    setLoginForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const setR = (k, v) => {
    setRegisterForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validateLogin = () => {
    const e = {};
    if (!loginForm.email.trim()) e.email = "Email is required";
    if (!loginForm.password) e.password = "Password is required";
    return e;
  };

  const validateRegister = () => {
    const e = {};
    if (!registerForm.name.trim()) e.name = "Full name is required";
    if (!registerForm.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email))
      e.email = "Enter a valid email";
    if (!registerForm.password) e.password = "Password is required";
    else if (registerForm.password.length < 6)
      e.password = "At least 6 characters";
    if (registerForm.password !== registerForm.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleLogin = async () => {
    const e = validateLogin();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setLoading(true);
    try {
      const res = await login(loginForm);
      setAuth(res.data.data.user, res.data.data.token);
      toast.success(`Welcome back, ${res.data.data.user.name}!`);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const e = validateRegister();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setLoading(true);
    try {
      const res = await register({
        name: registerForm.name,
        email: registerForm.email,
        phone: registerForm.phone || undefined,
        password: registerForm.password,
      });
      setAuth(res.data.data.user, res.data.data.token);
      toast.success(`Welcome to Yum-Yum Cafe, ${res.data.data.user.name}!`);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-red relative overflow-hidden px-7 pt-8 pb-6">
              <div className="absolute inset-0 bg-hero-pattern opacity-20" />
              <div className="relative flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                      <MdStorefront className="text-white" size={16} />
                    </div>
                    <span className="text-white/70 text-xs font-semibold font-sans uppercase tracking-widest">
                      Yum-Yum Cafe
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-white text-3xl">
                    {tab === "login" ? "Welcome Back!" : "Create Account"}
                  </h2>
                  <p className="text-white/65 text-sm font-sans mt-1">
                    {tab === "login"
                      ? "Sign in to access your orders and profile"
                      : "Join us and enjoy a better ordering experience"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors flex-shrink-0"
                >
                  <FiX size={16} />
                </button>
              </div>

              {/* Tab switcher */}
              <div className="flex gap-1 mt-5 bg-white/15 rounded-2xl p-1">
                {["login", "register"].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTab(t);
                      setErrors({});
                    }}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold font-sans transition-all ${
                      tab === t
                        ? "bg-white text-brand-red shadow-sm"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {t === "login" ? "Sign In" : "Register"}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="px-7 py-6">
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 text-sm font-sans px-4 py-3 rounded-2xl mb-5"
                >
                  {errors.general}
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {tab === "login" ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Email */}
                    <div>
                      <div className="relative">
                        <FiMail
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={15}
                        />
                        <input
                          type="email"
                          value={loginForm.email}
                          onChange={(e) => setL("email", e.target.value)}
                          placeholder="Email address"
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
                      <div className="relative">
                        <FiLock
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={15}
                        />
                        <input
                          type={showPass ? "text" : "password"}
                          value={loginForm.password}
                          onChange={(e) => setL("password", e.target.value)}
                          placeholder="Password"
                          className={`${inputClass("password")} pr-11`}
                          autoComplete="current-password"
                          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass((v) => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPass ? (
                            <FiEyeOff size={15} />
                          ) : (
                            <FiEye size={15} />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1.5 font-sans">
                          {errors.password}
                        </p>
                      )}
                      <div className="mt-2 text-right">
                        <a
                          href="/forgot-password"
                          className="text-sm font-semibold text-brand-red hover:text-brand-red-dark"
                        >
                          Forgot password?
                        </a>
                      </div>
                    </div>

                    <motion.button
                      onClick={handleLogin}
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="w-full flex items-center justify-center gap-2.5 bg-brand-red text-white font-bold py-4 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans shadow-glow-red disabled:opacity-70"
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
                          Sign In <FiArrowRight size={16} />
                        </>
                      )}
                    </motion.button>

                    <p className="text-center text-gray-400 text-sm font-sans">
                      No account?{" "}
                      <button
                        onClick={() => {
                          setTab("register");
                          setErrors({});
                        }}
                        className="text-brand-red font-bold hover:underline"
                      >
                        Create one
                      </button>
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Name */}
                    <div>
                      <div className="relative">
                        <FiUser
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={15}
                        />
                        <input
                          type="text"
                          value={registerForm.name}
                          onChange={(e) => setR("name", e.target.value)}
                          placeholder="Full name"
                          className={inputClass("name")}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1.5 font-sans">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <div className="relative">
                        <FiMail
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={15}
                        />
                        <input
                          type="email"
                          value={registerForm.email}
                          onChange={(e) => setR("email", e.target.value)}
                          placeholder="Email address"
                          className={inputClass("email")}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1.5 font-sans">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="relative">
                      <FiPhone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={15}
                      />
                      <input
                        type="tel"
                        value={registerForm.phone}
                        onChange={(e) => setR("phone", e.target.value)}
                        placeholder="Phone number (optional)"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <div className="relative">
                        <FiLock
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={15}
                        />
                        <input
                          type={showPass ? "text" : "password"}
                          value={registerForm.password}
                          onChange={(e) => setR("password", e.target.value)}
                          placeholder="Password (min. 6 characters)"
                          className={`${inputClass("password")} pr-11`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass((v) => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPass ? (
                            <FiEyeOff size={15} />
                          ) : (
                            <FiEye size={15} />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1.5 font-sans">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Confirm password */}
                    <div>
                      <div className="relative">
                        <FiCheck
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={15}
                        />
                        <input
                          type={showPass ? "text" : "password"}
                          value={registerForm.confirmPassword}
                          onChange={(e) =>
                            setR("confirmPassword", e.target.value)
                          }
                          placeholder="Confirm password"
                          className={inputClass("confirmPassword")}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleRegister()
                          }
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1.5 font-sans">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <motion.button
                      onClick={handleRegister}
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="w-full flex items-center justify-center gap-2.5 bg-brand-red text-white font-bold py-4 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans shadow-glow-red disabled:opacity-70"
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
                          Create Account <FiArrowRight size={16} />
                        </>
                      )}
                    </motion.button>

                    <p className="text-center text-gray-400 text-sm font-sans">
                      Already have an account?{" "}
                      <button
                        onClick={() => {
                          setTab("login");
                          setErrors({});
                        }}
                        className="text-brand-red font-bold hover:underline"
                      >
                        Sign in
                      </button>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
