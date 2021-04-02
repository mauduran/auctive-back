const bcrypt = require("bcryptjs");
const tokenUtils = require("./token.utils");

const findUsers = async (query) => { }

const findUserByEmail = async (email) => { }

const findUserById = async (userId) => { }

const deleteUser = async (userId) => { }

const changePassword = async (userId, currentPassword, newPassword) => { }

const updateUserWithGoogleId = async (userId, googleId) => { }

const updateUserProfilePic = async (userId, imageUrl) => { }

module.exports = {
    findUsers,
    findUserByEmail,
    findUserById,
    deleteUser,
    changePassword,
    updateUserWithGoogleId,
    updateUserProfilePic
}