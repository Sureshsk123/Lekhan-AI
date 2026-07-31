import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  Sparkles,
  PenTool,
  ShoppingBag,
  Package,
  Users,
  User as UserIcon,
  Shield,
  Settings
} from 'lucide-react';

export const Sidebar = () => {
  const { user, activeLanguage } = useAuth();
  if (!user) return null;

  const mainNav = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/ai-tutor', label: 'AI Tutor', icon: Bot, badge: 'AI' },
    { to: `/lessons/${activeLanguage || 'tamil'}`, label: 'Lessons', icon: BookOpen },
    { to: `/stories/${activeLanguage || 'tamil'}`, label: 'Stories', icon: Sparkles },
    { to: `/handwriting/${activeLanguage || 'tamil'}`, label: 'Handwriting', icon: PenTool },
    { to: '/shop', label: 'Shop', icon: ShoppingBag },
    { to: '/inventory', label: 'Inventory', icon: Package },
  ];

  if (user.role === 'parent' || user.mode === 'parent') {
    mainNav.push({ to: '/parent-dashboard', label: 'Parent Portal', icon: Users });
  }

  if (user.role === 'admin') {
    mainNav.push({ to: '/admin', label: 'Admin Portal', icon: Shield });
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-surface-primary/70 dark:bg-surface-primary/70 border-r border-border-light/60 backdrop-blur-xl min-h-[calc(100vh-4rem)] p-4 space-y-6">
      
      {/* Quick User Stats Pill */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            Level {user.level || 1} Scholar
          </span>
          <span className="text-xs font-bold text-slate-800 dark:text-white">
            ⚡ {user.xp || 0} Total XP
          </span>
        </div>
        <span className="text-xl">🔥</span>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {mainNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-accent-primary text-white shadow-lg shadow-sm scale-[1.02]'
                    : 'text-content-tertiary hover:bg-surface-tertiary/80'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 uppercase">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Profile & Settings Bottom Footer */}
      <div className="pt-3 border-t border-border-light/60 space-y-1">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              isActive
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-content-tertiary hover:bg-surface-tertiary'
            }`
          }
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              isActive
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-content-tertiary hover:bg-surface-tertiary'
            }`
          }
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </NavLink>
      </div>

    </aside>
  );
};

export default Sidebar;
