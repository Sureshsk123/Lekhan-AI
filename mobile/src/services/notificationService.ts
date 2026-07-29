import apiClient from './apiClient';
import { AppNotification } from '../types';

export const getNotifications = async (): Promise<AppNotification[]> => {
  const res = await apiClient.get('/notifications');
  return res.data.notifications || res.data.data || [];
};

export const markNotificationRead = async (id: string): Promise<any> => {
  const res = await apiClient.put(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsRead = async (): Promise<any> => {
  const res = await apiClient.put('/notifications/read-all');
  return res.data;
};

export const sendPracticeReminder = async (language: string): Promise<any> => {
  const res = await apiClient.post('/notifications/remind-practice', { language });
  return res.data;
};

export default {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  sendPracticeReminder,
};
