import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import { Volume2, Languages, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import apiClient from '../../services/apiClient';

export const StoryReaderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory]           = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [loading, setLoading]       = useState(true);

  useEffect(() => { fetchStory(); }, [id]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/v1/stories/${id}`);
      if (res.data?.data) setStory(res.data.data);
    } catch (err) {
      console.error('Fetch story error:', err);
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
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-content-primary mb-2">Story not found</h2>
            <button onClick={() => navigate('/stories')} className="text-sm text-amber-600 underline">
              Browse Stories
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pages = story.pages || [];
  const page  = pages[currentPage];
  const totalPages = pages.length;
  const progress   = totalPages > 0 ? Math.round(((currentPage + 1) / totalPages) * 100) : 0;

  return (
    <div className="min-h-screen bg-transparent text-content-primary flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-5xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto pb-24 lg:pb-12">
          <Breadcrumbs />

          {/* Story Header */}
          <div className="p-6 rounded-2xl bg-amber-500 text-white shadow-lg">
            <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
              {story.level} · {story.languageCode?.toUpperCase()}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-3">{story.title}</h1>
            {story.description && (
              <p className="text-sm text-amber-100 mt-1">{story.description}</p>
            )}
          </div>

          {/* Progress */}
          {totalPages > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-content-tertiary">
                <span>Page {currentPage + 1} of {totalPages}</span>
                <span>{progress}% Read</span>
              </div>
              <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Page Content */}
          <GlassCard className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <div className="flex gap-2">
                {page && (
                  <button
                    onClick={() => setShowTranslation(!showTranslation)}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center gap-1"
                  >
                    <Languages className="w-3.5 h-3.5" />
                    {showTranslation ? 'Original' : 'English'}
                  </button>
                )}
                {page && (
                  <button
                    onClick={() => playTTS(showTranslation ? (page.translation || page.text) : page.text)}
                    className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {page ? (
              <p className="text-lg sm:text-xl leading-relaxed text-content-primary font-serif">
                {showTranslation ? (page.translation || page.text) : page.text}
              </p>
            ) : (
              <p className="text-content-tertiary text-sm italic">No pages available for this story.</p>
            )}
          </GlassCard>

          {/* Navigation */}
          {totalPages > 0 && (
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border-light text-sm font-bold text-content-secondary hover:bg-surface-secondary transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={() => {
                  if (currentPage < totalPages - 1) setCurrentPage(p => p + 1);
                  else navigate('/stories');
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-colors"
              >
                {currentPage < totalPages - 1 ? 'Next Page' : 'Finish Story'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default StoryReaderPage;
