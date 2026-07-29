import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, Diamond, Zap, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const TopBar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 glass shadow-lg"
        >
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <div
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-all"
                >
                    <div className="text-3xl font-bold text-gradient child-font">
                        🌳 LangSphere AI
                    </div>
                </div>

                {/* User Stats */}
                <div className="flex items-center space-x-6">
                    {/* Streak */}
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center space-x-2 bg-gradient-to-r from-orange-400 to-red-500 px-4 py-2 rounded-full shadow-lg"
                    >
                        <Flame className="w-5 h-5 text-white streak-flame" />
                        <span className="text-white font-bold">{user.streak?.current || 0}</span>
                    </motion.div>

                    {/* XP */}
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center space-x-2 bg-gradient-to-r from-reward-xp to-orange-600 px-4 py-2 rounded-full shadow-lg"
                    >
                        <Zap className="w-5 h-5 text-white xp-glow" />
                        <span className="text-white font-bold">{user.xp || 0} XP</span>
                    </motion.div>

                    {/* Diamonds */}
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center space-x-2 bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 rounded-full shadow-lg"
                    >
                        <Diamond className="w-5 h-5 text-white diamond-glow fill-white" />
                        <span className="text-white font-bold">{user.diamonds || 0}</span>
                    </motion.div>

                    <div className="flex flex-col">
                        <div className="flex items-center space-x-3 bg-white/40 px-4 py-2 rounded-full border border-forest-100">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-magic-400 to-forest-500 flex items-center justify-center text-white font-bold">
                                {user.avatar ? (
                                    <img src={user.avatar.startsWith('http') ? user.avatar : `/avatars/${user.avatar}`} alt="avatar" className="w-full h-full rounded-full" />
                                ) : (
                                    <User className="w-6 h-6" />
                                )}
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-gray-800 leading-tight">{user.username}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Level {user.level || 1}</div>
                            </div>
                        </div>
                        {/* Level Progress Bar */}
                        <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(user.xp % 1000) / 10}%` }}
                                className="h-full bg-forest-500"
                            />
                        </div>
                    </div>

                    {/* Logout Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleLogout}
                        className="p-3 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md group"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default TopBar;
