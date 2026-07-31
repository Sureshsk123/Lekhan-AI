import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
      <header className="sticky top-0 z-40 w-full bg-surface-primary border-b border-border-light transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-500 font-extrabold text-2xl group-hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/.svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold text-content-primary tracking-tight">
                LangSphere
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border border-border-strong text-content-secondary tracking-wide">
                AI
              </span>
            </div>
          </Link>

          {/* Center: Search Trigger (Desktop) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-surface-secondary text-content-tertiary hover:bg-surface-tertiary text-sm font-medium w-64 lg:w-96 transition-colors border border-transparent hover:border-border-strong"
          >
            <Search className="w-4 h-4 text-content-tertiary shrink-0" />
            <span className="flex-1 text-left">Search lessons, stories...</span>
            <kbd className="hidden lg:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded text-content-tertiary">
              ⌘K
            </kbd>
          </button>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Mobile Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-lg text-content-tertiary hover:bg-surface-secondary"
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
              }}
            />

            {user ? (
              <div className="flex items-center gap-3 border-l border-border-light pl-4 ml-2">
                <NotificationDropdown />
                <ProfileDropdown />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-content-secondary hover:text-content-primary transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm"
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
