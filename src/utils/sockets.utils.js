const socketIo = require('socket.io');
const socketUtils = require('./socket-dictionary.utils');
const redisAdapter = require('socket.io-redis');

const socketInit = (server) => {

    const io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Authorization', 'userId'],
            credentials: true
        }
    });


    io.adapter(redisAdapter({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }));

    io.on('connection', socket => {
        const authToken = socket.handshake.headers['authorization'];
        const userId = socket.handshake.headers['userid'];

        socketUtils.addActiveUser(socket.id, userId);

        console.log('Client connected', socket.id);

        socket.on('disconnect', () => {
            socketUtils.removeActiveUser(userId);
            console.log('Client disconnected');
        });

        socket.on('notification', async data => { })

        socket.on('message', async data => { });

        socket.on('deleteMessage', async data => { });

        socket.on('createConversation', async data => { });

        socket.on('removeConversation', async data => { });

        socket.on('verificationRequest', async data => { });

        socket.on('newBid', async data => { });

        socket.on('buyNow', async data => { });
    });
}

module.exports = {
    socketInit
}