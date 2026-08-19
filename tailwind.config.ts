import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          DEFAULT: "#1B3550",
          deep: "#12253A",
        },
        washi: {
          DEFAULT: "#F6F1E4",
          warm: "#EFE7D3",
        },
        yamabuki: {
          DEFAULT: "#D9A441",
          deep: "#B8842E",
        },
        ink: {
          DEFAULT: "#201F1B",
          soft: "#5C6B78",
        },
      },
      fontFamily: {
        serif: ["var(--font-shippori)", "serif"],
        sans: ["var(--font-zenkaku)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      keyframes: {
        sway: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(1.2deg)" },
        },
      },
      animation: {
        sway: "sway 4.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
