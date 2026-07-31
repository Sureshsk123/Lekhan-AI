import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import Modal from '../../components/common/Modal';
import { Users, Plus, BookOpen, Clock, Flame, Brain, Award } from 'lucide-react';
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
      const res = await getChildrenOverview();
      if (res && res.data) {
        setChildren(res.data);
        if (res.data.length > 0) {
          selectChild(res.data[0]._id || res.data[0].id);
        }
      }
    } catch (err) {
      console.error('Fetch children error:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectChild = async (childId) => {
    setSelectedChildId(childId);
    try {
      const res = await getChildDashboard(childId);
      if (res && res.data) setChildDashboard(res.data);
    } catch (err) {
      console.error('Fetch child dashboard error:', err);
    }
  };

  const handleLinkChild = async (e) => {
    e.preventDefault();
    if (!childEmail.trim()) return;
    try {
      await linkChild(childEmail, relationship);
      setModalOpen(false);
      setChildEmail('');
      fetchChildren();
    } catch (err) {
      console.error('Link child error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-content-primary flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden pb-24 lg:pb-12">
          <Breadcrumbs />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
                <Users className="w-7 h-7 text-teal-500" /> Parent Portal Dashboard
              </h1>
              <p className="text-xs text-content-tertiary mt-1">Monitor child learning progress, study hours, weak topics, and AI reports</p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-accent-primary text-white font-bold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Link Child Account
            </button>
          </div>

          {/* Children Tabs */}
          {children.length > 0 && (
            <div className="flex gap-2 border-b border-border-light pb-2">
              {children.map((c) => {
                const cId = c._id || c.id;
                const active = selectedChildId === cId;
                return (
                  <button
                    key={cId}
                    onClick={() => selectChild(cId)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${
                      active
                        ? 'bg-teal-500 text-white shadow-md'
                        : 'text-slate-500 hover:bg-surface-tertiary'
                    }`}
                  >
                    👤 {c.username}
                  </button>
                );
              })}
            </div>
          )}

          {/* Dashboard Summary */}
          {childDashboard ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <GlassCard hover={false} className="p-4">
                  <p className="text-xs font-bold text-slate-400">Child Username</p>
                  <p className="text-lg font-black text-slate-800 dark:text-white mt-1">{childDashboard.child?.username}</p>
                </GlassCard>

                <GlassCard hover={false} className="p-4">
                  <p className="text-xs font-bold text-slate-400">Total XP</p>
                  <p className="text-lg font-black text-amber-500 mt-1">⚡ {childDashboard.child?.xp || 0}</p>
                </GlassCard>

                <GlassCard hover={false} className="p-4">
                  <p className="text-xs font-bold text-slate-400">Current Streak</p>
                  <p className="text-lg font-black text-rose-500 mt-1">🔥 {childDashboard.child?.streak?.current || 1} Days</p>
                </GlassCard>

                <GlassCard hover={false} className="p-4">
                  <p className="text-xs font-bold text-slate-400">Weak Topics</p>
                  <p className="text-lg font-black text-indigo-500 mt-1">
                    {(childDashboard.weakAreas?.weakAlphabetsCount || 0) + (childDashboard.weakAreas?.weakPronunciationCount || 0)}
                  </p>
                </GlassCard>
              </div>

              {/* Recommendations */}
              <GlassCard className="p-6 space-y-3">
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <Brain className="w-4 h-4 text-emerald-500" /> AI Recommendations for Child
                </h3>
                {childDashboard.recommendations?.map((r, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-surface-tertiary text-xs">
                    <p className="font-bold text-slate-800 dark:text-white">{r.title}</p>
                    <p className="text-slate-400 mt-0.5">{r.reason}</p>
                  </div>
                ))}
              </GlassCard>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">No child accounts linked yet. Click "Link Child Account" to begin monitoring.</div>
          )}

        </main>
      </div>

      {/* Link Child Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Link Child Learner Account">
        <form onSubmit={handleLinkChild} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-content-secondary mb-1">Child Account Email</label>
            <input
              type="email"
              required
              value={childEmail}
              onChange={(e) => setChildEmail(e.target.value)}
              placeholder="child@example.com"
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-tertiary border border-border-light text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-accent-primary text-white font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            Link Child Account
          </button>
        </form>
      </Modal>

      <MobileBottomNav />
    </div>
  );
};

export default ParentDashboardPage;
