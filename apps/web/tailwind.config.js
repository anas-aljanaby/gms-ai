/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(210, 40%, 50%)',
          light: 'hsl(210, 40%, 95%)',
          dark: 'hsl(210, 40%, 40%)',
        },
        secondary: {
          DEFAULT: 'hsl(145, 63%, 49%)',
          light: 'hsl(145, 63%, 95%)',
          dark: 'hsl(145, 63%, 39%)',
        },
        'sharia-primary': {
          DEFAULT: 'hsl(220, 45%, 25%)',
          dark: 'hsl(220, 45%, 35%)',
        },
        'sharia-secondary': {
          DEFAULT: 'hsl(35, 80%, 60%)',
          dark: 'hsl(35, 80%, 70%)',
        },
        background: 'hsl(210, 30%, 98%)',
        foreground: 'hsl(210, 20%, 15%)',
        card: 'hsl(0, 0%, 100%)',
        'dark-background': 'hsl(220, 20%, 12%)',
        'dark-foreground': 'hsl(210, 20%, 90%)',
        'dark-card': 'hsl(220, 20%, 16%)',
      },
      boxShadow: {
        soft: '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        xl: '24px',
      },
    },
  },
  plugins: [],
};
