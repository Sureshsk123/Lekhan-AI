import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import { Volume2, Award, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
import axios from 'axios';

export const LessonDetailPage = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vocab');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLessonDetail();
  }, [id]);

  const fetchLessonDetail = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const res = await axios.get(`${API_URL}/lessons/detail/${id}`);
      if (res.data && res.data.data) {
        setLesson(res.data.data);
      }
    } catch (err) {
      console.error('Fetch lesson detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden pb-24 lg:pb-12">
          <Breadcrumbs />

          {/* Header */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                {lesson?.difficulty || 'Lesson'}
              </span>
              <span className="text-sm font-extrabold text-amber-300">⚡ +{lesson?.xpReward || 50} XP</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black mt-3">{lesson?.title || 'Interactive Lesson'}</h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">{lesson?.description}</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            {['vocab', 'grammar', 'examples'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Vocabulary Content */}
          {activeTab === 'vocab' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lesson?.vocabulary?.map((v, i) => (
                <GlassCard key={i} className="p-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{v.word}</span>
                      <button
                        onClick={() => playAudio(v.word)}
                        className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 hover:scale-110 transition-transform"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{v.translation || v.meaning}</p>
                    {v.transliteration && (
                      <p className="text-xs text-slate-400 font-mono">[{v.transliteration}]</p>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Start Practice Quiz Button */}
          <div className="pt-6 text-center">
            <button
              onClick={() => navigate(`/quiz/${lesson?._id || 'ai-dynamic-quiz'}`)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-black text-base shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <span>Take Lesson Quiz</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default LessonDetailPage;
