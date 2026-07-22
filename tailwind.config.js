/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7",
          400: "#34d399", 500: "#0E9F6E", 600: "#059669", 700: "#047857",
          800: "#065f46", 900: "#064e3b",
        },
        secondary: {
          50: "#fff5f0", 100: "#ffe6d9", 200: "#ffc7ad", 300: "#ffa280",
          400: "#ff8659", 500: "#FF6B35", 600: "#ed4f16", 700: "#c43d0f",
          800: "#9c3210", 900: "#7c2c11",
        },
        ink: {
          50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1",
          400: "#94a3b8", 500: "#64748b", 600: "#475569", 700: "#334155",
          800: "#1e293b", 900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Outfit", "Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(15, 23, 42, 0.10)",
        glow: "0 8px 32px -6px rgba(14, 159, 110, 0.45)",
      },
    },
  },
  plugins: [],
};
