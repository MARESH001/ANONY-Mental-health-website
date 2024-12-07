const Notification = require('../models/Notification'); // Assume Notification model is defined

// Get all notifications for the authenticated user
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        console.error('Error fetching notifications:', err.message);
        res.status(500).json({ error: 'Failed to fetch notifications.' });
    }
};

// Delete a single notification
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndDelete(id);
        res.status(200).json({ message: 'Notification deleted successfully.' });
    } catch (err) {
        console.error('Error deleting notification:', err.message);
        res.status(500).json({ error: 'Failed to delete notification.' });
    }
};

// Delete all notifications for the authenticated user
exports.deleteAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ userId: req.user.id });
        res.status(200).json({ message: 'All notifications deleted successfully.' });
    } catch (err) {
        console.error('Error deleting all notifications:', err.message);
        res.status(500).json({ error: 'Failed to delete all notifications.' });
    }
};
