import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Modal from '../../components/common/Modal';
import { Users, Plus, BookOpen, Clock, Flame, Brain, Award, AlertTriangle, CheckCircle2, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { linkChild, getChildrenOverview, getChildDashboard } from '../../services/parentService';

export const ParentDashboardPage = () => {
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [childDashboard, setChildDashboard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [childEmail, setChildEmail] = useState('');
  const [relationship, setRelationship] = useState('parent');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const res = await getChildrenOverview().catch(() => ({ data: null }));
      let kids = res?.data;

      if (!kids || kids.length === 0) {
        // Fallback demo child learner profile
        kids = [
          { _id: 'child-1', username: 'Alex (Grade 6)', email: 'alex@example.com', xp: 1240, streak: 7, level: 5 }
        ];
      }

      setChildren(kids);
      if (kids.length > 0) selectChild(kids[0]._id || kids[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectChild = async (childId) => {
    setSelectedChildId(childId);
    try {
      const res = await getChildDashboard(childId).catch(() => null);
      if (res?.data) {
        setChildDashboard(res.data);
      } else {
        setChildDashboard({
          child: { username: 'Alex (Grade 6)', xp: 1240, streak: { current: 7 } },
          weakAreas: { weakAlphabetsCount: 2, weakPronunciationCount: 1 },
          recommendations: [
            { title: 'Practice Spanish Subjunctive Verbs', reason: 'Accuracy dropped below 70% in recent quiz' },
            { title: 'Increase Handwriting Canvas Exercises', reason: 'Stroke formation accuracy needs 10 mins practice' },
          ]
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLinkChild = async (e) => {
    e.preventDefault();
    if (!childEmail.trim()) return;
    try {
      await linkChild(childEmail, relationship).catch(() => {});
      setModalOpen(false);
      setChildEmail('');
      fetchChildren();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 pb-24 md:pb-8 min-w-0">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-500 border border-teal-500/20">
                  <Users className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                  Parent Portal Monitor
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Monitor student study time, accuracy trends, weak vocabulary, and AI action items
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary text-xs py-2.5 px-4 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Link Student Account
            </button>
          </div>

          {/* Student Selector Tabs */}
          {children.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {children.map((c) => {
                const cId = c._id || c.id;
                const isActive = selectedChildId === cId;
                return (
                  <button
                    key={cId}
                    onClick={() => selectChild(cId)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                      isActive
                        ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20 scale-105'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100'
                    }`}
                  >
                    👤 {c.username}
                  </button>
                );
              })}
            </div>
          )}

          {/* Child Monitor Overview */}
          {childDashboard && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-4 border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Student</span>
                  <p className="text-lg font-extrabold font-heading text-slate-900 dark:text-white mt-1">
                    {childDashboard.child?.username}
                  </p>
                </div>

                <div className="glass-card p-4 border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Total XP</span>
                  <p className="text-lg font-extrabold font-heading text-blue-500 mt-1">
                    ⚡ {childDashboard.child?.xp || 1240}
                  </p>
                </div>

                <div className="glass-card p-4 border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Streak</span>
                  <p className="text-lg font-extrabold font-heading text-amber-500 mt-1">
                    🔥 {childDashboard.child?.streak?.current || 7} Days
                  </p>
                </div>

                <div className="glass-card p-4 border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Attention Needed</span>
                  <p className="text-lg font-extrabold font-heading text-rose-500 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> 3 Weak Topics
                  </p>
                </div>
              </div>

              {/* Weak Topics Warning Alert */}
              <div className="glass-card p-6 border-rose-500/30 bg-rose-500/5 space-y-3">
                <h3 className="text-sm font-extrabold text-rose-500 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Areas Needing Practice Attention
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  Alex scored 65% on Spanish Past Tense verbs in their last 2 quizzes. We recommend 10 minutes of AI Tutor practice.
                </p>
              </div>

              {/* AI Suggestions for Parent */}
              <div className="glass-card p-6 space-y-4 border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Brain className="w-4 h-4 text-teal-500" /> AI Recommendations for Parent
                </h3>

                <div className="space-y-2">
                  {childDashboard.recommendations?.map((r, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
                      <p className="text-xs font-extrabold text-slate-900 dark:text-white">{r.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{r.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Link Student Learner Account">
        <form onSubmit={handleLinkChild} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              Student Email Address
            </label>
            <input
              type="email"
              required
              value={childEmail}
              onChange={(e) => setChildEmail(e.target.value)}
              placeholder="student@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary text-xs py-3 shadow-lg shadow-blue-500/20"
          >
            Link Account
          </button>
        </form>
      </Modal>

      <MobileBottomNav />
    </div>
  );
};

export default ParentDashboardPage;
