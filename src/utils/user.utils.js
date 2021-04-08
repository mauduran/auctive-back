const bcrypt = require("bcryptjs");
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
        p_hash: hash,
        notifications: [],
    }

    params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        Item: user,
        ConditionExpression: "attribute_not_exists(PK)"
    }

    return dynamoDB.put(params).promise()
        .then(res => {
            delete user.p_hash;
            return user;
        });
}

const verifyCredentials = async (hash, password) => {
    try {
        const validCredentials = await bcrypt.compare(password, hash);

        if (validCredentials) return Promise.resolve(true);

        throw "Credentials not valid";

    } catch (error) {
        return Promise.reject("Could not validate credentials");
    }
}

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

const changePassword = async (email, newPassword) => {
    email = email.toLowerCase();
    let hash = await bcrypt.hash(newPassword, 10);

    params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        Key: {
            "PK": `USER#${email}`,
            "SK": `#PROFILE#${email}`
        },
        UpdateExpression: "set p_hash = :p_hash",
        ExpressionAttributeValues: {
            ":p_hash": hash,
        },
        ReturnValues: "UPDATED_NEW"
    }

    return dynamoDB.update(params).promise()
        .then(user => {
            return true;
        })
}

//TODO: Poner filter query para filtrar por email: includes(query) o  name: includes(query)
const findUsers = async (query) => { 
    params = {
        TableName: 'auctive-table',
        IndexName: 'email-index',
    }

    return new Promise((resolve, reject) => {
        docClient.scan(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

//TODO: Delete lógico. Validar que no tenga ninguna subasta activa
const deleteUser = async (userId) => { }

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