import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Pencil, Mic, Gamepad2, BookHeart,
    ShoppingBag, TrendingUp, Sparkles
} from 'lucide-react';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedLanguage, setSelectedLanguage] = useState(user?.enrolledLanguages?.[0] || 'tamil');
    const [wordOfDay, setWordOfDay] = useState({ word: 'வணக்கம்', meaning: 'Hello', pronunciation: 'Vanakkam' });
    const [storyOfDay, setStoryOfDay] = useState({ title: 'The Clever Crow', preview: 'A thirsty crow finds a clever way...' });
    const [flyingBird, setFlyingBird] = useState(null);

    useEffect(() => {
        const dailyData = {
            tamil: { w: 'அன்பு', m: 'Love', p: 'Anbu', s: 'பொங்கல் பண்டிகை', sp: 'Learn about the harvest festival...' },
            hindi: { w: 'नमस्ते', m: 'Hello', p: 'Namaste', s: 'दिवाली की कहानी', sp: 'A story about the festival of lights...' },
            telugu: { w: 'ప్రేమ', m: 'Love', p: 'Prematho', s: 'సంక్రాంతి వేడుక', sp: 'Celebrating the harvest...' },
            kannada: { w: 'ಪ್ರೀತಿ', m: 'Love', p: 'Preeti', s: 'ದಸರಾ ಹಬ್ಬ', sp: 'The story of Dasara...' },
            malayalam: { w: 'സ്നേഹം', m: 'Love', p: 'Snehithan', s: 'ഓണം വന്നേ', sp: 'The arrival of Onam...' }
        };

        const current = dailyData[selectedLanguage] || dailyData.tamil;
        setWordOfDay({ word: current.w, meaning: current.m, pronunciation: current.p });
        setStoryOfDay({ title: current.s, preview: current.sp });
    }, [selectedLanguage]);

    const menuItems = [
        {
            id: 'lessons',
            icon: BookOpen,
            label: 'Lessons',
            color: 'from-green-400 to-emerald-500',
            path: `/lessons/${selectedLanguage}`,
            position: { top: '20%', left: '15%' }
        },
        {
            id: 'handwriting',
            icon: Pencil,
            label: 'Handwriting Tutor',
            color: 'from-blue-400 to-cyan-500',
            path: '/handwriting',
            position: { top: '25%', right: '20%' }
        },
        {
            id: 'writing',
            icon: Pencil,
            label: 'Writing Canvas',
            color: 'from-purple-400 to-pink-500',
            path: '/writing-canvas',
            position: { top: '45%', left: '10%' }
        },
        {
            id: 'voice',
            icon: Mic,
            label: 'Voice Tutor',
            color: 'from-orange-400 to-red-500',
            path: '/voice-tutor',
            position: { top: '50%', right: '15%' }
        },
        {
            id: 'stories',
            icon: BookHeart,
            label: 'Cultural Stories',
            color: 'from-pink-400 to-rose-500',
            path: `/stories/${selectedLanguage}`,
            position: { top: '70%', left: '20%' }
        },
        {
            id: 'games',
            icon: Gamepad2,
            label: 'Games',
            color: 'from-yellow-400 to-orange-500',
            path: '/games',
            position: { top: '75%', right: '25%' }
        },
        {
            id: 'store',
            icon: ShoppingBag,
            label: 'Epic Store',
            color: 'from-indigo-400 to-purple-500',
            path: '/store',
            position: { bottom: '15%', left: '50%', transform: 'translateX(-50%)' }
        }
    ];

    const handleMenuClick = (item) => {
        setFlyingBird(item.id);
        setTimeout(() => {
            navigate(item.path);
        }, 1500);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-4xl opacity-30"
                        initial={{ y: -100, x: Math.random() * window.innerWidth }}
                        animate={{
                            y: window.innerHeight + 100,
                            x: Math.random() * window.innerWidth
                        }}
                        transition={{
                            duration: 15 + Math.random() * 10,
                            repeat: Infinity,
                            delay: i * 3
                        }}
                    >
                        🍃
                    </motion.div>
                ))}
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-6xl font-bold text-gradient child-font mb-4">
                        Welcome to Your Forest! 🌳
                    </h1>
                    <p className="text-xl text-gray-700">
                        Choose your path and start learning, {user?.username}!
                    </p>
                </motion.div>

                {/* Language Selector */}
                <div className="flex justify-center mb-8">
                    <div className="glass rounded-full p-2 flex gap-2">
                        {user?.enrolledLanguages?.map(lang => (
                            <motion.button
                                key={lang}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedLanguage(lang)}
                                className={`px-6 py-2 rounded-full font-semibold capitalize transition-all ${selectedLanguage === lang
                                    ? 'bg-gradient-to-r from-forest-500 to-forest-600 text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-white/50'
                                    }`}
                            >
                                {lang}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        className="card bg-gradient-to-br from-orange-100 to-red-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-semibold">Current Streak</p>
                                <p className="text-4xl font-bold text-orange-600">{user?.streak?.current || 0} 🔥</p>
                            </div>
                            <TrendingUp className="w-12 h-12 text-orange-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, rotate: -2 }}
                        className="card bg-gradient-to-br from-blue-100 to-cyan-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-semibold">Total XP</p>
                                <p className="text-4xl font-bold text-blue-600">{user?.xp || 0} ⚡</p>
                            </div>
                            <Sparkles className="w-12 h-12 text-blue-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        className="card bg-gradient-to-br from-purple-100 to-pink-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-semibold">Level</p>
                                <p className="text-4xl font-bold text-purple-600">{user?.level || 1} 🏆</p>
                            </div>
                            <div className="text-4xl">👑</div>
                        </div>
                    </motion.div>
                </div>

                {/* Daily Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200"
                    >
                        <h3 className="text-xl font-bold text-orange-700 mb-3 child-font">
                            📚 Word of the Day
                        </h3>
                        <div className="bg-white/60 rounded-xl p-4">
                            <p className="text-3xl font-bold text-gray-800 mb-2">{wordOfDay.word}</p>
                            <p className="text-lg text-gray-600">{wordOfDay.meaning}</p>
                            <p className="text-sm text-gray-500 italic mt-1">Pronunciation: {wordOfDay.pronunciation}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="card bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200"
                    >
                        <h3 className="text-xl font-bold text-purple-700 mb-3 child-font">
                            📖 Story of the Day
                        </h3>
                        <div className="bg-white/60 rounded-xl p-4">
                            <p className="text-xl font-bold text-gray-800 mb-2">{storyOfDay.title}</p>
                            <p className="text-gray-600">{storyOfDay.preview}</p>
                            <button
                                onClick={() => navigate('/story/3')}
                                className="mt-3 text-purple-600 font-semibold hover:underline"
                            >
                                Read More →
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Forest Menu with Birds */}
                <div className="relative min-h-[600px] card bg-gradient-to-b from-green-50 to-blue-50">
                    {/* Tree Background */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 text-[400px]">
                        🌳
                    </div>

                    {/* Menu Items with Birds */}
                    {menuItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className="absolute"
                            style={item.position}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <motion.button
                                onClick={() => handleMenuClick(item)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative group"
                            >
                                {/* Bird */}
                                <motion.div
                                    animate={flyingBird === item.id ? {
                                        x: [0, 200, 400],
                                        y: [0, -100, 0],
                                        opacity: [1, 1, 0]
                                    } : {}}
                                    transition={{ duration: 1.5 }}
                                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-3xl"
                                >
                                    🐦
                                </motion.div>

                                {/* Menu Button */}
                                <div className={`bg-gradient-to-br ${item.color} p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all`}>
                                    <item.icon className="w-12 h-12 text-white mb-2" />
                                    <p className="text-white font-bold text-sm">{item.label}</p>
                                </div>
                            </motion.button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
