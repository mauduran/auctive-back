const express = require('express');
const conversationController = require('../controllers/conversation.controller');
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.route('/')
    .post(authMiddleware, conversationController.createConversation);

module.exports = router ;
