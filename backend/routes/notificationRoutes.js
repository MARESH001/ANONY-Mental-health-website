const express = require('express');
const { getNotifications, deleteNotification, deleteAllNotifications } = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Get all notifications for the authenticated user
router.get('/', authMiddleware, getNotifications);

// Delete a single notification
router.delete('/:id', authMiddleware, deleteNotification);

// Delete all notifications
router.delete('/', authMiddleware, deleteAllNotifications);

module.exports = router;
