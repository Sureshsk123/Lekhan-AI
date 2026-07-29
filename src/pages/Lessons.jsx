import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Lock, CheckCircle, Star } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Lessons = () => {
    const { language } = useParams();
    const navigate = useNavigate();
    const { API_URL } = useAuth();
    const [lessons, setLessons] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState('alphabets');

    const levels = ['alphabets', 'vowels', 'consonants', 'words', 'sentences', 'conversations'];

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await axios.get(`${API_URL}/lessons/${language}?level=${selectedLevel}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.data.success) {
                    setLessons(response.data.lessons);
                }
            } catch (error) {
                console.error('Error fetching lessons:', error);
            }
        };

        fetchLessons();
    }, [language, selectedLevel, API_URL]);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-bold text-gradient child-font text-center mb-8 capitalize"
                >
                    📚 {language} Lessons
                </motion.h1>

                {/* Level Selector */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {levels.map(level => (
                        <motion.button
                            key={level}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setSelectedLevel(level)}
                            className={`px-6 py-3 rounded-full font-semibold capitalize transition-all ${selectedLevel === level
                                ? 'bg-gradient-to-r from-forest-500 to-forest-600 text-white shadow-lg'
                                : 'glass text-gray-700'
                                }`}
                        >
                            {level}
                        </motion.button>
                    ))}
                </div>

                {/* Lessons Grid */}
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {lessons.map((lesson, index) => (
                        <motion.div
                            key={lesson._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: lesson.isLocked ? 1 : 1.05 }}
                            onClick={() => !lesson.isLocked && navigate(`/lesson/${lesson._id}`)}
                            className={`card cursor-pointer relative overflow-hidden ${lesson.isLocked ? 'opacity-60' : ''
                                }`}
                        >
                            {lesson.isLocked && (
                                <div className="absolute top-4 right-4">
                                    <Lock className="w-6 h-6 text-gray-400" />
                                </div>
                            )}

                            <div className="text-4xl mb-3">
                                {lesson.isLocked ? '🔒' : '📖'}
                            </div>

                            <h3 className="font-bold text-lg mb-2">{lesson.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">{lesson.description}</p>

                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-1">
                                    ⚡ {lesson.xpReward} XP
                                </span>
                                <span className="flex items-center gap-1">
                                    💎 {lesson.diamondReward}
                                </span>
                            </div>

                            <div className="mt-3">
                                <span className={`text-xs px-3 py-1 rounded-full ${lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                    lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {lesson.difficulty}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Lessons;
