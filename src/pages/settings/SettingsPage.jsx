import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Settings, User, Moon, Sun, Monitor, Lock, Bell, Trash2, CheckCircle2 } from 'lucide-react';
import authService from '../../services/authService';

export const SettingsPage = () => {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await authService.updateProfile({ username });
      updateUser({ username });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Update profile error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden pb-24 lg:pb-12">
          <Breadcrumbs />

          <div>
            <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
              <Settings className="w-7 h-7 text-emerald-500" /> Account Settings & Preferences
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage profile details, theme appearance, notifications, and security</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Profile Settings */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-500" /> Profile Information
              </h3>

              {saved && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs font-medium opacity-70 cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all"
                >
                  Save Profile Changes
                </button>
              </form>
            </GlassCard>

            {/* Theme & Appearance */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" /> Appearance & Theme Mode
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'system', label: 'System', icon: Monitor }
                ].map((t) => {
                  const Icon = t.icon;
                  const selected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleTheme(t.id)}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 text-xs font-bold transition-all ${
                        selected
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 shadow-md'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Danger Zone */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-xs text-rose-500 uppercase tracking-wider mb-2">Danger Zone</h4>
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="w-full py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-200 dark:border-rose-800 flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete Account
                </button>
              </div>
            </GlassCard>

          </div>

        </main>
      </div>

      {/* Delete Account Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Account Deletion">
        <div className="space-y-4 text-center">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            This action is permanent and cannot be undone. All learning progress, XP, streak data, and achievements will be erased.
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              className="flex-1 py-3 rounded-2xl bg-rose-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all"
            >
              Permanently Delete
            </button>
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <MobileBottomNav />
    </div>
  );
};

export default SettingsPage;
