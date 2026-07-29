import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import { BarChart, ProgressRing } from '../../components/charts/SimpleChart';
import { getSmartDashboard } from '../../services/smartDashboardService';
import { getPersonalizedProfile } from '../../services/personalizedService';
import { Flame, Trophy, Sparkles, BookOpen, Clock, Brain, ArrowRight, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SmartDashboardPage = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashRes = await getSmartDashboard();
        if (dashRes && dashRes.data) setMetrics(dashRes.data);

        const recRes = await getPersonalizedProfile();
        if (recRes && recRes.data && recRes.data.recommendations) {
          setRecommendations(recRes.data.recommendations);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden pb-24 lg:pb-12">
          <Breadcrumbs />

          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 text-white p-6 sm:p-8 shadow-xl shadow-emerald-500/20">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-200">
                  Daily Learning Portal
                </span>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-1">
                  Welcome back, {user?.username || 'Scholar'}! 👋
                </h1>
                <p className="text-sm text-emerald-100 mt-1 max-w-xl">
                  You are on a <strong className="text-amber-300">🔥 {user?.streak?.current || 1} day streak</strong>! Keep completing lessons to earn XP and unlock avatars.
                </p>
              </div>

              <button
                onClick={() => navigate('/ai-tutor')}
                className="px-5 py-3 rounded-2xl bg-white text-emerald-700 font-bold text-sm shadow-lg hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0"
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Ask AI Tutor</span>
              </button>
            </div>
          </div>

          {/* Top Quick Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <GlassCard hover={false} className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">Total XP</p>
                <p className="text-xl font-black">{metrics?.xpMetrics?.dailyXP || user?.xp || 0}</p>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">Current Streak</p>
                <p className="text-xl font-black">{user?.streak?.current || 1} Days</p>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-500">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">Study Hours</p>
                <p className="text-xl font-black">{metrics?.learningMetrics?.estimatedLearningHours || '2.5'} h</p>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">Completion</p>
                <p className="text-xl font-black">{metrics?.learningMetrics?.completionPercentage || 45}%</p>
              </div>
            </GlassCard>
          </div>

          {/* Main Dashboard Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (2 cols wide on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Activity Heatmap & XP Trends */}
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-emerald-500" /> Activity Trends (Last 14 Days)
                  </h3>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Weekly XP: +{metrics?.xpMetrics?.weeklyXP || 140}
                  </span>
                </div>
                <BarChart data={metrics?.heatmap || []} height={160} />
              </GlassCard>

              {/* AI Smart Recommendations */}
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    <Brain className="w-5 h-5 text-teal-500" /> AI Weakness Recommendations
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">Personalized</span>
                </div>

                <div className="space-y-3">
                  {recommendations.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 text-center">
                      No weak topics detected! Keep practicing to maintain high accuracy.
                    </div>
                  ) : (
                    recommendations.slice(0, 3).map((rec, idx) => (
                      <div
                        key={idx}
                        onClick={() => navigate(rec.type === 'story' ? '/stories/tamil' : rec.type === 'lesson' ? '/lessons/tamil' : '/quiz/remedial-quiz')}
                        className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer flex items-center justify-between transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-xs uppercase">
                            {rec.type}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 transition-colors">
                              {rec.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{rec.reason}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    ))
                  )}
                </div>
              </GlassCard>

            </div>

            {/* Right Column (1 col wide) */}
            <div className="space-y-6">
              
              {/* Level Progress Ring */}
              <GlassCard className="flex flex-col items-center justify-center text-center p-6">
                <h3 className="font-extrabold text-sm text-slate-500 uppercase tracking-wider mb-4">Level Mastery</h3>
                <ProgressRing progress={metrics?.learningMetrics?.completionPercentage || 45} label="Level 1" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 max-w-xs">
                  Complete 3 more lessons to reach Level 2 Scholar status!
                </p>
              </GlassCard>

              {/* Quick Actions Grid */}
              <GlassCard>
                <h3 className="font-extrabold text-sm text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate('/handwriting/tamil')}
                    className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left transition-colors"
                  >
                    <span className="text-xl">✍️</span>
                    <p className="text-xs font-bold mt-1">Handwriting</p>
                  </button>

                  <button
                    onClick={() => navigate('/vision-ocr')}
                    className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left transition-colors"
                  >
                    <span className="text-xl">📸</span>
                    <p className="text-xs font-bold mt-1">Vision OCR</p>
                  </button>

                  <button
                    onClick={() => navigate('/shop')}
                    className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left transition-colors"
                  >
                    <span className="text-xl">🛍️</span>
                    <p className="text-xs font-bold mt-1">Epic Shop</p>
                  </button>

                  <button
                    onClick={() => navigate('/leaderboard')}
                    className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left transition-colors"
                  >
                    <span className="text-xl">🏆</span>
                    <p className="text-xs font-bold mt-1">Leaderboard</p>
                  </button>
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

export default SmartDashboardPage;
