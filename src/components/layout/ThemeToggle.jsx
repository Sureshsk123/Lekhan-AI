import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const handleCycleTheme = () => {
    if (theme === 'light') toggleTheme('dark');
    else if (theme === 'dark') toggleTheme('system');
    else toggleTheme('light');
  };

  return (
    <button
      onClick={handleCycleTheme}
      className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
      title={`Current Theme: ${theme.toUpperCase()}`}
      aria-label="Toggle Theme"
    >
      {theme === 'light' && <Sun className="w-5 h-5 text-amber-500" />}
      {theme === 'dark' && <Moon className="w-5 h-5 text-indigo-400" />}
      {theme === 'system' && <Monitor className="w-5 h-5 text-emerald-500" />}
    </button>
  );
};

export default ThemeToggle;
