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
        const userId = socket.handshake.headers['userid'];
        const userName = socket.handshake.headers['username'];

        socketUtils.addActiveUser(socket.id, userId);

        // TODO: Check is user is Admin and join admin room.

        //TODO: if not user, join all auction rooms

        socket.on('disconnect', () => {
            socketUtils.removeActiveUser(userId);
            console.log('Client disconnected');
        });

        /*
        TYPES OF NOTIFICATION
         Admin - New verification request
         User - Change on verification status.
         User - New conversation
         User - New Bid on Auction
         Owner - New Bid on Auction
         User - Buy now event
         Owner - Buy now event
         Owner - End of auction (Expired, Closed)
         User - End of auction
         AuctionWinner - End of auction (bid won)
        */
        socket.on('verify', async data => {
            //Update dynamodb document.

            //SEND NOTIFICATION TO USER with new status and message.
        });

        socket.on('verificationRequest', async data => {
            //Add image to S3 bucket.
            //Add or update dynamodb document.
            //Remove old image from S3 bucket if any
            //Emit to admin room

        });

        socket.on('message', async data => {
            //Add message document to dynamoDB
            //Emit message to user 
        });

        socket.on('deleteMessage', async data => {
            //Update message document to dynamoDB
            //Emit message to user
        });

        socket.on('createConversation', async data => {
            //Create conversation Document.
            //SEND NOTIFICATION TO USER new conversation
            //Emit notification to user.
        });

        socket.on('removeConversation', async data => { 
            //Update conversation document (remove seller or bidder)
            //SEND message to other USER 'user has left conversation'
        });


        socket.on('subscribeToAuction', async data => { 
            //Update conversation document (Add user to Array if not there already)
            //Join auction room
        });

        socket.on('newBid', async data => {
            //Update conversation document with new bid and email of biddder
            //SEND NOTIFICATION TO OWNER AND INTERESTED PEOPLE
        });

        socket.on('buyNow', async data => {
            //Update conversation document with bidWinner and change status to closed
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