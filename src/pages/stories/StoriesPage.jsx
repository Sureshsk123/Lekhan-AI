import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import { getStories } from '../../services/storyService';
import { useAuth } from '../../context/AuthContext';

const LANGUAGES = [
  { code: 'tamil',    name: 'Tamil',     flag: '🇮🇳', apiCode: 'ta' },
  { code: 'telugu',   name: 'Telugu',    flag: '🇮🇳', apiCode: 'te' },
  { code: 'hindi',    name: 'Hindi',     flag: '🇮🇳', apiCode: 'hi' },
  { code: 'malayalam',name: 'Malayalam', flag: '🇮🇳', apiCode: 'ml' },
  { code: 'kannada',  name: 'Kannada',   flag: '🇮🇳', apiCode: 'kn' },
];

const LEVEL_COLORS = {
  BEGINNER:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  INTERMEDIATE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  ADVANCED:     'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export const StoriesPage = () => {
  const { language: paramLang } = useParams();
  const { activeLanguage } = useAuth();
  const navigate = useNavigate();

  // Determine initial language — URL param > active language > 'tamil'
  const resolvedLang = paramLang || activeLanguage || 'tamil';
  const [language, setLanguage] = useState(resolvedLang);
  const [stories, setStories]   = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => { fetchStories(); }, [language]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const langObj = LANGUAGES.find(l => l.code === language);
      const apiCode = langObj?.apiCode || language;
      const res = await getStories(apiCode);
      setStories(res?.data || []);
    } catch {
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <div className="min-h-screen bg-transparent text-content-primary flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto pb-24 lg:pb-12">
          <Breadcrumbs />

          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-amber-500" /> Cultural Storybooks
            </h1>
            <p className="text-xs text-content-tertiary mt-1">
              Immerse yourself in rich stories while building vocabulary and reading skills.
            </p>
          </div>

          {/* Language Tabs */}
          <div className="flex gap-1 border-b border-border-light overflow-x-auto pb-0 scrollbar-hide">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                  language === lang.code
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-content-secondary hover:text-content-primary'
                }`}
              >
                <span>{lang.flag}</span> {lang.name}
              </button>
            ))}
          </div>

          {/* Stories Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 rounded-2xl bg-surface-secondary animate-pulse" />
              ))}
            </div>
          ) : stories.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-semibold text-content-primary">No stories for {currentLang?.name} yet</h3>
              <p className="text-sm text-content-tertiary">Try switching to another language.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stories.map((story) => (
                <GlassCard
                  key={story.id}
                  onClick={() => navigate(`/story/${story.id}`)}
                  className="p-5 cursor-pointer hover:border-amber-400/50 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${LEVEL_COLORS[story.level] || 'bg-slate-100 text-slate-600'}`}>
                        {story.level}
                      </span>
                      <span className="text-xs font-bold text-amber-500">📖 {story._count?.pages || '—'} pages</span>
                    </div>
                    <h3 className="text-base font-bold text-content-primary line-clamp-2 group-hover:text-amber-600 transition-colors">
                      {story.title}
                    </h3>
                    {story.description && (
                      <p className="text-xs text-content-tertiary line-clamp-3">{story.description}</p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-border-light/60 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                      <Clock className="w-3 h-3" /> ~3 min read
                    </span>
                    <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default StoriesPage;
