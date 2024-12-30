/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src.{js,jsx,ts,tsx}", // This includes all files in the src directory
    "./*.{js,jsx,ts,tsx}",   // This includes all JS/JSX/TS/TSX files in the root directory
    "./src/**/*.{js,jsx,ts,tsx}", // Include any custom directories you have
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}