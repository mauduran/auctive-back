const notificationUtils = require('../utils/notification.utils');

const getNotifications = async (req, res) => {
    try {
        notifications = await notificationUtils.getAllNotifications(req._user.email);

        res.json({ success: true, notifications });
    } catch (error) {
        res.status(400).json({ error: true, message: "Couldn't fetch notifications" });
    }
}

const deleteNotification = async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({
        error: true,
        message: "Missing required fields"
    });

    try {
        notifications = await notificationUtils.deleteNotification(req._user.email, id);

        res.json({ success: true, message: `Notification ${id} removed` });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: true, message: "Couldn't delete notification" });
    }
}

const deleteAllNotifications = async (req, res) => {
    try {
        const deletedItems = await notificationUtils.deleteAllNotifications(req._user.email);
        res.json({ success: true, documentsDeleted: deletedItems.length, message: "Notifications Deleted" });
    } catch (error) {

        res.status(400).json({ error: true, message: "Could not delete notifications." })
    }
}

module.exports = {
    getNotifications,
    deleteNotification,
    deleteAllNotifications
}