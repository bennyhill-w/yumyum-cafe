import { motion } from "framer-motion";

export default function StatCard({
  icon,
  label,
  value,
  sub,
  color = "red",
  index = 0,
}) {
  const colors = {
    red: "bg-brand-red-light text-brand-red",
    gold: "bg-brand-gold-light text-brand-gold",
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center ${colors[color]}`}
        >
          {icon}
        </div>
      </div>
      <p className="font-display font-extrabold text-gray-900 text-3xl mb-1">
        {value}
      </p>
      <p className="font-bold text-gray-700 text-sm font-sans">{label}</p>
      {sub && <p className="text-gray-400 text-xs font-sans mt-0.5">{sub}</p>}
    </motion.div>
  );
}
