import {
  getUserNotifications,
  readNotification,
  readAllUserNotifications,
  sendPracticeReminder
} from '../services/notificationService.js';
import { sendError } from '../utils/responseHandler.js';

export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, unreadOnly } = req.query;
    const result = await getUserNotifications(req.user._id, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      type,
      unreadOnly: unreadOnly === 'true'
    });

    return res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: result.notifications,
      unreadCount: result.unreadCount,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return sendError(res, 500, error.message || 'Failed to fetch notifications');
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const updated = await readNotification(req.params.id, req.user._id);
    if (!updated) {
      return sendError(res, 404, 'Notification not found');
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: updated
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return sendError(res, 500, error.message || 'Failed to mark notification as read');
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    await readAllUserNotifications(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications read:', error);
    return sendError(res, 500, error.message || 'Failed to mark all notifications read');
  }
};

export const triggerPracticeReminder = async (req, res) => {
  try {
    const { language = 'Tamil' } = req.body;
    const notification = await sendPracticeReminder(req.user._id, language);

    return res.status(201).json({
      success: true,
      message: 'Practice reminder sent successfully',
      data: notification
    });
  } catch (error) {
    console.error('Error sending practice reminder:', error);
    return sendError(res, 500, error.message || 'Failed to send practice reminder');
  }
};

export default {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  triggerPracticeReminder
};
