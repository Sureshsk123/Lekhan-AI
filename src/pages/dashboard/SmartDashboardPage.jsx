import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import { BarChart, ProgressRing } from '../../components/charts/SimpleChart';
import { getSmartDashboard } from '../../services/smartDashboardService';
import {
  Flame, Trophy, Sparkles, BookOpen, Clock, Brain,
  ArrowRight, Award, Coins, Zap, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SmartDashboardPage = () => {
  const { user, activeLanguage } = useAuth();
  const [dashData, setDashData]         = useState(null);
  const [loading, setLoading]           = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getSmartDashboard(activeLanguage);
        if (res?.data) setDashData(res.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeLanguage]);

  const stats       = dashData?.stats       || {};
  const xpMetrics   = dashData?.xpMetrics   || {};
  const heatmap     = dashData?.heatmap     || [];
  const recent      = dashData?.recentActivity || [];
  const recommended = dashData?.recommended || [];
  const attempts    = dashData?.recentAttempts || [];

  // Level progress to next level
  const xp             = stats.xp || user?.xp || 0;
  const level          = stats.level || Math.floor(xp / 100) + 1;
  const xpInLevel      = xp % 100;
  const xpToNextLevel  = 100;
  const levelPct       = Math.min(100, Math.round((xpInLevel / xpToNextLevel) * 100));

  return (
    <div className="min-h-screen bg-transparent text-content-primary flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto pb-24 lg:pb-12">
          <Breadcrumbs />

          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-emerald-600 text-white p-6 sm:p-8 shadow-lg">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-200">
                  Daily Learning Portal
                </span>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-1">
                  Welcome back, {user?.fullName?.split(' ')[0] || user?.username || 'Scholar'}! 👋
                </h1>
                <p className="text-sm text-emerald-100 mt-1 max-w-xl">
                  Currently learning: <strong className="text-white capitalize">{activeLanguage}</strong>
                  <span className="mx-2 opacity-50">|</span>
                  <strong className="text-amber-300">🔥 {stats.streak || 0} day streak</strong>
                  <span className="mx-2 opacity-50">|</span>
                  {stats.totalCompleted > 0
                    ? `${stats.totalCompleted} lessons completed`
                    : 'Start your first lesson today!'}
                </p>
              </div>
              <button
                onClick={() => navigate('/ai-tutor')}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center gap-2 transition-all shrink-0"
              >
                <Sparkles className="w-4 h-4" /> Ask AI Tutor
              </button>
            </div>
          </div>

          {/* Top Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <GlassCard hover={false} className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-content-tertiary">Total XP</p>
                <p className="text-xl font-black">{xp.toLocaleString()}</p>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-content-tertiary">Day Streak</p>
                <p className="text-xl font-black">{stats.streak || 0} 🔥</p>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500">
                <span className="text-lg">🪙</span>
              </div>
              <div>
                <p className="text-xs font-bold text-content-tertiary">Coins</p>
                <p className="text-xl font-black">{(stats.coins || 0).toLocaleString()}</p>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-content-tertiary">Lessons Done</p>
                <p className="text-xl font-black">{stats.totalCompleted || 0}</p>
              </div>
            </GlassCard>
          </div>

          {/* Main 2-col grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Activity + Recommended */}
            <div className="lg:col-span-2 space-y-6">

              {/* Weekly Heatmap */}
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-emerald-500" /> Weekly Activity
                  </h3>
                  <span className="text-xs font-bold text-emerald-600">
                    +{xpMetrics.weeklyXP || 0} XP this week
                  </span>
                </div>
                {heatmap.length > 0
                  ? <BarChart data={heatmap} height={140} />
                  : <div className="h-32 flex items-center justify-center text-sm text-content-tertiary">
                      Start lessons to see activity data!
                    </div>
                }
              </GlassCard>

              {/* Recommended Lessons */}
              {recommended.length > 0 && (
                <GlassCard>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-extrabold text-base flex items-center gap-2">
                      <Brain className="w-5 h-5 text-teal-500" /> Recommended Next
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {recommended.map((rec, i) => (
                      <div
                        key={i}
                        onClick={() => navigate(`/lesson/${rec.id}`)}
                        className="p-4 rounded-xl bg-surface-tertiary/70 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-border-light cursor-pointer flex items-center justify-between transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs font-bold">
                            {rec.language?.toUpperCase() || 'EN'}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-content-primary group-hover:text-emerald-600 transition-colors">
                              {rec.title}
                            </h4>
                            <p className="text-xs text-content-tertiary">
                              {rec.type} · +{rec.xpReward} XP
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-content-tertiary group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Recent Activity */}
              {recent.length > 0 && (
                <GlassCard>
                  <h3 className="font-extrabold text-base mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" /> Recent Activity
                  </h3>
                  <div className="space-y-2">
                    {recent.map((r, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-tertiary/40">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${r.status === 'COMPLETED' ? 'text-emerald-500' : 'text-slate-400'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-content-primary truncate">{r.lessonTitle}</p>
                          <p className="text-xs text-content-tertiary">{r.language}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          r.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>

            {/* Right: Level + Quick Actions */}
            <div className="space-y-6">

              {/* Level Ring */}
              <GlassCard className="flex flex-col items-center text-center p-6">
                <h3 className="font-extrabold text-sm text-content-tertiary uppercase tracking-wider mb-4">
                  Current Level
                </h3>
                <ProgressRing progress={levelPct} label={`Lv ${level}`} />
                <p className="text-xs text-content-tertiary mt-4">
                  {xpInLevel} / {xpToNextLevel} XP to Level {level + 1}
                </p>
              </GlassCard>

              {/* Quick Actions */}
              <GlassCard>
                <h3 className="font-extrabold text-sm text-content-tertiary uppercase tracking-wider mb-3">
                  Quick Access
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Lessons',    icon: '📚', path: `/lessons/${activeLanguage || 'tamil'}` },
                    { label: 'Stories',    icon: '📖', path: `/stories/${activeLanguage || 'tamil'}` },
                    { label: 'Shop',       icon: '🛍️', path: '/shop' },
                    { label: 'Handwriting',icon: '✍️', path: `/handwriting/${activeLanguage || 'tamil'}` },
                    { label: 'AI Tutor',   icon: '🤖', path: '/ai-tutor' },
                    { label: 'Settings',   icon: '⚙️', path: '/settings' },
                  ].map(({ label, icon, path }) => (
                    <button
                      key={path}
                      onClick={() => navigate(path)}
                      className="p-3 rounded-xl bg-surface-tertiary/70 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left transition-colors"
                    >
                      <span className="text-xl">{icon}</span>
                      <p className="text-xs font-bold mt-1 text-content-primary">{label}</p>
                    </button>
                  ))}
                </div>
              </GlassCard>

              {/* Recent Quiz Attempts */}
              {attempts.length > 0 && (
                <GlassCard>
                  <h3 className="font-extrabold text-sm text-content-tertiary uppercase tracking-wider mb-3">
                    Quiz History
                  </h3>
                  <div className="space-y-2">
                    {attempts.slice(0, 3).map((a, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-tertiary/40">
                        <p className="text-xs font-semibold text-content-primary truncate flex-1">{a.quizTitle}</p>
                        <span className={`ml-2 text-xs font-bold shrink-0 ${a.passed ? 'text-emerald-600' : 'text-red-500'}`}>
                          {a.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-content-tertiary pt-4 border-t border-border-light">
            © 2026 LangSphere AI. All Rights Reserved. Developed at SIMATS Engineering.
          </p>

        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default SmartDashboardPage;
