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
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi";
import {
  register,
  login,
  googleAuth,
  sendOTP,
  verifyOTP,
} from "../../services/userService";
import { GoogleLogin } from "@react-oauth/google";
import useUserStore from "../../store/userStore";
import toast from "react-hot-toast";

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }) {
  const [tab, setTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOTP, setShowOTP] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [pendingEmail, setPendingEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
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
      // Account created — store auth but show OTP screen before closing
      setAuth(res.data.data.user, res.data.data.token);
      setPendingEmail(registerForm.email);
      setShowOTP(true);
      startCooldown();
      toast.success(
        "Account created! Check your email for the verification code.",
      );
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  // Start resend cooldown timer
  const startCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((v) => {
        if (v <= 1) {
          clearInterval(interval);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  };

  // Handle OTP input — auto-advance to next box
  const handleOTPInput = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpCode];
    newOtp[index] = value.slice(-1);
    setOtpCode(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Handle backspace in OTP — go back to previous box
  const handleOTPKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
    if (e.key === "Enter") handleVerifyOTP();
  };

  const handleVerifyOTP = async () => {
    const code = otpCode.join("");
    if (code.length !== 6) {
      toast.error("Enter the full 6-digit code");
      return;
    }
    setOtpLoading(true);
    try {
      const res = await verifyOTP(pendingEmail, code);
      setAuth(res.data.data.user, res.data.data.token);
      toast.success("Email verified! Welcome to Yum-Yum Cafe 🎉");
      setShowOTP(false);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Incorrect code. Try again.");
      // Shake the OTP inputs to signal error
      setOtpCode(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    try {
      await sendOTP(pendingEmail);
      toast.success("New code sent to your email!");
      setOtpCode(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
      startCooldown();
    } catch (err) {
      toast.error("Failed to resend code. Try again.");
    }
  };

  const handleGoogleAuth = async (credential) => {
    setGoogleLoading(true);
    try {
      const res = await googleAuth(credential);
      setAuth(res.data.data.user, res.data.data.token);
      toast.success(
        res.data.isNewUser
          ? `Welcome to Yum-Yum Cafe, ${res.data.data.user.name}!`
          : `Welcome back, ${res.data.data.user.name}!`,
      );
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Google sign-in failed. Try again.",
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const GoogleDivider = () => (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider">
          or continue with
        </span>
      </div>
    </div>
  );

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
                    {showOTP
                      ? "Verify Your Email"
                      : tab === "login"
                        ? "Welcome Back!"
                        : "Create Account"}
                  </h2>
                  <p className="text-white/65 text-sm font-sans mt-1">
                    {showOTP
                      ? `Enter the 6-digit code sent to ${pendingEmail}`
                      : tab === "login"
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

              {/* Tab switcher — hidden during OTP verification */}
              {!showOTP && (
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
              )}
            </div>

            {/* Form */}
            <div className="px-7 py-6 max-h-[60vh] overflow-y-auto">
              {/* ── OTP VERIFICATION SCREEN ── */}
              {showOTP ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Email icon */}
                  <div className="flex flex-col items-center py-2">
                    <div className="w-16 h-16 bg-brand-red-light rounded-3xl flex items-center justify-center mb-3">
                      <FiShield className="text-brand-red" size={28} />
                    </div>
                    <p className="text-gray-500 text-sm font-sans text-center max-w-xs leading-relaxed">
                      We sent a 6-digit code to{" "}
                      <span className="font-bold text-gray-900">
                        {pendingEmail}
                      </span>
                      . Enter it below to verify your account.
                    </p>
                  </div>

                  {/* 6-digit OTP input */}
                  <div className="flex justify-center gap-2.5">
                    {otpCode.map((digit, index) => (
                      <motion.input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPInput(index, e.target.value)}
                        onKeyDown={(e) => handleOTPKeyDown(index, e)}
                        onFocus={(e) => e.target.select()}
                        whileFocus={{ scale: 1.05 }}
                        className={`w-12 h-14 text-center text-xl font-bold rounded-2xl border-2 font-sans transition-all focus:outline-none focus:ring-2 focus:ring-brand-red ${
                          digit
                            ? "border-brand-red bg-brand-red-light text-brand-red"
                            : "border-gray-200 bg-white text-gray-900"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Verify button */}
                  <motion.button
                    onClick={handleVerifyOTP}
                    disabled={otpLoading || otpCode.join("").length !== 6}
                    whileHover={{ scale: otpLoading ? 1 : 1.02 }}
                    whileTap={{ scale: otpLoading ? 1 : 0.98 }}
                    className="w-full flex items-center justify-center gap-2.5 bg-brand-red text-white font-bold py-4 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans shadow-glow-red disabled:opacity-50"
                  >
                    {otpLoading ? (
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
                        <FiCheck size={16} /> Verify Email
                      </>
                    )}
                  </motion.button>

                  {/* Resend */}
                  <div className="text-center space-y-2">
                    <p className="text-gray-400 text-sm font-sans">
                      Didn&apos;t receive the code?
                    </p>
                    <button
                      onClick={handleResendOTP}
                      disabled={resendCooldown > 0}
                      className={`inline-flex items-center gap-1.5 text-sm font-bold font-sans transition-colors ${
                        resendCooldown > 0
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-brand-red hover:underline"
                      }`}
                    >
                      <FiRefreshCw size={13} />
                      {resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : "Resend Code"}
                    </button>
                  </div>

                  {/* Skip for now — let them in but remind them */}
                  <button
                    onClick={() => {
                      setShowOTP(false);
                      onClose();
                      toast("Verify your email later from your dashboard.", {
                        icon: "📧",
                      });
                    }}
                    className="w-full text-center text-gray-400 text-xs font-sans hover:text-gray-600 transition-colors py-1"
                  >
                    Skip for now — verify later
                  </button>
                </motion.div>
              ) : (
                <>
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
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleLogin()
                              }
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

                        <GoogleDivider />

                        <div className="flex justify-center">
                          {googleLoading ? (
                            <div className="flex items-center gap-2 py-3 text-gray-500 text-sm font-sans">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="w-4 h-4 border-2 border-gray-300 border-t-brand-red rounded-full"
                              />
                              Signing in with Google...
                            </div>
                          ) : (
                            <GoogleLogin
                              onSuccess={(response) =>
                                handleGoogleAuth(response.credential)
                              }
                              onError={() =>
                                toast.error(
                                  "Google sign-in failed. Please try again.",
                                )
                              }
                              width="320"
                              text="signin_with"
                              shape="rectangular"
                              theme="outline"
                              size="large"
                            />
                          )}
                        </div>

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

                        <GoogleDivider />

                        <div className="flex justify-center">
                          {googleLoading ? (
                            <div className="flex items-center gap-2 py-3 text-gray-500 text-sm font-sans">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="w-4 h-4 border-2 border-gray-300 border-t-brand-red rounded-full"
                              />
                              Continuing with Google...
                            </div>
                          ) : (
                            <GoogleLogin
                              onSuccess={(response) =>
                                handleGoogleAuth(response.credential)
                              }
                              onError={() =>
                                toast.error(
                                  "Google sign-in failed. Please try again.",
                                )
                              }
                              width="320"
                              text="signup_with"
                              shape="rectangular"
                              theme="outline"
                              size="large"
                            />
                          )}
                        </div>

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
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
