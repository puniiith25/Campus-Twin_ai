/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f3ff',
          100: '#ebe9fe',
          200: '#d9d6fe',
          300: '#bdb4fe',
          400: '#9b8afb',
          500: '#7a5af8',
          600: '#6938ef',
          700: '#5925dc',
          800: '#4a1fb8',
          900: '#3e1c96',
          950: '#260e68',
        },
        lavender: {
          50: '#fbfaff',
          100: '#f3f0ff',
          200: '#e9e4ff',
          500: '#9b82fe',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(122, 90, 248, 0.3)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      }
    },
  },
  plugins: [],
}
