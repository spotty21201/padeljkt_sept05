import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./styles/**/*.{css}"],
  theme: {
    extend: {
      colors: {
        ink: { 900: "#0A0A0A", 700: "#151821" },
        text: { 100: "#EDEEF0" },
        muted: { 300: "#9AA3AE" },
        padel: { green: "#DFFF00" }
      },
      borderRadius: { xl: "16px", "2xl": "24px" }
    }
  },
  plugins: []
};
export default config;
