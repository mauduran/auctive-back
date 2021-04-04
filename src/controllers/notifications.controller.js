const notificationUtils = require('../utils/notification.utils');

const getNotifications = async (req, res) => { 
    try {
        notifications = await notificationUtils.getAllNotifications(req._user.email);

        res.json({success: true, notifications});
    } catch (error) {
        res.status(400).json({error: true, message: "Couldn't fetch notifications"});
    }
}

const deleteNotification = async (req, res) => { }

const deleteAllNotifications = async (req, res) => { }

module.exports = {
    getNotifications,
    deleteNotification,
    deleteAllNotifications
}