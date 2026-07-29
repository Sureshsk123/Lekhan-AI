import Notification from '../models/Notification.js';

export const createNotification = async (data) => {
  return await Notification.create(data);
};

export const getNotificationsByUserId = async (userId, { page = 1, limit = 10, type, unreadOnly = false }) => {
  const skip = (page - 1) * limit;
  const filter = { userId, isDeleted: false };
  if (type) filter.type = type;
  if (unreadOnly) filter.read = false;

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments(filter);
  const unreadCount = await Notification.countDocuments({ userId, read: false, isDeleted: false });

  return {
    notifications,
    unreadCount,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

export const markAsRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true }
  );
};

export const markAllAsRead = async (userId) => {
  return await Notification.updateMany({ userId, read: false }, { read: true });
};

export default {
  createNotification,
  getNotificationsByUserId,
  markAsRead,
  markAllAsRead
};
