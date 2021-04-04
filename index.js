const express = require('express');
const cors = require('cors');
const path = require('path');

const socketConfig = require('./src/utils/sockets.utils');

const notificationsRoute = require('./src/routes/notifications.route');
const auctionsRoute = require('./src/routes/auctions.route');
const userRoute = require('./src/routes/user.route');

if(process.env.NODE_ENV=='dev'){
    require('dotenv').config();
}

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req,res)=>res.json("Welcome"));
app.use('/assets', express.static(path.join(__dirname, 'public')));

app.use('/api/notifications', notificationsRoute);
app.use('/api/auctions', auctionsRoute);
app.use('/api/users', userRoute);



const server = app.listen(PORT, () => {
    console.log("Server running on PORT " + PORT);
})

socketConfig.socketInit(server);