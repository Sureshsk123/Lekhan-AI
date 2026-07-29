import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import GlobalSearchModal from './GlobalSearchModal';
import { Search, Sparkles, BookOpen, Flame } from 'lucide-react';

export const Navbar = () => {
  const { user, activeLanguage, setActiveLanguage } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  
  // Gets current feature path like 'lessons' or 'stories' from URL, defaulting to dashboard
  const getCurrentFeaturePath = () => {
    const path = window.location.pathname;
    if (path.startsWith('/lessons')) return 'lessons';
    if (path.startsWith('/stories')) return 'stories';
    if (path.startsWith('/handwriting')) return 'handwriting';
    return null; // For paths that don't need language postfix
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/60 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              🌐
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent tracking-tight">
                LangSphere
              </span>
              <span className="hidden sm:inline-block ml-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                AI
              </span>
            </div>
          </Link>

          {/* Center: Search Trigger (Desktop) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-sm font-medium w-64 lg:w-80 transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
          >
            <Search className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="flex-1 text-left">Search lessons, stories...</span>
            <kbd className="hidden lg:inline-block text-[10px] font-bold bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-400 border border-slate-200 dark:border-slate-600">
              ⌘K
            </kbd>
          </button>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher
              selectedLanguage={activeLanguage}
              onSelectLanguage={(lang) => {
                setActiveLanguage(lang);
                const feature = getCurrentFeaturePath();
                if (feature) {
                  navigate(`/${feature}/${lang}`);
                }
                // If on a page like dashboard that doesn't have lang in URL, it will just re-render via AuthContext
              }}
            />

            {/* Theme Switcher */}
            <ThemeToggle />

            {user ? (
              <>
                {/* Notifications */}
                <NotificationDropdown />

                {/* Profile Menu */}
                <ProfileDropdown />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Global Search Modal Overlay */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
