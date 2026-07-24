/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        elevated: "var(--elevated)",
        line: "var(--line)",
        body: "var(--body)",
        muted: "var(--muted)",
        faint: "var(--faint)",

        void: "#08090D",
        carbon: "#101218",
        smoke: "#191D28",
        volt: "#00E0FF",
        electric: {
          50: "#EEF3FF", 100: "#DCE6FF", 200: "#BACDFF", 300: "#8DAAFF",
          400: "#5B8CFF", 500: "#2E6BFF", 600: "#1B52E0", 700: "#1440B8",
          800: "#123593", 900: "#122C74",
        },

        primary: {
          50: "#EFF6FF", 100: "#DBEAFE", 200: "#BFDBFE", 300: "#93C5FD",
          400: "#60A5FA", 500: "#3B82F6", 600: "#2563EB", 700: "#1D4ED8",
          800: "#1E40AF", 900: "#1E3A8A",
        },
        indigo: {
          50: "#EEF2FF", 100: "#E0E7FF", 200: "#C7D2FE", 300: "#A5B4FC",
          400: "#818CF8", 500: "#6366F1", 600: "#4F46E5", 700: "#4338CA",
          800: "#3730A3", 900: "#312E81",
        },
        cyan: {
          50: "#ECFEFF", 100: "#CFFAFE", 200: "#A5F3FC", 300: "#67E8F9",
          400: "#22D3EE", 500: "#06B6D4", 600: "#0891B2", 700: "#0E7490",
        },
        violet: {
          50: "#F5F3FF", 100: "#EDE9FE", 200: "#DDD6FE", 300: "#C4B5FD",
          400: "#A78BFA", 500: "#8B5CF6", 600: "#7C3AED", 700: "#6D28D9",
        },
        ink: {
          50: "#F5F8FC", 100: "#E9EFF7", 200: "#D5DFEE", 300: "#B2C1DA",
          400: "#8697B5", 500: "#5F708F", 600: "#45546F", 700: "#2F3B52",
          800: "#1D2739", 900: "#131B29", 950: "#0A101C",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Bricolage Grotesque'", "Inter", "system-ui", "sans-serif"],
        mega: ["Anton", "Impact", "Haettenschweiler", "sans-serif"],
      },
      borderRadius: { xl: "14px", "2xl": "20px", "3xl": "28px", "4xl": "36px" },
      boxShadow: {
        card: "0 1px 2px rgba(15,18,34,0.04), 0 8px 24px -10px rgba(15,18,34,0.10)",
        lift: "0 2px 4px rgba(15,18,34,0.04), 0 20px 44px -14px rgba(15,18,34,0.18)",
        glow: "0 10px 30px -8px rgba(37,99,235,0.42)",
        float: "0 24px 60px -18px rgba(15,18,34,0.28)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        drift: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(4%,-6%) scale(1.1)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-rev": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        drift: "drift 26s ease-in-out infinite",
        "drift-slow": "drift 38s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
        "marquee-fast": "marquee 18s linear infinite",
        "marquee-rev": "marquee-rev 32s linear infinite",
      },
      transitionTimingFunction: { smooth: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
  },
  plugins: [],
};