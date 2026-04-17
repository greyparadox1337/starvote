/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        accent: '#06b6d4',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        dark: {
          900: '#0a0a0f',
          800: '#14141d',
          700: '#1e1e2d'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
