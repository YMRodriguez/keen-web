/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'black-white': '#fffcf5',
        'holly': '#082017',
        'granny-apple': '#c9eddc',
        'claret': '#7c0728',
      },
    },
  },
  plugins: [],
}
