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
        'black-white': '#FDFBFF',
        'holly': '#082017',
        'black': '#000000',
        'granny-apple': '#c9eddc',
        'claret': '#7c0728',
        'magnolia': '#FDFBFF',
      },
      fontFamily: {
        zen: ['"Zen Loop"', 'cursive'],
        bellota: ['"Bellota"', 'cursive'],
        bellotaText: ['"Bellota Text"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
