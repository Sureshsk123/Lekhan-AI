import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { Trophy, Award, Flame, Search, Crown, Globe, Users, Flag, Sparkles, TrendingUp, ChevronRight, BookOpen, Coins, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getLeaderboard } from '../../services/gamificationService';

export const LeaderboardPage = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('weekly'); // weekly, monthly, alltime
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchLeaderboardData = async () => {
    try {
      const data = await getLeaderboard(50);
      if (Array.isArray(data) && data.length > 0) {
        setPlayers(data);
      } else {
        // Fallback dynamically generated registered user entry from AuthContext state
        const activeUserName = user?.fullName || user?.username || 'Scholar';
        const activeUserXP = user?.xp || 0;
        const activeUserStreak = typeof user?.streak === 'object' ? (user?.streak?.current || 0) : (user?.streak || 0);

        setPlayers([
          {
            id: user?._id || 'u1',
            rank: 1,
            name: activeUserName,
            username: user?.username || 'scholar',
            xp: activeUserXP,
            level: user?.level || 1,
            streak: activeUserStreak,
            lessonsCompleted: 1,
            coins: user?.diamonds || user?.coins || 100,
            badge: 'Scholar',
            avatar: user?.avatar || 'avatar1.png'
          }
        ]);
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
    // Auto-refresh real-time rankings every 10 seconds
    const interval = setInterval(() => {
      fetchLeaderboardData();
    }, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const activeUserId = user?._id || user?.id;
  const activeUsername = user?.username;

  const processedPlayers = players.map(p => ({
    ...p,
    isUser: Boolean(
      (activeUserId && String(p.id) === String(activeUserId)) ||
      (activeUsername && p.username === activeUsername)
    )
  }));

  const filteredPlayers = processedPlayers.filter(p =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.username || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const top3 = processedPlayers.slice(0, 3);
  while (top3.length < 3) {
    top3.push({
      rank: top3.length + 1,
      name: `Scholar #${top3.length + 1}`,
      xp: 0,
      streak: 0,
      level: 1,
      lessonsCompleted: 0,
      coins: 0,
      badge: 'Learner'
    });
  }

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
                <div className="p-2 rounded-xl bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                  <Trophy className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                  Real-Time Live Leaderboard
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                <span>Real registered users ranked by XP, Completed Lessons, Streak & Gems</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              </p>
            </div>

            {/* Timeframe & Refresh Indicator Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={fetchLeaderboardData}
                title="Refresh rankings"
                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-500 hover:text-blue-500 transition-colors shadow-xs"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-500' : ''}`} />
              </button>

              <div className="flex p-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
                {['weekly', 'monthly', 'alltime'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                      timeframe === t
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3D Animated Podium for Top 3 */}
          <div className="glass-card p-6 sm:p-8 bg-gradient-to-b from-blue-600/10 via-slate-900/5 to-transparent relative overflow-hidden">
            <div className="text-center mb-6">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500 flex items-center justify-center gap-1.5">
                <Crown className="w-4 h-4" /> Top Live Champions
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto items-end pt-4">
              {/* 2nd Place (Silver) */}
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-900 font-black text-xl flex items-center justify-center ring-4 ring-slate-300 shadow-xl">
                    {top3[1]?.name ? top3[1].name.charAt(0).toUpperCase() : '2'}
                  </div>
                  <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-slate-300 text-slate-800 text-xs font-black flex items-center justify-center shadow-md">
                    2
                  </span>
                </div>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white text-center line-clamp-1">
                  {top3[1]?.name || 'Scholar'}
                </p>
                <p className="text-[10px] text-amber-500 font-extrabold mt-0.5">⚡ {top3[1]?.xp || 0} XP</p>
                <div className="w-full h-24 sm:h-32 mt-3 bg-gradient-to-t from-slate-300/40 to-slate-300/10 rounded-t-2xl border-t-2 border-slate-300 flex items-center justify-center text-slate-400 font-black text-2xl">
                  🥈
                </div>
              </div>

              {/* 1st Place (Gold) */}
              <div className="flex flex-col items-center -top-4 relative">
                <Crown className="w-8 h-8 text-amber-400 fill-amber-400 mb-1 animate-bounce" />
                <div className="relative mb-2">
                  <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-900 font-black text-2xl flex items-center justify-center ring-4 ring-amber-400 shadow-2xl shadow-amber-500/30">
                    {top3[0]?.name ? top3[0].name.charAt(0).toUpperCase() : '1'}
                  </div>
                  <span className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-amber-400 text-slate-900 text-xs font-black flex items-center justify-center shadow-lg">
                    1
                  </span>
                </div>
                <p className="text-sm font-black text-slate-900 dark:text-white text-center line-clamp-1">
                  {top3[0]?.name || 'Champion'}
                </p>
                <p className="text-xs text-amber-400 font-black mt-0.5">⚡ {top3[0]?.xp || 0} XP</p>
                <div className="w-full h-32 sm:h-40 mt-3 bg-gradient-to-t from-amber-400/40 via-amber-400/20 to-amber-400/10 rounded-t-2xl border-t-2 border-amber-400 flex items-center justify-center text-amber-400 font-black text-3xl shadow-lg">
                  🥇
                </div>
              </div>

              {/* 3rd Place (Bronze) */}
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-800 to-amber-600 text-white font-black text-xl flex items-center justify-center ring-4 ring-amber-700 shadow-xl">
                    {top3[2]?.name ? top3[2].name.charAt(0).toUpperCase() : '3'}
                  </div>
                  <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-black flex items-center justify-center shadow-md">
                    3
                  </span>
                </div>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white text-center line-clamp-1">
                  {top3[2]?.name || 'Scholar'}
                </p>
                <p className="text-[10px] text-amber-500 font-extrabold mt-0.5">⚡ {top3[2]?.xp || 0} XP</p>
                <div className="w-full h-20 sm:h-28 mt-3 bg-gradient-to-t from-amber-700/40 to-amber-700/10 rounded-t-2xl border-t-2 border-amber-700 flex items-center justify-center text-amber-700 font-black text-2xl">
                  🥉
                </div>
              </div>
            </div>
          </div>

          {/* Player Ranks List */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Active Registered Learners ({filteredPlayers.length})</span>
              </h3>

              <div className="relative w-48 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search learner..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none border border-slate-200 dark:border-slate-700 focus:border-blue-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <span className="text-xs text-slate-400 font-medium block">Loading Real-Time Rankings...</span>
              </div>
            ) : filteredPlayers.length === 0 ? (
              <div className="py-12 text-center space-y-2 text-slate-400">
                <p className="text-sm font-medium">No registered learners found matching "{searchTerm}"</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPlayers.map((player) => (
                  <div
                    key={player.rank}
                    className={`p-3.5 rounded-2xl flex items-center justify-between border transition-all ${
                      player.isUser
                        ? 'bg-blue-600/10 border-blue-500/40 ring-1 ring-blue-500/30 shadow-md'
                        : 'bg-white/60 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <span className={`w-7 text-center font-black text-sm shrink-0 ${
                        player.rank === 1 ? 'text-amber-400' : player.rank === 2 ? 'text-slate-300' : player.rank === 3 ? 'text-amber-700' : 'text-slate-400'
                      }`}>
                        #{player.rank}
                      </span>

                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                        {player.name ? player.name.charAt(0).toUpperCase() : 'S'}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {player.name}
                          </p>
                          {player.isUser && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-500 text-white uppercase shrink-0">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>Level {player.level || 1}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-blue-500" />
                            {player.lessonsCompleted || 0} Lessons
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{player.streak || 0}d</span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 block">
                          ⚡ {player.xp || 0} XP
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold">{player.badge || 'Scholar'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default LeaderboardPage;
