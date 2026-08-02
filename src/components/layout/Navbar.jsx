import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import GlobalSearchModal from './GlobalSearchModal';
import { Search, Sparkles, Sun, Moon, Flame, Zap } from 'lucide-react';

export const Navbar = () => {
  const { user, activeLanguage, setActiveLanguage } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const getCurrentFeaturePath = () => {
    const path = window.location.pathname;
    if (path.startsWith('/lessons')) return 'lessons';
    if (path.startsWith('/stories')) return 'stories';
    if (path.startsWith('/handwriting')) return 'handwriting';
    if (path.startsWith('/quiz')) return 'quiz';
    return null;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-teal-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white font-extrabold text-xl">
                <Sparkles className="w-5 h-5 text-teal-400 animate-pulse-subtle" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
                  LangSphere
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 uppercase tracking-widest">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
                AI Language Platform
              </span>
            </div>
          </Link>

          {/* Center: Quick Search Bar (Desktop) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 text-xs font-medium w-64 lg:w-96 transition-all shadow-xs group"
          >
            <Search className="w-4 h-4 text-blue-500 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="flex-1 text-left">Search lessons, tutors, words...</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              <span>⌘</span>K
            </kbd>
          </button>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Streak & XP Pills (If logged in) */}
            {user && (
              <div className="hidden lg:flex items-center gap-2 mr-1">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-extrabold">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
                  <span>7 Day Streak</span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-extrabold">
                  <Zap className="w-4 h-4 text-blue-500 fill-blue-500" />
                  <span>{user.xp || 1240} XP</span>
                </div>
              </div>
            )}

            {/* Language Switcher */}
            <LanguageSwitcher
              selectedLanguage={activeLanguage}
              onSelectLanguage={(lang) => {
                setActiveLanguage(lang);
                const feature = getCurrentFeaturePath();
                if (feature) {
                  navigate(`/${feature}/${lang}`);
                }
              }}
            />

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* User Dropdown / Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-2 sm:pl-3">
                <NotificationDropdown />
                <ProfileDropdown />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-500 transition-colors px-3 py-2"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary text-xs py-2 px-4 shadow-lg shadow-blue-500/20"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
