import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, Target, TrendingUp, Download, Calendar } from 'lucide-react';

const ParentDashboard = () => {
    const [selectedChild, setSelectedChild] = useState('child1');

    // Mock data
    const analytics = {
        totalTimeSpent: 1250, // minutes
        wordsLearned: 156,
        averageAccuracy: 87,
        weeklyConsistency: 6, // days
        skillLevels: {
            handwriting: 75,
            pronunciation: 82,
            vocabulary: 68,
            culture: 90
        },
        weeklyActivity: [
            { day: 'Mon', minutes: 45, xp: 150 },
            { day: 'Tue', minutes: 60, xp: 200 },
            { day: 'Wed', minutes: 30, xp: 100 },
            { day: 'Thu', minutes: 50, xp: 180 },
            { day: 'Fri', minutes: 40, xp: 140 },
            { day: 'Sat', minutes: 70, xp: 250 },
            { day: 'Sun', minutes: 55, xp: 190 }
        ]
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-bold text-gradient child-font text-center mb-8"
                >
                    📊 Parent Dashboard
                </motion.h1>

                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="card bg-gradient-to-br from-blue-50 to-cyan-50"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <Clock className="w-8 h-8 text-blue-600" />
                            <span className="text-3xl">⏰</span>
                        </div>
                        <p className="text-sm text-gray-600 font-semibold">Time Spent</p>
                        <p className="text-3xl font-bold text-blue-600">
                            {Math.floor(analytics.totalTimeSpent / 60)}h {analytics.totalTimeSpent % 60}m
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="card bg-gradient-to-br from-green-50 to-emerald-50"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <Target className="w-8 h-8 text-green-600" />
                            <span className="text-3xl">📚</span>
                        </div>
                        <p className="text-sm text-gray-600 font-semibold">Words Mastered</p>
                        <p className="text-3xl font-bold text-green-600">{analytics.wordsLearned}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="card bg-gradient-to-br from-purple-50 to-pink-50"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="w-8 h-8 text-purple-600" />
                            <span className="text-3xl">🎯</span>
                        </div>
                        <p className="text-sm text-gray-600 font-semibold">Avg. Accuracy</p>
                        <p className="text-3xl font-bold text-purple-600">{analytics.averageAccuracy}%</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="card bg-gradient-to-br from-orange-50 to-red-50"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <Calendar className="w-8 h-8 text-orange-600" />
                            <span className="text-3xl">🔥</span>
                        </div>
                        <p className="text-sm text-gray-600 font-semibold">Weekly Consistency</p>
                        <p className="text-3xl font-bold text-orange-600">{analytics.weeklyConsistency}/7 days</p>
                    </motion.div>
                </div>

                {/* Weekly Activity Chart */}
                <div className="card mb-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6" />
                        Weekly Activity
                    </h2>
                    <div className="flex items-end justify-between gap-2 h-64">
                        {analytics.weeklyActivity.map((day, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(day.minutes / 70) * 100}%` }}
                                    transition={{ delay: index * 0.1 }}
                                    className="w-full bg-gradient-to-t from-forest-500 to-forest-300 rounded-t-lg mb-2 min-h-[20px]"
                                />
                                <p className="text-sm font-semibold text-gray-700">{day.day}</p>
                                <p className="text-xs text-gray-500">{day.minutes}m</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skill Mastery */}
                <div className="card mb-8">
                    <h2 className="text-2xl font-bold mb-6">Skill Mastery</h2>
                    <div className="space-y-4">
                        {Object.entries(analytics.skillLevels).map(([skill, level]) => (
                            <div key={skill}>
                                <div className="flex justify-between mb-2">
                                    <span className="font-semibold capitalize">{skill}</span>
                                    <span className="text-gray-600">{level}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${level}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        className="h-full bg-gradient-to-r from-forest-500 to-emerald-500 rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Download Report */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => alert('Generating your child\'s progress report... 📄')}
                    className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
                >
                    <Download className="w-6 h-6" />
                    Download Weekly Report (PDF)
                </motion.button>
            </div>
        </div>
    );
};

export default ParentDashboard;
