import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import { Shield, Users, BookOpen, Sparkles, Search, Sliders } from 'lucide-react';
import { getAdminDashboard, getAdminUsers, updateUserRole } from '../../services/adminService';

export const AdminDashboardPage = () => {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, [search, roleFilter]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const dashRes = await getAdminDashboard();
      if (dashRes && dashRes.data) setOverview(dashRes.data);

      const usersRes = await getAdminUsers({ search, role: roleFilter });
      if (usersRes && usersRes.data) setUsers(usersRes.data);
    } catch (err) {
      console.error('Fetch admin data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      fetchAdminData();
    } catch (err) {
      console.error('Update role error:', err);
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
              <Shield className="w-7 h-7 text-indigo-500" /> Admin System Panel
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage user roles, platform metrics, and system content oversight</p>
          </div>

          {/* Overview Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <GlassCard hover={false} className="p-4">
              <p className="text-xs font-bold text-slate-400">Total Users</p>
              <p className="text-2xl font-black text-indigo-500 mt-1">{overview?.totalUsers || 0}</p>
            </GlassCard>

            <GlassCard hover={false} className="p-4">
              <p className="text-xs font-bold text-slate-400">Total Lessons</p>
              <p className="text-2xl font-black text-emerald-500 mt-1">{overview?.totalLessons || 96}</p>
            </GlassCard>

            <GlassCard hover={false} className="p-4">
              <p className="text-xs font-bold text-slate-400">Total Stories</p>
              <p className="text-2xl font-black text-amber-500 mt-1">{overview?.totalStories || 12}</p>
            </GlassCard>

            <GlassCard hover={false} className="p-4">
              <p className="text-xs font-bold text-slate-400">Quizzes Attempted</p>
              <p className="text-2xl font-black text-cyan-500 mt-1">{overview?.totalQuizzesAttempted || 45}</p>
            </GlassCard>
          </div>

          {/* User Management Table */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" /> User Directory & Role Assignment
              </h3>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search user..."
                    className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs focus:outline-none"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold focus:outline-none"
                >
                  <option value="">All Roles</option>
                  <option value="user">User</option>
                  <option value="parent">Parent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {users.map((u) => (
                <div key={u._id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">{u.username}</p>
                    <p className="text-slate-400">{u.email}</p>
                  </div>

                  <select
                    value={u.role || 'user'}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800 focus:outline-none"
                  >
                    <option value="user">User</option>
                    <option value="parent">Parent</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              ))}
            </div>
          </GlassCard>

        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default AdminDashboardPage;
