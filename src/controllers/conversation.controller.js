const conversationUtils = require('../utils/conversation.utils');
const notificationUtils = require('../utils/notification.utils');


const createConversation = async (req, res) => {

    const { auctionId,  auctionOwnerEmail, auctionTitle } = req.body;

    if (!auctionId ||  !auctionOwnerEmail || !auctionTitle ) return res.status(400).json({
        error: true,
        message: "Missing required fields"
    });

    const bidder_email = req._user.email;


    try {
        await conversationUtils.createConversation(auctionId, bidder_email, auctionOwnerEmail);
        await notificationUtils.createNotification(auctionOwnerEmail, auctionId, auctionTitle, "Alguien ha pujado", bidder_email);
        // TODO: socket message to Owner (Socket)

        return res.json({ success: true, message: "Conversation created!"});

    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: true, message: "Could not create a Conversation" });
    }    
}


module.exports = {
    createConversation
}