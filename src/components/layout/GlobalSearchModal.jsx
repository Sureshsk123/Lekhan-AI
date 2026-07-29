import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Sparkles, User, ShoppingBag, Trophy, ArrowRight } from 'lucide-react';
import { globalSearch } from '../../services/searchService';
import { useNavigate } from 'react-router-dom';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-start justify-center pt-16 px-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-700">
          <Search className="w-5 h-5 text-emerald-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons, stories, vocabulary, users, shop, achievements..."
            className="flex-1 bg-transparent text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none text-base"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="py-8 text-center text-slate-400">
              <div className="inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs mt-2 font-medium">Searching LangSphere...</p>
            </div>
          )}

          {!loading && results && (
            <div className="space-y-4">
              {results.lessons?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> Lessons
                  </h4>
                  <div className="space-y-1">
                    {results.lessons.map(l => (
                      <div
                        key={l._id}
                        onClick={() => { onClose(); navigate(`/lesson/${l._id}`); }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{l.title}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.stories?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Stories
                  </h4>
                  <div className="space-y-1">
                    {results.stories.map(s => (
                      <div
                        key={s._id}
                        onClick={() => { onClose(); navigate(`/story/${s._id}`); }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{s.title}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.shop?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-teal-500" /> Shop Items
                  </h4>
                  <div className="space-y-1">
                    {results.shop.map(i => (
                      <div
                        key={i._id}
                        onClick={() => { onClose(); navigate('/shop'); }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{i.name}</span>
                        <span className="text-xs text-amber-500 font-bold">💎 {i.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !results && query.trim() === '' && (
            <div className="py-8 text-center text-slate-400 text-sm">
              Type anything to search across the entire LangSphere platform
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
