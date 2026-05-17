/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#22201c',
          muted: '#6e665d',
          light: '#9b9287',
        },
        forest: {
          950: '#172018',
          900: '#223025',
          800: '#304536',
          700: '#3f6049',
          600: '#4f7c5b',
          500: '#67956f',
        },
        sage: {
          100: '#ece9e2',
          200: '#d9d2c5',
          300: '#bfb4a3',
        },
        amber: {
          DEFAULT: '#b76e39',
          light: '#fbefe5',
          hover: '#98582c',
        },
        denim: {
          DEFAULT: '#47677a',
          light: '#e9f0f3',
        },
        clay: {
          DEFAULT: '#9d5548',
          light: '#f5e9e6',
        },
        surface: '#f7f4ee',
        paper: '#fffdf8',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
