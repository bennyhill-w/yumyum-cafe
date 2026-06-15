export default function Card({
  children,
  className = "",
  hover = false,
  padding = true,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-gray-100 shadow-sm
        ${padding ? "p-5" : ""}
        ${hover ? "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
