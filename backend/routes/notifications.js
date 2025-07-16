import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
  getUserProfile
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', authenticateToken, getNotifications);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.get('/profile', authenticateToken, getUserProfile);
router.put('/:notificationId/read', authenticateToken, markAsRead);
router.put('/mark-all-read', authenticateToken, markAllAsRead);
router.delete('/:notificationId', authenticateToken, deleteNotification);

export default router;