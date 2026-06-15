const variants = {
  red: "bg-brand-red-light text-brand-red",
  gold: "bg-brand-gold-light text-brand-gold",
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-100 text-blue-800",
  gray: "bg-gray-100 text-gray-600",
  orange: "bg-orange-100 text-orange-700",
};

export default function Badge({ children, variant = "red", className = "" }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-1
        text-xs font-semibold rounded-full
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
