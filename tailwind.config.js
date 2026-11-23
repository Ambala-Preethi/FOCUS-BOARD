/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F5F5FE',
          100: '#ECECFC',
          200: '#D9D7FB',
          300: '#B8B3F8',
          400: '#8C83F5',
          500: '#6259F7', // Primary Figma Purple
          600: '#5046E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#2A247A',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'modal': '0 20px 40px -15px rgba(0, 0, 0, 0.15), 0 0 1px 1px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
