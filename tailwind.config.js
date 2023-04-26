/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#171717",
        white: "#FCFCFC",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
