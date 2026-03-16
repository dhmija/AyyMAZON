import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s infinite",
        "fade-up": "fade-up 0.35s ease-out",
      },
      colors: {
        amazon: {
          orange: "#febd69",
          "orange-dark": "#ff9900",
          "nav-dark": "#131921",
          "nav-mid": "#232f3e",
          "nav-light": "#37475a",
          background: "#eaeded",
          "card-bg": "#ffffff",
          text: "#0f1111",
          "text-muted": "#565959",
          "link-blue": "#007185",
        },
      },
      fontFamily: {
        sans: ["Amazon Ember", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 5px 0 rgba(15, 17, 17, 0.15)",
        "card-hover": "0 4px 12px 0 rgba(15, 17, 17, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
