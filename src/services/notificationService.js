import apiClient from './apiClient';

export const getNotifications = async (params = {}) => {
  const res = await apiClient.get('/notifications', { params });
  return res.data;
};

export const markNotificationRead = async (id) => {
  const res = await apiClient.put(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsRead = async () => {
  const res = await apiClient.put('/notifications/read-all');
  return res.data;
};

export const sendPracticeReminder = async (language) => {
  const res = await apiClient.post('/notifications/remind-practice', { language });
  return res.data;
};

export default {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  sendPracticeReminder
};
