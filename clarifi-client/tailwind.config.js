/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        accent: "#10b981",
        danger: "#ef4444",
        background: "#f8fafc",
      }
    },
  },
  plugins: [],
}