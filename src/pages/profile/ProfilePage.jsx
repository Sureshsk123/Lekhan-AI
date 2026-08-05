import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Globe, Zap, BookOpen, Award, Star, LogOut, Flame, Clock, ShieldCheck, Download, Sparkles, CheckCircle2, ChevronRight, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { user, logout, activeLanguage } = useAuth();
  const navigate = useNavigate();
  const [selectedCert, setSelectedCert] = useState(null);
  const [dashStats, setDashStats] = useState(null);

  useEffect(() => {
    import('../../services/smartDashboardService').then(m => {
      m.getSmartDashboard(activeLanguage || 'ta').then(res => {
        if (res?.data?.stats) setDashStats(res.data.stats);
      }).catch(() => {});
    });
  }, [activeLanguage]);

  const fullName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.username || 'Scholar';
  const initial = fullName.charAt(0).toUpperCase();

  const certificates = [
    { id: '1', title: 'Spanish A1 Beginner Certificate', date: 'August 2026', level: 'Beginner', issuer: 'LangSphere AI Academy' },
    { id: '2', title: 'Indic Script Calligraphy Foundations', date: 'July 2026', level: 'Intermediate', issuer: 'LangSphere AI Vision Lab' },
  ];

  // 365 activity heatmap simulated squares
  const heatmapDays = Array.from({ length: 91 }, (_, i) => ({
    day: i,
    count: Math.floor(Math.random() * 4),
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 pb-24 md:pb-8 min-w-0">
          
          {/* Header Profile Hero Card */}
          <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-blue-600/20 via-teal-500/10 to-purple-600/20 border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white font-black text-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 border-4 border-white dark:border-slate-800">
                  {initial}
                </div>
                <span className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-amber-500 text-slate-900 font-extrabold text-xs shadow-md">
                  👑 Lv.{user?.level || 5}
                </span>
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                  {fullName}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{user?.email}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-500 border border-blue-500/30">
                    Grandmaster Scholar
                  </span>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-500 border border-teal-500/30">
                    Verified Learner
                  </span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={() => navigate('/settings')}
                className="flex-1 sm:flex-none btn-secondary text-xs py-2.5 px-4 flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" /> Edit Profile
              </button>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

          {/* Stats Bar Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-4 flex items-center gap-3.5 border-slate-200 dark:border-slate-800">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 shrink-0">
                <Zap className="w-6 h-6 fill-blue-500" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Total XP</span>
                <p className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">
                  {(dashStats?.xp ?? user?.xp ?? 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="glass-card p-4 flex items-center gap-3.5 border-slate-200 dark:border-slate-800">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 shrink-0">
                <Flame className="w-6 h-6 fill-amber-500" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Streak</span>
                <p className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">
                  {(dashStats?.streak ?? user?.streak ?? 0) > 0 ? `${dashStats?.streak ?? user?.streak} Days 🔥` : 'Start Today!'}
                </p>
              </div>
            </div>

            <div className="glass-card p-4 flex items-center gap-3.5 border-slate-200 dark:border-slate-800">
              <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-500 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Study Hours</span>
                <p className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">
                  24.5 hrs
                </p>
              </div>
            </div>

            <div className="glass-card p-4 flex items-center gap-3.5 border-slate-200 dark:border-slate-800">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Lessons</span>
                <p className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">
                  {dashStats?.totalCompleted ?? 0} Done
                </p>
              </div>
            </div>
          </div>

          {/* Activity Heatmap Grid */}
          <div className="glass-card p-6 space-y-4 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" /> Learning Activity Heatmap (Last 90 Days)
              </h3>
              <span className="text-xs font-bold text-emerald-500">Active Daily</span>
            </div>

            <div className="flex flex-wrap gap-1.5 justify-center py-2">
              {heatmapDays.map((d) => (
                <div
                  key={d.day}
                  className={`w-3.5 h-3.5 rounded-sm transition-all ${
                    d.count === 3
                      ? 'bg-blue-600 shadow-xs scale-110'
                      : d.count === 2
                      ? 'bg-blue-500/70'
                      : d.count === 1
                      ? 'bg-blue-500/30'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                  title={`Day ${d.day + 1}: ${d.count * 45} XP`}
                />
              ))}
            </div>
          </div>

          {/* Certificates Showcase Grid */}
          <div className="glass-card p-6 space-y-4 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" /> Verified Language Certificates ({certificates.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-800/60 hover:border-amber-500/50 cursor-pointer flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                        {cert.title}
                      </h4>
                      <p className="text-[10px] text-slate-400">{cert.issuer} • {cert.date}</p>
                    </div>
                  </div>

                  <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Certificate Modal */}
      <Modal isOpen={!!selectedCert} onClose={() => setSelectedCert(null)} title="Official Verified Certificate">
        {selectedCert && (
          <div className="space-y-4 text-center p-4 rounded-3xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/30">
            <Award className="w-12 h-12 text-amber-500 mx-auto" />
            <div>
              <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest block">
                Certificate of Fluency Completion
              </span>
              <h2 className="text-xl font-extrabold font-heading text-slate-900 dark:text-white mt-1">
                {selectedCert.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Issued to <strong>{fullName}</strong> on {selectedCert.date} by {selectedCert.issuer}
              </p>
            </div>

            <button
              onClick={() => setSelectedCert(null)}
              className="btn-primary text-xs py-2.5 px-6 shadow-lg shadow-amber-500/20"
            >
              Download PDF Certificate
            </button>
          </div>
        )}
      </Modal>

      <MobileBottomNav />
    </div>
  );
};

export default ProfilePage;
