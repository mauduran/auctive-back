const { dynamoDB } = require("../../config/aws.config")

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}

// TODO: Create notification. new DynamoDB document
const createNotification = async (email, auctionId, auctionTitle, message, emitter) => {

}

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

//TODO: Include #NOTIFICATION# in notificationId
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

const deleteAllNotifications = async (email) => {
    try {
        let notifications = await getAllNotifications(email);

        notifications = notifications.map(notification => ({
            DeleteRequest: {
                Key: {
                    PK: notification.PK,
                    SK: notification.SK
                }
            }
        }));

        let requests = [];
        let batchSize = 25;

        for (let i = 0; i < notifications.length; i += batchSize) {
            let RequestItems = {}
            RequestItems[`${process.env.AWS_DYNAMODB_TABLE}`] = notifications.slice(i, i + batchSize);
            const params = {
                RequestItems
            }
            requests.push(dynamoDB.batchWrite(params).promise());
        }

        return Promise.all(notifications);


    } catch (error) {
        console.log(error);
        return Promise.reject("Could not delete notifications.");
    }
}

module.exports = {
    createNotification,
    deleteNotification,
    deleteAllNotifications,
    getAllNotifications
}