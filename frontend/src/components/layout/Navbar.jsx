import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ShoppingCart,
  Menu,
  X,
  MapPin,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AiFillStar } from "react-icons/ai";
import useCartStore from "../../store/cartStore";
import useUserStore from "../../store/userStore";
import AuthModal from "../ui/AuthModal";
import toast from "react-hot-toast";
import logoImg from "../../assets/logo.jpg";
import { getLoyaltyAccount } from "../../services/userService";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "About" },
  { to: "/find-us", label: "Find Us" },
  { to: "/gallery", label: "Gallery" },
  { to: "/reservations", label: "Reservations" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const totalItems = getTotalItems();
  const { user, isAuthenticated, clearAuth } = useUserStore();

  const { data: loyaltyData } = useQuery({
    queryKey: ["loyalty-nav"],
    queryFn: () => getLoyaltyAccount().then((r) => r.data),
    enabled: isAuthenticated,
    staleTime: 1000 * 60,
  });
  const pointsBalance = loyaltyData?.data?.points_balance || 0;

  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const openAuth = (tab = "login") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const handleLogout = () => {
    clearAuth();
    toast.success("Signed out successfully");
    setUserMenuOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md border-b border-gray-100" : "bg-white"
        }`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 flex-shrink-0"
              aria-label="Yum-Yum Cafe Home"
            >
              <img
                src={logoImg}
                alt="Yum-Yum Cafe"
                className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover flex-shrink-0"
              />
              <span className="font-display text-brand-red text-xl leading-tight hidden sm:block">
                Yum-Yum Cafe
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-semibold transition-colors font-sans ${
                      isActive
                        ? "bg-brand-red-light text-brand-red"
                        : "text-gray-600 hover:text-brand-red hover:bg-brand-red-light"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <Link
                to="/order"
                className="relative flex items-center gap-2 bg-brand-gold text-brand-gold-light px-2 sm:px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-gold/90 transition-colors font-sans"
              >
                <ShoppingCart size={16} />
                <span className="hidden sm:inline">Order Now</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-white text-brand-red text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

              {/* User auth */}
              {isAuthenticated ? (
                <div className="hidden lg:relative lg:flex">
                  <motion.button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-brand-red text-white border border-brand-red/20 px-3 py-2 rounded-lg transition-colors hover:bg-brand-red-dark"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-white text-xs font-bold font-sans">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:block text-sm font-semibold font-sans max-w-20 truncate">
                      {user?.name?.split(" ")[0]}
                    </span>
                    {pointsBalance >= 100 && (
                      <span className="hidden sm:flex items-center gap-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full font-sans flex-shrink-0">
                        <AiFillStar size={9} />
                        {pointsBalance}
                      </span>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-10"
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20"
                        >
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="font-bold text-gray-900 text-sm font-sans">
                              {user?.name}
                            </p>
                            <p className="text-gray-400 text-xs font-sans truncate">
                              {user?.email}
                            </p>
                            {pointsBalance > 0 && (
                              <div className="flex items-center gap-1.5 mt-1.5 bg-yellow-50 rounded-lg px-2 py-1">
                                <AiFillStar
                                  className="text-yellow-500"
                                  size={11}
                                />
                                <span className="text-yellow-700 text-xs font-bold font-sans">
                                  {pointsBalance} loyalty points
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <Link
                              to="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-brand-red-light hover:text-brand-red transition-colors font-sans">
                                <LayoutDashboard size={15} /> My Dashboard
                              </button>
                            </Link>
                            <Link
                              to="/order"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-brand-red-light hover:text-brand-red transition-colors font-sans">
                                <ShoppingCart size={15} /> Order Food
                              </button>
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors font-sans"
                            >
                              <LogOut size={15} /> Sign Out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <button
                    onClick={() => openAuth("login")}
                    className="text-gray-700 hover:text-brand-red text-sm font-semibold font-sans transition-colors px-3 py-2 rounded-lg hover:bg-brand-red-light"
                  >
                    Sign In
                  </button>
                  <motion.button
                    onClick={() => openAuth("register")}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 bg-brand-red text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-brand-red-dark transition-colors font-sans"
                  >
                    <User size={14} /> Register
                  </motion.button>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsOpen((v) => !v)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {/* Mobile drawer background stays red — it pops against the white navbar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
        <div
          className={`absolute top-0 left-0 h-full w-full max-w-xs sm:w-72 bg-brand-red shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/20">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logoImg}
                alt="Yum-Yum Cafe"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
              />
              <span className="font-display text-white text-lg">
                Yum-Yum Cafe
              </span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          {/* User section in mobile */}
          {isAuthenticated ? (
            <div className="px-4 py-3 border-b border-white/20">
              <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-3">
                <div className="w-9 h-9 rounded-xl bg-white/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm font-sans">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white text-sm font-sans truncate">
                    {user?.name}
                  </p>
                  <p className="text-white/60 text-xs font-sans truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-4 py-3 border-b border-white/20 flex gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  openAuth("login");
                }}
                className="flex-1 py-2.5 bg-white/10 border border-white/20 text-white text-sm font-bold rounded-xl font-sans"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  openAuth("register");
                }}
                className="flex-1 py-2.5 bg-white text-brand-red text-sm font-bold rounded-xl font-sans"
              >
                Register
              </button>
            </div>
          )}

          <nav className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-semibold transition-colors font-sans ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-3 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors font-sans flex items-center gap-2"
                >
                  <LayoutDashboard size={15} /> My Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors font-sans text-left flex items-center gap-2"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            )}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 px-5 py-4 border-t border-white/20">
            <div className="flex items-center gap-2 text-white/70 text-xs font-sans">
              <MapPin size={13} />
              <span>4 locations across Lagos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab={authTab}
      />
    </>
  );
}
