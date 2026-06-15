import React from "react";

export default function SectionDivider({
  flip = false,
  color = "#FEE2E2",
  opacity = 0.95,
  variant = "wave",
  gradient = true,
  className = "",
}) {
  let d;
  switch (variant) {
    case "curve":
      d = "M0,0 C300,120 900,0 1200,80 L1200,120 L0,120 Z";
      break;
    case "tilt":
      d = "M0,0 L1200,48 L1200,120 L0,120 Z";
      break;
    case "wave":
    default:
      d =
        "M0,0 C150,60 350,60 600,28 C850,-4 1050,56 1200,24 L1200,120 L0,120 Z";
  }

  const gradientId = `grad-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className={`overflow-hidden ${className} ${flip ? "-scale-y-100" : ""}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-16 md:h-24 block"
        xmlns="http://www.w3.org/2000/svg"
      >
        {gradient && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity={opacity} />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
        )}
        <path
          d={d}
          fill={gradient ? `url(#${gradientId})` : color}
          fillOpacity={gradient ? 1 : opacity}
        />
      </svg>
    </div>
  );
}
