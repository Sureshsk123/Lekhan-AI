import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import { BarChart, ProgressRing } from '../../components/charts/SimpleChart';
import { BarChart2, Clock, Flame, Award, Trophy } from 'lucide-react';
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
      const res = await getSmartDashboard();
      if (res && res.data) setMetrics(res.data);
    } catch (err) {
      console.error('Fetch analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-content-primary flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden pb-24 lg:pb-12">
          <Breadcrumbs />

          <div>
            <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
              <BarChart2 className="w-7 h-7 text-indigo-500" /> Learning Analytics & Proficiency
            </h1>
            <p className="text-xs text-content-tertiary mt-1">Deep breakdown of learning hours, accuracy ratings, and language progress</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="p-6">
                <h3 className="font-extrabold text-base mb-4 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-emerald-500" /> Daily XP Trajectory
                </h3>
                <BarChart data={metrics?.heatmap || []} height={180} />
              </GlassCard>

              {/* Language Proficiency List */}
              {metrics?.languageProficiency && Object.keys(metrics.languageProficiency).length > 0 && (
                <GlassCard className="p-6 space-y-4">
                  <h3 className="font-extrabold text-base">Language Proficiency Ratings</h3>
                  <div className="space-y-3">
                    {Object.entries(metrics.languageProficiency).map(([lang, rating]) => (
                      <div key={lang} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold capitalize">
                          <span>{lang}</span>
                          <span className="text-emerald-500">{rating}%</span>
                        </div>
                        <div className="w-full bg-surface-tertiary rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-accent-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${rating}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>

            <div className="space-y-6">
              <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
                <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4">Curriculum Progress</h3>
                <ProgressRing progress={metrics?.learningMetrics?.completionPercentage || 45} label="Completed" />
              </GlassCard>
            </div>

          </div>

        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default AnalyticsPage;
