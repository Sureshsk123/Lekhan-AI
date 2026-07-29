/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F7FF',
          100: '#E0EFFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        accent: {
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        success: {
          500: '#10B981',
        },
        warning: {
          500: '#F59E0B',
        },
        dark: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
        }
      },
    },
  },
  plugins: [],
};
