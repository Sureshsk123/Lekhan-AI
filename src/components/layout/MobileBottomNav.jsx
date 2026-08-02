import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, BookOpen, Bot, Zap, User } from 'lucide-react';

export const MobileBottomNav = () => {
  const { user, activeLanguage } = useAuth();
  if (!user) return null;

  const currentLang = activeLanguage || 'spanish';

  const items = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: `/lessons/${currentLang}`, label: 'Learn', icon: BookOpen },
    { to: '/ai-tutor', label: 'AI Tutor', icon: Bot, isCenterFab: true },
    { to: `/quiz/${currentLang}`, label: 'Practice', icon: Zap },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon;
        
        if (item.isCenterFab) {
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative -top-4 flex items-center justify-center w-13 h-13 rounded-full bg-gradient-to-tr from-blue-600 to-teal-400 text-white shadow-xl shadow-blue-500/30 transition-all ${
                  isActive ? 'ring-4 ring-blue-500/30 scale-110' : 'hover:scale-105'
                }`
              }
            >
              <Bot className="w-6 h-6 animate-pulse-subtle" />
            </NavLink>
          );
        }

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-extrabold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default MobileBottomNav;
