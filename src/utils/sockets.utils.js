const jwt = require("jsonwebtoken");
const socketIo = require('socket.io');
const socketUtils = require('./socket-dictionary.utils');

let io;
const socketInit = (server) => {

    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Authorization', 'userId'],
            credentials: true
        }
    });

    io.on('connection', socket => {
        const authToken = socket.handshake.headers['authorization'];
        const userEmail = socket.handshake.headers['userEmail'];

        socketUtils.addActiveUser(socket.id, userEmail);

        const verification = jwt.verify(user.session_token, process.env.TOKEN_SECRET);
        // TODO: Check is user is Admin and join admin room.
        if(verification.is_admin){
            socket.join('admin');
        } else {
            // Get user auctions and conversations
            //TODO: Join Auction rooms and conversations
        }


        socket.on('disconnect', () => {
            socketUtils.removeActiveUser(userEmail);
            console.log('Client disconnected');
        });

        /*
        TYPES OF NOTIFICATION
         Admin - New verification request
         User - Change on verification status.
         User - New conversation
         User/Owner - New Bid on Auction
         User/Owner - Buy now event
         Owner/AuctionWinner - End of auction (Expired, Closed)
        */
        socket.on('verify', async data => {
            //Update dynamodb document.

            //SEND NOTIFICATION TO USER with new status and message.
        });

        socket.on('verificationRequest', async data => {
            //After creating verificationRequest with lambda S3 image and dynamodb doc.
            //Emit to admin room
        });

        socket.on('message', async data => {
            //Add message document to dynamoDB
            //Add message as last message on conversation Document (this two on same lambda)
            //Emit message to user 
        });

        socket.on('createConversation', async data => {
            //Create conversation Document.
            //SEND NOTIFICATION TO USER new conversation
            //Emit notification to user.
        });

        socket.on('subscribeToConversation', async data => {

        });

        socket.on('subscribeToAuction', async data => {
            //Call subscribeToAuctionLambda
            //Join auction room
        });

        socket.on('newBid', async data => {
            //Update auction document with new bid and email of biddder
            //SEND NOTIFICATION TO OWNER AND INTERESTED PEOPLE
        });

        socket.on('buyNow', async data => {
            //Update auction document with bidWinner and change status to closed
            //SEND NOTIFICATION TO OWNER AND INTERESTED PEOPLE
        });
    });
}

notifyEndOfAuction = (auction) => {
    //Check if auction was closed or expired (Notify owner)
    //Notify bid winner if one exists
    //Notify all interested parties that auction has ended.
}

module.exports = {
    socketInit,
    notifyEndOfAuction
}