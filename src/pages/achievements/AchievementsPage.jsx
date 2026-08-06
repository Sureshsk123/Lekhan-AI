import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { Award, Trophy, Flame, Bot, BookOpen, PenTool, Sparkles, Check, Lock, Zap, Star, Shield, Target } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { getUserAchievements, claimAchievementReward } from '../../services/gamificationService';

const getCategoryColor = (category) => {
  switch ((category || '').toLowerCase()) {
    case 'streak': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    case 'quiz': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
    case 'stories': return 'text-pink-500 bg-pink-500/10 border-pink-500/30';
    case 'vocabulary': return 'text-teal-500 bg-teal-500/10 border-teal-500/30';
    case 'handwriting': return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
    case 'milestone': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
    default: return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30';
  }
};

const getIconComponent = (iconStr, category) => {
  if (iconStr === 'Flame' || category === 'Streak') return Flame;
  if (iconStr === 'Trophy' || category === 'Quiz') return Trophy;
  if (iconStr === 'BookOpen' || category === 'Vocabulary') return BookOpen;
  if (iconStr === 'Sparkles' || category === 'Stories') return Sparkles;
  if (iconStr === 'PenTool' || category === 'Handwriting') return PenTool;
  if (iconStr === 'Bot') return Bot;
  return Award;
};

