import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { Award, Trophy, Flame, Bot, BookOpen, PenTool, Sparkles, Check, Lock, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AchievementsPage = () => {
  const initialAchievements = [
    {
      id: '1',
      title: '7-Day Streak Master',
      description: 'Practice every day for 7 consecutive days',
      icon: Flame,
      category: 'Streak',
      progress: 7,
      total: 7,
      unlocked: true,
      claimed: true,
      reward: '50 Gems',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    },
    {
      id: '2',
      title: 'AI Scholar',
      description: 'Complete 10 interactive AI Tutor chat conversations',
      icon: Bot,
      category: 'AI Tutor',
      progress: 10,
      total: 10,
      unlocked: true,
      claimed: false,
      reward: '100 Gems',
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    },
    {
      id: '3',
      title: 'Polyglot Pioneer',
      description: 'Master 50 vocabulary words across any language',
      icon: BookOpen,
      category: 'Vocabulary',
      progress: 32,
      total: 50,
      unlocked: false,
      claimed: false,
      reward: '150 Gems',
      color: 'text-teal-500 bg-teal-500/10 border-teal-500/30',
    },
    {
      id: '4',
      title: 'Quiz Champion',
      description: 'Score 100% on 5 language quizzes',
      icon: Trophy,
      category: 'Quiz',
      progress: 5,
      total: 5,
      unlocked: true,
      claimed: false,
      reward: '120 Gems',
      color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
    },
    {
      id: '5',
      title: 'Calligraphy Master',
      description: 'Draw 20 foreign character strokes with >90% accuracy',
      icon: PenTool,
      category: 'Handwriting',
      progress: 14,
      total: 20,
      unlocked: false,
      claimed: false,
      reward: '80 Gems',
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
    },
    {
      id: '6',
      title: 'Story Explorer',
      description: 'Read and complete 3 interactive stories',
      icon: Sparkles,
      category: 'Stories',
      progress: 3,
      total: 3,
      unlocked: true,
      claimed: true,
      reward: '60 Gems',
      color: 'text-pink-500 bg-pink-500/10 border-pink-500/30',
    },
  ];

  const [achievements, setAchievements] = useState(initialAchievements);

  const handleClaim = (id) => {
    setAchievements(prev => prev.map(a => a.id === id ? { ...a, claimed: true } : a));
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 pb-24 md:pb-8 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                  Achievements Showcase
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Unlock badges as you learn, complete daily quests, and claim gem rewards
              </p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center gap-3">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Unlocked</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {unlockedCount} of {achievements.length} Badges
                </span>
              </div>
            </div>
          </div>

          {/* Grid of Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((item) => {
              const Icon = item.icon;
              const percent = Math.min(100, Math.round((item.progress / item.total) * 100));

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
                    <div className={`p-3.5 rounded-2xl border ${item.color} relative`}>
                      <Icon className="w-7 h-7" />
                      {!item.unlocked && (
                        <span className="absolute -top-1 -right-1 p-1 rounded-full bg-slate-900 text-slate-400">
                          <Lock className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
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
                      <div className="w-full p-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4" /> Claimed ({item.reward})
                      </div>
                    ) : (
                      <div className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-semibold text-center">
                        Locked (Reward: {item.reward})
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default AchievementsPage;
