const { dynamoDB } = require("../../config/aws.config")

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}

const generateNotification = async (email, auctionId, message, file, emitter) => { }

const getAllNotifications = (email) => {
    params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        KeyConditionExpression: "PK = :pk  and begins_with (SK, :sk)",
        ExpressionAttributeValues: {
            ":pk": `USER#${email}`,
            ":sk": '#NOTIFICATION#'
        },
    }

    return dynamoDB.query(params).promise()
        .then(data => {
            return data.Items;
        });
}

const deleteNotification = async (email, notificationId) => {
    params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        Key: {
            PK: `USER#${email}`,
            SK: `#NOTIFICATION#${notificationId}`
        },
    }

    return dynamoDB.delete(params).promise()
        .then(data => {
            return data.Items;
        });
}

const deleteAllNotifications = async (email) => { }

module.exports = {
    generateNotification,
    deleteNotification,
    deleteAllNotifications,
    getAllNotifications
}