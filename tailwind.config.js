/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2066CC",
        secondary: "#8C52FF",
      },
      borderRadius: {
        '2xl': '1rem'
      }
    },
  },
  plugins: [],
};
