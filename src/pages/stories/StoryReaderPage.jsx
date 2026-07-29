import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import { Volume2, BookOpen, Languages, Sparkles } from 'lucide-react';
import axios from 'axios';

export const StoryReaderPage = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [showEnglish, setShowEnglish] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStory();
  }, [id]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const res = await axios.get(`${API_URL}/stories/detail/${id}`);
      if (res.data && res.data.data) setStory(res.data.data);
    } catch (err) {
      console.error('Fetch story detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  const playTTS = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-5xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden pb-24 lg:pb-12">
          <Breadcrumbs />

          <GlassCard className="p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                  {story?.language || 'Cultural Story'}
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-800 dark:text-white mt-1">
                  {story?.title || 'Storybook Reader'}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEnglish(!showEnglish)}
                  className="px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-amber-200"
                >
                  <Languages className="w-4 h-4" />
                  <span>{showEnglish ? 'Original' : 'Translate'}</span>
                </button>
                <button
                  onClick={() => playTTS(story?.content || '')}
                  className="p-2.5 rounded-2xl bg-emerald-500 text-white shadow-md hover:scale-105 transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-200 font-serif">
              {showEnglish ? (story?.translation || story?.content) : (story?.content || 'Story text...')}
            </div>

            {story?.vocabulary && story.vocabulary.length > 0 && (
              <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-3">Key Vocabulary</h3>
                <div className="flex flex-wrap gap-2">
                  {story.vocabulary.map((v, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                      {v.word} ({v.meaning})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>

        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default StoryReaderPage;
