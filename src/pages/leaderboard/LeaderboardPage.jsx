import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { Trophy, Award, Flame, Search, Crown, Globe, Users, Flag, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';

export const LeaderboardPage = () => {
  const [timeframe, setTimeframe] = useState('weekly'); // weekly, monthly, alltime
  const [scope, setScope] = useState('global'); // global, country, friends
  const [searchTerm, setSearchTerm] = useState('');

  const players = [
    { rank: 1, name: 'Sofia Rodriguez', country: '🇪🇸 Spain', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', xp: 4850, streak: 28, level: 14, badge: 'Grandmaster' },
    { rank: 2, name: 'Lucas Dubois', country: '🇫🇷 France', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', xp: 4210, streak: 21, level: 12, badge: 'Polyglot' },
    { rank: 3, name: 'Aarav Sharma', country: '🇮🇳 India', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', xp: 3980, streak: 19, level: 11, badge: 'Scholar' },
    { rank: 4, name: 'Emma Watson', country: '🇬🇧 UK', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80', xp: 3620, streak: 14, level: 10, badge: 'Explorer' },
    { rank: 5, name: 'Kenji Sato', country: '🇯🇵 Japan', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', xp: 3450, streak: 12, level: 9, badge: 'Scholar' },
    { rank: 6, name: 'Alex Johnson (You)', country: '🇺🇸 USA', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', xp: 3240, streak: 7, level: 8, badge: 'Pioneer', isUser: true },
    { rank: 7, name: 'Elena Meyer', country: '🇩🇪 Germany', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80', xp: 2980, streak: 9, level: 8, badge: 'Learner' },
  ];

  const filteredPlayers = players.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const top3 = players.slice(0, 3);
  const rest = filteredPlayers.filter(p => p.rank > 3);

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
                <div className="p-2 rounded-xl bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                  <Trophy className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                  Global Leaderboard
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Compete with learners worldwide, earn XP, and climb the weekly standings
              </p>
            </div>

            {/* Timeframe & Scope Controls */}
            <div className="flex items-center gap-2">
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
          <div className="glass-card p-8 bg-gradient-to-b from-blue-600/10 via-slate-900/5 to-transparent relative overflow-hidden">
            <div className="text-center mb-6">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500 flex items-center justify-center gap-1.5">
                <Crown className="w-4 h-4" /> Top Champions This Week
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto items-end pt-4">
              {/* 2nd Place (Silver) */}
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <img src={top3[1].avatar} alt={top3[1].name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-slate-300 shadow-xl" />
                  <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-slate-300 text-slate-800 text-xs font-black flex items-center justify-center shadow-md">
                    2
                  </span>
                </div>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white text-center line-clamp-1">
                  {top3[1].name}
                </p>
                <p className="text-[10px] text-amber-500 font-extrabold mt-0.5">⚡ {top3[1].xp} XP</p>
                <div className="w-full h-24 sm:h-32 mt-3 bg-gradient-to-t from-slate-300/40 to-slate-300/10 rounded-t-2xl border-t-2 border-slate-300 flex items-center justify-center text-slate-400 font-black text-2xl">
                  🥈
                </div>
              </div>

              {/* 1st Place (Gold) */}
              <div className="flex flex-col items-center -top-4 relative">
                <Crown className="w-8 h-8 text-amber-400 fill-amber-400 mb-1 animate-bounce" />
                <div className="relative mb-2">
                  <img src={top3[0].avatar} alt={top3[0].name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-amber-400 shadow-2xl shadow-amber-500/30" />
                  <span className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-amber-400 text-slate-900 text-xs font-black flex items-center justify-center shadow-lg">
                    1
                  </span>
                </div>
                <p className="text-sm font-black text-slate-900 dark:text-white text-center line-clamp-1">
                  {top3[0].name}
                </p>
                <p className="text-xs text-amber-400 font-black mt-0.5">⚡ {top3[0].xp} XP</p>
                <div className="w-full h-32 sm:h-40 mt-3 bg-gradient-to-t from-amber-400/40 via-amber-400/20 to-amber-400/10 rounded-t-2xl border-t-2 border-amber-400 flex items-center justify-center text-amber-400 font-black text-3xl shadow-lg">
                  🥇
                </div>
              </div>

              {/* 3rd Place (Bronze) */}
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <img src={top3[2].avatar} alt={top3[2].name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-amber-700 shadow-xl" />
                  <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-black flex items-center justify-center shadow-md">
                    3
                  </span>
                </div>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white text-center line-clamp-1">
                  {top3[2].name}
                </p>
                <p className="text-[10px] text-amber-500 font-extrabold mt-0.5">⚡ {top3[2].xp} XP</p>
                <div className="w-full h-20 sm:h-28 mt-3 bg-gradient-to-t from-amber-700/40 to-amber-700/10 rounded-t-2xl border-t-2 border-amber-700 flex items-center justify-center text-amber-700 font-black text-2xl">
                  🥉
                </div>
              </div>
            </div>
          </div>

          {/* Player Ranks List */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Rankings
              </h3>

              <div className="relative w-48 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search learner..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              {filteredPlayers.map((player) => (
                <div
                  key={player.rank}
                  className={`p-3.5 rounded-2xl flex items-center justify-between border transition-all ${
                    player.isUser
                      ? 'bg-blue-600/10 border-blue-500/40 ring-1 ring-blue-500/30'
                      : 'bg-white/60 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <span className={`w-7 text-center font-black text-sm ${
                      player.rank === 1 ? 'text-amber-400' : player.rank === 2 ? 'text-slate-300' : player.rank === 3 ? 'text-amber-700' : 'text-slate-400'
                    }`}>
                      #{player.rank}
                    </span>

                    <img src={player.avatar} alt={player.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {player.name}
                        </p>
                        {player.isUser && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-500 text-white uppercase">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{player.country}</span>
                        <span>•</span>
                        <span>Level {player.level}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-xl">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{player.streak}d</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 block">
                        ⚡ {player.xp} XP
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold">{player.badge}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default LeaderboardPage;
