/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        travel: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        sunset: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        sage: {
          50: '#f6f7f6',
          100: '#e3e8e3',
          200: '#c7d2c7',
          300: '#a3b5a3',
          400: '#7a927a',
          500: '#5d755d',
          600: '#4a5e4a',
          700: '#3d4e3d',
          800: '#334033',
          900: '#2b352b',
        },
      },
      fontFamily: {
        'travel': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        'heading': ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'travel-gradient': 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)',
        'sage-gradient': 'linear-gradient(135deg, #5d755d 0%, #4a5e4a 50%, #3d4e3d 100%)',
      },
    },
  },
  plugins: [],
};
