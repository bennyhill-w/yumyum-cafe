/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#B91C1C",
          "red-dark": "#7F1D1D",
          "red-light": "#FEE2E2",
          gold: "#92400E",
          "gold-light": "#FEF3C7",
          "gold-mid": "#D97706",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        display: ["Staatliches", "sans-serif"],
        syne: ["Syne", "sans-serif"],
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        marquee2: "marquee2 30s linear infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      backgroundImage: {
        "hero-pattern":
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        "card-hover": "0 20px 60px rgba(0,0,0,0.10)",
        "glow-red": "0 0 40px rgba(185,28,28,0.35)",
        "glow-gold": "0 0 40px rgba(217,119,6,0.35)",
      },
    },
  },
  plugins: [],
};
