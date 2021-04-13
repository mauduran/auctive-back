const { dynamoDB } = require("../../config/aws.config")
const { v4: uuidv4 } = require('uuid');

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}

//TODO: Create conversation, only the bidder can start the conversation. Last message is empty
const createConversation = async (auctionId, bidderEmail, auctionOwnerEmail) => {
    let conversationId = uuidv4();

    let conversation = {
        PK: `AUCTION#${auctionId}`,
        SK: `#CONVERSATION#${conversationId}`,
        auctionId: auctionId,
        bidder_email: bidderEmail,
        last_message_date: new Date().toDateString(),
        last_message_sender: "",
        last_message_value: "",
        seller_email: auctionOwnerEmail,
    }

    params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        ConditionExpression: "attribute_not_exists(PK)",
        Item: conversation
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
}