import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        // Unified dark+green palette
        ink: {
          950: "#0B0E13",
          900: "#0E1218",
          800: "#141922",
          700: "#1B2230",
          600: "#242C3A",
        },
        text: {
          hi: "#E6EDF3",
          base: "#C9D2DB",
          mut: "#9AA3AE",
        },
        accent: {
          400: "#C9FF53",
          500: "#B6FF3B",
          600: "#A5F12F",
        },
        info: { 500: "#4FC3F7" },
        warn: { 500: "#FBBF24" },
        danger: { 500: "#F87171" },
        ok: { 500: "#34D399" },
        borders: { default: "rgba(255,255,255,0.06)" },
        gridlines: { default: "rgba(255,255,255,0.08)" },
      },
      borderRadius: { xl: "16px", "2xl": "24px" }
    }
  },
  plugins: []
};
export default config;
