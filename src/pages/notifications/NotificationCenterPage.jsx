import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCheck, Sparkles } from 'lucide-react';

export const NotificationCenterPage = () => {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden pb-24 lg:pb-12">
          <Breadcrumbs />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
                <Bell className="w-7 h-7 text-emerald-500" /> Notification Center
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Stay updated on daily practice reminders, streak updates, and achievements</p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="px-4 py-2 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <CheckCheck className="w-4 h-4" /> Mark All Read
              </button>
            )}
          </div>

          <GlassCard className="p-6 space-y-3">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">No notifications available</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => markRead(n._id)}
                  className={`p-4 rounded-2xl border transition-colors flex items-start gap-4 cursor-pointer ${
                    !n.read
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300/50'
                      : 'bg-slate-100/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50'
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500 text-white shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white">{n.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      {new Date(n.createdAt || Date.now()).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </GlassCard>

        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default NotificationCenterPage;
