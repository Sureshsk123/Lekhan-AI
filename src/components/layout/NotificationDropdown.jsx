import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCheck, Sparkles, BookOpen, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-content-tertiary hover:bg-surface-tertiary transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-primary rounded-3xl shadow-2xl border border-border-light py-3 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between px-4 pb-2 border-b border-border-light">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-500" /> Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-700/50">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                No new notifications
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => {
                    markRead(notif._id);
                    setOpen(false);
                  }}
                  className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors flex items-start gap-3 ${
                    !notif.read ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                      {notif.title}
                    </p>
                    <p className="text-xs text-content-tertiary mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                      {new Date(notif.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 px-4 border-t border-border-light text-center">
            <button
              onClick={() => {
                setOpen(false);
                navigate('/notifications');
              }}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View Notification Center →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
