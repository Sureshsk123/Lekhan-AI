import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { code: 'tamil', name: 'Tamil', flag: '🇮🇳', native: 'தமிழ்' },
  { code: 'telugu', name: 'Telugu', flag: '🇮🇳', native: 'తెలుగు' },
  { code: 'hindi', name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
  { code: 'malayalam', name: 'Malayalam', flag: '🇮🇳', native: 'മലയാളം' },
  { code: 'kannada', name: 'Kannada', flag: '🇮🇳', native: 'ಕನ್ನಡ' },
];

export const LanguageSwitcher = ({ selectedLanguage = 'tamil', onSelectLanguage }) => {
  const [open, setOpen] = useState(false);
  const currentLang = LANGUAGES.find(l => l.code === selectedLanguage) || LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border-0 bg-slate-600 dark:bg-slate-700 text-white hover:bg-slate-500 transition-colors text-sm font-semibold shadow-sm"
      >
        <Globe className="w-4 h-4 text-emerald-400" />
        <span>{currentLang.flag}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-surface-primary rounded-2xl shadow-xl border border-border-light py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
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
                  : 'text-content-secondary hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>
                  <span className="font-semibold">{lang.name}</span>
                  {lang.native && <span className="text-content-tertiary text-xs ml-1">· {lang.native}</span>}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
