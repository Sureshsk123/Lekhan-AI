import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import { Trophy, Flame, Search, Medal, Globe, Users } from 'lucide-react';
import { getLeaderboard } from '../../services/gamificationService';

export const LeaderboardsPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [category, setCategory] = useState('xp');
  const [scope, setScope] = useState('global');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [category, scope]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await getLeaderboard({ category, scope });
      if (res && res.data) setLeaderboard(res.data);
    } catch (err) {
      console.error('Fetch leaderboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden pb-24 lg:pb-12">
          <Breadcrumbs />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
                <Trophy className="w-7 h-7 text-amber-500" /> Global Leaderboards
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Compete against global language learners across XP, Reading, Speaking, and Handwriting</p>
            </div>

            {/* Scope Toggle */}
            <div className="flex gap-2 bg-slate-200/70 dark:bg-slate-800/70 p-1 rounded-2xl">
              {['global', 'country', 'friends'].map((sc) => (
                <button
                  key={sc}
                  onClick={() => setScope(sc)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                    scope === sc
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {sc}
                </button>
              ))}
            </div>
          </div>

          {/* Top 3 Podium */}
          {top3.length > 0 && (
            <div className="grid grid-cols-3 gap-4 pt-4 items-end max-w-2xl mx-auto">
              {/* 2nd Place */}
              {top3[1] && (
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-300 text-slate-700 font-black text-lg flex items-center justify-center shadow-lg mb-2">
                    🥈
                  </div>
                  <p className="text-xs font-bold truncate max-w-[80px]">{top3[1].username}</p>
                  <p className="text-[10px] font-extrabold text-amber-500">⚡ {top3[1].xp}</p>
                  <div className="w-full h-24 bg-gradient-to-t from-slate-300/40 to-slate-200/20 rounded-t-2xl mt-2"></div>
                </div>
              )}

              {/* 1st Place */}
              {top3[0] && (
                <div className="flex flex-col items-center -translate-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-amber-400 text-white font-black text-2xl flex items-center justify-center shadow-xl shadow-amber-500/30 mb-2">
                    🥇
                  </div>
                  <p className="text-xs font-black truncate max-w-[100px]">{top3[0].username}</p>
                  <p className="text-xs font-black text-amber-500">⚡ {top3[0].xp}</p>
                  <div className="w-full h-32 bg-gradient-to-t from-amber-400/40 to-amber-300/20 rounded-t-2xl mt-2"></div>
                </div>
              )}

              {/* 3rd Place */}
              {top3[2] && (
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-700/60 text-white font-black text-lg flex items-center justify-center shadow-lg mb-2">
                    🥉
                  </div>
                  <p className="text-xs font-bold truncate max-w-[80px]">{top3[2].username}</p>
                  <p className="text-[10px] font-extrabold text-amber-500">⚡ {top3[2].xp}</p>
                  <div className="w-full h-20 bg-gradient-to-t from-amber-800/30 to-amber-700/10 rounded-t-2xl mt-2"></div>
                </div>
              )}
            </div>
          )}

          {/* Standings Table */}
          <GlassCard className="p-4 sm:p-6 space-y-2">
            <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider mb-4">Rankings Table</h3>
            {leaderboard.map((user, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 flex items-center justify-between text-xs sm:text-sm font-semibold"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 font-black text-slate-400">#{idx + 1}</span>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-bold text-xs flex items-center justify-center">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-800 dark:text-white font-bold">{user.username}</span>
                </div>
                <span className="font-black text-amber-500">⚡ {user.xp} XP</span>
              </div>
            ))}
          </GlassCard>

        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default LeaderboardsPage;
