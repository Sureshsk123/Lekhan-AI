import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Sparkles, User, ShoppingBag, Trophy, ArrowRight, Bot, PenTool, ScanText, Zap, Compass } from 'lucide-react';
import { globalSearch } from '../../services/searchService';
import { useNavigate } from 'react-router-dom';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await globalSearch(query);
        setResults(res.data);
      } catch (err) {
        // Fallback search algorithm if backend search API is offline
        const q = query.toLowerCase();
        const mockLessons = [
          { _id: '1', title: 'Greetings & Introduction (Basic Spanish)', category: 'Beginner' },
          { _id: '2', title: 'Ordering Food in Madrid (Intermediate)', category: 'Intermediate' },
          { _id: '3', title: 'Travel & Navigation Vocabulary', category: 'Advanced' },
        ].filter(l => l.title.toLowerCase().includes(q));

        const mockStories = [
          { _id: '1', title: 'El Viaje de Sofía (Sofia\'s Journey)', language: 'Spanish' },
          { _id: '2', title: 'Le Petit Café de Paris', language: 'French' },
        ].filter(s => s.title.toLowerCase().includes(q));

        setResults({ lessons: mockLessons, stories: mockStories, shop: [] });
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const quickLinks = [
    { title: 'AI Conversation Tutor', desc: 'Practice speaking with Ollama AI', path: '/ai-tutor', icon: Bot, color: 'text-blue-500 bg-blue-500/10' },
    { title: 'Interactive Lessons', desc: 'Structured learning path', path: '/lessons/ta', icon: BookOpen, color: 'text-teal-500 bg-teal-500/10' },
    { title: 'Vocabulary Flashcards', desc: 'Spaced repetition hub', path: '/vocabulary', icon: Zap, color: 'text-rose-500 bg-rose-500/10' },
    { title: 'Global Leaderboard', desc: 'Rankings & XP trophies', path: '/leaderboard', icon: Trophy, color: 'text-yellow-500 bg-yellow-500/10' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Input Header */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-blue-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons, AI tutor, stories, vocabulary, leaderboard..."
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base font-medium"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {loading && (
            <div className="py-8 text-center text-slate-400">
              <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs mt-2 font-semibold">Searching LangSphere...</p>
            </div>
          )}

          {!loading && results && (
            <div className="space-y-4">
              {results.lessons?.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" /> Lessons
                  </h4>
                  <div className="space-y-1">
                    {results.lessons.map((l) => (
                      <div
                        key={l._id}
                        onClick={() => { onClose(); navigate(`/lesson/${l._id}`); }}
                        className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition-all"
                      >
                        <span className="text-sm font-bold text-slate-800 dark:text-white">{l.title}</span>
                        <ArrowRight className="w-4 h-4 text-blue-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.stories?.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-500" /> Stories
                  </h4>
                  <div className="space-y-1">
                    {results.stories.map((s) => (
                      <div
                        key={s._id}
                        onClick={() => { onClose(); navigate(`/story/${s._id}`); }}
                        className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition-all"
                      >
                        <span className="text-sm font-bold text-slate-800 dark:text-white">{s.title}</span>
                        <ArrowRight className="w-4 h-4 text-teal-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && (!results || (results.lessons?.length === 0 && results.stories?.length === 0)) && (
            <div>
              <div className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-blue-500" /> Quick Navigation
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <div
                      key={link.path}
                      onClick={() => { onClose(); navigate(link.path); }}
                      className="p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 hover:border-blue-500/50 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3 transition-all group"
                    >
                      <div className={`p-2.5 rounded-xl ${link.color} shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                          {link.title}
                        </h5>
                        <p className="text-[10px] text-slate-400 truncate">{link.desc}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
