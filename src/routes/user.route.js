const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.route('/')
    .get(authMiddleware, userController.getUsers)
    .delete(authMiddleware, userController.deleteUser);

router.route('/login')
    .post(userController.login);

router.route('/login/google')
    .post(userController.googleLogin);

router.route('/logout')
    .post(authMiddleware, userController.logOut);

router.route('/register')
    .post(userController.createUser);

router.route('/changePassword')
    .post(authMiddleware, userController.changePassword);

router.route('/profile-pic')
    .put(authMiddleware, userController.updateUserProfilePic)

router.route('/:id')
    .get(authMiddleware, userController.getUser);