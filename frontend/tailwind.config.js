/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        a_bg: '#FBFFE8',
        text_green: "#005A45",
        a_sc: '#3D8D7A',
      },
      fontFamily: {
        arima: ['Arima', 'sans-serif'],
        inria: ['Inria Serif', 'serif'],
      },
    },
  },
  plugins: [],
}

