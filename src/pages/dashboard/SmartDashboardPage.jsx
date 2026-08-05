import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { BarChart, ProgressRing } from '../../components/charts/SimpleChart';
import { getSmartDashboard } from '../../services/smartDashboardService';
import {
  Flame, Trophy, Sparkles, BookOpen, Brain,
  ArrowRight, Zap, Bot,
  BookmarkCheck, Play, Gift, Target, Mic
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

export const SmartDashboardPage = () => {
  const { user, activeLanguage } = useAuth();
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dailyChallengeClaimed, setDailyChallengeClaimed] = useState(false);
  const navigate = useNavigate();

  const currentLang = activeLanguage || 'ta';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getSmartDashboard(currentLang);
        if (res?.data) setDashData(res.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentLang]);

  const stats = dashData?.stats || {};
  const xpMetrics = dashData?.xpMetrics || {};
  const heatmap = dashData?.heatmap || [
    { day: 'Mon', xp: 0 },
    { day: 'Tue', xp: 0 },
    { day: 'Wed', xp: 0 },
    { day: 'Thu', xp: 0 },
    { day: 'Fri', xp: 0 },
    { day: 'Sat', xp: 0 },
    { day: 'Sun', xp: 0 },
  ];
  const recent = dashData?.recentActivity || [];
  const recommended = dashData?.recommended || [];

  // Use real stats from API, fallback to user object from auth, then 0
  const xp = stats.xp ?? user?.xp ?? 0;
  const streak = stats.streak ?? user?.streak ?? 0;
  const level = stats.level ?? Math.floor(xp / 200) + 1;
  const xpInLevel = xp % 200;
  const levelPct = Math.min(100, Math.round((xpInLevel / 200) * 100));

  // For leaderboard preview — use recommended/recentActivity or fallback to placeholder
  const topLesson = recommended[0] || null;

  const claimChallenge = () => {
    setDailyChallengeClaimed(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 pb-24 md:pb-8 min-w-0">
          
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 text-white p-6 sm:p-8 shadow-xl shadow-blue-500/20">
            <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Personal Learning Hub</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight">
                  Welcome back, {user?.fullName?.split(' ')[0] || user?.username || 'Scholar'}! 🚀
                </h1>
                <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed font-medium">
                  {streak > 0
                    ? <>You're on a <strong className="text-amber-300 font-extrabold">{streak}-Day Learning Streak!</strong> Keep practicing today to unlock Level {level + 1}.</>
                    : <>Start learning today to begin your streak! Practice daily to unlock Level {level + 1}.</>}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => navigate('/ai-tutor')}
                  className="px-5 py-3 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  <Bot className="w-4 h-4" /> Start AI Chat
                </button>
              </div>
            </div>
          </div>

          {/* Top Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-4 flex items-center gap-3.5 border-slate-200 dark:border-slate-800">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 shrink-0">
                <Zap className="w-6 h-6 fill-blue-500" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Total XP</span>
                <p className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">
                  {xp.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="glass-card p-4 flex items-center gap-3.5 border-slate-200 dark:border-slate-800">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 shrink-0">
                <Flame className="w-6 h-6 fill-amber-500 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Daily Streak</span>
                <p className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">
                  {streak > 0 ? `${streak} Days 🔥` : 'Start Today!'}
                </p>
              </div>
            </div>

            <div className="glass-card p-4 flex items-center gap-3.5 border-slate-200 dark:border-slate-800">
              <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-500 shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Level</span>
                <p className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">
                  Level {level}
                </p>
              </div>
            </div>

            <div className="glass-card p-4 flex items-center gap-3.5 border-slate-200 dark:border-slate-800">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Completed</span>
                <p className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">
                  {stats.totalCompleted || 0} Lessons
                </p>
              </div>
            </div>
          </div>

          {/* Main Content 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column: Continue Learning & Recommended */}
            <div className="lg:col-span-2 space-y-6">

              {/* Continue Learning Banner */}
              <div className="glass-card p-6 border-blue-500/30 bg-gradient-to-r from-blue-600/10 via-slate-900/5 to-transparent space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      {topLesson ? 'Recommended Next' : 'Continue Learning'}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-500">
                      {topLesson?.language?.toUpperCase() || currentLang.toUpperCase()} · {topLesson?.type || 'Beginner'}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {topLesson?.title || 'வணக்கம் சொல்வது (Greetings in Tamil)'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {topLesson ? `+${topLesson.xpReward || 15} XP Reward` : 'Start your first lesson today!'}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(topLesson ? `/lesson/${topLesson.id}` : `/lessons/${currentLang}`)}
                    className="btn-primary text-xs py-2.5 px-5 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 shrink-0"
                  >
                    <Play className="w-4 h-4 fill-white" /> {topLesson ? 'Start Lesson' : 'View Lessons'}
                  </button>
                </div>
              </div>

              {/* AI Smart Recommendation Card */}
              <div className="glass-card p-6 space-y-3 bg-gradient-to-br from-teal-500/10 to-blue-500/5 border-teal-500/30">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-teal-500" />
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    AI Recommendation Insights
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {stats.totalCompleted > 0
                    ? <>Based on your {stats.totalCompleted} completed lessons, keep practicing <strong>conversation skills</strong> to boost fluency. Try a quick quiz or chat with the AI Tutor!</>
                    : <>Start your language journey with <strong>Tamil Greetings</strong> — the essential first step to fluency! Complete Lesson 1 to unlock your first achievement.</>}
                </p>
                <div className="pt-1 flex gap-3">
                  <button
                    onClick={() => navigate('/ai-tutor')}
                    className="btn-accent text-xs py-2 px-4 shadow-md"
                  >
                    Chat with AI Tutor →
                  </button>
                  <button
                    onClick={() => navigate(`/lessons/${currentLang}`)}
                    className="btn-secondary text-xs py-2 px-4"
                  >
                    View Lessons
                  </button>
                </div>
              </div>

              {/* Weekly Progress Animated Chart */}
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" /> Weekly XP Activity
                  </h3>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                    +{xpMetrics.weeklyXP || 0} XP Earned
                  </span>
                </div>
                <BarChart data={heatmap} height={160} />
              </div>

              {/* Daily Challenge Card */}
              <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-500 shrink-0">
                    <Gift className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Daily Learning Quest
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Complete 1 lesson & 1 AI chat session today (+100 XP Bonus)
                    </p>
                  </div>
                </div>

                <button
                  onClick={claimChallenge}
                  disabled={dailyChallengeClaimed}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                    dailyChallengeClaimed
                      ? 'bg-emerald-500/20 text-emerald-500 cursor-default'
                      : 'btn-primary shadow-lg shadow-amber-500/20'
                  }`}
                >
                  {dailyChallengeClaimed ? '✓ Bonus Claimed (+100 XP)' : 'Claim +100 XP Bonus'}
                </button>
              </div>
            </div>

            {/* Right Column: Level Progress & Quick Actions */}
            <div className="space-y-6">

              {/* Level Progress Gauge */}
              <div className="glass-card p-6 text-center space-y-4 flex flex-col items-center">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  Level Progression
                </span>
                <ProgressRing progress={levelPct} label={`Lv ${level}`} />
                <div className="w-full space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-500">
                    <span>{xpInLevel} XP</span>
                    <span>200 XP Goal</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Earn {200 - xpInLevel} more XP to reach Level {level + 1}!
                  </p>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="glass-card p-6 space-y-3">
                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Quick Tools
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: 'Lessons', path: `/lessons/${currentLang}`, icon: BookOpen, color: 'text-blue-500 bg-blue-500/10' },
                    { label: 'AI Tutor', path: '/ai-tutor', icon: Bot, color: 'text-teal-500 bg-teal-500/10' },
                    { label: 'Quiz', path: `/quiz/${currentLang}`, icon: Zap, color: 'text-amber-500 bg-amber-500/10' },
                    { label: 'Pronunciation', path: '/pronunciation', icon: Mic, color: 'text-purple-500 bg-purple-500/10' },
                    { label: 'Stories', path: `/stories/${currentLang}`, icon: BookOpen, color: 'text-rose-500 bg-rose-500/10' },
                    { label: 'Vocabulary', path: '/vocabulary', icon: BookmarkCheck, color: 'text-indigo-500 bg-indigo-500/10' },
                  ].map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.path}
                        onClick={() => navigate(action.path)}
                        className="p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-left transition-all group flex flex-col justify-between space-y-2"
                      >
                        <div className={`p-2 rounded-xl w-fit ${action.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                          {action.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity Card */}
              <div className="glass-card p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" /> Recent Progress
                  </h3>
                  <button
                    onClick={() => navigate('/reports')}
                    className="text-[11px] font-bold text-blue-500 hover:underline"
                  >
                    View All →
                  </button>
                </div>

                {recent.length > 0 ? (
                  <div className="space-y-2">
                    {recent.slice(0, 3).map((act, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate max-w-[130px]">{act.lessonTitle}</p>
                          <p className="text-[10px] text-slate-400">{act.status}</p>
                        </div>
                        <span className={`text-xs font-extrabold ${act.status === 'COMPLETED' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {act.status === 'COMPLETED' ? '✓' : '▶'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
                    <p className="text-xs font-bold text-blue-500">No activity yet</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Complete your first lesson to see progress here!</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default SmartDashboardPage;
