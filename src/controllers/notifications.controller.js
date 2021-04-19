const notificationUtils = require('../utils/notification.utils');

const createNotification = async (req, res) => {
    const {  email,  message, auctionId, auctionTitle } = req.body;

    if (!email ||  !message || !auctionId || !auctionTitle) return res.status(400).json({
        error: true,
        message: "Missing required fields"
    });

    const emitter = req._user.email;
    try {
        let new_notification =  await notificationUtils.createNotification(email, message, auctionId, auctionTitle, emitter);
        console.log(new_notification);
        return res.json({ success: true, message: "Notification created!"});

    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: true, message: "Could not create a notification" });
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

    deleteAllNotifications,
    createNotification
}