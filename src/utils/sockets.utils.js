const jwt = require("jsonwebtoken");
const socketIo = require('socket.io');
const socketUtils = require('./socket-dictionary.utils');
const schedule = require('node-schedule');
const axios = require('axios');
const dateUtils = require('./date.utils');

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}

const headers = { 'Content-Type': 'application/json', 'X-API-KEY': process.env.SERVERLESS_API_KEY };

const socketInit = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Authorization', 'userEmail'],
            credentials: true
        }
    });

    io.on('connection', socket => {
        const authToken = socket.handshake.headers['authorization'];
        const userEmail = socket.handshake.headers['useremail'];

        socketUtils.addActiveUser(socket.id, userEmail);

        console.log("newConnection: ", userEmail);
        const verification = jwt.verify(authToken, process.env.TOKEN_SECRET);
        if (verification.is_admin) {
            socket.join('admin');
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
            const { verificationStatus, email } = data;
            if (!verificationStatus || !email) return;

            const configParams = {
                headers: { ...headers, Authorization: authToken }
            }
            axios.put(process.env.IBM_API_GATEWAY_URL, { verificationStatus, email }, configParams)
                .then(res => {
                    const userSocket = socketUtils.getSocketIdFromUser(email);
                    const status = verificationStatus == 'ACCEPTED' ? 'accepted' : 'rejected';
                    socket.to(userSocket).emit('verificationUpdate', { status, message: `Your verification request has been ${status}` });
                })
                .catch(err => {
                    console.error(err);
                })
        });

        socket.on('verificationRequest', async data => {
            console.log("new verification request!")
            io.to('admin').emit('newVerificationRequest');
        });

        socket.on('message', async data => {

            const { conversationId, messageBody, senderName, auctionId } = data;
            if (!conversationId || !messageBody || !senderName || !auctionId) return;

            const configParams = {
                headers: { ...headers, Authorization: authToken }
            }
            axios.put(`${process.env.API_GATEWAY_URL}/conversations/addMessage`,
                { conversationId, messageBody, senderName, auctionId },
                configParams
            ).then(res => {
                const result = res.data;
                socket.to(conversationId).emit(result);
            }).catch(err => {
                console.error(err);
            })

        });

        socket.on('createConversation', async data => {
            const { auctionId, auctionOwnerEmail, auctionTitle } = body;
            if (!auctionOwnerEmail || !auctionTitle || !senderName || !auctionId) return;

            const configParams = {
                headers: { ...headers, Authorization: authToken }
            }

            try {
                const res = await axios.post(`${process.env.API_GATEWAY_URL}/conversations/create`,
                    { auctionId, auctionOwnerEmail, auctionTitle },
                    configParams
                );

                const conversation = res.data;

                socket.join(conversation.conversation_id);
                const socketId = socketUtils.getSocketIdFromUser(auctionOwnerEmail);
                if (socketId) {
                    socket.to(socketId).emit('newConversation', { conversation })
                }


            } catch (error) {
                console.log(error);
            }

        });

        socket.on('subscribeToConversations', async data => {
            for (let conversation of data.conversations) {
                socket.join(conversation);
            }
        });

        socket.on('subscribeToAuctions', data => {
            for (let auction of data.auctions) {
                socket.join(auction);
            }
        })

        socket.on('subscribeToAuction', async data => {
            try {
                const { auctionId } = data;

                const configParams = {
                    headers: { ...headers, Authorization: authToken }
                }

                await axios.post(`${process.env.API_GATEWAY_URL}/auctions/subscribe`,
                    { auctionId },
                    configParams
                );

                socket.join(data.auctionId);
            } catch (error) {
                console.log(error);
            }
        });

        socket.on('newBid', async data => {
            const { auctionId, bid, auctionOwnerEmail } = data;

            if (!auctionId || !bid || !auctionOwnerEmail) return;

            const configParams = {
                headers: { ...headers, Authorization: authToken }
            }

            await axios.put(`${process.env.API_GATEWAY_URL}/auctions/newBid`,
                { auctionId, bid, auctionOwnerEmail },
                configParams
            );


            socket.to(auctionId).send("newBid", { auctionId, bid, auctionOwnerEmail });
            const owner = socketUtils.getSocketIdFromUser(auction.owner_email);

            //Subscribe user to auction
            //SEND NOTIFICATION TO OWNER  
            //GET INTERESTED PEOPLE AND SEND NOTIFICATION
            //SEND PHONE NOTIFICATION TO users with feature activated
        });

        socket.on('buyNow', async data => {
            const { auctionId, auctionOwnerEmail } = data;

            if (!auctionId || !auctionOwnerEmail) return;

            const configParams = {
                headers: { ...headers, Authorization: authToken }
            }

            await axios.put(`${process.env.API_GATEWAY_URL}/auctions/newBid`,
                { auctionId, auctionOwnerEmail },
                configParams
            );

            io.to(auctionId).send("buyNow", { auctionId, auctionOwnerEmail });

            const owner = socketUtils.getSocketIdFromUser(auction.owner_email);

            //Subscribe user to auction
            // GET INTERESTED PEOPLE
            //SEND NOTIFICATION TO OWNER AND INTERESTED PEOPLE
            schedule.scheduledJobs[data.auctionId].cancel();
        });

        socket.on('scheduleAuction', async auction => {
            try {
                const { auctionId, endDate, auctionOwnerEmail } = auction;


                if (!auctionId || !endDate || !auctionOwnerEmail) return;

                const configParams = {
                    headers
                }
                const res = await axios.post(`${process.env.API_GATEWAY_URL}/scheduled-actions`,
                    { auctionId, endDate, auctionOwnerEmail },
                    configParams
                );

                
                const resAuction = res.data.auction;

                schedule.scheduleJob(auction.auctionId, new Date(endDate), () => {
                    closeAuction(resAuction.auction_id, resAuction.owner_email);
                });

            } catch (error) {
                console.log(error);
            }
        });
    });

    const notifyEndOfAuction = async (auctionId, ownerEmail) => {
        try {
            const configParams = {
                headers: { ...headers }
            }
            let scheduledAuction = await axios.get(`${process.env.API_GATEWAY_URL}/scheduled-actions/${auctionId}`,
                configParams
            );

            scheduledAuction = scheduledAuction.data;

            date = new Date(scheduledAuction.date);

            if (scheduledAuction.scheduledAction.pending) {
                if (date <= new Date()) {
                    await closeAuction({ auctionId, ownerEmail });
                    return;
                }
                schedule.scheduleJob(auctionId, date, async () => {
                    await closeAuction({ auctionId, ownerEmail });
                });
            }
        } catch (error) {
            console.log(error);
        }

    }

    const closeAuction = async (auction) => {
        const configParams = {
            headers
        }

        console.log("Closing auction");
        try {
            const res = await axios.post(
                `${process.env.API_GATEWAY_URL}/auctions/close`,
                { auctionId: auction.auctionId, auctionOwnerEmail: auction.ownerEmail },
                configParams
            )
            const { bid_winner } = res.data;

            let auctionRes = await axios.get(
                `${process.env.API_GATEWAY_URL}/auctions/get/${auction.auctionId}`,
                configParams
            )

            auctionRes = auctionRes.data;

            io.to(auction.auctionId).emit('auctionClose', auctionRes.auction);

            if (bid_winner) {
                const socketId = socketUtils.getSocketIdFromUser(bid_winner);
                if (socketId) io.to(socketId).emit('auctionWon', auction);
            }

            console.log("Auction closed");

        } catch (error) {
            console.log(error);
            return {}
        }
    }

    return { notifyEndOfAuction }
}


module.exports = {
    socketInit
}