const jwt = require("jsonwebtoken");
const socketIo = require('socket.io');
const socketUtils = require('./socket-dictionary.utils');
const schedule = require('node-schedule');
const axios = require('axios').default;

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
            try {
                await axios.put(process.env.IBM_API_GATEWAY_URL, { verificationStatus, email }, configParams);
                const userSocket = socketUtils.getSocketIdFromUser(email);
                const status = verificationStatus == 'ACCEPTED' ? 'accepted' : 'rejected';

                socket.to(userSocket).emit('verificationUpdate', { status, message: `Your verification request has been ${status}` });

                socket.to(userSocket).emit('notification', { type: "Verification", message: "New notification" });


                // Get user
                let userResponse = await axios.get(process.env.API_GATEWAY_URL + `/users/emailList?list=["${email}"]`, configParams);
                if (!userResponse.data.success) return;
                let user = userResponse.data.usersList[0];

                // Check if phone number && sms enabled
                if (!user.phone_number || !user.notifications_enabled) return;

                // Send or not SMS
                let sms = {
                    "number": user.phone_number,
                    "message": `Your verification request has been ${status}`
                }
                await axios.post(process.env.API_GATEWAY_URL + "/send-sms", sms, configParams);
            } catch (error) {
                console.error(error);
            }

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
            if (!auctionOwnerEmail || !auctionTitle || !auctionId) return;

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
                socket.join(auction.auction_id);
            }
        })
        socket.on('leaveAuctions', data => {
            for (let auction of data.auctions) {
                socket.leave(auction);
            }
        })

        socket.on('joinAuction', data => {
            socket.join(data.auctionId);
        });

        socket.on('leaveAuction', data => {
            socket.leave(data.auctionId);
        });

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
            try {
                const { auctionId, bid, auctionOwnerEmail } = data;

                if (!auctionId || !bid || !auctionOwnerEmail) return;

                const configParams = {
                    headers: { ...headers, Authorization: authToken }
                }

                let res = await axios.put(`${process.env.API_GATEWAY_URL}/auctions/new-bid`,
                    { auctionId, bid, auctionOwnerEmail },
                    configParams
                );
                if (!res.data.success) return;

                let updatedAuction = res.data.current_auction.Attributes;
                let current_bidder = updatedAuction.current_bidder

                socket.join(auctionId);
                io.to(auctionId).emit("newBid", { auctionId, bid, auctionOwnerEmail, current_bidder });


                await axios.post(`http://localhost:4000/dev/notifications/create`,
                    { email: auctionOwnerEmail, auctionId, auctionTitle: updatedAuction.title, message: `Somebody has made a bid on auction ${auctionId}` },
                    configParams
                );

                const owner = socketUtils.getSocketIdFromUser(auctionOwnerEmail);

                if (owner) socket.to(owner).emit("notification", { auctionId, bid, current_bidder });


                subscribeAndSendSMS(auctionId, updatedAuction.title, `There has been a new bid on auction ${auctionId}`, configParams);
            } catch (error) {
                console.log(error);
                socket.emit('unsuccessfulBid', {});
            }
        });

        socket.on('buyNow', async data => {

            try {
                const { auctionId, auctionOwnerEmail } = data;

                if (!auctionId || !auctionOwnerEmail) return;

                const configParams = {
                    headers: { ...headers, Authorization: authToken }
                }

                let res = await axios.put(`${process.env.API_GATEWAY_URL}/auctions/buy-now`,
                    { auctionId, auctionOwnerEmail },
                    configParams
                );

                if (!res.data.success) return;

                let updatedAuction = res.data.closed_auction.Attributes;
                let bid_winner = updatedAuction.bid_winner;

                if (schedule.scheduledJobs[data.auctionId])
                    schedule.scheduledJobs[data.auctionId].cancel();

                console.log(auctionId);

                io.to(auctionId).emit("buyNow", { auctionId, auctionOwnerEmail, bid_winner });

                const owner = socketUtils.getSocketIdFromUser(auctionOwnerEmail);

                await axios.post(`${process.env.API_GATEWAY_URL}/notifications/create`,
                    { email: auctionOwnerEmail, auctionId, auctionTitle: updatedAuction.title, message: `Somebody has bought the product from auction ${auctionId}` },
                    configParams
                );

                if (owner) socket.to(owner).emit("notification", { auctionId, bid_winner });

                await subscribeAndSendSMS(auctionId, updatedAuction.title, `Somebody has bought the product from ${auctionId}`, configParams);

            } catch (error) {
                console.log("Error");
                console.log(error);
                socket.emit('unsuccessfulBuyNow', {});
            }
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


                await notifyEndOfAuction(resAuction.auction_id, resAuction.owner_email, resAuction.date);

            } catch (error) {

                console.log(error);
            }
        });
    });

    const notifyEndOfAuction = async (auctionId, ownerEmail, date) => {
        try {
            date = new Date(date);

            if (date <= new Date()) {
                await closeAuction({ auctionId, ownerEmail, date });
                return;
            }

            schedule.scheduleJob(auctionId, date, async () => {
                await closeAuction({ auctionId, ownerEmail, date });
            });

        } catch (error) {
            console.log(error);
        }
    }

    const closeAuction = async (auction) => {
        try {
            const configParams = {
                headers
            }

            let scheduledAuction = await axios.get(`${process.env.API_GATEWAY_URL}/scheduled-actions/${auction.auctionId}`,
                configParams
            );

            scheduledAuction = scheduledAuction.data.scheduledAction;

            if (scheduledAuction.pending) {
                console.log("Closing auction " + auction.auctionId);
                console.log("Auction end date: " + auction.date.toISOString());
                console.log("Current date: " + new Date().toISOString());

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

                io.to(auction.auctionId).emit('auctionClose', { auctionId: auction.auctionId });

                if (bid_winner) {
                    const socketId = socketUtils.getSocketIdFromUser(bid_winner);
                    if (socketId) io.to(socketId).emit('auctionWon', auction);
                }

                console.log(`closed auction ${auction.auctionId}`);
            }

        } catch (error) {
            console.log(error);
            return {}
        }
    }

    const subscribeAndSendSMS = async (auctionId, title, message, configParams) => {
        try {
            await axios.post(`${process.env.API_GATEWAY_URL}/auctions/subscribe`, { "auctionId": auctionId }, configParams);

            let resInterestedUsers = await axios.get(`${process.env.API_GATEWAY_URL}/auctions/interested/${auctionId}`, configParams);
            if (!resInterestedUsers.data.success) return;

            let interestedUsers = resInterestedUsers.data.users || [];

            interestedUsers = interestedUsers.map((element) => {
                const usr = socketUtils.getSocketIdFromUser(element.interested_user);
                if (usr) {
                    io.to(usr).emit("notification", { auctionId });
                }
                return `${element.interested_user}`;
            });

            let notificationReqs = interestedUsers.map(user => {
                return axios.post(`${process.env.API_GATEWAY_URL}/notifications/create`,
                    { email: user, auctionId, auctionTitle: title, message },
                    configParams,
                );
            });

            await Promise.all(notificationReqs);

            let resGetUserByEmail = await axios.get(`${process.env.API_GATEWAY_URL}/users/emailList?list=[${interestedUsers.map(usr => `"${usr}"`).join(',')}]`, configParams);
            if (!resGetUserByEmail.data.success) return;

            let usersList = resGetUserByEmail.data.usersList;


            let numberList = [];
            usersList.forEach(element => {
                if (element.notifications_enabled) {
                    numberList.push({ "Message": message, "PhoneNumber": element.phone_number })
                }

            });

            await axios.post(`${process.env.API_GATEWAY_URL}/send-multiple-sms`, { "numberList": numberList }, configParams)
        } catch (error) {
            console.log(error);
        }

    }

    return { notifyEndOfAuction }
}



module.exports = {
    socketInit
}