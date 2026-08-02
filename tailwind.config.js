/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          DEFAULT: '#14B8A6',
          light: '#2dd4bf',
          dark: '#0d9488',
        },
        success: {
          DEFAULT: '#22C55E',
          light: '#4ade80',
          dark: '#16a34a',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#fbbf24',
          dark: '#d97706',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#f87171',
          dark: '#dc2626',
        },
        brand: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        reward: {
          gold: '#f59e0b',
          diamond: '#38bdf8',
          xp: '#f43f5e',
        },
        surface: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },
        content: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        border: {
          light: 'var(--border-light)',
          strong: 'var(--border-strong)',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Poppins', 'Manrope', 'Inter', 'sans-serif'],
        'display': ['Manrope', 'Poppins', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
