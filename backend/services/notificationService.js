import {
  createNotification,
  getNotificationsByUserId,
  markAsRead,
  markAllAsRead
} from '../repositories/notificationRepository.js';

export const sendNotification = async ({ userId, title, message, type = 'info', pushToken = null, metadata = {} }) => {
  return await createNotification({
    userId,
    title,
    message,
    type,
    pushSent: Boolean(pushToken),
    pushToken,
    metadata
  });
};

export const getUserNotifications = async (userId, params) => {
  return await getNotificationsByUserId(userId, params);
};

export const readNotification = async (notificationId, userId) => {
  return await markAsRead(notificationId, userId);
};

export const readAllUserNotifications = async (userId) => {
  return await markAllAsRead(userId);
};

export const sendPracticeReminder = async (userId, language = 'Tamil') => {
  return await sendNotification({
    userId,
    title: '⏰ Time for Daily Practice!',
    message: `Keep your streak alive! Spend 10 minutes practicing ${language} today.`,
    type: 'practice_reminder'
  });
};

export default {
  sendNotification,
  getUserNotifications,
  readNotification,
  readAllUserNotifications,
  sendPracticeReminder
};
