import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopBar from '../components/TopBar';

const QuizResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { attempt, xpEarned, diamondBonus, newStats } = location.state || {};

    if (!attempt) {
        return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
    }

    const accuracy = attempt.accuracy;
    const isPerfect = accuracy === 100;

    return (
        <div className="min-h-screen bg-[#F0F2F5]">
            <TopBar />
            <div className="max-w-2xl mx-auto pt-24 px-6 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                        className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <span className="text-6xl">{isPerfect ? '👑' : accuracy > 70 ? '🎉' : '📚'}</span>
                    </motion.div>

                    <h1 className="text-4xl font-black text-gray-800 mb-2">
                        {isPerfect ? 'Perfect Score!' : accuracy > 70 ? 'Great Job!' : 'Good Effort!'}
                    </h1>
                    <p className="text-gray-500 font-medium mb-10">You've completed the assessment successfully.</p>

                    <div className="grid grid-cols-2 gap-6 mb-10">
                        <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                            <span className="block text-3xl font-black text-indigo-600">+{xpEarned}</span>
                            <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest">XP Gained</span>
                        </div>
                        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                            <span className="block text-3xl font-black text-amber-600">+{diamondBonus}</span>
                            <span className="text-sm font-bold text-amber-400 uppercase tracking-widest">Diamonds</span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-10">
                        <div className="flex justify-between items-center bg-gray-50 p-5 rounded-2xl">
                            <span className="font-bold text-gray-600">Accuracy</span>
                            <span className="font-black text-indigo-600 text-xl">{accuracy}%</span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 p-5 rounded-2xl">
                            <span className="font-bold text-gray-600">Correct Answers</span>
                            <span className="font-black text-indigo-600 text-xl">{attempt.score} / {attempt.totalQuestions}</span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 p-5 rounded-2xl">
                            <span className="font-bold text-gray-600">Time Spent</span>
                            <span className="font-black text-indigo-600 text-xl">{attempt.timeSpent}s</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard')}
                            className="bg-indigo-600 text-white p-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100"
                        >
                            Return to Dashboard
                        </motion.button>
                        <button
                            onClick={() => navigate(`/lesson/${attempt.lessonId}`)}
                            className="text-indigo-600 font-bold p-3"
                        >
                            Retry Lesson
                        </button>
                    </div>
                </motion.div>

                {/* Level Up Notification (Conditional) */}
                {newStats?.level > (newStats?.xp - xpEarned < 0 ? 0 : Math.floor((newStats.xp - xpEarned) / 1000) + 1) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl flex items-center gap-6"
                    >
                        <span className="text-5xl">🆙</span>
                        <div>
                            <h3 className="text-2xl font-black">Level Up!</h3>
                            <p className="font-medium opacity-90">You reached level {newStats.level} and earned 50 bonus diamonds!</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default QuizResults;
