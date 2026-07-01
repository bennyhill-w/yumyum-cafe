import { useLocation } from "react-router-dom";
import { FiMenu, FiBell } from "react-icons/fi";
import useAuthStore from "../../store/authStore";
import logoImg from "../../assets/logo.jpg";

const PAGE_TITLES = {
  "/orders": "Orders",
  "/reservations": "Reservations",
  "/menu": "Menu Manager",
  "/branches": "Branch Settings",
  "/contacts": "Messages",
};

export default function AdminNavbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const admin = useAuthStore((s) => s.admin);

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <FiMenu size={20} />
        </button>
        <div className="flex items-center gap-3">
          <img
            src={logoImg}
            alt="Yum-Yum Cafe Admin Logo"
            className="w-11 h-11 rounded-2xl object-cover"
          />
          <div>
            <h1 className="font-display font-bold text-gray-900 text-xl">
              {PAGE_TITLES[pathname] || "Dashboard"}
            </h1>
            <p className="text-gray-400 text-xs font-sans max-w-[220px] truncate">
              {new Date().toLocaleDateString("en-NG", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
          <FiBell size={18} />
        </button>
        <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-brand-red flex items-center justify-center">
            <span className="text-white font-bold text-xs font-sans">
              {admin?.name?.charAt(0) || "A"}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="font-bold text-gray-900 text-sm font-sans leading-none">
              {admin?.name || "Admin"}
            </p>
            <p className="text-gray-400 text-xs font-sans capitalize">
              {admin?.role?.replace("_", " ") || "Staff"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
