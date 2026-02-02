/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-cairo)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'Cairo', 'Tajawal', 'Noto Sans Arabic', 'sans-serif'],
      },
      colors: {
        primary: {
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
        legal: {
          blue: '#1e3a8a',
          dark: '#1e293b',
          gray: '#64748b',
        },
      },
      spacing: {
        'rtl-safe': 'var(--rtl-safe-spacing)',
      },
    },
  },
  plugins: [],
}

