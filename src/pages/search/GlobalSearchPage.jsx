import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import { Search, BookOpen, Sparkles, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { globalSearch } from '../../services/searchService';
import { useNavigate } from 'react-router-dom';

export const GlobalSearchPage = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
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
        const res = await globalSearch(query, category);
        setResults(res.data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, category]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden pb-24 lg:pb-12">
          <Breadcrumbs />

          <div>
            <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
              <Search className="w-7 h-7 text-emerald-500" /> Unified Global Search Engine
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Instant multi-category search across lessons, stories, vocabulary, users, and shop items</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search anything..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                autoFocus
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="lessons">Lessons</option>
              <option value="stories">Stories</option>
              <option value="vocabulary">Vocabulary</option>
              <option value="shop">Shop</option>
              <option value="users">Users</option>
            </select>
          </div>

          {loading && (
            <div className="py-12 text-center text-slate-400">Searching...</div>
          )}

          {!loading && results && (
            <div className="space-y-6">
              {results.lessons?.length > 0 && (
                <GlassCard className="p-6">
                  <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider mb-3">Lessons</h3>
                  <div className="space-y-2">
                    {results.lessons.map((l) => (
                      <div
                        key={l._id}
                        onClick={() => navigate(`/lesson/${l._id}`)}
                        className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <span className="font-bold text-sm">{l.title}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {results.stories?.length > 0 && (
                <GlassCard className="p-6">
                  <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider mb-3">Stories</h3>
                  <div className="space-y-2">
                    {results.stories.map((s) => (
                      <div
                        key={s._id}
                        onClick={() => navigate(`/story/${s._id}`)}
                        className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <span className="font-bold text-sm">{s.title}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>
          )}

        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default GlobalSearchPage;
