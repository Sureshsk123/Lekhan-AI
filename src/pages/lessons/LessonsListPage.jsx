import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { Star, Lock, Trophy, Flame, BookOpen } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

export const LessonsListPage = () => {
  const { language = 'tamil' } = useParams();
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [language]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      
      const [lessonsRes, progressRes] = await Promise.all([
        axios.get(`${API_URL}/lessons/${language}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_URL}/progress/${language}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).catch(() => ({ data: { progress: { lessonsCompleted: [], xpEarned: 0 } } }))
      ]);

      const fetchedLessons = lessonsRes.data?.data || [];
      const fetchedProgress = progressRes.data?.progress || { lessonsCompleted: [], weeklyActivity: [] };

      // Ensure lessons are sorted by level and unit and lessonNumber
      fetchedLessons.sort((a, b) => {
        if (a.unit !== b.unit) return a.unit - b.unit;
        return a.lessonNumber - b.lessonNumber;
      });

      setLessons(fetchedLessons);
      setProgress(fetchedProgress);
    } catch (err) {
      console.error('Fetch lessons error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCompletedIds = () => {
    if (!progress || !progress.lessonsCompleted) return new Set();
    return new Set(progress.lessonsCompleted.map(l => l.lessonId));
  };

  const completedIds = getCompletedIds();
  
  // Group by Unit
  const units = {};
  lessons.forEach(lesson => {
    if (!units[lesson.unit]) units[lesson.unit] = [];
    units[lesson.unit].push(lesson);
  });

  // Calculate current active lesson
  let activeLessonFound = false;
  let activeLessonId = null;

  lessons.forEach(lesson => {
    if (!activeLessonFound && !completedIds.has(lesson._id)) {
      activeLessonId = lesson._id;
      activeLessonFound = true;
    }
  });

  // If no active found, and we have lessons, all are completed, so maybe the last one is active to replay.
  if (!activeLessonFound && lessons.length > 0) {
    activeLessonId = lessons[lessons.length - 1]._id;
  }

  // Calculate Total XP from weekly activity or overall
  const totalXp = progress?.weeklyActivity?.reduce((sum, day) => sum + (day.xp || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 overflow-y-auto pb-24 lg:pb-12">
          
          {/* Top Sticky Header for Path */}
          <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 font-bold uppercase">
                {language.substring(0, 2)}
              </div>
              <div>
                <h1 className="font-extrabold capitalize text-slate-800 dark:text-white leading-tight">{language}</h1>
                <p className="text-xs text-slate-500 font-medium">Beginner Path</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Flame className="w-5 h-5 fill-current" />
                <span>2</span>
              </div>
              <div className="flex items-center gap-1 text-blue-500 font-bold">
                <Trophy className="w-5 h-5 fill-current" />
                <span>{totalXp} XP</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
               <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-slate-500 font-medium animate-pulse">Loading your learning path...</p>
            </div>
          ) : lessons.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Star className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">No lessons available yet</h2>
              <p className="text-slate-500 mt-2">The curriculum for {language} is currently being built.</p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto py-12 px-4 space-y-16">
              {Object.keys(units).map((unitKey, unitIndex) => {
                const unitLessons = units[unitKey];
                
                return (
                  <div key={unitKey} className="relative">
                    {/* Unit Header */}
                    <div className="bg-emerald-500 text-white p-5 rounded-3xl shadow-lg shadow-emerald-500/20 mb-10 flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-black mb-1">Unit {unitKey}</h2>
                        <p className="text-emerald-100 font-medium text-sm">
                          {unitLessons[0]?.title?.split(':')[0] || 'Foundations'}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Lesson Path */}
                    <div className="relative flex flex-col items-center gap-12 py-4">
                      {unitLessons.map((lesson, idx) => {
                        const isCompleted = completedIds.has(lesson._id);
                        const isActive = lesson._id === activeLessonId;
                        const isLocked = !isCompleted && !isActive;

                        // Calculate zigzag offset
                        // Sin wave: 0, 1, 0, -1, 0...
                        const offset = Math.sin(idx * Math.PI / 2) * 60; // Max offset 60px

                        return (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={lesson._id} 
                            className="relative flex flex-col items-center"
                            style={{ transform: `translateX(${offset}px)` }}
                          >
                            {/* Connecting Line to next node (visual only) */}
                            {idx < unitLessons.length - 1 && (
                              <svg className="absolute top-1/2 left-1/2 w-full h-[120px] -z-10 pointer-events-none" style={{ overflow: 'visible' }}>
                                <path 
                                  d={`M 0 0 Q ${Math.sin((idx + 1) * Math.PI / 2) * 60 - offset} 60, ${Math.sin((idx + 1) * Math.PI / 2) * 60 - offset} 120`}
                                  fill="none" 
                                  stroke={isCompleted ? "#10b981" : "#e2e8f0"} 
                                  strokeWidth="12" 
                                  strokeLinecap="round" 
                                />
                              </svg>
                            )}

                            {/* Node Button */}
                            <button
                              onClick={() => {
                                if (!isLocked) navigate(`/lesson/${lesson._id}`);
                              }}
                              className={`
                                relative w-[72px] h-[72px] rounded-full border-b-8 flex items-center justify-center shadow-md transition-transform active:scale-95
                                ${isCompleted ? 'bg-emerald-500 border-emerald-600 text-white' : ''}
                                ${isActive ? 'bg-emerald-500 border-emerald-600 text-white ring-4 ring-emerald-500/30 ring-offset-4' : ''}
                                ${isLocked ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 cursor-not-allowed' : ''}
                              `}
                            >
                              {isActive && (
                                <span className="absolute -top-2 flex h-4 w-4">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                                </span>
                              )}

                              {isCompleted ? (
                                <Star className="w-8 h-8 fill-current text-yellow-300 drop-shadow" />
                              ) : isLocked ? (
                                <Lock className="w-7 h-7" />
                              ) : (
                                <Star className="w-8 h-8" />
                              )}
                            </button>

                            {/* Tooltip / Label */}
                            <div className="absolute top-[80px] w-48 text-center pointer-events-none">
                              <span className={`text-[12px] font-extrabold uppercase tracking-wide
                                ${isActive ? 'text-emerald-500' : 'text-slate-400'}
                              `}>
                                {lesson.title}
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
