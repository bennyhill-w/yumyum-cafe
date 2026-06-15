import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingCart,
  FiCalendar,
  FiMail,
  FiLogOut,
  FiX,
  FiGrid,
  FiMapPin,
} from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../services/ordersService";
import { getReservations } from "../../services/reservationsService";
import { getContacts } from "../../services/contactsService";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

function useBadgeCounts() {
  const { data: ordersData } = useQuery({
    queryKey: ["orders-badge"],
    queryFn: () =>
      getOrders({ status: "pending", limit: 100 }).then((r) => r.data),
    refetchInterval: 30000,
  });
  const { data: reservationsData } = useQuery({
    queryKey: ["reservations-badge"],
    queryFn: () =>
      getReservations({ status: "pending", limit: 100 }).then((r) => r.data),
    refetchInterval: 30000,
  });
  const { data: contactsData } = useQuery({
    queryKey: ["contacts-badge"],
    queryFn: () =>
      getContacts({ is_read: "false", limit: 100 }).then((r) => r.data),
    refetchInterval: 30000,
  });

  return {
    orders: ordersData?.data?.length || 0,
    reservations: reservationsData?.data?.length || 0,
    contacts: contactsData?.data?.length || 0,
  };
}

function NavBadge({ count }) {
  if (!count) return null;
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="ml-auto min-w-[20px] h-5 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1.5 font-sans"
    >
      {count > 99 ? "99+" : count}
    </motion.span>
  );
}

function SidebarContent({ onClose }) {
  const { admin, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const badges = useBadgeCounts();

  const { pathname } = useLocation();
  const isSuperAdmin = admin?.role === "super_admin";
  const isBranchAdmin = admin?.role === "branch_admin" || isSuperAdmin;

  const NAV = [
    {
      to: "/orders",
      icon: <FiShoppingCart size={18} />,
      label: "Orders",
      badge: pathname === "/orders" ? 0 : badges.orders,
      show: true,
    },
    {
      to: "/reservations",
      icon: <FiCalendar size={18} />,
      label: "Reservations",
      badge: pathname === "/reservations" ? 0 : badges.reservations,
      show: true,
    },
    {
      to: "/contacts",
      icon: <FiMail size={18} />,
      label: "Messages",
      badge: pathname === "/contacts" ? 0 : badges.contacts,
      show: true,
    },
    {
      to: "/menu",
      icon: <FiGrid size={18} />,
      label: "Menu Manager",
      badge: 0,
      show: isBranchAdmin,
    },
    {
      to: "/branches",
      icon: <FiMapPin size={18} />,
      label: "Branches",
      badge: 0,
      show: isSuperAdmin,
    },
  ].filter((item) => item.show);

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-red rounded-xl flex items-center justify-center">
            <MdStorefront className="text-white" size={18} />
          </div>
          <div>
            <p className="font-display font-bold text-gray-900 text-sm leading-none">
              Yum-Yum Cafe
            </p>
            <p className="text-gray-400 text-xs font-sans mt-0.5">
              Admin Panel
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {/* Admin info */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 bg-brand-red-light rounded-2xl p-3">
          <div className="w-9 h-9 rounded-xl bg-brand-red flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm font-sans">
              {admin?.name?.charAt(0) || "A"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm font-sans truncate">
              {admin?.name || "Admin"}
            </p>
            <p className="text-gray-500 text-xs font-sans capitalize truncate">
              {admin?.role?.replace("_", " ") || "Staff"}
            </p>
          </div>
        </div>
      </div>

      {/* Total alert */}
      {badges.orders + badges.reservations + badges.contacts > 0 && (
        <div className="mx-3 mt-3 bg-brand-red-light border border-brand-red/20 rounded-2xl px-4 py-2.5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse flex-shrink-0" />
          <p className="text-brand-red text-xs font-bold font-sans">
            {badges.orders + badges.reservations + badges.contacts} new item
            {badges.orders + badges.reservations + badges.contacts !== 1
              ? "s"
              : ""}{" "}
            need attention
          </p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest font-sans px-3 mb-3">
          Management
        </p>
        <div className="flex flex-col gap-1">
          {NAV.map(({ to, icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold font-sans transition-all ${
                  isActive
                    ? "bg-brand-red text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {icon}
                  <span className="flex-1">{label}</span>
                  {badge > 0 && (
                    <span
                      className={`min-w-[20px] h-5 text-[10px] font-bold rounded-full flex items-center justify-center px-1.5 font-sans ${
                        isActive
                          ? "bg-white text-brand-red"
                          : "bg-brand-red text-white"
                      }`}
                    >
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold font-sans text-gray-600 hover:bg-red-50 hover:text-brand-red transition-all"
        >
          <FiLogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar({ open, onClose }) {
  return (
    <>
      <div className="hidden lg:flex w-64 flex-shrink-0">
        <div className="w-full">
          <SidebarContent />
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-72 z-50 lg:hidden"
            >
              <SidebarContent onClose={onClose} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
