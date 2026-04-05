/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0a1628",
        navy: "#1a2942",
        sage: "#8b9d83",
        cream: "#f8f6f1",
        gold: "#d4af37",
        warmWhite: "#fefdfb",
        slate: "#64748b",
        teal: "#0d4d56",
      },
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
        jost: ["Jost", "sans-serif"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out",
        shimmer: "shimmer 1.5s infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [],
};
