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
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Syne", "sans-serif"],
      },
      boxShadow: {
        "glow-red": "0 0 40px rgba(185,28,28,0.25)",
      },
    },
  },
  plugins: [],
};
