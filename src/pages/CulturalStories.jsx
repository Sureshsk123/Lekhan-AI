import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookHeart, Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CulturalStories = () => {
    const { language } = useParams();
    const navigate = useNavigate();
    const { API_URL } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = ['all', 'festival', 'moral', 'short', 'epic'];

    useEffect(() => {
        const fetchStories = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/stories/${language}${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`);
                setStories(res.data.stories);
            } catch (error) {
                console.error('Error fetching stories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, [language, selectedCategory, API_URL]);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-bold text-gradient child-font text-center mb-8 capitalize"
                >
                    📖 {language} Cultural Masterpieces
                </motion.h1>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {categories.map(cat => (
                        <motion.button
                            key={cat}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-3 rounded-full font-semibold capitalize transition-all ${selectedCategory === cat
                                ? 'bg-gradient-to-r from-magic-500 to-magic-600 text-white shadow-lg'
                                : 'glass text-gray-700'
                                }`}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>

                {/* Stories Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-forest-500 animate-spin mb-4" />
                        <p className="text-gray-500 animate-pulse">Unlocking Ancient Archives...</p>
                    </div>
                ) : stories.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stories.map((story, index) => (
                            <motion.div
                                key={story._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => navigate(`/story/${story._id}`)}
                                className="card cursor-pointer bg-gradient-to-br from-pink-50 to-purple-50 hover:shadow-2xl"
                            >
                                <div className="text-6xl mb-4">{story.emoji || '📖'}</div>
                                <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm px-3 py-1 rounded-full bg-purple-200 text-purple-700 capitalize">
                                        {story.category}
                                    </span>
                                    <span className={`text-sm px-3 py-1 rounded-full ${story.difficulty === 'easy' ? 'bg-green-200 text-green-700' :
                                        story.difficulty === 'medium' ? 'bg-yellow-200 text-yellow-700' :
                                            'bg-red-200 text-red-700'
                                        }`}>
                                        {story.difficulty}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🏜️</div>
                        <h3 className="text-2xl font-bold text-gray-400">Library is Empty</h3>
                        <p className="text-gray-500">Check back soon for new legends!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CulturalStories;
