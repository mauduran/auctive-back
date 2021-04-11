const { dynamoDB } = require("../../config/aws.config")

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}

//TODO: Create conversation, only the bidder can start the conversation. Last message is empty
const createConversation = async (auctionId, user, auctionOwner) => {

}

//TODO: Update conversation and remove user from it. Does not remove the conversation
const leaveConversation = async (conversationId, userEmail) => {

}

//TODO: Create new mesage document linked to a conversation.
const addMessageToConversation = async (conversationId, message, senderEmail, senderName) => {

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