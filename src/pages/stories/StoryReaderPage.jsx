import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { Volume2, Languages, ChevronLeft, ChevronRight, BookOpen, Bookmark, Sparkles, Plus, Check, Eye } from 'lucide-react';
import apiClient from '../../services/apiClient';

export const StoryReaderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [fontSize, setFontSize] = useState('text-lg');

  useEffect(() => {
    fetchStory();
  }, [id]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/v1/stories/${id}`).catch(() => ({ data: null }));
      let data = res?.data?.data;
      
      if (!data) {
        // Fallback demo story
        data = {
          id,
          title: 'El Viaje de Sofía a Madrid',
          level: 'BEGINNER',
          languageCode: 'ES',
          description: 'A charming tale of Sofia travelling through Spain, discovering cafes, museums, and historical landmarks.',
          pages: [
            {
              pageNumber: 1,
              text: 'Un día soleado en Madrid, Sofía caminaba por la Gran Vía con su mochila azul. Tenía hambre y buscaba un café tradicional.',
              translation: 'On a sunny day in Madrid, Sofia was walking down Gran Vía with her blue backpack. She was hungry and looking for a traditional cafe.',
            },
            {
              pageNumber: 2,
              text: 'Encontró una pequeña cafetería cerca de la Plaza Mayor. El camarero le sonrió y le dijo: «¡Buenos días! ¿Qué va a tomar?»',
              translation: 'She found a small coffee shop near Plaza Mayor. The waiter smiled at her and said: "Good morning! What will you have?"',
            },
            {
              pageNumber: 3,
              text: 'Sofía pidió un café con leche caliente y un churro recién hecho. Todo estaba riquísimo y disfrutó del ambiente de la ciudad.',
              translation: 'Sofia ordered a hot coffee with milk and a freshly made churro. Everything was delicious and she enjoyed the city atmosphere.',
            },
          ]
        };
      }

      setStory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const playTTS = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleWordTap = (word) => {
    const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()«»]/g, '');
    setSelectedWord({
      word: cleanWord,
      meaning: `Translation of "${cleanWord}"`,
      phonetic: `[phonetic ${cleanWord}]`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-400">Opening Interactive Storybook...</span>
      </div>
    );
  }

  const pages = story.pages || [];
  const page = pages[currentPage];
  const totalPages = pages.length;
  const progress = totalPages > 0 ? Math.round(((currentPage + 1) / totalPages) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 pb-24 md:pb-8 min-w-0">
          
          {/* Header Banner */}
          <div className="glass-card p-6 border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500">
                {story.level} · {story.languageCode}
              </span>
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-2 rounded-xl border transition-colors ${
                  bookmarked ? 'bg-amber-500 text-white border-amber-500' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
                title="Bookmark Page"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
            <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
              {story.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{story.description}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Page {currentPage + 1} of {totalPages}</span>
              <span>{progress}% Completed</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                  showTranslation
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                }`}
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{showTranslation ? 'Show Original' : 'Translate English'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSize(fontSize === 'text-lg' ? 'text-xl' : 'text-lg')}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
              >
                {fontSize === 'text-lg' ? 'A+' : 'A-'}
              </button>
              {page && (
                <button
                  onClick={() => playTTS(showTranslation ? (page.translation || page.text) : page.text)}
                  className="p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                  title="Listen audio"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Reader Card with Word Tap Popups */}
          <div className="glass-card p-8 min-h-[220px] space-y-4 border-slate-200 dark:border-slate-800 relative">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
              Tap any word for instant meaning
            </span>

            {page ? (
              <div className={`${fontSize} leading-relaxed text-slate-900 dark:text-slate-100 font-serif flex flex-wrap gap-1.5`}>
                {!showTranslation
                  ? page.text.split(' ').map((word, idx) => (
                      <span
                        key={idx}
                        onClick={() => handleWordTap(word)}
                        className="hover:text-amber-500 hover:bg-amber-500/10 cursor-pointer rounded px-1 transition-colors"
                      >
                        {word}
                      </span>
                    ))
                  : page.translation || page.text}
              </div>
            ) : (
              <p className="text-slate-400 text-xs italic">No page content available.</p>
            )}
          </div>

          {/* Word Meaning Modal Popup */}
          {selectedWord && (
            <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-3">
                <button onClick={() => playTTS(selectedWord.word)} className="p-2 rounded-xl bg-amber-500 text-white">
                  <Volume2 className="w-4 h-4" />
                </button>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {selectedWord.word}
                  </h4>
                  <p className="text-xs text-slate-500">{selectedWord.meaning}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWord(null)}
                className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
            </div>
          )}

          {/* Page Turn Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="flex-1 btn-secondary text-xs py-3 flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Page
            </button>
            <button
              onClick={() => {
                if (currentPage < totalPages - 1) setCurrentPage((p) => p + 1);
                else navigate('/stories/spanish');
              }}
              className="flex-1 btn-primary text-xs py-3 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <span>{currentPage < totalPages - 1 ? 'Next Page' : 'Finish Story 🎉'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default StoryReaderPage;
