/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Bảng màu giống thienlong.vn: xanh dương đậm + cam nhấn
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#1e6bbf',
          600: '#1857a8',
          700: '#143f86',
          800: '#0f2f6a',
        },
        accent: {
          500: '#f59e0b', // cam khuyến mãi
          600: '#d97706',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