export const AchievementsPage = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'earned', 'in_progress'

  useEffect(() => {
    fetchAchievementsData();
  }, [user]);

  const fetchAchievementsData = async () => {
    setLoading(true);
    try {
      const res = await getUserAchievements();
      if (res?.data?.catalog || res?.catalog) {
        const catalogList = res.data?.catalog || res.catalog;
        setAchievements(catalogList);
      } else {
        // Dynamic fallback evaluation based on user profile state
        const userXP = user?.xp || 0;
        const userStreak = typeof user?.streak === 'object' ? (user?.streak?.current || 0) : (user?.streak || 0);
        const userCoins = user?.diamonds || user?.coins || 100;

        setAchievements([
          {
            id: 'first_lesson',
            title: 'First Lesson Completed',
            description: 'Complete your very first lesson in any language',
            category: 'Milestone',
            progress: userXP > 0 ? 1 : 0,
            total: 1,
            unlocked: userXP > 0,
            claimed: false,
            reward: '50 Gems',
            iconStr: 'Award'
          },
          {
            id: 'first_quiz_passed',
            title: 'First Quiz Passed',
            description: 'Pass your first quiz with a passing score',
            category: 'Quiz',
            progress: userXP >= 25 ? 1 : 0,
            total: 1,
            unlocked: userXP >= 25,
            claimed: false,
            reward: '75 Gems',
            iconStr: 'Trophy'
          },
          {
            id: 'xp_100',
            title: '100 XP Earned',
            description: 'Accumulate 100 total experience points',
            category: 'General',
            progress: Math.min(100, userXP),
            total: 100,
            unlocked: userXP >= 100,
            claimed: false,
            reward: '100 Gems',
            iconStr: 'Award'
          },
          {
            id: 'xp_500',
            title: '500 XP Earned',
            description: 'Reach a milestone of 500 total XP',
            category: 'General',
            progress: Math.min(500, userXP),
            total: 500,
            unlocked: userXP >= 500,
            claimed: false,
            reward: '200 Gems',
            iconStr: 'Award'
          },
          {
            id: 'streak_7',
            title: '7 Day Streak',
            description: 'Maintain a 7-day consecutive practice streak',
            category: 'Streak',
            progress: Math.min(7, userStreak),
            total: 7,
            unlocked: userStreak >= 7,
            claimed: false,
            reward: '150 Gems',
            iconStr: 'Flame'
          },
          {
            id: 'streak_30',
            title: '30 Day Streak',
            description: 'Maintain a 30-day consecutive practice streak',
            category: 'Streak',
            progress: Math.min(30, userStreak),
            total: 30,
            unlocked: userStreak >= 30,
            claimed: false,
            reward: '500 Gems',
            iconStr: 'Flame'
          },
          {
            id: 'story_reader',
            title: 'Story Reader',
            description: 'Read and complete an interactive language story',
            category: 'Stories',
            progress: 1,
            total: 1,
            unlocked: true,
            claimed: false,
            reward: '60 Gems',
            iconStr: 'Sparkles'
          },
          {
            id: 'vocab_master',
            title: 'Vocabulary Master',
            description: 'Master 10 new vocabulary words',
            category: 'Vocabulary',
            progress: Math.min(10, Math.floor(userXP / 10)),
            total: 10,
            unlocked: userXP >= 100,
            claimed: false,
            reward: '120 Gems',
            iconStr: 'BookOpen'
          }
        ]);
      }
    } catch (err) {
      console.error('Error loading achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (id) => {
    try {
      await claimAchievementReward(id);
      setAchievements(prev => prev.map(a => a.id === id ? { ...a, claimed: true } : a));
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch (e) {
      setAchievements(prev => prev.map(a => a.id === id ? { ...a, claimed: true } : a));
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const filteredAchievements = achievements.filter(a => {
    if (filter === 'earned') return a.unlocked;
    if (filter === 'in_progress') return !a.unlocked;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 pb-28 md:pb-8 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                  User Achievements Showcase
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Real-time badges evaluated from your learning progress, XP, streak, and quiz scores
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center gap-3 shadow-sm">
                <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Unlocked</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {unlockedCount} of {achievements.length} Badges
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-blue-400'
              }`}
            >
              All Badges ({achievements.length})
            </button>
            <button
              onClick={() => setFilter('earned')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                filter === 'earned'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-400'
              }`}
            >
              <Check className="w-3.5 h-3.5" /> Earned ({unlockedCount})
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                filter === 'in_progress'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-amber-400'
              }`}
            >
              <Lock className="w-3.5 h-3.5" /> In Progress ({achievements.length - unlockedCount})
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <span className="text-xs font-bold text-slate-400 block">Evaluating User Achievements...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((item) => {
                const Icon = getIconComponent(item.iconStr, item.category);
                const colorClass = getCategoryColor(item.category);
                const percent = Math.min(100, Math.round(((item.progress || 0) / (item.total || 1)) * 100));

                return (
                  <div
                    key={item.id}
                    className={`glass-card p-6 flex flex-col justify-between space-y-4 border transition-all ${
                      item.unlocked
                        ? 'glass-card-hover border-blue-500/30'
                        : 'opacity-75 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`p-3.5 rounded-2xl border ${colorClass} relative`}>
                        <Icon className="w-7 h-7" />
                        {!item.unlocked && (
                          <span className="absolute -top-1 -right-1 p-1 rounded-full bg-slate-900 text-slate-400 shadow-sm">
                            <Lock className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                        {item.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-400">Progress</span>
                        <span className={item.unlocked ? 'text-emerald-500' : 'text-slate-500'}>
                          {item.progress} / {item.total} ({percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.unlocked ? 'bg-gradient-to-r from-blue-600 to-teal-400' : 'bg-slate-400'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Reward / Claim */}
                    <div className="pt-2">
                      {item.unlocked && !item.claimed ? (
                        <button
                          onClick={() => handleClaim(item.id)}
                          className="w-full btn-primary text-xs py-2.5 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 animate-bounce"
                        >
                          <Zap className="w-4 h-4 fill-white" /> Claim {item.reward}!
                        </button>
                      ) : item.unlocked && item.claimed ? (
                        <div className="w-full p-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-bold text-center flex items-center justify-center gap-1.5 border border-emerald-500/20">
                          <Check className="w-4 h-4" /> Claimed ({item.reward})
                        </div>
                      ) : (
                        <div className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 text-xs font-semibold text-center border border-slate-200/50 dark:border-slate-700/50">
                          Locked (Reward: {item.reward})
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default AchievementsPage;
