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
          blue: '#1e3a8a',     // Deep trustworthy navy/royal blue (ANWB/CBR inspired)
          blueLight: '#1d4ed8',
          amber: '#d97706',    // Grounded safety amber/orange for CTAs
          amberHover: '#b45309',
        }
      }
    },
  },
  plugins: [],
};

