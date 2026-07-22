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

        primary: {
          50: "#FFF1EA", 100: "#FFE0D0", 200: "#FFBE9C", 300: "#FF9868",
          400: "#FF7742", 500: "#FF5A1F", 600: "#ED3F08", 700: "#C42F06",
          800: "#9B2708", 900: "#7C230C",
        },
        violet: {
          50: "#F3F0FF", 100: "#E8E2FF", 200: "#D3C7FF", 300: "#B5A0FF",
          400: "#9878FF", 500: "#7C5CFF", 600: "#6435F0", 700: "#5326CE",
          800: "#4522A6", 900: "#3A2084",
        },
        rose: {
          50: "#FFF0F5", 100: "#FFE0EB", 200: "#FFC0D8", 300: "#FF92BA",
          400: "#FF5C97", 500: "#FF2D78", 600: "#ED0B5C", 700: "#C40549",
          800: "#A2073F", 900: "#870B39",
        },
        ink: {
          50: "#F7F8FC", 100: "#EEF1F7", 200: "#DEE2EC", 300: "#C2C7D6",
          400: "#949BB3", 500: "#6B7391", 600: "#4A5273", 700: "#2E3554",
          800: "#1F2440", 900: "#14172B", 950: "#0B0D1A",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Bricolage Grotesque'", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: { xl: "14px", "2xl": "20px", "3xl": "28px", "4xl": "36px" },
      boxShadow: {
        card: "0 1px 2px rgba(15,18,34,0.04), 0 8px 24px -10px rgba(15,18,34,0.10)",
        lift: "0 2px 4px rgba(15,18,34,0.04), 0 20px 44px -14px rgba(15,18,34,0.18)",
        glow: "0 10px 30px -8px rgba(255,90,31,0.45)",
        float: "0 24px 60px -18px rgba(15,18,34,0.28)",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
        drift: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(4%,-6%) scale(1.1)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        drift: "drift 26s ease-in-out infinite",
        "drift-slow": "drift 38s ease-in-out infinite",
      },
      transitionTimingFunction: { smooth: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
  },
  plugins: [],
};
