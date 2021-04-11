const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.route('/')
    .get(authMiddleware, userController.getUsers)
    .post(authMiddleware, userController.updateUserPhoneNumber)
    .delete(authMiddleware, userController.deleteUser);

router.route('/login/google')
    .post(userController.googleLogin);

router.route('/logout')
    .post(authMiddleware, userController.logOut);

router.route('/change-password')
    .post(authMiddleware, userController.changePassword);

router.route('/profile-pic')
    .put(authMiddleware, userController.updateUserProfilePic)

router.route('/user')
    .get(authMiddleware, userController.getMyUser);

router.route('/:email')
    .get(authMiddleware, userController.getUser);


module.exports = router;
