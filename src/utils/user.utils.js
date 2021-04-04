const bcrypt = require("bcryptjs");
const tokenUtils = require("./token.utils");
const { dynamoDB } = require("../../config/aws.config")

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}

const createUser = async (name, email, password) => {
    email = email.toLowerCase();
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
        TableName: process.env.AWS_DYNAMODB_TABLE,
        Item: user,
        ConditionExpression: "attribute_not_exists(PK)"
    }

    return dynamoDB.put(params).promise()
        .then(res => {
            delete user.hash;
            return user;
        });
}

const verifyCredentials = async (email, password) => {
    try {
        const user = await findUserByEmail(email);

        const validCredentials = await bcrypt.compare(password, user.hash);

        if (validCredentials) return Promise.resolve(true);

        throw "Credentials not valid";

    } catch (error) {
        return Promise.reject("Could not validate credentials");
    }
}
const findUsers = async (query) => { }

const findUserByEmail = (email) => {
    email = email.toLowerCase();
    const params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        Key: {
            "PK": `USER#${email}`,
            "SK": `#PROFILE#${email}`
        }
    }

    return dynamoDB.get(params).promise()
        .then(data => data.Item);

}


const deleteUser = async (userId) => { }

const changePassword = async (userId, currentPassword, newPassword) => { }

const updateUserWithGoogleId = async (userId, googleId) => { }

const updateUserProfilePic = async (userId, imageUrl) => { }

module.exports = {
    createUser,
    findUsers,
    findUserByEmail,
    verifyCredentials,
    deleteUser,
    changePassword,
    updateUserWithGoogleId,
    updateUserProfilePic
}