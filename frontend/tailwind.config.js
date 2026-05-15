/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#10201c',
          muted: '#5a6b65',
          light: '#8fa39c',
        },
        forest: {
          950: '#0a1510',
          900: '#0f1f18',
          800: '#162e22',
          700: '#1d3d2c',
          600: '#247758',
          500: '#2d9469',
        },
        sage: {
          100: '#e8f0ec',
          200: '#cbe9d9',
          300: '#a8d4be',
        },
        amber: {
          DEFAULT: '#c8871a',
          light: '#fdf3e0',
          hover: '#b07315',
        },
        surface: '#f6faf7',
      },
      fontFamily: {
        display: ['Georgia', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
