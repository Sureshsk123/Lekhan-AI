import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

export const LANGUAGES = [
  { code: 'spanish', name: 'Spanish', flag: '🇪🇸', native: 'Español' },
  { code: 'french', name: 'French', flag: '🇫🇷', native: 'Français' },
  { code: 'german', name: 'German', flag: '🇩🇪', native: 'Deutsch' },
  { code: 'japanese', name: 'Japanese', flag: '🇯🇵', native: '日本語' },
  { code: 'hindi', name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
  { code: 'tamil', name: 'Tamil', flag: '🇮🇳', native: 'தமிழ்' },
  { code: 'telugu', name: 'Telugu', flag: '🇮🇳', native: 'తెలుగు' },
  { code: 'kannada', name: 'Kannada', flag: '🇮🇳', native: 'ಕನ್ನಡ' },
];

export const LanguageSwitcher = ({ selectedLanguage = 'spanish', onSelectLanguage }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const currentLang = LANGUAGES.find(l => l.code === selectedLanguage) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all text-xs font-semibold shadow-xs"
        aria-label="Switch learning language"
      >
        <Globe className="w-3.5 h-3.5 text-blue-500" />
        <span className="text-base">{currentLang.flag}</span>
        <span className="font-bold hidden sm:inline">{currentLang.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 mb-1">
            Learning Language
          </div>

          <div className="max-h-64 overflow-y-auto scrollbar-hide space-y-0.5 px-1">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    if (onSelectLanguage) onSelectLanguage(lang.code);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="flex flex-col">
                      <span className="font-bold leading-tight">{lang.name}</span>
                      <span className="text-[10px] text-slate-400">{lang.native}</span>
                    </span>
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
