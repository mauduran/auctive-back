const { dynamoDB } = require("../../config/aws.config")
const { v4: uuidv4 } = require('uuid');



if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}

// TODO: Create notification. new DynamoDB document
const createNotification = async (email, auctionId, auctionTitle, message, emitter) => {
    let notificationId = uuidv4();
    let notification = {
        PK: `USER#${email}`,
        SK: `#NOTIFICATION#${notificationId}`,
        notification_id: notificationId,
        auctionId: auctionId,
        auctionTitle: auctionTitle,
        message: message,
        date: new Date().toUTCString(),
        emitter: emitter
    }

    params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        ConditionExpression: "attribute_not_exists(PK)",
        Item: notification
    }

      return new Promise((resolve, reject) => {
        dynamoDB.put(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

}


//TODO: REMOVE: Move this to lambda.
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