/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3e2',
          100: '#fde4b4',
          200: '#fbd382',
          300: '#f9c14f',
          400: '#f7b128',
          500: '#f5a009',
          600: '#d88a05',
          700: '#b57104',
          800: '#915903',
          900: '#6b4102',
        },
        africa: {
          green: '#009a44',
          red: '#ef3340',
          gold: '#fcd116',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
