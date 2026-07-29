import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Book, Target, Clock, Zap, Target as TargetIcon, Brain, Calendar } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';

const AnalyticsDashboard = () => {
    const { token, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/analytics/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setStats(res.data.stats);
                }
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    if (loading) return (
        <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </div>
    );

    if (!stats) return null;

    return (
        <div className="min-h-screen bg-[#F0F2F5]">
            <TopBar />
            <div className="max-w-7xl mx-auto pt-28 px-6 pb-20">
                <header className="mb-12 flex items-end justify-between">
                    <div>
                        <h1 className="text-5xl font-black text-gray-800 mb-2 tracking-tight">Learning Journey</h1>
                        <p className="text-gray-500 font-medium">Visualizing your progress and achievements.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard icon={Book} label="Lessons Done" value={stats.totalLessons} color="indigo" />
                    <StatCard icon={Target} label="Avg. Accuracy" value={`${stats.avgAccuracy}%`} color="emerald" />
                    <StatCard icon={Zap} label="Daily Streak" value={`${user.streak?.current || 0} Days`} color="orange" />
                    <StatCard icon={Award} label="Total XP" value={user.xp || 0} color="purple" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Progress Chart Placeholder */}
                    <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                                <TrendingUp className="text-indigo-600" /> XP Progression
                            </h3>
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Last 7 Days</span>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-4 px-4 pb-4">
                            {[40, 65, 30, 85, 45, 90, 75].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: i * 0.1, duration: 0.8 }}
                                    className="w-full bg-gradient-to-t from-indigo-600/10 to-indigo-600 rounded-t-2xl relative group"
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {Math.round(h * 15)} XP
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-6 px-4">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => <span key={d} className="text-xs font-black text-gray-300">{d}</span>)}
                        </div>
                    </div>

                    {/* Skill Radar / Badges */}
                    <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100">
                        <h3 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-3">
                            <Brain className="text-purple-600" /> Mastery Breakdown
                        </h3>
                        <div className="space-y-6">
                            <SkillItem label="Vocabulary" value={stats.performanceByType?.mcq || 0} color="indigo" />
                            <SkillItem label="Writing" value={stats.performanceByType?.handwriting || 0} color="emerald" />
                            <SkillItem label="Grammar" value={stats.performanceByType?.fill_blank || 0} color="orange" />
                        </div>

                        <div className="mt-12 pt-10 border-t border-gray-50 text-center">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Current Rank</p>
                            <div className="text-4xl font-black text-indigo-600 mb-2">Knowledge Seeker</div>
                            <p className="text-xs font-medium text-gray-400 px-8">Complete 5 more perfect lessons to reach "Global Linguist"</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-12 bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100">
                    <h3 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-3">
                        <Calendar className="text-orange-600" /> Recent Learning Activity
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="pb-4 font-black text-gray-400 uppercase text-xs tracking-widest">Date</th>
                                    <th className="pb-4 font-black text-gray-400 uppercase text-xs tracking-widest">Type</th>
                                    <th className="pb-4 font-black text-gray-400 uppercase text-xs tracking-widest">Accuracy</th>
                                    <th className="pb-4 font-black text-gray-400 uppercase text-xs tracking-widest text-right">XP Earned</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentAttempts?.map((attempt, idx) => (
                                    <tr key={idx} className="border-b border-gray-50/50 last:border-0 group">
                                        <td className="py-6 font-bold text-gray-700">
                                            {new Date(attempt.timestamp).toLocaleDateString()}
                                        </td>
                                        <td className="py-6">
                                            <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-black uppercase">
                                                Quiz
                                            </span>
                                        </td>
                                        <td className="py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500" style={{ width: `${attempt.accuracy}%` }} />
                                                </div>
                                                <span className="font-black text-gray-500 text-sm">{attempt.accuracy}%</span>
                                            </div>
                                        </td>
                                        <td className="py-6 text-right font-black text-indigo-600">
                                            +{Math.round(attempt.score * 10)} XP
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50 flex items-center gap-6">
        <div className={`w-14 h-14 rounded-2xl bg-${color}-50 flex items-center justify-center text-${color}-600`}>
            <Icon className="w-7 h-7" />
        </div>
        <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">{label}</span>
            <span className="text-2xl font-black text-gray-800">{value}</span>
        </div>
    </div>
);

const SkillItem = ({ label, value, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-end">
            <span className="text-sm font-black text-gray-600 uppercase tracking-widest">{label}</span>
            <span className={`text-lg font-black text-${color}-600`}>{value}%</span>
        </div>
        <div className="h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-0.5">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                className={`h-full rounded-full bg-${color}-500 shadow-lg`}
            />
        </div>
    </div>
);

export default AnalyticsDashboard;
