import express from 'express';
import protect from '../middleware/auth.js';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  triggerPracticeReminder
} from '../controllers/notificationController.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.put('/read-all', markAllNotificationsRead);
router.put('/:id/read', markNotificationRead);
router.post('/remind-practice', triggerPracticeReminder);

export default router;
