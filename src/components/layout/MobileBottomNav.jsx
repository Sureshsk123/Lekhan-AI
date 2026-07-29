import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Bot, BookOpen, ShoppingBag, User } from 'lucide-react';

export const MobileBottomNav = () => {
  const { user, activeLanguage } = useAuth();
  if (!user) return null;

  const items = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/ai-tutor', label: 'Tutor', icon: Bot },
    { to: `/lessons/${activeLanguage || 'tamil'}`, label: 'Lessons', icon: BookOpen },
    { to: '/shop', label: 'Shop', icon: ShoppingBag },
    { to: '/settings', label: 'Profile', icon: User }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-around shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-16 h-12 rounded-2xl transition-all ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 font-extrabold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold'
              }`
            }
          >
            <Icon className={`w-6 h-6 mb-0.5 ${item.to === window.location.pathname ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px]">{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default MobileBottomNav;
