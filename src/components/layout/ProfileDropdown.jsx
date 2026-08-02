import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Settings, Flame, Trophy, Shield, ChevronDown, Sparkles, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initial = (user.username || user.fullName || user.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-500/20 ring-2 ring-white dark:ring-slate-800">
          {initial}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            {user.username || user.fullName || 'Scholar'}
          </p>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold capitalize">
            Level {user.level || 1} {user.role || 'Student'}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 hidden sm:block ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white font-black text-lg flex items-center justify-center shadow-md">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                  {user.username || user.fullName || 'Scholar'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-500/20 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400">Total XP</span>
                <span className="text-xs font-black text-slate-900 dark:text-white">⚡ {user.xp || 1240}</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-500/20 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400">Streak</span>
                <span className="text-xs font-black text-slate-900 dark:text-white">🔥 {user.streak?.current || 7}d</span>
              </div>
            </div>
          </div>

          <div className="py-2 px-1 space-y-0.5">
            <button
              onClick={() => { setOpen(false); navigate('/profile'); }}
              className="w-full px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl flex items-center gap-2.5 transition-colors"
            >
              <User className="w-4 h-4 text-blue-500" /> View Profile & Badges
            </button>
            <button
              onClick={() => { setOpen(false); navigate('/achievements'); }}
              className="w-full px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl flex items-center gap-2.5 transition-colors"
            >
              <Award className="w-4 h-4 text-teal-500" /> Achievements
            </button>
            <button
              onClick={() => { setOpen(false); navigate('/settings'); }}
              className="w-full px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl flex items-center gap-2.5 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" /> Account Settings
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => { setOpen(false); navigate('/admin'); }}
                className="w-full px-3 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl flex items-center gap-2.5 transition-colors"
              >
                <Shield className="w-4 h-4 text-indigo-500" /> Admin Control Portal
              </button>
            )}

            {(user.role === 'parent' || user.mode === 'parent') && (
              <button
                onClick={() => { setOpen(false); navigate('/parent-dashboard'); }}
                className="w-full px-3 py-2 text-xs font-bold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-xl flex items-center gap-2.5 transition-colors"
              >
                <User className="w-4 h-4 text-teal-500" /> Parent Portal
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 px-2">
            <button
              onClick={() => {
                setOpen(false);
                logout();
                navigate('/login');
              }}
              className="w-full px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl flex items-center gap-2.5 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
