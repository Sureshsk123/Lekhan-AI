import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { code: 'tamil', name: 'Tamil', flag: '🇮🇳' },
  { code: 'hindi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'telugu', name: 'Telugu', flag: '🇮🇳' },
  { code: 'malayalam', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'kannada', name: 'Kannada', flag: '🇮🇳' },
  { code: 'english', name: 'English', flag: '🇬🇧' }
];

export const LanguageSwitcher = ({ selectedLanguage = 'tamil', onSelectLanguage }) => {
  const [open, setOpen] = useState(false);
  const currentLang = LANGUAGES.find(l => l.code === selectedLanguage) || LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
      >
        <Globe className="w-4 h-4 text-emerald-500" />
        <span>{currentLang.flag} {currentLang.name}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                if (onSelectLanguage) onSelectLanguage(lang.code);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${
                selectedLanguage === lang.code
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <span>{lang.flag} {lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
