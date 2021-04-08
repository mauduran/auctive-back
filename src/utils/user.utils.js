const bcrypt = require("bcryptjs");
const { dynamoDB } = require("../../config/aws.config")

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}

//TODO: REMOVE (now in lambda function)
const createUser = async (name, email, password) => {
    email = email.toLowerCase();
    let hash = await bcrypt.hash(password, 10);

    let user = {
        PK: `USER#${email}`,
        SK: `#PROFILE#${email}`,
        joined: new Date(),
        is_verified: false,
        name: name,
        email: email,
        is_admin: false,
        p_hash: hash,
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


//TODO: REMOVE (now in lambda function)
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

//TODO: Add phone number to user, requires auth middleware
const addPhoneNumber = async (email, phoneNumber) => {

}

// TODO: Enable notifications to phone/email
const enableNotifications = async () => { }

//TODO: Have filter query to search by either email: includes(query) or name: includes(query)
const findUsers = async (query) => {
    params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        IndexName: 'email-index',
    }

    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

//TODO: Logical Delete. Validate that is not currentBidder of any auctions and does not have any open auctions.
const deleteUser = async (userId) => { }

//TODO: Base this function on cloud drive project Check if theere is any changes for user creation with google
const updateUserWithGoogleId = async (userId, googleId) => { }

//TODO: Call Lambda function to store profile pic in S3 then update user document with url
const updateUserProfilePic = async (userId, imageUrl) => { }

module.exports = {
    createUser,
    findUsers,
    findUserByEmail,
    verifyCredentials,
    deleteUser,
    changePassword,
    updateUserWithGoogleId,
    updateUserProfilePic,
    addPhoneNumber,
    enableNotifications
}