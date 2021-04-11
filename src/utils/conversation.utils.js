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