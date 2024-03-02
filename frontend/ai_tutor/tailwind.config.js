/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        secondary: {
          50: "#edf7ff",
          100: "#d6ebff",
          200: "#b5deff",
          300: "#83cbff",
          400: "#48adff",
          500: "#1e88ff",
          600: "#0666ff",
          700: "#0051ff",
          800: "#083fc5",
          900: "#0d3a9b",
          950: "#0e245d",
        },
      },
    },
  },
  plugins: [],
};
