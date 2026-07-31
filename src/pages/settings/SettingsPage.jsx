import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Settings, User, Moon, Sun, Monitor, Globe, Info, ShieldCheck, FileText, LogOut, CheckCircle2, Trash2 } from 'lucide-react';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const LANGUAGES = [
  { code: 'tamil',    name: 'Tamil',     native: 'தமிழ்' },
  { code: 'telugu',   name: 'Telugu',    native: 'తెలుగు' },
  { code: 'hindi',    name: 'Hindi',     native: 'हिन्दी' },
  { code: 'malayalam',name: 'Malayalam', native: 'മലയാളം' },
  { code: 'kannada',  name: 'Kannada',   native: 'ಕನ್ನಡ' },
];

export const SettingsPage = () => {
  const { user, updateUser, logout, activeLanguage, setActiveLanguage } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || user?.fullName || '');
  const [email] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

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

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-transparent text-content-primary flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden pb-24 lg:pb-12">
          <Breadcrumbs />

          <div>
            <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
              <Settings className="w-7 h-7 text-emerald-500" /> Settings & Preferences
            </h1>
            <p className="text-xs text-content-tertiary mt-1">Manage app settings, appearance, language preference, and policy details</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Theme & Appearance */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" /> Appearance Theme
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
                          : 'border-border-light text-content-tertiary hover:bg-surface-tertiary'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            {/* Language Preference */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-500" /> Language Preference
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {LANGUAGES.map((lang) => {
                  const selected = activeLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => setActiveLanguage(lang.code)}
                      className={`p-3 rounded-2xl border-2 flex items-center justify-between text-xs font-bold transition-all ${
                        selected
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300'
                          : 'border-border-light text-content-secondary hover:bg-surface-tertiary'
                      }`}
                    >
                      <span>{lang.name} ({lang.native})</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            {/* Profile Info */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-500" /> Account Profile
              </h3>

              {saved && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-content-secondary mb-1">Display Name</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-surface-tertiary border border-border-light text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-content-secondary mb-1">Email</label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50 border border-border-light text-xs font-medium opacity-70 cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-md hover:bg-emerald-600 transition-all"
                >
                  Save Profile
                </button>
              </form>
            </GlassCard>

            {/* Legal & About */}
            <GlassCard className="p-6 space-y-3">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" /> About & Policies
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => setAboutModalOpen(true)}
                  className="w-full p-3 rounded-xl bg-surface-tertiary hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-bold text-content-primary flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2"><Info className="w-4 h-4 text-emerald-500" /> About LangSphere AI</span>
                  <span className="text-content-tertiary">v1.0.0</span>
                </button>

                <button
                  onClick={() => setPrivacyModalOpen(true)}
                  className="w-full p-3 rounded-xl bg-surface-tertiary hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-bold text-content-primary flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-teal-500" /> Privacy Policy</span>
                  <span className="text-content-tertiary">View</span>
                </button>

                <button
                  onClick={() => setTermsModalOpen(true)}
                  className="w-full p-3 rounded-xl bg-surface-tertiary hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-bold text-content-primary flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-500" /> Terms of Service</span>
                  <span className="text-content-tertiary">View</span>
                </button>

                <div className="pt-3 border-t border-border-light flex gap-2">
                  <button
                    onClick={handleSignOut}
                    className="flex-1 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-xs hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </GlassCard>

          </div>

        </main>
      </div>

      {/* Modals */}
      <Modal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} title="About LangSphere AI">
        <div className="space-y-3 text-xs leading-relaxed text-content-secondary">
          <p className="font-bold text-sm text-content-primary">LangSphere AI v1.0.0</p>
          <p>LangSphere AI is an interactive language learning platform powered by AI, designed specifically for Indian regional languages including Tamil, Telugu, Hindi, Malayalam, and Kannada.</p>
          <p className="text-content-tertiary pt-2 border-t border-border-light">Developed with ❤️ at SIMATS Engineering.</p>
        </div>
      </Modal>

      <Modal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} title="Privacy Policy">
        <div className="space-y-3 text-xs leading-relaxed text-content-secondary max-h-60 overflow-y-auto">
          <p className="font-bold text-content-primary">Your Privacy Matters</p>
          <p>LangSphere AI collects minimal personal information (name, email, learning activity) solely to provide and improve your language learning experience.</p>
          <p>We do not sell or share your personal data with third parties. All authentication data and passwords are strictly encrypted.</p>
        </div>
      </Modal>

      <Modal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} title="Terms of Service">
        <div className="space-y-3 text-xs leading-relaxed text-content-secondary max-h-60 overflow-y-auto">
          <p className="font-bold text-content-primary">Terms of Use</p>
          <p>By using LangSphere AI, you agree to use the platform for educational purposes. All content, lessons, and cultural stories remain the property of LangSphere AI.</p>
        </div>
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Account Deletion">
        <div className="space-y-4 text-center">
          <p className="text-sm font-medium text-content-secondary">
            This action is permanent and cannot be undone. All learning progress, XP, streak data, and achievements will be erased.
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSignOut} className="flex-1 py-3 rounded-2xl bg-rose-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all">
              Permanently Delete
            </button>
            <button onClick={() => setDeleteModalOpen(false)} className="flex-1 py-3 rounded-2xl bg-surface-tertiary text-xs font-bold">
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
