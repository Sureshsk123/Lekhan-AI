import React from 'react';
import Navbar from '../../components/layout/Navbar';
import { Users, BookOpen, Trophy, ShieldCheck, Activity, BarChart } from 'lucide-react';

export const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-content-primary">Admin Overview</h1>
            <p className="text-content-secondary mt-1">Enterprise management console</p>
          </div>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium shadow-sm transition-colors">
            Generate Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="p-6 rounded-2xl bg-surface-primary border border-border-light shadow-sm flex items-center justify-between hover:border-emerald-500/50 transition-colors cursor-default">
            <div>
              <p className="text-sm font-medium text-content-secondary">Total Users</p>
              <h3 className="text-2xl font-bold text-content-primary mt-1">12,450</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-surface-primary border border-border-light shadow-sm flex items-center justify-between hover:border-blue-500/50 transition-colors cursor-default">
            <div>
              <p className="text-sm font-medium text-content-secondary">Active Courses</p>
              <h3 className="text-2xl font-bold text-content-primary mt-1">45</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface-primary border border-border-light shadow-sm flex items-center justify-between hover:border-purple-500/50 transition-colors cursor-default">
            <div>
              <p className="text-sm font-medium text-content-secondary">System Health</p>
              <h3 className="text-2xl font-bold text-content-primary mt-1">99.9%</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Charts Area Placeholder */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-surface-primary border border-border-light shadow-sm min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <BarChart className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-content-secondary">Revenue Analytics Widget</p>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-surface-primary border border-border-light shadow-sm min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-content-secondary">Security Audit Logs</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
