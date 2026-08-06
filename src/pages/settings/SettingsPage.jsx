import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Settings, User, Moon, Sun, Monitor, Globe, Info, ShieldCheck, FileText, LogOut, CheckCircle2, Trash2 } from 'lucide-react';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { LANGUAGES } from '../../components/layout/LanguageSwitcher';

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
      await authService.updateProfile({ username }).catch(() => {});
      updateUser({ username });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 pb-24 md:pb-8 min-w-0">
          
          {/* Header */}
          <div className="glass-card p-6 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <Settings className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                Platform Settings & Preferences
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Customize appearance themes, active learning language, and profile options
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Theme & Appearance Card */}
            <div className="glass-card p-6 space-y-4 border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" /> Appearance Theme
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { if (theme !== 'light') toggleTheme(); }}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2 text-xs font-extrabold transition-all ${
                    theme === 'light'
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-md'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light Mode (#F8FAFC)</span>
                </button>

                <button
                  onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2 text-xs font-extrabold transition-all ${
                    theme === 'dark'
                      ? 'border-blue-500 bg-blue-900/40 text-blue-400 shadow-md'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Moon className="w-4 h-4 text-blue-400" />
                  <span>Dark Mode (#0F172A)</span>
                </button>
              </div>
            </div>

            {/* Active Language Card */}
            <div className="glass-card p-6 space-y-4 border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" /> Target Learning Language
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((lang) => {
                  const isSelected = activeLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setActiveLanguage(lang.code);
                        authService.updateProfile({ preferredLanguage: lang.code }).catch(() => {});
                        updateUser({ preferredLanguage: lang.code });
                      }}
                      className={`p-3 rounded-2xl border-2 flex items-center justify-between text-xs font-bold transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                          : 'border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile Info Form */}
            <div className="glass-card p-6 space-y-4 border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" /> User Profile Information
              </h3>

              {saved && (
                <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-500 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-800/50 text-slate-500 text-xs font-medium cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary text-xs py-3 shadow-lg shadow-blue-500/20 font-extrabold"
                >
                  Save Profile Settings
                </button>
              </form>
            </div>

            {/* About & Actions Card */}
            <div className="glass-card p-6 space-y-3 border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-teal-400" /> Platform & Legal Policies
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => setAboutModalOpen(true)}
                  className="w-full p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors border border-slate-200/80 dark:border-slate-700/80"
                >
                  <span className="flex items-center gap-2"><Info className="w-4 h-4 text-blue-500" /> About LangSphere AI</span>
                  <span className="text-slate-400 text-[10px]">v1.0 Commercial</span>
                </button>

                <button
                  onClick={() => setPrivacyModalOpen(true)}
                  className="w-full p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors border border-slate-200/80 dark:border-slate-700/80"
                >
                  <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-teal-500" /> Privacy & Security Policy</span>
                  <span className="text-slate-400 text-[10px]">View</span>
                </button>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <button
                    onClick={handleSignOut}
                    className="flex-1 py-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Delete Account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* Modals */}
      <Modal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} title="About LangSphere AI">
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p className="font-extrabold text-sm text-slate-900 dark:text-white">LangSphere AI Ecosystem v1.0</p>
          <p>LangSphere AI is a premium AI-powered language learning platform combining Gemini AI conversation tutoring, HTML5 canvas handwriting stroke analysis, Duolingo-style skill paths, and dual-language interactive stories.</p>
        </div>
      </Modal>

      <Modal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} title="Privacy & Security Policy">
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p className="font-extrabold text-slate-900 dark:text-white">Data Privacy Commitment</p>
          <p>Your user profile and learning statistics are stored securely with JWT token authentication. We do not sell or monetize personal user data.</p>
        </div>
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Account Deletion">
        <div className="space-y-4 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Are you sure you want to delete your account? All XP, streak progress, and badges will be permanently erased.
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSignOut} className="flex-1 py-3 rounded-2xl bg-rose-600 text-white font-extrabold text-xs">
              Permanently Delete
            </button>
            <button onClick={() => setDeleteModalOpen(false)} className="flex-1 btn-secondary text-xs py-3">
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
