const express = require('express');
const notificationsController = require('../controllers/notifications.controller');
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();


router.route('/')
    .post(authMiddleware, notificationsController.createNotification)
    .delete(authMiddleware, notificationsController.deleteAllNotifications);


module.exports = router ;
