import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { Users, BookOpen, ShieldCheck, Activity, BarChart, Server, Cpu, Database, Plus, Search, MoreVertical, CheckCircle2 } from 'lucide-react';

export const AdminDashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const usersList = [
    { id: '1', name: 'Sofia Rodriguez', email: 'sofia@example.com', role: 'Student', status: 'Active', xp: 4850 },
    { id: '2', name: 'Lucas Dubois', email: 'lucas@example.com', role: 'Student', status: 'Active', xp: 4210 },
    { id: '3', name: 'Dr. Sarah Jenkins', email: 'sarah@example.com', role: 'Parent', status: 'Active', xp: 0 },
    { id: '4', name: 'System Admin', email: 'admin@langsphere.app', role: 'Admin', status: 'Active', xp: 9990 },
  ];

  const filteredUsers = usersList.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

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
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                  Enterprise Admin Control Room
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Monitor system metrics, role-based access control, AI API telemetry, and content management
              </p>
            </div>

            <button className="btn-primary text-xs py-2.5 px-4 shadow-lg shadow-blue-500/20">
              Export System Audit Report
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-4 border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Users</span>
              <p className="text-xl font-extrabold font-heading text-slate-900 dark:text-white mt-1">
                12,450
              </p>
              <span className="text-[10px] font-bold text-emerald-500">▲ +14% this month</span>
            </div>

            <div className="glass-card p-4 border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Active Courses</span>
              <p className="text-xl font-extrabold font-heading text-blue-500 mt-1">
                48 Lessons
              </p>
              <span className="text-[10px] font-bold text-slate-400">across 8 languages</span>
            </div>

            <div className="glass-card p-4 border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">AI API Requests</span>
              <p className="text-xl font-extrabold font-heading text-teal-500 mt-1">
                184,290
              </p>
              <span className="text-[10px] font-bold text-teal-500">Gemini 2.5 Active</span>
            </div>

            <div className="glass-card p-4 border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">System Health</span>
              <p className="text-xl font-extrabold font-heading text-emerald-500 mt-1">
                99.98%
              </p>
              <span className="text-[10px] font-bold text-emerald-500">All Nodes Operational 🟢</span>
            </div>
          </div>

          {/* Role Management Table */}
          <div className="glass-card p-6 space-y-4 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                User Account Management
              </h3>

              <div className="relative w-48 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search user..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-extrabold uppercase text-slate-400">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">XP Score</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3">
                        <p className="font-extrabold text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-[10px] text-slate-400">{u.email}</p>
                      </td>
                      <td className="py-3">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          u.role === 'Admin' ? 'bg-indigo-500/15 text-indigo-500' : u.role === 'Parent' ? 'bg-teal-500/15 text-teal-500' : 'bg-blue-500/15 text-blue-500'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-emerald-500 font-bold">🟢 {u.status}</span>
                      </td>
                      <td className="py-3 font-bold text-amber-500">
                        ⚡ {u.xp} XP
                      </td>
                      <td className="py-3 text-right">
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default AdminDashboardPage;
