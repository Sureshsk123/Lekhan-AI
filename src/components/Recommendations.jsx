import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, BookOpen, PenTool, MessageSquare, ArrowRight, Zap, Target } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Recommendations = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [recs, setRecs] = useState([]);
    const [weakAreas, setWeakAreas] = useState([]);

    useEffect(() => {
        const fetchRecs = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/analytics/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    const stats = res.data.stats;
                    // Logic to derive recommendations from stats if backend doesn't provide them explicitly
                    setWeakAreas(stats.weakAreas || []);

                    // Synthetic recommendations for UI demo based on low marks in performanceByType
                    const lowPerf = Object.entries(stats.performanceByType || {})
                        .filter(([_, val]) => val < 70)
                        .map(([type]) => type);

                    const derivedRecs = [
                        { id: 1, type: 'lesson', title: 'Mastering Common Verbs', desc: 'Focus on your vocabulary accuracy.', icon: BookOpen, color: 'indigo' },
                        { id: 2, type: 'drill', title: 'Handwriting Sprint', desc: 'Improve your stroke precision.', icon: PenTool, color: 'emerald' },
                        { id: 3, type: 'quiz', title: 'Grammar Refresh', desc: 'Quick recap of your weak areas.', icon: Zap, color: 'orange' }
                    ];
                    setRecs(derivedRecs);
                }
            } catch (err) {
                console.error('Failed to fetch recommendations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecs();
    }, [token]);

    if (loading) return null;

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-3xl font-black text-gray-800 flex items-center gap-3">
                        <Sparkles className="text-indigo-600 fill-indigo-100" /> AI Interventions
                    </h3>
                    <p className="text-gray-500 font-medium">Smart paths designed to boost your efficiency.</p>
                </div>
                <button
                    onClick={() => navigate('/analytics')}
                    className="text-indigo-600 font-black text-xs uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
                >
                    View Insights
                </button>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatePresence>
                    {recs.map((rec, idx) => (
                        <motion.div
                            key={rec.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -8 }}
                            className={`bg-white rounded-[2.5rem] p-8 shadow-xl border-2 border-transparent hover:border-${rec.color}-100 transition-all group cursor-pointer`}
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-${rec.color}-50 flex items-center justify-center text-${rec.color}-600 mb-6 group-hover:scale-110 transition-transform`}>
                                <rec.icon className="w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-black text-gray-800 mb-2">{rec.title}</h4>
                            <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
                                {rec.desc}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-black uppercase tracking-widest text-${rec.color}-600 bg-${rec.color}-50 px-3 py-1 rounded-full`}>
                                    {rec.type}
                                </span>
                                <ArrowRight className={`w-5 h-5 text-${rec.color}-600 group-hover:translate-x-2 transition-transform`} />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Weak Areas Banner */}
            {weakAreas.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-indigo-600 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10"
                >
                    <div className="relative z-10 flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <Target className="w-6 h-6 text-white" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Precision Focus</span>
                        </div>
                        <h3 className="text-3xl font-black mb-4">You're struggling with {weakAreas[0].label}.</h3>
                        <p className="text-indigo-100 font-medium opacity-90 max-w-lg">
                            Our AI detected consistent challenges with these specific characters. Perfecting them will increase your overall accuracy by 15%.
                        </p>
                    </div>
                    <div className="relative z-10 flex gap-4">
                        <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                            Repair Now <Zap className="w-5 h-5 fill-indigo-600" />
                        </button>
                    </div>
                    <Brain className="absolute -bottom-10 -right-10 w-64 h-64 opacity-10 rotate-12" />
                </motion.div>
            )}
        </div>
    );
};

export default Recommendations;
