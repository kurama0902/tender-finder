import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        "blink-flash": {
          "0%, 100%": { opacity: "1", backgroundColor: "transparent" },
          "25%": { opacity: "0.5", backgroundColor: "yellow" },
          "50%": { opacity: "0.8", backgroundColor: "orange" },
          "75%": { opacity: "0.5", backgroundColor: "yellow" },
        },
        "blink-blue": {
          "0%, 100%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "rgba(0, 191, 255, 0.4)" },
        },
      },
      animation: {
        "blink-flash": "blink-flash 0.5s ease-in-out",
        "blink-blue": "blink-blue 0.5s ease-out",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#232428ff",
            foreground: "#ffffff",
          },
        },
      },
    }),
  ],
};

module.exports = config;
