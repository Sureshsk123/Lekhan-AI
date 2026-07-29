import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Pencil, Mic, Gamepad2, BookHeart,
    ShoppingBag, TrendingUp, Sparkles, BarChart3, Clock, Target, Calendar, ArrowRight
} from 'lucide-react';
import axios from 'axios';
import Recommendations from '../components/Recommendations';
import TopBar from '../components/TopBar';

import { DashboardSkeleton } from '../components/Skeleton';

const UnifiedDashboard = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [selectedLanguage, setSelectedLanguage] = useState(user?.enrolledLanguages?.[0] || 'tamil');
    const [flyingBird, setFlyingBird] = useState(null);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const [wordOfDay, setWordOfDay] = useState({ word: '...', meaning: '...', pronunciation: '...' });
    const [storyOfDay, setStoryOfDay] = useState({ title: '...', preview: '...' });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Stats
                const statsRes = await axios.get('http://localhost:5001/api/analytics/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (statsRes.data.success) {
                    setStats(statsRes.data.stats);
                }

                // Daily data
                const dailyData = {
                    tamil: { w: 'அன்பு', m: 'Love', p: 'Anbu', s: 'பொங்கல் பண்டிகை', sp: 'Learn about the harvest festival...' },
                    hindi: { w: 'नमस्ते', m: 'Hello', p: 'Namaste', s: 'दिवाली की कहानी', sp: 'A story about the festival of lights...' },
                    telugu: { w: 'ప్రేమ', m: 'Love', p: 'Prematho', s: 'సంక్రాంతి వేడుక', sp: 'Celebrating the harvest...' },
                    kannada: { w: 'ಪ್ರೀತಿ', m: 'Love', p: 'Preeti', s: 'ದಸರಾ ಹಬ್ಬ', sp: 'The story of Dasara...' },
                    malayalam: { w: 'സ്നേഹം', m: 'Love', p: 'Snehithan', s: 'ഓണം வந்தே', sp: 'The arrival of Onam...' },
                    english: { w: 'KINDNESS', m: 'Being friendly and helpful', p: 'Kind-ness', s: 'Lion & Mouse', sp: 'A lesson in helping others...' }
                };

                const current = dailyData[selectedLanguage] || dailyData.english;
                setWordOfDay({ word: current.w, meaning: current.m, pronunciation: current.p });
                setStoryOfDay({ title: current.s, preview: current.sp });
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [selectedLanguage, token]);

    if (loading) return <div className="min-h-screen bg-forest-50"><TopBar /><DashboardSkeleton /></div>;

    const menuItems = [
        { id: 'lessons', icon: BookOpen, label: 'Lessons', color: 'from-green-400 to-emerald-500', path: `/lessons/${selectedLanguage}`, position: { top: '20%', left: '15%' } },
        { id: 'handwriting', icon: Pencil, label: 'Handwriting Tutor', color: 'from-blue-400 to-cyan-500', path: `/handwriting/${selectedLanguage}`, position: { top: '25%', right: '20%' } },
        { id: 'writing', icon: Pencil, label: 'Writing Canvas', color: 'from-purple-400 to-pink-500', path: `/writing-canvas/${selectedLanguage}`, position: { top: '45%', left: '10%' } },
        { id: 'voice', icon: Mic, label: 'Voice Tutor', color: 'from-orange-400 to-red-500', path: `/voice-tutor/${selectedLanguage}`, position: { top: '50%', right: '15%' } },
        { id: 'stories', icon: BookHeart, label: 'Cultural Stories', color: 'from-pink-400 to-rose-500', path: `/stories/${selectedLanguage}`, position: { top: '70%', left: '20%' } },
        { id: 'games', icon: Gamepad2, label: 'Games', color: 'from-yellow-400 to-orange-500', path: `/games/${selectedLanguage}`, position: { top: '75%', right: '25%' } },
        { id: 'store', icon: ShoppingBag, label: 'Epic Store', color: 'from-indigo-400 to-purple-500', path: '/store', position: { bottom: '15%', left: '50%', transform: 'translateX(-50%)' } }
    ];

    const handleMenuClick = (item) => {
        setFlyingBird(item.id);
        setTimeout(() => navigate(item.path), 1200);
    };

    return (
        <div className="min-h-screen pt-28 pb-12 px-6 bg-forest-50 relative overflow-hidden">
            <TopBar />

            {/* Falling Leaves Animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-3xl opacity-20"
                        initial={{ y: -100, x: Math.random() * 100 + '%' }}
                        animate={{ y: '110vh', rotate: 360 }}
                        transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, ease: 'linear', delay: i * 2 }}
                    >
                        🍃
                    </motion.div>
                ))}
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-6xl font-black text-gray-800 mb-2 tracking-tight">
                            Namaste, <span className="text-indigo-600">{user?.username}</span>! 🌳
                        </h1>
                        <p className="text-xl font-medium text-gray-500">How would you like to grow today?</p>
                    </motion.div>

                    <div className="flex gap-4">
                        <div className="bg-white/60 p-2 rounded-full flex gap-2 border border-white">
                            {user?.enrolledLanguages?.map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => setSelectedLanguage(lang)}
                                    className={`px-8 py-3 rounded-full font-black capitalize transition-all ${selectedLanguage === lang
                                        ? 'bg-indigo-600 text-white shadow-xl'
                                        : 'text-gray-500 hover:bg-white'
                                        }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => navigate('/analytics')}
                            className="bg-white p-5 rounded-2xl shadow-xl transition-all text-indigo-600 border border-gray-100 hover:scale-105"
                            title="Interactive Analytics"
                        >
                            <BarChart3 className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                {/* Quick Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard icon={Target} label="Accuracy" value={`${stats?.avgAccuracy || 0}%`} color="emerald" />
                    <StatCard icon={TrendingUp} label="Total XP" value={user?.xp || 0} color="indigo" />
                    <StatCard icon={Calendar} label="Streak" value={`${user?.streak?.current || 0} Days`} color="orange" />
                </div>

                {/* AI Interventions Section */}
                <div className="mb-20">
                    <Recommendations />
                </div>

                {/* Daily Engagement Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    <motion.div whileHover={{ y: -5 }} className="bg-white rounded-[3rem] p-10 border border-gray-100 flex gap-8 items-center shadow-xl">
                        <div className="bg-orange-100 p-6 rounded-[2rem] text-5xl shadow-inner">🔤</div>
                        <div>
                            <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-3">Word of the Day</h3>
                            <p className="text-4xl font-black text-gray-800 mb-1">{wordOfDay.word}</p>
                            <p className="text-gray-500 font-bold italic">{wordOfDay.meaning} • <span className="text-indigo-600">{wordOfDay.pronunciation}</span></p>
                        </div>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} className="bg-white rounded-[3rem] p-10 border border-gray-100 flex gap-8 items-center shadow-xl">
                        <div className="bg-indigo-50 p-6 rounded-[2rem] text-5xl shadow-inner">📖</div>
                        <div className="flex-1">
                            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">Daily Storyventure</h3>
                            <p className="text-2xl font-black text-gray-800 mb-4">{storyOfDay.title}</p>
                            <button onClick={() => navigate('/stories/tamil')} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 flex items-center gap-2 text-sm hover:scale-105 transition-transform">
                                Read Story <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* The Magical Forest Menu */}
                <div className="relative min-h-[800px] bg-white rounded-[4rem] border-8 border-white shadow-2xl p-10">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-[3.5rem]">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.05 }}
                            className="text-[600px] select-none"
                        >
                            🌳
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-forest-50/50" />
                    </div>

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-10">
                        {menuItems.filter(item => item.id !== 'store').map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => handleMenuClick(item)}
                                className="group cursor-pointer"
                            >
                                <div className={`h-full bg-gradient-to-br ${item.color} rounded-[3rem] p-10 shadow-2xl relative overflow-hidden transition-all group-hover:shadow-indigo-200`}>
                                    <div className="relative z-10">
                                        <item.icon className="w-16 h-16 text-white mb-6 group-hover:scale-125 transition-transform duration-500" />
                                        <h3 className="text-2xl font-black text-white">{item.label}</h3>
                                        <p className="text-white/80 font-medium text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Explore and master new skills in {selectedLanguage}.</p>
                                    </div>
                                    <Sparkles className="absolute -bottom-10 -right-10 w-48 h-48 text-white/10 rotate-12" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Centered Store Button */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                        <motion.button
                            onClick={() => navigate('/shop')}
                            whileHover={{ scale: 1.1 }}
                            className="bg-indigo-600 text-white px-12 py-5 rounded-[2.5rem] font-black shadow-2xl shadow-indigo-200 border-4 border-white flex items-center gap-4 text-xl"
                        >
                            <ShoppingBag className="w-8 h-8" />
                            Epic Marketplace
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 flex items-center gap-6">
        <div className={`w-14 h-14 rounded-2xl bg-${color}-50 flex items-center justify-center text-${color}-600`}>
            <Icon className="w-7 h-7" />
        </div>
        <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">{label}</span>
            <span className="text-3xl font-black text-gray-800">{value}</span>
        </div>
    </div>
);

export default UnifiedDashboard;
