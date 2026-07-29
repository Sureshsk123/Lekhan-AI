import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import Modal from '../../components/common/Modal';
import { Sparkles, BookOpen, Plus, Bookmark, ArrowRight } from 'lucide-react';
import { getStories, generateAIStory } from '../../services/storyService';

export const StoriesPage = () => {
  const { language = 'tamil' } = useParams();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStories();
  }, [language]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await getStories(language);
      if (res && res.data) setStories(res.data);
    } catch (err) {
      console.error('Fetch stories error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStory = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setGenerating(true);
    try {
      const res = await generateAIStory({ topic, language });
      setModalOpen(false);
      setTopic('');
      fetchStories();
    } catch (err) {
      console.error('Generate story error:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden pb-24 lg:pb-12">
          <Breadcrumbs />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black capitalize flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-amber-500" /> Cultural Storybooks ({language})
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Immerse yourself in rich folklore while building vocabulary</p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> AI Story Generator
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading stories...</div>
          ) : stories.length === 0 ? (
            <div className="py-12 text-center text-slate-400">No stories available. Use AI Story Generator to create one!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stories.map((story) => (
                <GlassCard
                  key={story._id}
                  onClick={() => navigate(`/story/${story._id}`)}
                  className="p-5 cursor-pointer hover:border-amber-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                        {story.difficulty || 'Intermediate'}
                      </span>
                      <span className="text-xs font-bold text-amber-500">📖 Story</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-800 dark:text-white line-clamp-1">{story.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">{story.summary || story.content}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">Read in ~3 mins</span>
                    <ArrowRight className="w-4 h-4 text-amber-500" />
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

        </main>
      </div>

      {/* AI Story Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="✨ AI Cultural Story Generator">
        <form onSubmit={handleGenerateStory} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Story Topic or Moral</label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. A brave farmer in a Tamil village"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {generating ? 'Generating Story with Gemini AI...' : 'Generate Story'}
          </button>
        </form>
      </Modal>

      <MobileBottomNav />
    </div>
  );
};

export default StoriesPage;
