import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Settings, Flame, Trophy, Shield, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-surface-tertiary transition-colors focus:outline-none"
      >
        <div className="w-8 h-8 rounded-xl bg-accent-primary text-white font-bold text-sm flex items-center justify-center shadow-md">
          {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
            {user.username}
          </p>
          <span className="text-[10px] text-content-tertiary capitalize">
            {user.role || user.mode || 'student'}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 opacity-60 hidden sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-surface-primary rounded-3xl shadow-2xl border border-border-light py-3 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-4 pb-3 border-b border-border-light">
            <p className="font-bold text-slate-800 dark:text-white">{user.username}</p>
            <p className="text-xs text-content-tertiary truncate">{user.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg">
                ⚡ {user.xp || 0} XP
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-lg">
                🔥 {user.streak?.current || 1} d
              </span>
            </div>
          </div>

          <div className="py-2">
            <button
              onClick={() => { setOpen(false); navigate('/profile'); }}
              className="w-full px-4 py-2 text-xs font-semibold text-content-secondary hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-emerald-500" /> View Profile
            </button>
            <button
              onClick={() => { setOpen(false); navigate('/settings'); }}
              className="w-full px-4 py-2 text-xs font-semibold text-content-secondary hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
            >
              <Settings className="w-4 h-4 text-emerald-500" /> Account Settings
            </button>
            {user.role === 'admin' && (
              <button
                onClick={() => { setOpen(false); navigate('/admin'); }}
                className="w-full px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <Shield className="w-4 h-4" /> Admin Portal
              </button>
            )}
            {(user.role === 'parent' || user.mode === 'parent') && (
              <button
                onClick={() => { setOpen(false); navigate('/parent-dashboard'); }}
                className="w-full px-4 py-2 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <User className="w-4 h-4" /> Parent Portal
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-border-light px-2">
            <button
              onClick={() => {
                setOpen(false);
                logout();
                navigate('/login');
              }}
              className="w-full px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl flex items-center gap-2 transition-colors"
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
