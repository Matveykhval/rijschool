/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        brand: {
          green: '#064e3b',     // Deep trustworthy forest/clover green
          greenLight: '#047857',
          amber: '#d97706',     // Grounded safety amber/orange for CTAs
          amberHover: '#b45309',
        }
      }
    },
  },
  plugins: [],
};
