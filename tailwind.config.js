/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a1a1a",
          light: "#2a2a2a",
          dark: "#0a0a0a",
        },
        secondary: {
          DEFAULT: "#3a3a3a",
          light: "#4a4a4a",
          dark: "#2a2a2a",
        },
        accent: {
          DEFAULT: "#007bff",
          light: "#3399ff",
          dark: "#0056b3",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
