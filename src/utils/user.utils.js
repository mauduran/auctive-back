const bcrypt = require("bcryptjs");
const tokenUtils = require("./token.utils");
const { dynamoDB } = require("../../config/aws.config")

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}

const createUser = async (name, email, password) => {
    let hash = await bcrypt.hash(password, 10);

    let user = {
        PK: `USER#${email}`,
        SK: `#PROFILE#${email}`,
        joined: new Date().toISOString(),
        is_verified: false,
        name: name,
        email: email,
        is_admin: false,
        hash: hash,
        notifications: [],
    }

    params = {
        TableName: 'auctive-table',
        Item: user,
        ConditionExpression: "attribute_not_exists(PK)"
    }

    return dynamoDB.put(params).promise()
        .then(res => {
            delete user.hash;
            return user;
        });
}

const findUsers = async (query) => { }

const findUserByEmail = async (email) => { }

const findUserById = async (userId) => { }

const deleteUser = async (userId) => { }

const changePassword = async (userId, currentPassword, newPassword) => { }

const updateUserWithGoogleId = async (userId, googleId) => { }

const updateUserProfilePic = async (userId, imageUrl) => { }

module.exports = {
    createUser,
    findUsers,
    findUserByEmail,
    findUserById,
    deleteUser,
    changePassword,
    updateUserWithGoogleId,
    updateUserProfilePic
}