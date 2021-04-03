const express = require('express');
const notificationsController = require('../controllers/notifications.controller');
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();


router.route('/')
    .get(authMiddleware, notificationsController.getNotifications)
    .delete(authMiddleware, notificationsController.deleteAllNotifications);

router.route('/:id')
    .delete(authMiddleware, notificationsController.deleteNotification);

module.exports = router ;
