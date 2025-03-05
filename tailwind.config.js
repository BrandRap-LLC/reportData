/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f3f0',
          100: '#f0e6e0',
          200: '#e5d3c8',
          300: '#d7bba9',
          400: '#c49c81',
          500: '#b68565',
          600: '#976751',
          700: '#7d5544',
          800: '#634436',
          900: '#4a3728',
          950: '#2a1f17',
        },
        secondary: {
          DEFAULT: '#C49C81',
          light: '#D7BBA9',
          dark: '#B68565',
        },
        background: '#EDD7C8',
        newCustomer: '#976751',
        returningCustomer: '#C49C81',
        positive: '#7D5544',
        negative: '#D35F5F',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(151, 103, 81, 0.1), 0 2px 4px -1px rgba(151, 103, 81, 0.06)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#4A3728',
            lineHeight: '1.75',
          },
        },
      },
      screens: {
        'print': {'raw': 'print'},
      },
    },
  },
  plugins: [],
};