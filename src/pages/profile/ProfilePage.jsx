import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import GlassCard from '../../components/common/GlassCard';
import { useAuth } from '../../context/AuthContext';
import { getSmartDashboard } from '../../services/smartDashboardService';
import {
  User, Mail, Globe, Zap, BookOpen, Award, Star, LogOut,
  CheckCircle2, BookMarked, Layers, ArrowRight, TrendingUp
} from 'lucide-react';

const LANG_META = {
  tamil:    { name: 'Tamil',    flag: '🇮🇳', native: 'தமிழ்' },
  telugu:   { name: 'Telugu',   flag: '🇮🇳', native: 'తెలుగు' },
  hindi:    { name: 'Hindi',    flag: '🇮🇳', native: 'हिन्दी' },
  malayalam:{ name: 'Malayalam',flag: '🇮🇳', native: 'മലയാളം' },
  kannada:  { name: 'Kannada', flag: '🇮🇳', native: 'ಕನ್ನಡ' },
};

export const ProfilePage = () => {
  const { user, activeLanguage, logout } = useAuth();
  const navigate = useNavigate();
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getSmartDashboard(activeLanguage);
        if (res?.data) setDashData(res.data);
      } catch {
        // silent fail — user info still shows
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeLanguage]);

  const stats = dashData?.stats || {};
  const recommended = dashData?.recommended || [];

  const xp = stats.xp ?? user?.xp ?? 0;
  const coins = stats.coins ?? user?.coins ?? 0;
  const streak = stats.streak ?? 0;
  const totalCompleted = stats.totalCompleted ?? 0;
  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;
  const levelPct = Math.min(100, Math.round((xpInLevel / 100) * 100));

  const fullName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.username || 'Learner';
  const langMeta = LANG_META[activeLanguage] || { name: activeLanguage, flag: '🌐', native: '' };

  // Avatar initials
  const initials = fullName.split(' ').map(n => n[0]?.toUpperCase()).slice(0, 2).join('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-transparent text-content-primary flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto pb-24 lg:pb-12">

          {/* Profile Hero */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white p-6 sm:p-8 shadow-xl">
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 70% 50%, white 0%, transparent 60%)'}} />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-2xl font-black text-white shrink-0 backdrop-blur-sm">
                {user?.avatarUrl
                  ? <img src={user.avatarUrl} alt={fullName} className="w-full h-full rounded-full object-cover" />
                  : initials
                }
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-black">{fullName}</h1>
                <p className="text-emerald-100 text-sm mt-0.5">{user?.email}</p>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                    🌟 Level {level} Scholar
                  </span>
                  <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                    {langMeta.flag} {langMeta.name}
                  </span>
                  <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                    🔥 {streak} day streak
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-content-tertiary uppercase tracking-wide">Level {level} Progress</span>
              <span className="text-xs font-bold text-emerald-500">{xpInLevel} / 100 XP</span>
            </div>
            <div className="w-full bg-surface-tertiary rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${levelPct}%` }}
              />
            </div>
            <p className="text-xs text-content-tertiary mt-2">{100 - xpInLevel} XP to reach Level {level + 1}</p>
          </GlassCard>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total XP', value: xp.toLocaleString(), icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'Coins', value: coins.toLocaleString(), icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
              { label: 'Lessons Done', value: totalCompleted, icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Day Streak', value: `${streak} 🔥`, icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-500/10' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <GlassCard key={label} hover={false} className="p-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${bg} ${color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-content-tertiary uppercase tracking-wide">{label}</p>
                  <p className="text-lg font-black">{loading ? '—' : value}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Account Info */}
            <div className="lg:col-span-2 space-y-6">

              {/* Personal Info */}
              <GlassCard className="p-6 space-y-4">
                <h2 className="font-extrabold text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" /> Account Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-tertiary/50">
                    <User className="w-4 h-4 text-content-tertiary shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-content-tertiary uppercase">Full Name</p>
                      <p className="text-sm font-semibold">{fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-tertiary/50">
                    <Mail className="w-4 h-4 text-content-tertiary shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-content-tertiary uppercase">Email</p>
                      <p className="text-sm font-semibold">{user?.email || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-tertiary/50">
                    <Globe className="w-4 h-4 text-content-tertiary shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-content-tertiary uppercase">Learning Language</p>
                      <p className="text-sm font-semibold capitalize">
                        {langMeta.flag} {langMeta.name}
                        {langMeta.native && <span className="text-content-tertiary ml-1.5 text-xs">({langMeta.native})</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-tertiary/50">
                    <Star className="w-4 h-4 text-content-tertiary shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-content-tertiary uppercase">Current Level</p>
                      <p className="text-sm font-semibold">Level {level} — {xp} XP total</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Recommended Next */}
              {recommended.length > 0 && (
                <GlassCard className="p-6">
                  <h2 className="font-extrabold text-base flex items-center gap-2 mb-4">
                    <Layers className="w-4 h-4 text-teal-500" /> Continue Learning
                  </h2>
                  <div className="space-y-2">
                    {recommended.slice(0, 3).map((rec) => (
                      <div
                        key={rec.id}
                        onClick={() => navigate(`/lesson/${rec.id}`)}
                        className="p-4 rounded-xl bg-surface-tertiary/70 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-border-light cursor-pointer flex items-center justify-between transition-all group"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-content-primary group-hover:text-emerald-600 transition-colors">{rec.title}</h4>
                          <p className="text-xs text-content-tertiary mt-0.5 capitalize">{rec.type} · +{rec.xpReward} XP</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-content-tertiary group-hover:text-emerald-500 group-hover:translate-x-1 transition-all shrink-0" />
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>

            {/* Right: Actions */}
            <div className="space-y-4">
              <GlassCard className="p-6 space-y-3">
                <h2 className="font-extrabold text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Quick Actions
                </h2>

                <button
                  onClick={() => navigate('/settings')}
                  className="w-full py-3 px-4 rounded-xl bg-surface-tertiary hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-sm font-semibold text-content-primary text-left flex items-center justify-between transition-all group"
                >
                  <span>⚙️ Account Settings</span>
                  <ArrowRight className="w-4 h-4 text-content-tertiary group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => navigate(`/lessons/${activeLanguage || 'tamil'}`)}
                  className="w-full py-3 px-4 rounded-xl bg-surface-tertiary hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-sm font-semibold text-content-primary text-left flex items-center justify-between transition-all group"
                >
                  <span>📚 Learning Path</span>
                  <ArrowRight className="w-4 h-4 text-content-tertiary group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => navigate(`/stories/${activeLanguage || 'tamil'}`)}
                  className="w-full py-3 px-4 rounded-xl bg-surface-tertiary hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-sm font-semibold text-content-primary text-left flex items-center justify-between transition-all group"
                >
                  <span>📖 Read Stories</span>
                  <ArrowRight className="w-4 h-4 text-content-tertiary group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => navigate('/shop')}
                  className="w-full py-3 px-4 rounded-xl bg-surface-tertiary hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-sm font-semibold text-content-primary text-left flex items-center justify-between transition-all group"
                >
                  <span>🛍️ Shop ({coins} coins)</span>
                  <ArrowRight className="w-4 h-4 text-content-tertiary group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                </button>

                <div className="pt-3 border-t border-border-light">
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors border border-rose-200 dark:border-rose-800"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </GlassCard>

              {/* Achievement badges */}
              <GlassCard className="p-5">
                <h3 className="font-extrabold text-sm text-content-tertiary uppercase tracking-wider mb-3">
                  <BookMarked className="w-3.5 h-3.5 inline mr-1 text-emerald-500" /> Achievements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {totalCompleted >= 1 && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">🎯 First Lesson</span>
                  )}
                  {streak >= 3 && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">🔥 3-Day Streak</span>
                  )}
                  {xp >= 100 && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">⭐ 100 XP Club</span>
                  )}
                  {totalCompleted >= 5 && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">📚 5 Lessons</span>
                  )}
                  {totalCompleted === 0 && xp === 0 && (
                    <p className="text-xs text-content-tertiary">Complete your first lesson to earn achievements!</p>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>

        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default ProfilePage;
