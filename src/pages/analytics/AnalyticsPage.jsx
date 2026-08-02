import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { BarChart, ProgressRing } from '../../components/charts/SimpleChart';
import { BarChart2, Clock, Flame, Award, Trophy, Sparkles, Brain, BookOpen, Mic, PenTool } from 'lucide-react';
import { getSmartDashboard } from '../../services/smartDashboardService';

export const AnalyticsPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getSmartDashboard().catch(() => ({ data: null }));
      if (res?.data) setMetrics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const heatmap = metrics?.heatmap || [
    { day: 'Mon', xp: 60 },
    { day: 'Tue', xp: 95 },
    { day: 'Wed', xp: 140 },
    { day: 'Thu', xp: 110 },
    { day: 'Fri', xp: 180 },
    { day: 'Sat', xp: 220 },
    { day: 'Sun', xp: 130 },
  ];

  const skillBreakdown = [
    { skill: 'Reading Fluency', score: 92, icon: BookOpen, color: 'bg-blue-500' },
    { skill: 'Voice & Pronunciation', score: 88, icon: Mic, color: 'bg-teal-500' },
    { skill: 'Handwriting Strokes', score: 94, icon: PenTool, color: 'bg-purple-500' },
    { skill: 'Grammar Accuracy', score: 85, icon: Brain, color: 'bg-amber-500' },
  ];

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
                <BarChart2 className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                Learning Analytics & Skill Proficiency
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Comprehensive breakdown of study time, accuracy trends, and language mastery
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: XP Trajectory & Skill Ratings */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-6 space-y-4 border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" /> Daily XP Trajectory
                  </h3>
                  <span className="text-xs font-bold text-blue-500">Weekly Target: 1,000 XP</span>
                </div>
                <BarChart data={heatmap} height={180} />
              </div>

              {/* Skill Proficiency Breakdown */}
              <div className="glass-card p-6 space-y-4 border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" /> Skill Breakdown & Mastery Ratings
                </h3>

                <div className="space-y-4">
                  {skillBreakdown.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.skill} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-800 dark:text-white flex items-center gap-2">
                            <Icon className="w-4 h-4 text-slate-400" /> {item.skill}
                          </span>
                          <span className="text-blue-500 font-extrabold">{item.score}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.color} transition-all duration-700`}
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Gauge & Summary */}
            <div className="space-y-6">
              <div className="glass-card p-6 flex flex-col items-center justify-center text-center space-y-4 border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Overall Curriculum Mastery
                </span>
                <ProgressRing progress={82} label="82%" />
                <p className="text-xs text-slate-500 font-medium">
                  You are ahead of 88% of learners in your cohort!
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default AnalyticsPage;
