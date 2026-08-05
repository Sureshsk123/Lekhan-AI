import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { Star, Lock, Trophy, Flame, BookOpen, Sparkles, CheckCircle, ChevronRight, Zap, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '../../services/apiClient';
import { LANGUAGES } from '../../components/layout/LanguageSwitcher';
import { useAuth } from '../../context/AuthContext';

export const LessonsListPage = () => {
  const { language } = useParams();
  const { activeLanguage } = useAuth();
  const effectiveLang = language || activeLanguage || 'ta';
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [effectiveLang]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lessonsRes, progressRes] = await Promise.all([
        apiClient.get(`/v1/lessons/${effectiveLang}`).catch(() => ({ data: { data: [] } })),
        apiClient.get(`/v1/lessons/progress/${effectiveLang}`).catch(() => ({ data: { progress: { lessonsCompleted: [], xpEarned: 0 } } }))
      ]);

      const modules = lessonsRes.data?.data || [];
      const fetchedProgress = progressRes.data?.progress || { lessonsCompleted: [], weeklyActivity: [], streak: 0 };

      let fetchedLessons = [];
      modules.forEach(module => {
        module.topics.forEach(topic => {
          topic.lessons.forEach(lesson => {
            fetchedLessons.push({
              ...lesson,
              _id: lesson.id || lesson._id,
              unit: module.order || 1,
              unitTitle: module.title || 'Foundations & Greetings',
              lessonNumber: lesson.order || 1,
              duration: '8 mins',
              difficulty: 'Beginner',
            });
          });
        });
      });

      setLessons(fetchedLessons);
      setProgress(fetchedProgress);
    } catch (err) {
      console.error('Fetch lessons error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Build completed set from real database progress (no fallback hardcoded IDs)
  const completedIds = new Set(progress?.lessonsCompleted?.map(l => l.lessonId) || []);

  const currentLangObj = LANGUAGES.find(l => l.code === effectiveLang) || LANGUAGES[0];

  // Group lessons by Unit
  const units = {};
  lessons.forEach(l => {
    const key = l.unit || 1;
    if (!units[key]) units[key] = [];
    units[key].push(l);
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 pb-24 md:pb-8 min-w-0">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                {currentLangObj.flag}
              </div>
              <div>
                <h1 className="text-xl font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{currentLangObj.name} Learning Path</span>
                  <span className="text-xs text-blue-500 font-mono font-bold">({currentLangObj.native})</span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Progressive skill tree from Beginner to Advanced
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-extrabold">
                <Flame className="w-4 h-4 fill-amber-500 animate-bounce" />
                <span>{progress?.streak || 0} Day Streak</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-extrabold">
                <Zap className="w-4 h-4 fill-blue-500" />
                <span>{progress?.xpEarned || 0} XP</span>
              </div>
            </div>
          </div>

          {/* Language Selector Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => navigate(`/lessons/${lang.code}`)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                  effectiveLang === lang.code
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>

          {/* Learning Path Container */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-extrabold text-slate-400">Loading {currentLangObj.name} Skill Tree...</p>
            </div>
          ) : lessons.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-bold text-slate-500">No lessons found for {currentLangObj.name}</p>
              <p className="text-xs text-slate-400">Check back soon — more content is being added!</p>
            </div>
          ) : (
            <div className="max-w-xl mx-auto py-8 space-y-16">
              {Object.keys(units).map((unitKey, unitIdx) => {
                const unitLessons = units[unitKey];
                const unitTitle = unitLessons[0]?.unitTitle || `Unit ${unitKey}: Foundations`;
                const unitCompleted = unitLessons.filter(l => completedIds.has(l._id)).length;

                return (
                  <div key={unitKey} className="space-y-8">
                    {/* Unit Header Card */}
                    <div className="glass-card p-6 bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 text-white border-none shadow-xl shadow-blue-500/20 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">
                          Level {unitKey} Progression
                        </span>
                        <h2 className="text-xl font-extrabold font-heading mt-0.5">{unitTitle}</h2>
                        <p className="text-xs text-blue-100 mt-1">
                          {unitCompleted}/{unitLessons.length} Lessons Complete · +{unitLessons.length * 50} XP Total
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Nodes Path */}
                    <div className="flex flex-col items-center space-y-10 relative">
                      {unitLessons.map((lesson, idx) => {
                        const isCompleted = completedIds.has(lesson._id);
                        // First lesson always active; subsequent lessons unlock only if previous is completed
                        const isActive = idx === 0 || completedIds.has(unitLessons[idx - 1]?._id);
                        const isLocked = !isCompleted && !isActive;

                        // Zigzag sine wave offset
                        const offset = Math.sin(idx * Math.PI / 1.8) * 60;

                        return (
                          <motion.div
                            key={lesson._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.08 }}
                            className="relative flex flex-col items-center group"
                            style={{ transform: `translateX(${offset}px)` }}
                          >
                            {/* Connecting SVG Curve */}
                            {idx < unitLessons.length - 1 && (
                              <svg className="absolute top-full left-1/2 -translate-x-1/2 w-48 h-12 -z-10 pointer-events-none">
                                <path
                                  d={`M 96 0 C 96 24, ${96 + Math.sin((idx + 1) * Math.PI / 1.8) * 30} 24, ${96 + Math.sin((idx + 1) * Math.PI / 1.8) * 30} 48`}
                                  fill="none"
                                  stroke={isCompleted ? "#2563EB" : "#94A3B8"}
                                  strokeWidth="6"
                                  strokeDasharray={isLocked ? "6 6" : "none"}
                                />
                              </svg>
                            )}

                            {/* Node Button */}
                            <button
                              onClick={() => {
                                if (!isLocked) navigate(`/lesson/${lesson._id}`);
                              }}
                              onMouseEnter={() => setSelectedNode(lesson)}
                              className={`w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-xl transition-all relative ${
                                isCompleted
                                  ? 'bg-gradient-to-tr from-blue-600 to-blue-500 text-white hover:scale-110 active:scale-95 shadow-blue-500/30'
                                  : isActive
                                  ? 'bg-gradient-to-tr from-teal-400 to-emerald-500 text-white ring-4 ring-teal-400/40 ring-offset-4 dark:ring-offset-slate-900 hover:scale-110 active:scale-95 shadow-teal-500/30 animate-pulse-subtle'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700 cursor-not-allowed'
                              }`}
                            >
                              {isCompleted ? (
                                <Star className="w-8 h-8 fill-yellow-300 text-yellow-300 drop-shadow" />
                              ) : isLocked ? (
                                <Lock className="w-7 h-7 stroke-[2]" />
                              ) : (
                                <Play className="w-8 h-8 fill-white text-white translate-x-0.5" />
                              )}

                              {isActive && !isCompleted && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white dark:border-slate-900 animate-ping" />
                              )}
                            </button>

                            {/* Title Label */}
                            <div className="mt-2 text-center max-w-[140px]">
                              <p className={`text-xs font-bold truncate ${
                                isCompleted || isActive ? 'text-slate-900 dark:text-white font-extrabold' : 'text-slate-400'
                              }`}>
                                {lesson.title}
                              </p>
                              <span className="text-[10px] font-black text-amber-500">
                                +{lesson.xpReward || 50} XP
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
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

export default LessonsListPage;
