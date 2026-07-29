import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import { Brain, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { getPersonalizedProfile } from '../../services/personalizedService';
import { useNavigate } from 'react-router-dom';

export const PersonalizedLearningPage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getPersonalizedProfile();
      if (res && res.data) setProfileData(res.data);
    } catch (err) {
      console.error('Fetch personalized profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden pb-24 lg:pb-12">
          <Breadcrumbs />

          <div>
            <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
              <Brain className="w-7 h-7 text-emerald-500" /> AI Weakness Diagnostics & Study Plan
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Autonomous Gemini AI analysis of your weak alphabets, vocabulary, pronunciation, and handwriting</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Weak Areas Summary Card */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" /> Detected Weak Topics
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-rose-700 dark:text-rose-300">Weak Alphabets / Characters</p>
                    <p className="text-xs text-rose-600 dark:text-rose-400">Consonant dots & curve formation</p>
                  </div>
                  <span className="text-lg font-black text-rose-600">
                    {profileData?.weakAreas?.weakAlphabetsCount || 2}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-300">Weak Pronunciation</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">Vowel elongation phrases</p>
                  </div>
                  <span className="text-lg font-black text-amber-600">
                    {profileData?.weakAreas?.weakPronunciationCount || 1}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300">Weak Handwriting</p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400">Stroke width consistency</p>
                  </div>
                  <span className="text-lg font-black text-indigo-600">
                    {profileData?.weakAreas?.weakHandwritingCount || 3}
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* Smart Recommendations Card */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" /> Recommended Practice Session
              </h3>

              <div className="space-y-3">
                {profileData?.recommendations?.map((rec, i) => (
                  <div
                    key={i}
                    onClick={() => navigate(rec.type === 'story' ? '/stories/tamil' : rec.type === 'lesson' ? '/lessons/tamil' : '/quiz/remedial-quiz')}
                    className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-emerald-500">{rec.type}</span>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-emerald-500">{rec.title}</h4>
                      <p className="text-xs text-slate-400">{rec.reason}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </GlassCard>

          </div>

        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default PersonalizedLearningPage;
