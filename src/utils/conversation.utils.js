const { dynamoDB } = require("../../config/aws.config")

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}


const createConversation = async (auctionId, user, auctionOwner) => {

}

const leaveConversation = async (conversationId, userEmail) => {

}


const addMessageToConversation = async (conversationId, message, senderEmail, senderName) => {

}

//TODO: Test functionality and consider including "#CONVERSATION#" in the conversationId
const getConversationById = async (conversationId, userEmail) => {
    //Validate user is in conversation with filter query
    params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        IndexName: 'reverse-index',
        KeyConditionExpression: "SK = :sk  and begins_with (PK, :pk)",
        ExpressionAttributeValues: {
            ":pk": `AUCTION#`,
            ":sk": `#CONVERSATION#${conversationId}`
        },
    }
    return dynamoDB.query(params).promise()
        .then(data => {
            if (data.Items.length) return data.Items[0];
            throw "Could not find conversation"
        });
}

//TODO: Test functionality
const getConversations = async (email) => {
    params_1 = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        IndexName: 'seller_email-index',
        KeyConditionExpression: "seller_email = :seller_email",
        ExpressionAttributeValues: {
            ":seller_email": email
        },
    }

    params_2 = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        IndexName: 'bidder_email-index',
        KeyConditionExpression: "bidder_email = :bidder_email",
        ExpressionAttributeValues: {
            ":bidder_email": email
        },
    }

    let conversations = [];

    return dynamoDB.query(params_1).promise()
        .then(data => {
            conversations.push(...data.Items);
            return dynamoDB.query(params_2).promise()
        })
        .then(data => {
            conversations.push(...data.Items);
            return conversations;
        });
}

//TODO: Test functionality and consider including "#CONVERSATION#" in the conversationId
const getMessagesFromConversation = async (conversationId) => {
    params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        KeyConditionExpression: "PK = :pk  and begins_with (SK, :sk)",
        ExpressionAttributeValues: {
            ":pk": `#CONVERSATION#${id}`,
            ":sk": '#MESSAGE#'
        },
    }
    return dynamoDB.query(params).promise()
        .then(data => data.Items);
}

//TODO: Borrado Lógico. Los usuarios verán "Mensaje eliminado"
const deleteMessageFromConversation = async (conversationId, messageId, userEmail) => {

}


module.exports = {
    createConversation,
    leaveConversation,
    addMessageToConversation,
    deleteMessageFromConversation,
    getMessagesFromConversation,
    getConversationById,
    getConversations
}