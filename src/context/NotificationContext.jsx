import React, { createContext, useContext, useState, useEffect } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/notificationService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUserNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications({ limit: 10 });
      if (data && data.data) {
        setNotifications(data.data);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      // Quiet fail if not authenticated
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      fetchUserNotifications,
      markRead,
      markAllRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
