export default function Spinner({
  size = 20,
  color = "#B91C1C",
  className = "",
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-spin flex-shrink-0 ${className}`}
      aria-label="Loading"
      role="status"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
