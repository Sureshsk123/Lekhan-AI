import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  Sparkles,
  Mic,
  BookmarkCheck,
  Trophy,
  Award,
  BarChart3,
  Users,
  ShoppingBag,
  User as UserIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Flame,
  Zap,
  ChevronDown
} from 'lucide-react';

export const Sidebar = () => {
  const { user, activeLanguage } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState({
    learn: true,
    practice: true,
    progress: true,
  });
  const location = useLocation();

  if (!user) return null;

  const currentLang = activeLanguage || 'spanish';

  const navCategories = [
    {
      id: 'main',
      title: 'Overview',
      items: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      id: 'learn',
      title: 'Learn',
      items: [
        { to: `/lessons/${currentLang}`, label: 'Lessons', icon: BookOpen, matchPrefix: '/lesson' },
        { to: `/stories/${currentLang}`, label: 'Stories', icon: Sparkles, matchPrefix: '/story' },
        { to: '/ai-tutor', label: 'AI Tutor', icon: Bot, badge: 'AI' },
      ],
    },
    {
      id: 'practice',
      title: 'Practice & Tools',
      items: [
        { to: `/quiz/${currentLang}`, label: 'Quiz', icon: Zap, matchPrefix: '/quiz' },
        { to: '/pronunciation', label: 'Pronunciation', icon: Mic },
        { to: '/vocabulary', label: 'Vocabulary', icon: BookmarkCheck },
      ],
    },
    {
      id: 'progress',
      title: 'Community & Progress',
      items: [
        { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
        { to: '/achievements', label: 'Achievements', icon: Award },
        { to: '/reports', label: 'Reports', icon: BarChart3 },
      ],
    },
  ];

  if (user.role === 'parent' || user.mode === 'parent') {
    navCategories.find(c => c.id === 'progress').items.push({
      to: '/parent-dashboard',
      label: 'Parent Portal',
      icon: Users,
    });
  }

  if (user.role === 'admin') {
    navCategories.push({
      id: 'admin',
      title: 'Management',
      items: [{ to: '/admin', label: 'Admin Portal', icon: Shield }],
    });
  }

  const toggleSection = (id) => {
    setExpandedSection(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside
      className={`hidden md:flex flex-col shrink-0 transition-all duration-300 relative z-30 sticky top-16 h-[calc(100vh-4rem)] border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-5 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-40"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* User Quick Progress Banner */}
      {!collapsed ? (
        <div className="p-4 mx-3 mt-3 rounded-2xl bg-gradient-to-br from-blue-600/10 via-teal-500/10 to-blue-500/5 border border-blue-500/20 dark:border-blue-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
              Level {user.level || 1} Explorer
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                {user.xp || 1240} XP
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-xl text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-bounce" />
            <span>{user.streak > 0 ? `${user.streak}d` : '0d'}</span>
          </div>
        </div>
      ) : (
        <div className="flex justify-center my-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/20">
            L{user.level || 1}
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-hide">
        {navCategories.map((category) => (
          <div key={category.id} className="space-y-1">
            {!collapsed && (
              <div
                onClick={() => toggleSection(category.id)}
                className="flex items-center justify-between px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors select-none"
              >
                <span>{category.title}</span>
                {category.items.length > 1 && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      expandedSection[category.id] === false ? '-rotate-90' : ''
                    }`}
                  />
                )}
              </div>
            )}

            {(collapsed || expandedSection[category.id] !== false) && (
              <div className="space-y-1">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.to ||
                    (item.matchPrefix && location.pathname.startsWith(item.matchPrefix));

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center ${
                        collapsed ? 'justify-center py-3' : 'justify-between px-3 py-2.5'
                      } rounded-xl text-sm font-semibold transition-all group relative ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/25 scale-[1.01]'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'
                          }`}
                        />
                        {!collapsed && <span>{item.label}</span>}
                      </div>

                      {!collapsed && item.badge && (
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {collapsed && item.badge && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-500" />
                      )}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer Nav Links: Shop, Profile & Settings */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1">
        <NavLink
          to="/shop"
          title={collapsed ? 'Shop' : undefined}
          className={({ isActive }) =>
            `flex items-center ${
              collapsed ? 'justify-center py-2.5' : 'gap-3 px-3 py-2'
            } rounded-xl text-sm font-semibold transition-all ${
              isActive
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
            }`
          }
        >
          <ShoppingBag className="w-4 h-4 text-amber-500 shrink-0" />
          {!collapsed && <span>Shop</span>}
        </NavLink>
        
        <NavLink
          to="/profile"
          title={collapsed ? 'Profile' : undefined}
          className={({ isActive }) =>
            `flex items-center ${
              collapsed ? 'justify-center py-2.5' : 'gap-3 px-3 py-2'
            } rounded-xl text-sm font-semibold transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
            }`
          }
        >
          <UserIcon className="w-4 h-4 text-blue-500 shrink-0" />
          {!collapsed && <span>Profile</span>}
        </NavLink>

        <NavLink
          to="/settings"
          title={collapsed ? 'Settings' : undefined}
          className={({ isActive }) =>
            `flex items-center ${
              collapsed ? 'justify-center py-2.5' : 'gap-3 px-3 py-2'
            } rounded-xl text-sm font-semibold transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
            }`
          }
        >
          <Settings className="w-4 h-4 text-slate-500 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
